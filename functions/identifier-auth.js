const { getApps, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { onRequest } = require("firebase-functions/https");

if (!getApps().length) initializeApp();
const db = getFirestore();
const adminAuth = getAuth();

const WEB_API_KEY = "AIzaSyDWxxu3zwThJp1fuWMhXiRig3Fswt0QARA";
const IDENTITY_TOOLKIT = "https://identitytoolkit.googleapis.com/v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^01[0-9]{9}$/;

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

  try {
    const email = await resolveEmail(identifier);
    const result = await signInWithPassword(email, password);
    const customToken = await adminAuth.createCustomToken(result.localId);
    return res.json({ ok: true, customToken });
  } catch (error) {
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
