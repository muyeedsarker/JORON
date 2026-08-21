import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* JORON universal premium visual system — visual only, no auth logic changed. */
if (typeof document !== "undefined" && !document.querySelector("link[data-joron-premium]")) {
  const premiumLink = document.createElement("link");
  premiumLink.rel = "stylesheet";
  premiumLink.href = new URL("./premium-universal.css", import.meta.url).href;
  premiumLink.dataset.joronPremium = "true";
  document.head.appendChild(premiumLink);
}

const firebaseConfig = {
  apiKey: "AIzaSyDWxxu3zwThJp1fuWMhXiRig3Fswt0QARA",
  authDomain: "joron-d7742.firebaseapp.com",
  projectId: "joron-d7742",
  storageBucket: "joron-d7742.firebasestorage.app",
  messagingSenderId: "907727989078",
  appId: "1:907727989078:web:4fdd266e3517a862fa0ef7",
  measurementId: "G-Q8PXH6C5NC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function currentUser() {
  return auth.currentUser;
}

export async function ensureUserDocument(user, extra = {}) {
  if (!user) throw new Error("AUTH_REQUIRED");

  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || extra.displayName || "",
      role: "user",
      accountStatus: "active",
      profileComplete: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } else {
    await setDoc(ref, {
      email: user.email || null,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  return ref;
}

export async function registerUser({ email, password, displayName = "" }) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  await ensureUserDocument(credential.user, { displayName });
  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  await ensureUserDocument(credential.user);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email.trim());
}

export function authErrorMessage(error) {
  const code = error?.code || "";
  const messages = {
    "auth/invalid-credential": "ইমেইল বা পাসওয়ার্ড সঠিক নয়।",
    "auth/user-not-found": "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।",
    "auth/wrong-password": "পাসওয়ার্ড সঠিক নয়।",
    "auth/email-already-in-use": "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে।",
    "auth/weak-password": "আরও শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।",
    "auth/invalid-email": "সঠিক ইমেইল ঠিকানা দিন।",
    "auth/too-many-requests": "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
    "auth/network-request-failed": "নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।"
  };
  return messages[code] || "অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।";
}

export function requireAuth({ redirect = "login.html" } = {}) {
  let settled = false;
  return new Promise((resolve) => {
    const unsubscribe = watchAuth((user) => {
      if (settled) return;
      settled = true;
      unsubscribe();
      if (!user) {
        const next = `${window.location.pathname.split("/").pop() || "index.html"}${window.location.search}`;
        const target = `${redirect}?next=${encodeURIComponent(next)}`;
        window.location.replace(target);
        return;
      }
      resolve(user);
    });
  });
}

export function redirectIfAuthenticated({ redirect = "biodata.html" } = {}) {
  let settled = false;
  return new Promise((resolve) => {
    const unsubscribe = watchAuth((user) => {
      if (settled) return;
      settled = true;
      unsubscribe();
      if (user) {
        window.location.replace(redirect);
        return;
      }
      resolve(null);
    });
  });
}
