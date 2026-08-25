(() => {
  const firebaseClientPromise = import("./firebase-client.js");

  function getCredentials() {
    const emailEl = document.getElementById("email");
    const passwordEl = document.getElementById("password");
    return { emailEl, passwordEl, email: emailEl ? emailEl.value.trim() : "", password: passwordEl ? passwordEl.value : "" };
  }

  function showError(message) {
    let box = document.getElementById("joron-auth-message");
    if (!box) {
      box = document.createElement("div");
      box.id = "joron-auth-message";
      box.style.cssText = "margin:12px 0;padding:12px 14px;border-radius:12px;background:#fff1f1;color:#b42318;border:1px solid #f3b7b7;font-weight:800;text-align:center;";
      const form = document.querySelector(".login-card form");
      if (form) form.insertAdjacentElement("beforebegin", box); else document.body.prepend(box);
    }
    box.textContent = message;
    box.style.display = "block";
  }

  function clearError() {
    const box = document.getElementById("joron-auth-message");
    if (box) box.style.display = "none";
  }

  window.loginUser = async function () {
    const { email, password } = getCredentials();
    const button = document.querySelector(".login-button");
    if (!email || !password) { showError("ইমেইল ও পাসওয়ার্ড দুটোই দিন।"); return false; }
    clearError();
    if (button) { button.disabled = true; button.dataset.originalText = button.textContent; button.textContent = "⏳ লগইন হচ্ছে..."; }
    try {
      const { auth, signInWithEmailAndPassword, persistenceReady } = await firebaseClientPromise;
      await persistenceReady;
      await signInWithEmailAndPassword(auth, email, password);
      window.location.replace("biodata.html");
    } catch (error) {
      console.error("JORON login error:", error);
      let message = "লগইন করা সম্ভব হয়নি। আবার চেষ্টা করুন।";
      if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(error.code)) message = "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";
      else if (error.code === "auth/invalid-email") message = "সঠিক ইমেইল ঠিকানা দিন।";
      else if (error.code === "auth/too-many-requests") message = "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
      else if (error.code === "auth/network-request-failed") message = "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
      showError(message);
    } finally {
      if (button) { button.disabled = false; button.textContent = button.dataset.originalText || "🔐 নিরাপদে লগইন করুন"; }
    }
    return false;
  };

  window.resetPassword = async function () {
    const { email, emailEl } = getCredentials();
    if (!email) { showError("আগে আপনার ইমেইল ঠিকানা লিখুন।"); if (emailEl) emailEl.focus(); return false; }
    try {
      const { auth, sendPasswordResetEmail, persistenceReady } = await firebaseClientPromise;
      await persistenceReady; await sendPasswordResetEmail(auth, email);
      alert("পাসওয়ার্ড পরিবর্তনের লিংক আপনার ইমেইলে পাঠানো হয়েছে।");
    } catch (error) { console.error("JORON password reset error:", error); showError("পাসওয়ার্ড রিসেট করা সম্ভব হয়নি। ইমেইল ঠিক আছে কি না দেখুন।"); }
    return false;
  };

  // Capture the submit event so the inline onsubmit handler cannot perform a normal page reload.
  function bindLoginForm() {
    const form = document.querySelector(".login-card form");
    if (!form || form.dataset.joronAuthBound === "1") return;
    form.dataset.joronAuthBound = "1";
    form.addEventListener("submit", (event) => { event.preventDefault(); event.stopImmediatePropagation(); window.loginUser(); }, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindLoginForm);
  else bindLoginForm();
})();
