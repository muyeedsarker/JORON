import { auth, signInWithEmailAndPassword, sendPasswordResetEmail, persistenceReady } from "./firebase-client.js";

function message(text, ok = false) {
  let el = document.getElementById("joron-auth-message");
  if (!el) {
    el = document.createElement("div");
    el.id = "joron-auth-message";
    const card = document.querySelector(".login-card");
    if (card) card.insertBefore(el, card.firstChild);
  }
  el.textContent = text;
  el.style.cssText = `margin:10px 0;padding:12px;border-radius:12px;text-align:center;font-weight:800;background:${ok ? '#e9fff4' : '#fff1f1'};color:${ok ? '#087b59' : '#b42318'};border:1px solid ${ok ? '#a9e6ca' : '#f0b5b5'};`;
}

async function doLogin() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value || "";
  const button = document.querySelector(".login-button");
  if (!email || !password) { message("ইমেইল ও পাসওয়ার্ড দুটোই দিন।"); return; }
  if (button) { button.disabled = true; button.textContent = "⏳ লগইন হচ্ছে..."; }
  try {
    await persistenceReady;
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result?.user) {
      message("✅ লগইন সফল। Biodata পেজ খোলা হচ্ছে...", true);
      setTimeout(() => { window.location.href = "biodata.html"; }, 250);
    } else {
      message("লগইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।");
    }
  } catch (error) {
    console.error("JORON login error", error);
    const code = error?.code || "";
    const text = code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
      ? "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
      : code === "auth/invalid-email" ? "সঠিক ইমেইল ঠিকানা দিন।"
      : code === "auth/too-many-requests" ? "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
      : code === "auth/network-request-failed" ? "ইন্টারনেট সংযোগ পরীক্ষা করুন।"
      : `লগইন ব্যর্থ হয়েছে (${code || 'unknown-error'})`;
    message(text);
  } finally {
    if (button) { button.disabled = false; button.textContent = "🔐 নিরাপদে লগইন করুন"; }
  }
}

async function resetPassword() {
  const email = document.getElementById("email")?.value.trim();
  if (!email) { message("আগে আপনার ইমেইল লিখুন।"); return; }
  try {
    await persistenceReady;
    await sendPasswordResetEmail(auth, email);
    message("✅ পাসওয়ার্ড পরিবর্তনের লিংক ইমেইলে পাঠানো হয়েছে।", true);
  } catch (error) { console.error(error); message("পাসওয়ার্ড রিসেট করা যায়নি।"); }
}

window.resetPassword = resetPassword;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-card form");
  if (!form) return;
  form.addEventListener("submit", (event) => { event.preventDefault(); doLogin(); });
});
