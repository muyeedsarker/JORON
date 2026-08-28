// JORON Smart Biodata runtime bridge.
// Load the existing Firebase save/restore implementation and the repaired Address runtime.

const loadSmartBiodataRuntime = () => {
  if (window.__JORON_BIODATA_RUNTIME_LOADING || window.__JORON_BIODATA_RUNTIME_LOADED) return;
  window.__JORON_BIODATA_RUNTIME_LOADING = true;

  const load = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load '+src));
    document.head.appendChild(script);
  });

  Promise.all([
    load('assets/smart-biodata-firebase-legacy.js'),
    load('assets/smart-biodata-address-v12.js')
  ]).then(() => {
    window.__JORON_BIODATA_RUNTIME_LOADED = true;
  }).catch(e => {
    console.error('JORON Smart Biodata runtime failed to load.', e);
  }).finally(() => {
    window.__JORON_BIODATA_RUNTIME_LOADING = false;
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSmartBiodataRuntime, { once: true });
} else {
  loadSmartBiodataRuntime();
}

export {};
