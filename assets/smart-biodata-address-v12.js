// JORON Smart Biodata — Address runtime loader v14
(()=>{
  'use strict';
  if(window.__JORON_ADDRESS_V14_LOADING || window.__JORON_ADDRESS_V14_READY) return;
  window.__JORON_ADDRESS_V14_LOADING=true;
  const src='assets/smart-biodata-address-fix.js';
  fetch(src,{cache:'no-store'})
    .then(r=>{if(!r.ok) throw new Error('Address source HTTP '+r.status); return r.text();})
    .then(code=>{
      new Function(code+'\n//# sourceURL=joron-address-final-v14.js')();
      window.__JORON_ADDRESS_V14_READY=true;
    })
    .catch(e=>{
      console.error('JORON Address v14 failed',e);
      const s=document.getElementById('locationStatus');
      if(s){s.textContent='❌ ঠিকানা engine চালু হয়নি। Internet চালু করে Refresh করুন।';s.style.display='block';s.style.color='#a80000';}
    })
    .finally(()=>{window.__JORON_ADDRESS_V14_LOADING=false;});
})();
