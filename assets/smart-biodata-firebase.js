// JORON Smart Biodata runtime bridge.
// The page keeps its existing local draft/save logic.
// This bridge loads the verified Address FINAL v11 engine after the page is ready.
// It intentionally does not overwrite form/Firebase listeners.

const loadJoronAddressEngine = () => {
  if (window.__JORON_ADDRESS_ENGINE_LOADING || window.__JORON_ADDRESS_ENGINE_LOADED) return;
  window.__JORON_ADDRESS_ENGINE_LOADING = true;

  const script = document.createElement('script');
  script.src = 'assets/smart-biodata-address-fix.js';
  script.async = false;
  script.onload = () => {
    window.__JORON_ADDRESS_ENGINE_LOADED = true;
    window.__JORON_ADDRESS_ENGINE_LOADING = false;
  };
  script.onerror = () => {
    window.__JORON_ADDRESS_ENGINE_LOADING = false;
    console.error('JORON Address engine failed to load.');
  };
  document.head.appendChild(script);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadJoronAddressEngine, { once: true });
} else {
  loadJoronAddressEngine();
}

export {};
