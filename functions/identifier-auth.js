const { getApps, initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { onRequest } = require("firebase-functions/https");
const crypto = require("crypto");

if (!getApps().length) initializeApp();
const db = getFirestore();
const adminAuth = getAuth();

const WEB_API_KEY = "AIzaSyDWxxu3zwThJp1fuWMhXiRig3Fswt0QARA";
const IDENTITY_TOOLKIT = "https://identitytoolkit.googleapis.com/v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^01[0-9]{9}$/;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const LOGIN_RATE_LIMITS = "authRateLimits";

function cors(req, res) {
  const origin = req.get("origin") || "";
  if (origin === "https://muyeedsarker.github.io" || origin === "https://joron-d7742.web.app" || origin === "https://joron-d7742.firebaseapp.com") {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
}

function genericAuthError(res) {
  return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
}

function hashRateKey(identifier, req) {
  const value = String(identifier || "").trim().toLowerCase();
  const forwarded = String(req.get("x-forwarded-for") || "").split(",")[0].trim();
  const ip = forwarded || String(req.ip || "unknown");
  return crypto.createHash("sha256").update(`${value}|${ip}`).digest("hex");
}

async function checkLoginRateLimit(key) {
  const ref = db.collection(LOGIN_RATE_LIMITS).doc(key);
  const snap = await ref.get();
  if (!snap.exists) return { blocked: false, ref };
  const data = snap.data() || {};
  const now = Date.now();
  const updatedAt = Number(data.updatedAtMs || 0);
  const lockedUntil = Number(data.lockedUntilMs || 0);
  if (lockedUntil > now) return { blocked: true, ref };
  if (!updatedAt || now - updatedAt > LOGIN_WINDOW_MS) return { blocked: false, ref };
  return { blocked: false, ref };
}

async function recordLoginFailure(key) {
  const ref = db.collection(LOGIN_RATE_LIMITS).doc(key);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = Date.now();
    const old = snap.exists ? snap.data() || {} : {};
    const updatedAt = Number(old.updatedAtMs || 0);
    const failures = updatedAt && now - updatedAt <= LOGIN_WINDOW_MS ? Number(old.failures || 0) : 0;
    const nextFailures = failures + 1;
    tx.set(ref, {
      failures: nextFailures,
      updatedAtMs: now,
      lockedUntilMs: nextFailures >= LOGIN_MAX_FAILURES ? now + LOGIN_LOCK_MS : 0,
    }, { merge: true });
  });
}

async function clearLoginFailures(key) {
  await db.collection(LOGIN_RATE_LIMITS).doc(key).delete();
}

async function resolveEmail(identifier) {
  const value = String(identifier || "").trim();
  if (!value) throw new Error("INVALID_IDENTIFIER");
  if (EMAIL_RE.test(value)) return value.toLowerCase();

  const users = db.collection("users");
  const memberSnap = await users.where("memberId", "==", value.toUpperCase()).limit(1).get();
  if (!memberSnap.empty) return String(memberSnap.docs[0].data().email || "").toLowerCase();

  if (PHONE_RE.test(value)) {
    const phoneSnap = await users.where("phone", "==", value).limit(1).get();
    if (!phoneSnap.empty) return String(phoneSnap.docs[0].data().email || "").toLowerCase();
  }
  throw new Error("INVALID_IDENTIFIER");
}

async function signInWithPassword(email, password) {
  const response = await fetch(`${IDENTITY_TOOLKIT}/accounts:signInWithPassword?key=${WEB_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await response.json();
  if (!response.ok || !data.localId) throw new Error("INVALID_CREDENTIALS");
  return data;
}

exports.loginWithIdentifier = onRequest(async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "POST_REQUIRED" });

  const { identifier, password } = req.body || {};
  if (!identifier || !password) return genericAuthError(res);
  const rateKey = hashRateKey(identifier, req);

  try {
    const rate = await checkLoginRateLimit(rateKey);
    if (rate.blocked) return genericAuthError(res);

    const email = await resolveEmail(identifier);
    const result = await signInWithPassword(email, password);
    await clearLoginFailures(rateKey);
    const customToken = await adminAuth.createCustomToken(result.localId);
    return res.json({ ok: true, customToken });
  } catch (error) {
    try { await recordLoginFailure(rateKey); } catch (rateError) { console.error("JORON login rate-limit update failed:", rateError.message); }
    console.error("JORON identifier login failed:", error.message);
    return genericAuthError(res);
  }
});

exports.passwordResetByIdentifier = onRequest(async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "POST_REQUIRED" });

  const { identifier } = req.body || {};
  if (!identifier) return res.json({ ok: true });

  try {
    const email = await resolveEmail(identifier);
    const response = await fetch(`${IDENTITY_TOOLKIT}/accounts:sendOobCode?key=${WEB_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error("JORON password reset failed:", data?.error?.message || "unknown");
    }
  } catch (error) {
    console.error("JORON password reset lookup failed:", error.message);
  }

  // Do not reveal whether a Member ID/mobile/email exists.
  return res.json({ ok: true });
});
