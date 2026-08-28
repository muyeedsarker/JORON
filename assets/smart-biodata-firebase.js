// JORON Smart Biodata runtime bridge.
// Load the active Firebase save/restore implementation after the page is ready.
// The legacy file contains the existing Firestore save/restore flow.

const loadSmartBiodataFirebase = () => {
  if (window.__JORON_BIODATA_FIREBASE_LOADING || window.__JORON_BIODATA_FIREBASE_LOADED) return;
  window.__JORON_BIODATA_FIREBASE_LOADING = true;

  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'assets/smart-biodata-firebase-legacy.js';
  script.onload = () => {
    window.__JORON_BIODATA_FIREBASE_LOADED = true;
    window.__JORON_BIODATA_FIREBASE_LOADING = false;
  };
  script.onerror = () => {
    window.__JORON_BIODATA_FIREBASE_LOADING = false;
    console.error('JORON Smart Biodata Firebase engine failed to load.');
  };
  document.head.appendChild(script);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSmartBiodataFirebase, { once: true });
} else {
  loadSmartBiodataFirebase();
}

export {};
