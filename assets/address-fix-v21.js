// JORON Address Engine — cascading selector up to Post Office
// Division → District → Upazila/Thana → Post Office → Postal Code (auto)
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toLowerCase().replace(/[.\-–—]/g,' ').replace(/\s+/g,' ');
const reset=(s,ph)=>{if(!s)return;s.innerHTML='';s.add(new Option(ph,''));s.value='';s.disabled=true};
const fill=(s,rows,ph,labelFn,valueFn)=>{
 if(!s)return;
 s.innerHTML='';s.add(new Option(ph,''));
 const seen=new Set();
 for(const r of rows||[]){const label=String(labelFn(r)||'').trim(),value=String(valueFn(r)??'');if(label&&!seen.has(value)){seen.add(value);s.add(new Option(label,value));}}
 s.disabled=seen.size===0;
};
const replaceSelect=id=>{const old=$(id);if(!old)return null;if(old.tagName==='SELECT')return old;const n=document.createElement('select');n.id=old.id;n.name=old.name||old.id;n.required=old.required;n.className=old.className;old.replaceWith(n);return n};
async function loadPostal(){const r=await fetch('https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json',{cache:'no-store'});if(!r.ok)throw Error('Postal HTTP '+r.status);const j=await r.json();return Array.isArray(j)?j:(j.postcodes||j.data||[])}
async function init(){
 try{
  const [geo,posts]=await Promise.all([
   import('https://cdn.jsdelivr.net/npm/@olism/bd-geo@0.1.6/+esm'),
   loadPostal()
  ]);
  const divisions=geo.getDivisions(), districts=geo.getDistricts(), upazilas=geo.getUpazilas();
  const bind=permanent=>{
   const x=permanent?'p':'';
   const dv=replaceSelect(x+'division'),di=replaceSelect(x+'district'),th=replaceSelect(x+'upazila'),po=replaceSelect(x+'postOffice'),pc=$(permanent?'ppostalCode':'postalCode');
   if(!dv||!di||!th||!po)return;
   ['area','ward','village'].forEach(k=>{const el=$(x+k);el?.closest('.field')?.style.setProperty('display','none','important');if(el)el.required=false;});
   if(pc){pc.readOnly=true;pc.placeholder='Post Office নির্বাচন করলে পোস্ট কোড আসবে';}
   fill(dv,divisions,'বিভাগ নির্বাচন করুন',r=>r.nameBn||r.name,r=>r.id);
   reset(di,'জেলা নির্বাচন করুন');reset(th,'উপজেলা / থানা নির্বাচন করুন');reset(po,'পোস্ট অফিস (পোঃ) নির্বাচন করুন');if(pc)pc.value='';
   dv.onchange=()=>{
    const id=Number(dv.value);reset(di,'জেলা নির্বাচন করুন');reset(th,'উপজেলা / থানা নির্বাচন করুন');reset(po,'পোস্ট অফিস (পোঃ) নির্বাচন করুন');if(pc)pc.value='';
    fill(di,districts.filter(r=>Number(r.divisionId)===id),'জেলা নির্বাচন করুন',r=>r.nameBn||r.name,r=>r.id);
   };
   di.onchange=()=>{
    const id=Number(di.value);reset(th,'উপজেলা / থানা নির্বাচন করুন');reset(po,'পোস্ট অফিস (পোঃ) নির্বাচন করুন');if(pc)pc.value='';
    fill(th,upazilas.filter(r=>Number(r.districtId)===id),'উপজেলা / থানা নির্বাচন করুন',r=>r.nameBn||r.name,r=>r.id);
   };
   th.onchange=()=>{
    const id=Number(th.value),u=upazilas.find(r=>Number(r.id)===id),districtId=Number(di.value);
    reset(po,'পোস্ট অফিস (পোঃ) নির্বাচন করুন');if(pc)pc.value='';
    if(!u)return;
    const un=norm(u.name),rows=posts.filter(r=>Number(r.district_id)===districtId&&norm(r.upazila)===un);
    const fallback=rows.length?rows:posts.filter(r=>Number(r.district_id)===districtId&&(norm(r.upazila).includes(un)||un.includes(norm(r.upazila))));
    fill(po,fallback,'পোস্ট অফিস (পোঃ) নির্বাচন করুন',r=>r.postOffice||r.postoffice||r.suboffice,r=>r.postCode||r.postcode||r.postalCode);
   };
   po.onchange=()=>{if(pc)pc.value=String(po.value||'');};
  };
  bind(false);bind(true);window.JORON_ADDRESS_READY=true;
  window.dispatchEvent(new CustomEvent('joron-address-ready'));
 }catch(e){
  console.error('JORON Address Engine',e);
  const s=$('locationStatus');if(s){s.textContent='❌ ঠিকানা সিলেক্টর চালু হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করে Refresh করুন।';s.style.display='block';}
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
