// JORON Address Engine v25 — source-conscious cascading address selector
// Division → District → Upazila/Thana → Union/Ward → Village → Post Office → Postal Code
// Village data is supplied by @olism/bd-geo. No fake ward numbers or invented villages are generated.
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
const same=(a,b)=>norm(a)===norm(b);
const label=x=>String(x?.nameBn??x?.bn_name??x?.name??x?.title??'').trim();
const reset=(s,ph)=>{if(!s)return;s.innerHTML='';s.add(new Option(ph,''));s.value='';s.disabled=true};
const fill=(s,rows,ph,valueKey='id')=>{if(!s)return;s.innerHTML='';s.add(new Option(ph,''));for(const r of rows||[]){const n=label(r);if(n)s.add(new Option(n,String(r?.[valueKey]??r?.id??r?.key??r?.name??n)))}s.disabled=!(rows||[]).length};
const replaceSelect=id=>{const old=$(id);if(!old)return null;const n=old.cloneNode(false);n.innerHTML='';old.replaceWith(n);return n};
function makeField(id,text,before){const old=$(id);if(old)return old;const b=$(before);if(!b)return null;const w=document.createElement('div');w.className='field';w.innerHTML=`<label>${text}</label><select id="${id}" disabled><option value="">${text} নির্বাচন করুন</option></select>`;b.closest('.field').insertAdjacentElement('beforebegin',w);return $(id)}
function removeDuplicateCards(){const seen={education:false,profession:false,family:false,lifestyle:false};document.querySelectorAll('form#form section.card').forEach(card=>{const h=(card.querySelector('h2')?.textContent||'').replace(/\s+/g,' ').trim();let k=null;if(/৩\.?\s*(শিক্ষা|শিক্ষাগত)/.test(h)||/Education/i.test(h))k='education';else if(/৪\.?\s*পেশাগত/.test(h)||/Profession/i.test(h))k='profession';else if(/৫\.?\s*(Family|পারিবারিক)/i.test(h))k='family';else if(/৬\.?\s*(Lifestyle|জীবনযাপন)/i.test(h))k='lifestyle';if(k){if(seen[k])card.remove();else seen[k]=true}})}
async function loadPostal(){const r=await fetch('https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json',{cache:'no-store'});if(!r.ok)throw Error('Postal HTTP '+r.status);const j=await r.json();return Array.isArray(j)?j:(j.postcodes||j.data||[])}
async function init(){
 removeDuplicateCards();
 try{
  const [geo,posts]=await Promise.all([
   import('https://cdn.jsdelivr.net/npm/@olism/bd-geo@0.1.6/+esm'),
   loadPostal()
  ]);
  const divisions=geo.getDivisions();
  const districts=geo.getDistricts();
  const upazilas=geo.getUpazilas();
  const areas=geo.getAreas();
  const villages=geo.getVillages();
  const bind=(permanent)=>{
   const x=permanent?'p':'';
   const prefix=permanent?'Permanent ':'Present ';
   const dv=replaceSelect(x+'division'),di=replaceSelect(x+'district'),th=replaceSelect(x+'upazila'),area=replaceSelect(x+'area'),po=replaceSelect(x+'postOffice');
   if(!dv||!di||!th||!area||!po)return;
   const pc=$(permanent?'ppostalCode':'postalCode');
   const oldW=$(x+'ward');if(oldW)oldW.closest('.field')?.remove();
   const oldV=$(x+'village');if(oldV)oldV.closest('.field')?.remove();
   const wd=makeField(x+'ward',prefix+'ওয়ার্ড',x+'postOffice');
   const vl=makeField(x+'village',prefix+'গ্রাম / মহল্লা',x+'ward');
   fill(dv,divisions,prefix+'বিভাগ নির্বাচন করুন');
   reset(di,prefix+'জেলা নির্বাচন করুন');reset(th,prefix+'উপজেলা / থানা নির্বাচন করুন');
   reset(area,prefix+'ইউনিয়ন / পৌরসভা / সিটি এলাকা নির্বাচন করুন');reset(wd,prefix+'ওয়ার্ড নির্বাচন করুন');reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন');reset(po,prefix+'Post Office নির্বাচন করুন');if(pc)pc.value='';
   const clearFromDistrict=()=>{reset(th,prefix+'উপজেলা / থানা নির্বাচন করুন');reset(area,prefix+'ইউনিয়ন / পৌরসভা / সিটি এলাকা নির্বাচন করুন');reset(wd,prefix+'ওয়ার্ড নির্বাচন করুন');reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন');reset(po,prefix+'Post Office নির্বাচন করুন');if(pc)pc.value=''};
   const clearFromUpazila=()=>{reset(area,prefix+'ইউনিয়ন / পৌরসভা / সিটি এলাকা নির্বাচন করুন');reset(wd,prefix+'ওয়ার্ড নির্বাচন করুন');reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন');reset(po,prefix+'Post Office নির্বাচন করুন');if(pc)pc.value=''};
   dv.onchange=()=>{const id=Number(dv.value);clearFromDistrict();fill(di,districts.filter(r=>Number(r.divisionId)===id),prefix+'জেলা নির্বাচন করুন')};
   di.onchange=()=>{const id=Number(di.value);clearFromUpazila();fill(th,upazilas.filter(r=>Number(r.districtId)===id),prefix+'উপজেলা / থানা নির্বাচন করুন')};
   th.onchange=()=>{
    const id=Number(th.value);clearFromUpazila();
    const local=areas.filter(r=>Number(r.upazilaId)===id);
    fill(area,local,prefix+'ইউনিয়ন / পৌরসভা / সিটি এলাকা নির্বাচন করুন');
    const selectedDistrict=districts.find(r=>Number(r.id)===Number(di.value));
    const selectedUpazila=upazilas.find(r=>Number(r.id)===id);
    const dn=selectedDistrict?.name||'';const un=selectedUpazila?.name||'';
    const rows=posts.filter(a=>same(a.district||a.district_name||' ',dn)&&same(a.upazila||a.upazila_name||a.thana||' ',un));
    fill(po,rows.map(a=>({id:String(a.postCode||a.postcode||a.postalCode||''),nameBn:`${a.postOffice||a.postoffice||a.suboffice||a.name||''}${a.postCode||a.postcode||a.postalCode?' — '+(a.postCode||a.postcode||a.postalCode):''}`})),prefix+'Post Office নির্বাচন করুন');
   };
   area.onchange=()=>{
    const id=Number(area.value);const selected=areas.find(r=>Number(r.id)===id);reset(wd,prefix+'ওয়ার্ড নির্বাচন করুন');reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন');
    if(!selected)return;
    if(selected.type==='union'){
      if(wd)wd.closest('.field')?.style.setProperty('display','none');
      if(vl){vl.closest('.field')?.style.setProperty('display','');fill(vl,villages.filter(v=>Number(v.areaId)===id),prefix+'গ্রাম / মহল্লা নির্বাচন করুন')}
    }else{
      if(wd){wd.closest('.field')?.style.setProperty('display','');fill(wd,areas.filter(r=>Number(r.upazilaId)===Number(selected.upazilaId)&&r.type==='ward'),prefix+'ওয়ার্ড নির্বাচন করুন')}
      if(vl){vl.closest('.field')?.style.setProperty('display','none')}
    }
   };
   wd?.addEventListener('change',()=>{});
   vl?.addEventListener('change',()=>{});
   po.onchange=()=>{if(pc){const code=String(po.value||'');pc.value=/^\d{4}$/.test(code)?code:''}};
  };
  bind(false);bind(true);window.JORON_ADDRESS_READY=true;
 }catch(e){console.error('JORON Address v25',e);const s=$('locationStatus');if(s){s.textContent='❌ ঠিকানা engine চালু হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করে Refresh করুন।';s.style.display='block'}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
