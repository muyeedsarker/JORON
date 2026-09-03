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
  "ইমেইল": { en: "Email", hi: "ईमेल" },
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
  "শর্তাবলি": { en: "Terms & Conditions", hi: "नियम और शर्तें" },
  "নিরাপদ • সম্মানজনক • Smart Search": { en: "Safe • Respectful • Smart Search", hi: "सुरक्षित • सम्मानजनक • स्मार्ट खोज" },
  "বিশ্বাস • সম্মান • সুন্দর সম্পর্ক": { en: "Trust • Respect • Beautiful Relationships", hi: "विश्वास • सम्मान • सुंदर रिश्ते" },
  "একটি সুন্দর সম্পর্কের": { en: "A beautiful relationship's", hi: "एक सुंदर रिश्ते की" },
  "শুরু": { en: "beginning", hi: "शुरुआत" },
  "আপনার গল্পের সঠিক মানুষটি হয়তো এখানেই": { en: "The right person for your story may be here", hi: "आपकी कहानी का सही इंसान शायद यहीं है" },
  "JORON আপনাকে বিশ্বাস, পছন্দ ও পারস্পরিক সম্মানের ভিত্তিতে সঠিক মানুষের সঙ্গে পরিচিত হতে সাহায্য করে।": { en: "JORON helps you meet the right person based on trust, preferences and mutual respect.", hi: "JORON आपको विश्वास, पसंद और आपसी सम्मान के आधार पर सही व्यक्ति से मिलने में मदद करता है।" },
  "আজই শুরু করুন": { en: "Get Started Today", hi: "आज ही शुरुआत करें" },
  "প্রোফাইল দেখুন": { en: "View Profiles", hi: "प्रोफ़ाइल देखें" },
  "যাচাইকৃত প্রোফাইল": { en: "Verified Profiles", hi: "सत्यापित प्रोफ़ाइल" },
  "গোপনীয়তা সুরক্ষিত": { en: "Privacy Protected", hi: "गोपनीयता सुरक्षित" },
  "সম্মানজনক পরিবেশ": { en: "Respectful Environment", hi: "सम्मानजनक वातावरण" },
  "কেন JORON": { en: "Why JORON", hi: "JORON क्यों" },
  "সম্পর্ক হোক সহজ, নিরাপদ ও অর্থপূর্ণ": { en: "Make relationships simple, safe and meaningful", hi: "रिश्तों को सरल, सुरक्षित और सार्थक बनाएं" },
  "একটি পরিষ্কার ও সম্মানজনক matrimonial experience—শুরু থেকে পরিচয় পর্যন্ত।": { en: "A clear and respectful matrimonial experience—from beginning to introduction.", hi: "शुरुआत से परिचय तक एक स्पष्ट और सम्मानजनक वैवाहिक अनुभव।" },
  "স্মার্ট ম্যাচিং": { en: "Smart Matching", hi: "स्मার্ট मैचिंग" },
  "আপনার পছন্দ ও তথ্যের ভিত্তিতে সম্ভাব্য উপযুক্ত প্রোফাইল খুঁজে নিন।": { en: "Find potentially suitable profiles based on your preferences and information.", hi: "अपनी पसंद और जानकारी के आधार पर संभावित उपयुक्त प्रोफ़ाइल खोजें।" },
  "ম্যাচিং দেখুন →": { en: "View Matching →", hi: "मैचिंग देखें →" },
  "নিরাপত্তা ও গোপনীয়তা": { en: "Security & Privacy", hi: "सुरक्षा और गोपनीयता" }
};

function getLanguage() {
  const saved = localStorage.getItem("joronLanguage");
  return SUPPORTED.includes(saved) ? saved : DEFAULT_LANGUAGE;
}

function translateText(key, language) {
  const entry = translations[key];
  if (!entry || language === "bn") return key;
  return entry[language] || key;
}

function applyTranslations(language = getLanguage()) {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) el.textContent = translateText(key, language);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[key]) el.setAttribute("placeholder", translateText(key, language));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (translations[key]) el.setAttribute("title", translateText(key, language));
  });
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === language ? "true" : "false");
  });
}

function setLanguage(language) {
  if (!SUPPORTED.includes(language)) return;
  localStorage.setItem("joronLanguage", language);
  applyTranslations(language);
  document.dispatchEvent(new CustomEvent("joron-language-change", { detail: { language } }));
}

function ensureToggle() {
  if (document.querySelector("[data-joron-language-toggle]")) return;
  const wrap = document.createElement("div");
  wrap.setAttribute("data-joron-language-toggle", "true");
  wrap.setAttribute("aria-label", "Language");
  wrap.style.cssText = "display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;margin:8px auto;z-index:20;position:relative";
  SUPPORTED.forEach((lang) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("data-lang", lang);
    btn.textContent = lang === "bn" ? "🇧🇩 বাংলা" : lang === "en" ? "English 🇬🇧" : "हिन्दी 🇮🇳";
    btn.addEventListener("click", () => setLanguage(lang));
    wrap.appendChild(btn);
  });
  (document.querySelector("header") || document.body).appendChild(wrap);
}

document.addEventListener("DOMContentLoaded", () => {
  ensureToggle();
  applyTranslations(getLanguage());
});

window.JORONLanguage = { getLanguage, setLanguage, translateText, applyTranslations, supported: SUPPORTED.slice() };