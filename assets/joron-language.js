/* JORON Global Language System
 * Default: Bengali. Persists selection in localStorage.
 * Pages can opt into translation with data-i18n="key" and data-i18n-placeholder="key".
 * The same module is safe to load more than once.
 */
(function () {
  const STORAGE_KEY = "joronLanguage";
  const DEFAULT_LANGUAGE = "bn";
  const SUPPORTED = ["bn", "en"];

  const translations = {
    "হোম": { en: "Home" },
    "প্রোফাইল": { en: "Profile" },
    "ম্যাচিং": { en: "Matching" },
    "সহায়তা": { en: "Help" },
    "লগইন": { en: "Login" },
    "রেজিস্টার": { en: "Register" },
    "লাভ": { en: "Benefits" },
    "মৌলিক তথ্য": { en: "Basic Details" },
    "আপনার নাম লিখুন": { en: "Enter your name" },
    "ইমেইল": { en: "Email" },
    "পাসওয়ার্ড তৈরি করুন": { en: "Create password" },
    "পাসওয়ার্ড ৮–২০ অক্ষরের হতে হবে": { en: "Your password must be 8–20 characters" },
    "আপনার মোবাইল নম্বর লিখুন": { en: "Enter your mobile number" },
    "এই নম্বরে OTP পাঠানো হবে": { en: "OTP will be sent to this number" },
    "OTP নিন": { en: "Get OTP" },
    "সাহায্য প্রয়োজন? কল করুন": { en: "Need help? Call" },
    "নিরাপদ": { en: "Safe" },
    "সম্মানজনক": { en: "Respectful" },
    "Smart Search": { en: "Smart Search" },
    "বায়োডাটা": { en: "Biodata" },
    "ম্যাচিং প্রোফাইল": { en: "Matching Profiles" },
    "পছন্দ": { en: "Interest" },
    "চ্যাট": { en: "Chat" },
    "সদস্যপদ": { en: "Membership" },
    "পেমেন্ট": { en: "Payment" },
    "সেটিংস": { en: "Settings" },
    "গোপনীয়তা নীতি": { en: "Privacy Policy" },
    "শর্তাবলি": { en: "Terms & Conditions" }
  };

  function getLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(saved) ? saved : DEFAULT_LANGUAGE;
  }

  function setLanguage(language) {
    const next = SUPPORTED.includes(language) ? language : DEFAULT_LANGUAGE;
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
    document.documentElement.dataset.joronLanguage = next;
    applyTranslations(next);
    updateToggle(next);
    window.dispatchEvent(new CustomEvent("joron-language-change", { detail: { language: next } }));
  }

  function translateText(key, language) {
    const entry = translations[key];
    if (!entry) return key;
    if (language === "bn") return key;
    return entry.en || key;
  }

  function applyTranslations(language) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = translateText(key, language);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", translateText(key, language));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      el.setAttribute("title", translateText(key, language));
    });
  }

  function updateToggle(language) {
    document.querySelectorAll("[data-joron-language-toggle]").forEach((toggle) => {
      toggle.querySelectorAll("[data-lang]").forEach((button) => {
        const active = button.getAttribute("data-lang") === language;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("active", active);
      });
    });
  }

  function ensureToggle() {
    if (document.querySelector("[data-joron-language-toggle]")) return;
    const toggle = document.createElement("div");
    toggle.setAttribute("data-joron-language-toggle", "1");
    toggle.setAttribute("aria-label", "Language");
    toggle.innerHTML = '<button type="button" data-lang="bn" aria-label="বাংলা">🇧🇩 বাংলা</button><span aria-hidden="true">|</span><button type="button" data-lang="en" aria-label="English">English 🇬🇧</button>';
    Object.assign(toggle.style, {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 10px",
      border: "1px solid currentColor",
      borderRadius: "999px",
      fontSize: "13px",
      lineHeight: "1.2",
      background: "transparent",
      zIndex: "9999"
    });
    toggle.querySelectorAll("button").forEach((button) => {
      Object.assign(button.style, { border: "0", background: "transparent", cursor: "pointer", padding: "3px 5px", font: "inherit", color: "inherit" });
      button.addEventListener("click", () => setLanguage(button.getAttribute("data-lang")));
    });
    const host = document.querySelector("header") || document.body;
    if (host) host.appendChild(toggle);
  }

  function init() {
    const language = getLanguage();
    document.documentElement.lang = language;
    document.documentElement.dataset.joronLanguage = language;
    ensureToggle();
    applyTranslations(language);
    updateToggle(language);
  }

  window.JORONLanguage = { getLanguage, setLanguage, applyTranslations, translateText, translations, STORAGE_KEY };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
