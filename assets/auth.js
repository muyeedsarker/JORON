(() => {
  const firebaseClient = import("./firebase-client.js");

  window.loginUser = function () {
    const emailEl = document.getElementById("email");
    const passwordEl = document.getElementById("password");
    const button = document.querySelector(".login-button");
    const email = emailEl ? emailEl.value.trim() : "";
    const password = passwordEl ? passwordEl.value : "";

    if (!email || !password) return false;

    if (button) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = "⏳ লগইন হচ্ছে...";
    }

    firebaseClient
      .then(({ auth, signInWithEmailAndPassword, persistenceReady }) =>
        persistenceReady.then(() => signInWithEmailAndPassword(auth, email, password))
      )
      .then(() => {
        window.location.href = "biodata.html";
      })
      .catch((error) => {
        console.error("JORON login error:", error);
        let message = "লগইন করা সম্ভব হয়নি। আবার চেষ্টা করুন।";
        if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(error.code)) {
          message = "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";
        } else if (error.code === "auth/invalid-email") {
          message = "সঠিক ইমেইল ঠিকানা দিন।";
        } else if (error.code === "auth/too-many-requests") {
          message = "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
        }
        alert(message);
      })
      .finally(() => {
        if (button) {
          button.disabled = false;
          button.textContent = button.dataset.originalText || "🔐 নিরাপদে লগইন করুন";
        }
      });

    return false;
  };

  window.resetPassword = function () {
    const emailEl = document.getElementById("email");
    const email = emailEl ? emailEl.value.trim() : "";
    if (!email) {
      alert("আগে আপনার ইমেইল ঠিকানা লিখুন।");
      if (emailEl) emailEl.focus();
      return false;
    }

    firebaseClient
      .then(({ auth, sendPasswordResetEmail, persistenceReady }) =>
        persistenceReady.then(() => sendPasswordResetEmail(auth, email))
      )
      .then(() => alert("পাসওয়ার্ড পরিবর্তনের লিংক আপনার ইমেইলে পাঠানো হয়েছে।"))
      .catch((error) => {
        console.error("JORON password reset error:", error);
        alert("পাসওয়ার্ড রিসেট করা সম্ভব হয়নি। ইমেইল ঠিক আছে কি না দেখুন।");
      });

    return false;
  };
})();
