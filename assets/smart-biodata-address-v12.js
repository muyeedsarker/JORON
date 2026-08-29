// JORON Smart Biodata — Address runtime loader v18
(()=>{
  'use strict';
  if(window.__JORON_ADDRESS_V18_LOADING || window.__JORON_ADDRESS_V18_READY) return;
  window.__JORON_ADDRESS_V18_LOADING=true;
  const src='assets/smart-biodata-address-hybrid-v18.js';
  fetch(src,{cache:'no-store'})
    .then(r=>{if(!r.ok) throw new Error('Address source HTTP '+r.status); return r.text();})
    .then(code=>{new Function(code+'\n//# sourceURL=joron-address-hybrid-v18.js')();window.__JORON_ADDRESS_V18_READY=true;})
    .catch(e=>{console.error('JORON Address v18 failed',e);const s=document.getElementById('locationStatus');if(s){s.textContent='❌ ঠিকানা engine চালু হয়নি। Internet চালু করে Refresh করুন।';s.style.display='block';s.style.color='#a80000';}})
    .finally(()=>{window.__JORON_ADDRESS_V18_LOADING=false;});
})();
