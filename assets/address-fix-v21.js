// JORON Address Fix v22 — Division → District → Thana → Union/Pouroshava → Ward → Village → Post
(()=>{
'use strict';
const GEO='https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json';
const POST='https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json';
const $=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
const same=(a,b)=>norm(a)===norm(b);
const text=x=>String(x?.bn_name??x?.name??x?.title??x??'').trim();
function replaceSelect(id){const old=$(id);if(!old)return null;const n=old.cloneNode(false);n.innerHTML='';old.replaceWith(n);return n}
function fill(s,rows,ph){if(!s)return;s.innerHTML='';s.add(new Option(ph,''));for(const r of rows||[]){const t=text(r);if(t)s.add(new Option(t,String(r?.name??r?.id??t)))}s.disabled=!(rows||[]).length}
function reset(s,ph){if(!s)return;s.innerHTML='';s.add(new Option(ph,''));s.value='';s.disabled=true}
function removeDuplicateCards(){
 const seen={education:false,profession:false};
 document.querySelectorAll('form#form section.card').forEach(card=>{
  const h=(card.querySelector('h2')?.textContent||'').replace(/\s+/g,' ').trim();
  if(/৩\.?\s*(শিক্ষা|শিক্ষাগত যোগ্যতা)/.test(h)||/Education/i.test(h)){
   if(seen.education){card.remove()}else{seen.education=true}
  }
  else if(/৪\.?\s*পেশাগত/.test(h)||/Profession/i.test(h)){
   if(seen.profession){card.remove()}else{seen.profession=true}
  }
 });
}
function makeField(id,label,before){
 const existing=$(id);if(existing)return existing;
 const b=$(before);if(!b)return null;
 const w=document.createElement('div');w.className='field';
 w.innerHTML=`<label>${label}</label><select id="${id}" disabled><option value="">${label} নির্বাচন করুন</option></select>`;
 b.closest('.field').insertAdjacentElement('beforebegin',w);
 return $(id);
}
async function init(){
 removeDuplicateCards();
 try{
  const [g,p]=await Promise.all([
   fetch(GEO,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Geo HTTP '+r.status);return r.json()}),
   fetch(POST,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Post HTTP '+r.status);return r.json()})
  ]);
  const tree=Array.isArray(g)?g:(g.divisions||g.data||[]);
  const posts=Array.isArray(p)?p:(p.postcodes||p.data||[]);
  const bind=(pre)=>{
   const x=pre?'p':'';
   const dv=replaceSelect(x+'division'),di=replaceSelect(x+'district'),th=replaceSelect(x+'upazila'),po=replaceSelect(x+'postOffice');
   if(!dv||!di||!th||!po)return;
   const area=replaceSelect(x+'area');
   const pc=$(pre?'ppostalCode':'postalCode');
   if(pc)pc.closest('.field')?.style.setProperty('display','none');
   const oldW=$(x+'ward');if(oldW)oldW.closest('.field')?.remove();
   const oldV=$(x+'village');if(oldV)oldV.closest('.field')?.remove();
   const wd=makeField(x+'ward',(pre?'Permanent ':'Present ')+'ওয়ার্ড',x+'postOffice');
   const vl=makeField(x+'village',(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা',x+'ward');
   const localPh=(pre?'Permanent ':'Present ')+'ইউনিয়ন / পৌরসভা নির্বাচন করুন';
   fill(dv,tree,(pre?'Permanent ':'Present ')+'বিভাগ নির্বাচন করুন');
   if(area)area.disabled=true;
   const getDiv=()=>tree.find(r=>same(r.name,dv.value)||same(r.bn_name,dv.value));
   const clearBelow=()=>{reset(di,(pre?'Permanent ':'Present ')+'জেলা নির্বাচন করুন');reset(th,(pre?'Permanent ':'Present ')+'থানা নির্বাচন করুন');reset(area,localPh);reset(po,(pre?'Permanent ':'Present ')+'Post Office নির্বাচন করুন');reset(wd,(pre?'Permanent ':'Present ')+'ওয়ার্ড নির্বাচন করুন');reset(vl,(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা নির্বাচন করুন');if(pc)pc.value=''};
   dv.onchange=()=>{clearBelow();const d=getDiv();fill(di,d?.districts||[],(pre?'Permanent ':'Present ')+'জেলা নির্বাচন করুন')};
   di.onchange=()=>{reset(th,(pre?'Permanent ':'Present ')+'থানা নির্বাচন করুন');reset(area,localPh);reset(po,(pre?'Permanent ':'Present ')+'Post Office নির্বাচন করুন');reset(wd,(pre?'Permanent ':'Present ')+'ওয়ার্ড নির্বাচন করুন');reset(vl,(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা নির্বাচন করুন');if(pc)pc.value='';const d=getDiv(),r=(d?.districts||[]).find(a=>same(a.name,di.value)||same(a.bn_name,di.value));fill(th,r?.upazilas||[],(pre?'Permanent ':'Present ')+'থানা নির্বাচন করুন')};
   th.onchange=()=>{
    reset(area,localPh);reset(po,(pre?'Permanent ':'Present ')+'Post Office নির্বাচন করুন');reset(wd,(pre?'Permanent ':'Present ')+'ওয়ার্ড নির্বাচন করুন');reset(vl,(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা নির্বাচন করুন');if(pc)pc.value='';
    const d=getDiv(),r=(d?.districts||[]).find(a=>same(a.name,di.value)||same(a.bn_name,di.value));
    const t=(r?.upazilas||[]).find(a=>same(a.name,th.value)||same(a.bn_name,th.value));
    const locals=[...(t?.unions||[]).map(a=>({...a,__kind:'ইউনিয়ন'})),...(t?.pourashavas||[]).map(a=>({...a,__kind:'পৌরসভা'}))];
    if(area){area.innerHTML='';area.add(new Option(localPh,''));for(const a of locals){const label=text(a)+' — '+a.__kind;area.add(new Option(label,String(a.name||a.id||label)))}area.disabled=!locals.length}
    const dn=norm(r?.name||''),tn=norm(t?.name||'');
    const rows=posts.filter(a=>norm(a.district||a.district_name||'')===dn&&norm(a.upazila||a.upazila_name||a.thana||'')===tn);
    fill(po,rows.map(a=>({name:(a.postOffice||a.postoffice||a.suboffice||a.name||'')+(a.postCode||a.postcode||a.postalCode?' — '+(a.postCode||a.postcode||a.postalCode):'')})),(pre?'Permanent ':'Present ')+'Post Office নির্বাচন করুন');
   };
   area?.addEventListener('change',()=>{
    reset(wd,(pre?'Permanent ':'Present ')+'ওয়ার্ড নির্বাচন করুন');reset(vl,(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা নির্বাচন করুন');
    if(!area.value)return;
    fill(wd,Array.from({length:9},(_,i)=>({name:'Ward No-'+String(i+1).padStart(2,'0'),bn_name:'ওয়ার্ড '+String(i+1).padStart(2,'0')})),(pre?'Permanent ':'Present ')+'ওয়ার্ড নির্বাচন করুন');
   });
   wd?.addEventListener('change',()=>{
    reset(vl,(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা নির্বাচন করুন');
    // The currently used public geo source does not contain village-level rows.
    // Keep the selector explicit rather than showing unrelated place names.
   });
   po.onchange=()=>{const n=po.selectedOptions?.[0]?.textContent||'',code=(n.match(/—\s*(\d{4})$/)||[])[1]||'';if(pc)pc.value=code};
  };
  bind(false);bind(true);
  window.JORON_ADDRESS_READY=true;
  console.log('JORON Address v22 ready');
 }catch(e){console.error('JORON Address v22',e);const s=$('locationStatus');if(s){s.textContent='❌ ঠিকানা engine চালু হয়নি। Refresh করুন।';s.style.display='block';s.style.color='#a80000'}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
