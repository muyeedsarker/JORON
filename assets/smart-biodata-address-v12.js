// JORON Smart Biodata — Address runtime loader v21
(()=>{
'use strict';
if(window.__JORON_ADDRESS_V21_LOADING||window.__JORON_ADDRESS_V21_READY)return;
window.__JORON_ADDRESS_V21_LOADING=true;
const src='assets/address-fix-v21.js';
fetch(src,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Address source HTTP '+r.status);return r.text()}).then(code=>{new Function(code+'\n//# sourceURL=joron-address-fix-v21.js')();window.__JORON_ADDRESS_V21_READY=true}).catch(e=>{console.error('JORON Address v21 failed',e);const s=document.getElementById('locationStatus');if(s){s.textContent='❌ ঠিকানা engine চালু হয়নি। Refresh করুন।';s.style.display='block';s.style.color='#a80000'}}).finally(()=>window.__JORON_ADDRESS_V21_LOADING=false);
})();
