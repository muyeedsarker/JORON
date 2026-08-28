// JORON Smart Biodata — Address runtime repair v13
// Load the canonical address engine only after repairing its two malformed declarations.
(()=>{
  'use strict';
  if(window.__JORON_ADDRESS_V13_LOADING || window.__JORON_ADDRESS_V13_READY) return;
  window.__JORON_ADDRESS_V13_LOADING=true;
  const src='assets/smart-biodata-address-fix.js';
  fetch(src,{cache:'no-store'})
    .then(r=>{if(!r.ok) throw new Error('Address source HTTP '+r.status); return r.text();})
    .then(code=>{
      const repaired=code
        .replaceAll("function setup(pre){const p=pre?'p',", "function setup(pre){const p=pre?'p':'',")
        .replaceAll("async function hydrate(pre){const p=pre?'p',", "async function hydrate(pre){const p=pre?'p':'',");
      if(repaired===code) throw new Error('Address repair target not found');
      new Function(repaired+'\n//# sourceURL=joron-address-repaired-v13.js')();
      window.__JORON_ADDRESS_V13_READY=true;
    })
    .catch(e=>{
      console.error('JORON Address v13 repair failed',e);
      const s=document.getElementById('locationStatus');
      if(s){s.textContent='❌ ঠিকানা engine চালু হয়নি। Refresh করুন।';s.style.display='block';s.style.color='#a80000';}
    })
    .finally(()=>{window.__JORON_ADDRESS_V13_LOADING=false;});
})();
