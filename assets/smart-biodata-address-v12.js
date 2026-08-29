// JORON Smart Biodata — Address runtime loader v20
(()=>{
'use strict';
if(window.__JORON_ADDRESS_V20_LOADING||window.__JORON_ADDRESS_V20_READY)return;
window.__JORON_ADDRESS_V20_LOADING=true;
const src='assets/smart-biodata-address-hybrid-v19.js';
fetch(src,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Address source HTTP '+r.status);return r.text()}).then(code=>{new Function(code+'\n//# sourceURL=joron-address-hybrid-v20.js')();window.__JORON_ADDRESS_V20_READY=true}).catch(e=>{console.error('JORON Address v20 failed',e);const s=document.getElementById('locationStatus');if(s){s.textContent='❌ ঠিকানা engine চালু হয়নি। Internet চালু করে Refresh করুন।';s.style.display='block';s.style.color='#a80000'}}).finally(()=>window.__JORON_ADDRESS_V20_LOADING=false);
})();
