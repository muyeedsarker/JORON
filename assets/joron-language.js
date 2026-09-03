/* JORON Global Language System
 * Default: Bengali. Persists selection in localStorage.
 * Supports Bengali, English and Hindi.
 * Pages can opt into translation with data-i18n="key" and data-i18n-placeholder="key".
 * The same module is safe to load more than once.
 */
(function () {
  const STORAGE_KEY = "joronLanguage";
  const DEFAULT_LANGUAGE = "bn";
  const SUPPORTED = ["bn", "en", "hi"];

  const translations = {
    "হোম": { en: "Home", hi: "होम" },
    "প্রোফাইল": { en: "Profile", hi: "प्रोफ़ाइल" },
    "ম্যাচিং": { en: "Matching", hi: "मैचिंग" },
    "সহায়তা": { en: "Help", hi: "सहायता" },
    "লগইন": { en: "Login", hi: "लॉगिन" },
    "রেজিস্টার": { en: "Register", hi: "रजिस्टर" },
    "লাভ": { en: "Benefits", hi: "लाभ" },
    "মৌলিক তথ্য": { en: "Basic Details", hi: "मूल जानकारी" },
    "আপনার নাম লিখুন": { en: "Enter your name", hi: "अपना नाम लिखें" },
    "ইমেইল": { en: "Email", hi: "ईमेल" },
    "পাসওয়ার্ড তৈরি করুন": { en: "Create password", hi: "पासवर्ड बनाएं" },
    "পাসওয়ার্ড ৮–২০ অক্ষরের হতে হবে": { en: "Your password must be 8–20 characters", hi: "आपका पासवर्ड 8–20 अक्षरों का होना चाहिए" },
    "আপনার মোবাইল নম্বর লিখুন": { en: "Enter your mobile number", hi: "अपना मोबाइल नंबर दर्ज करें" },
    "এই নম্বরে OTP পাঠানো হবে": { en: "OTP will be sent to this number", hi: "इस नंबर पर OTP भेजा जाएगा" },
    "OTP নিন": { en: "Get OTP", hi: "OTP प्राप्त करें" },
    "সাহায্য প্রয়োজন? কল করুন": { en: "Need help? Call", hi: "मदद चाहिए? कॉल करें" },
    "নিরাপদ": { en: "Safe", hi: "सुरक्षित" },
    "সম্মানজনক": { en: "Respectful", hi: "सम्मानजनक" },
    "Smart Search": { en: "Smart Search", hi: "स्मार्ट खोज" },
    "বায়োডাটা": { en: "Biodata", hi: "बायोडाटा" },
    "ম্যাচিং প্রোফাইল": { en: "Matching Profiles", hi: "मिलान प्रोफ़ाइल" },
    "পছন্দ": { en: "Interest", hi: "रुचि" },
    "চ্যাট": { en: "Chat", hi: "चैट" },
    "সদস্যপদ": { en: "Membership", hi: "सदस्यता" },
    "পেমেন্ট": { en: "Payment", hi: "भुगतान" },
    "সেটিংস": { en: "Settings", hi: "सेटिंग्स" },
    "গোপনীয়তা নীতি": { en: "Privacy Policy", hi: "गोपनीयता नीति" },
    "শর্তাবলি": { en: "Terms & Conditions", hi: "नियम और शर्तें" }
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
    return entry[language] || key;
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
    toggle.setAttribute("role", "group");
    toggle.setAttribute("aria-label", "Language");
    toggle.innerHTML = '<button type="button" data-lang="bn" aria-label="বাংলা">বাংলা</button><span aria-hidden="true">|</span><button type="button" data-lang="en" aria-label="English">English</button><span aria-hidden="true">|</span><button type="button" data-lang="hi" aria-label="हिन्दी">हिन्दी</button>';

    const style = document.createElement("style");
    style.textContent = `
      [data-joron-language-toggle]{display:flex;align-items:center;justify-content:center;gap:2px;width:max-content;max-width:calc(100% - 16px);margin:8px auto 12px;padding:4px;border:1px solid rgba(197,154,69,.55);border-radius:999px;background:rgba(255,253,248,.96);box-shadow:0 5px 14px rgba(123,87,31,.10);font:700 12px/1.2 system-ui,sans-serif;color:#7b571f;position:relative;z-index:20}
      [data-joron-language-toggle] button{appearance:none;border:0;background:transparent;color:inherit;cursor:pointer;padding:6px 9px;border-radius:999px;font:inherit;white-space:nowrap;transition:.18s ease}
      [data-joron-language-toggle] button:hover{transform:translateY(-1px);background:rgba(197,154,69,.12)}
      [data-joron-language-toggle] button.active{background:#c59a45;color:#fff;box-shadow:0 3px 8px rgba(123,87,31,.18)}
      [data-joron-language-toggle] span{opacity:.45;font-weight:900}
      @media(max-width:390px){[data-joron-language-toggle]{font-size:11px;gap:0;padding:3px}[data-joron-language-toggle] button{padding:5px 7px}}
    `;
    document.head.appendChild(style);

    toggle.querySelectorAll("button").forEach((button) => {
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

  window.JORONLanguage = { getLanguage, setLanguage, applyTranslations, translateText, translations, STORAGE_KEY, SUPPORTED };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
