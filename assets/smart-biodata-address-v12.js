// JORON Smart Biodata — Address runtime loader v16
(()=>{
  'use strict';
  if(window.__JORON_ADDRESS_V16_LOADING || window.__JORON_ADDRESS_V16_READY) return;
  window.__JORON_ADDRESS_V16_LOADING=true;
  const src='assets/smart-biodata-address-hybrid-v16.js';
  fetch(src,{cache:'no-store'})
    .then(r=>{if(!r.ok) throw new Error('Address source HTTP '+r.status); return r.text();})
    .then(code=>{new Function(code+'\n//# sourceURL=joron-address-hybrid-v16.js')();window.__JORON_ADDRESS_V16_READY=true;})
    .catch(e=>{console.error('JORON Address v16 failed',e);const s=document.getElementById('locationStatus');if(s){s.textContent='❌ ঠিকানা engine চালু হয়নি। Internet চালু করে Refresh করুন।';s.style.display='block';s.style.color='#a80000';}})
    .finally(()=>{window.__JORON_ADDRESS_V16_LOADING=false;});
})();
