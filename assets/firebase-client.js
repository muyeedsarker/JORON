import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const persistenceReady = setPersistence(auth, browserLocalPersistence);

function createMemberId(uid) {
  return `JRN-${String(uid).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10).toUpperCase()}`;
}

async function ensureUserProfile(user, provider = null, extra = {}) {
  if (!user) throw new Error("ইউজার পাওয়া যায়নি");
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const existing = snap.data();
    if (!existing.memberId) {
      const memberId = createMemberId(user.uid);
      await updateDoc(ref, { memberId });
      return { ...existing, memberId };
    }
    return existing;
  }

  const data = {
    uid: user.uid,
    memberId: createMemberId(user.uid),
    name: user.displayName || extra.name || "",
    email: user.email || extra.email || "",
    phone: user.phoneNumber || extra.phone || "",
    photoURL: user.photoURL || extra.photoURL || "",
    gender: extra.gender || "",
    provider: provider || user.providerData?.[0]?.providerId || "password",
    createdAt: serverTimestamp()
  };
  await setDoc(ref, data);
  return data;
}

async function findLoginEmail(identifier) {
  const value = String(identifier || "").trim();
  if (!value) throw new Error("LOGIN_IDENTIFIER_REQUIRED");
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return value.toLowerCase();
  const users = collection(db, "users");
  const memberSnap = await getDocs(query(users, where("memberId", "==", value.toUpperCase())));
  if (!memberSnap.empty) {
    const email = memberSnap.docs[0].data()?.email;
    if (email) return email.toLowerCase();
  }
  const phoneSnap = await getDocs(query(users, where("phone", "==", value)));
  if (!phoneSnap.empty) {
    const email = phoneSnap.docs[0].data()?.email;
    if (email) return email.toLowerCase();
  }
  throw new Error("LOGIN_IDENTIFIER_NOT_FOUND");
}

function friendlyAuthError(error) {
  const code = error?.code || error?.message || "";
  const map = {
    "auth/email-already-in-use": "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে।",
    "auth/invalid-email": "ইমেইল ঠিকানাটি সঠিক নয়।",
    "auth/weak-password": "পাসওয়ার্ড আরও শক্তিশালী দিন (কমপক্ষে ৬ অক্ষর)।",
    "auth/invalid-credential": "ইমেইল, Member ID/মোবাইল অথবা পাসওয়ার্ড সঠিক নয়।",
    "auth/popup-closed-by-user": "লগইন উইন্ডো বন্ধ করা হয়েছে।",
    "auth/popup-blocked": "ব্রাউজার popup বন্ধ করেছে। Popup অনুমতি দিন।",
    "auth/account-exists-with-different-credential": "এই ইমেইলে অন্য একটি লগইন পদ্ধতির অ্যাকাউন্ট আছে।",
    "auth/operation-not-allowed": "Firebase Console-এ এই Login Provider চালু করা হয়নি।",
    "auth/unauthorized-domain": "এই ওয়েবসাইটের domain Firebase Authentication-এ অনুমোদিত নয়।",
    "LOGIN_IDENTIFIER_REQUIRED": "Member ID, মোবাইল অথবা ইমেইল দিন।",
    "LOGIN_IDENTIFIER_NOT_FOUND": "এই Member ID/মোবাইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।"
  };
  return map[code] || "লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।";
}

async function loginWithProvider(provider, label, msgEl) {
  if (msgEl) msgEl.textContent = `⏳ ${label} দিয়ে লগইন হচ্ছে...`;
  try {
    await persistenceReady;
    const result = await signInWithPopup(auth, provider);
    await ensureUserProfile(result.user, provider === googleProvider ? "google.com" : "facebook.com");
    if (msgEl) msgEl.textContent = "✅ লগইন সফল হচ্ছে...";
    location.href = "biodata.html";
  } catch (error) {
    if (msgEl) msgEl.textContent = `❌ ${friendlyAuthError(error)}`;
    console.error("JORON OAuth login error:", error);
  }
}

function wireLoginPage() {
  const googleBtn = document.getElementById("googleBtn");
  const facebookBtn = document.getElementById("facebookBtn");
  const msg = document.getElementById("msg");
  const form = document.getElementById("emailForm");
  const identifierInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const forgotBtn = document.getElementById("forgot");
  if (!googleBtn && !facebookBtn && !form) return;
  document.title = "JORON — Login";
  const sub = document.querySelector(".brand .sub");
  if (sub) sub.textContent = "সম্পর্ক জুড়ে দেয় জোড়ন";
  if (identifierInput) {
    identifierInput.type = "text";
    identifierInput.inputMode = "text";
    identifierInput.placeholder = "Member ID / মোবাইল / ইমেইল";
  }
  const label = form?.querySelector("label[for=\"email\"]") || form?.querySelector("label");
  if (label) label.textContent = "📧 Member ID / Mobile / Email";
  if (googleBtn && !googleBtn.dataset.joronWired) {
    googleBtn.dataset.joronWired = "1";
    googleBtn.onclick = () => loginWithProvider(googleProvider, "Google", msg);
  }
  if (facebookBtn && !facebookBtn.dataset.joronWired) {
    facebookBtn.dataset.joronWired = "1";
    facebookBtn.onclick = () => loginWithProvider(facebookProvider, "Facebook", msg);
  }
  if (form && !form.dataset.joronIdentifierWired) {
    form.dataset.joronIdentifierWired = "1";
    form.addEventListener("submit", async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const identifier = identifierInput?.value.trim() || "";
      const password = passwordInput?.value || "";
      if (!identifier || !password) return msg.textContent = "Member ID, মোবাইল/ইমেইল এবং পাসওয়ার্ড দিন।";
      try {
        msg.textContent = "⏳ লগইন হচ্ছে...";
        await persistenceReady;
        const email = await findLoginEmail(identifier);
        await signInWithEmailAndPassword(auth, email, password);
        msg.textContent = "✅ লগইন সফল হচ্ছে...";
        setTimeout(() => location.href = "biodata.html", 700);
      } catch (error) {
        msg.textContent = `❌ ${friendlyAuthError(error)}`;
        console.error("JORON identifier login error:", error);
      }
    });
  }
  if (forgotBtn && !forgotBtn.dataset.joronResetWired) {
    forgotBtn.dataset.joronResetWired = "1";
    forgotBtn.onclick = async () => {
      const identifier = identifierInput?.value.trim() || "";
      if (!identifier) return msg.textContent = "আগে Member ID, মোবাইল অথবা ইমেইল লিখুন।";
      try {
        msg.textContent = "⏳ তথ্য যাচাই হচ্ছে...";
        const email = await findLoginEmail(identifier);
        await sendPasswordResetEmail(auth, email);
        msg.textContent = "✅ পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে।";
      } catch (error) {
        msg.textContent = `❌ ${friendlyAuthError(error)}`;
      }
    };
  }
  if (!document.getElementById("joron-auth-login-skin")) {
    const style = document.createElement("style");
    style.id = "joron-auth-login-skin";
    style.textContent = `.login-shell{border:1px solid rgba(199,154,69,.38)!important}.brand span{color:#d90b62!important}.brand .sub{color:#c79a45!important;letter-spacing:1.2px!important;font-size:12px!important}.idbtn{background:linear-gradient(135deg,#c79a45,#d90b62)!important}.email-form{border-color:rgba(199,154,69,.42)!important}.email-form input:focus{border-color:#c79a45!important;box-shadow:0 0 0 3px rgba(199,154,69,.12)!important}.terms a,.msg{color:#d90b62!important}`;
    document.head.appendChild(style);
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wireLoginPage, { once: true });
  else wireLoginPage();
}

export { app, auth, db, storage, onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithCustomToken, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, FacebookAuthProvider, googleProvider, facebookProvider, signInWithPopup, updateProfile, ensureUserProfile, findLoginEmail, persistenceReady, friendlyAuthError };
