import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const persistenceReady = setPersistence(auth, browserLocalPersistence);

async function ensureUserProfile(user, provider = null, extra = {}) {
  if (!user) throw new Error("ইউজার পাওয়া যায়নি");
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();

  const data = {
    uid: user.uid,
    name: user.displayName || extra.name || "",
    email: user.email || extra.email || "",
    phone: user.phoneNumber || extra.phone || "",
    photoURL: user.photoURL || extra.photoURL || "",
    provider: provider || user.providerData?.[0]?.providerId || "password",
    createdAt: serverTimestamp()
  };
  await setDoc(ref, data);
  return data;
}

export {
  app,
  auth,
  db,
  storage,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  updateProfile,
  ensureUserProfile,
  persistenceReady
};
