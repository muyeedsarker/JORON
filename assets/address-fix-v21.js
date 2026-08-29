// JORON Address Fix v21 — robust Division → District → Thana → Post → Ward → Village
(()=>{
'use strict';
const GEO='https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json';
const POST='https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json';
const $=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
const same=(a,b)=>norm(a)===norm(b);
const text=x=>String(x?.bn_name??x?.name??x?.title??x??'').trim();
function replaceSelect(id){const old=$(id);if(!old)return null;const n=old.cloneNode(false);n.innerHTML='';old.replaceWith(n);return n}
function fill(s,rows,ph){if(!s)return;s.innerHTML='';s.add(new Option(ph,''));for(const r of rows||[]){const t=text(r);if(t)s.add(new Option(t,String(r?.name??r?.id??t))) }s.disabled=!(rows||[]).length}
function reset(s,ph){if(!s)return;s.innerHTML='';s.add(new Option(ph,''));s.value='';s.disabled=true}
async function init(){
 try{
  const [g,p]=await Promise.all([fetch(GEO,{cache:'no-store'}).then(r=>r.json()),fetch(POST,{cache:'no-store'}).then(r=>r.json())]);
  const tree=Array.isArray(g)?g:(g.divisions||g.data||[]),posts=Array.isArray(p)?p:(p.postcodes||p.data||[]);
  const bind=(pre)=>{
   const x=pre?'p':'', dv=replaceSelect(x+'division'),di=replaceSelect(x+'district'),th=replaceSelect(x+'upazila'),po=replaceSelect(x+'postOffice');
   if(!dv||!di||!th||!po)return;
   const pc=$(pre?'ppostalCode':'postalCode');
   if(pc)pc.closest('.field')?.style.setProperty('display','none');
   const oldW=$(x+'ward');if(oldW)oldW.closest('.field')?.remove();
   const oldV=$(x+'village');if(oldV)oldV.closest('.field')?.remove();
   const make=(id,label,before)=>{const b=$(before);if(!b)return null;const w=document.createElement('div');w.className='field';w.innerHTML=`<label>${label}</label><select id="${id}" disabled><option value="">${label} নির্বাচন করুন</option></select>`;b.closest('.field').insertAdjacentElement('beforebegin',w);return $(id)};
   const wd=make(x+'ward',(pre?'Permanent ':'Present ')+'ওয়ার্ড',x+'postOffice');
   const vl=make(x+'village',(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা',x+'ward');
   const divRows=tree;
   fill(dv,divRows,(pre?'Permanent ':'Present ')+'বিভাগ নির্বাচন করুন');
   const getDiv=()=>divRows.find(r=>same(r.name,dv.value)||same(r.bn_name,dv.value));
   dv.onchange=()=>{const d=getDiv();reset(di,(pre?'Permanent ':'Present ')+'জেলা নির্বাচন করুন');reset(th,(pre?'Permanent ':'Present ')+'থানা নির্বাচন করুন');reset(po,(pre?'Permanent ':'Present ')+'পোঃ নির্বাচন করুন');reset(wd,(pre?'Permanent ':'Present ')+'ওয়ার্ড নির্বাচন করুন');reset(vl,(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা নির্বাচন করুন');if(pc)pc.value='';fill(di,d?.districts||[],(pre?'Permanent ':'Present ')+'জেলা নির্বাচন করুন')};
   di.onchange=()=>{const d=getDiv(),r=(d?.districts||[]).find(a=>same(a.name,di.value)||same(a.bn_name,di.value));reset(th,(pre?'Permanent ':'Present ')+'থানা নির্বাচন করুন');reset(po,(pre?'Permanent ':'Present ')+'পোঃ নির্বাচন করুন');reset(wd,(pre?'Permanent ':'Present ')+'ওয়ার্ড নির্বাচন করুন');reset(vl,(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা নির্বাচন করুন');if(pc)pc.value='';fill(th,r?.upazilas||[],(pre?'Permanent ':'Present ')+'থানা নির্বাচন করুন')};
   th.onchange=()=>{const d=getDiv(),r=(d?.districts||[]).find(a=>same(a.name,di.value)||same(a.bn_name,di.value)),t=(r?.upazilas||[]).find(a=>same(a.name,th.value)||same(a.bn_name,th.value));reset(po,(pre?'Permanent ':'Present ')+'পোঃ নির্বাচন করুন');reset(wd,(pre?'Permanent ':'Present ')+'ওয়ার্ড নির্বাচন করুন');reset(vl,(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা নির্বাচন করুন');const dn=norm(r?.name||''),tn=norm(t?.name||'');const rows=posts.filter(a=>norm(a.district||a.district_name||'')===dn&&norm(a.upazila||a.upazila_name||a.thana||'')===tn);fill(po,rows.map(a=>({name:(a.postOffice||a.postoffice||a.suboffice||a.name||'')+(a.postCode||a.postcode||a.postalCode?' — '+(a.postCode||a.postcode||a.postalCode):'')})),(pre?'Permanent ':'Present ')+'পোঃ নির্বাচন করুন');fill(wd,[],(pre?'Permanent ':'Present ')+'ওয়ার্ড নির্বাচন করুন');fill(vl,[],(pre?'Permanent ':'Present ')+'গ্রাম / মহল্লা নির্বাচন করুন')};
   po.onchange=()=>{const n=po.selectedOptions?.[0]?.textContent||'',code=(n.match(/—\s*(\d{4})$/)||[])[1]||'';if(pc)pc.value=code};
  };
  bind(false);bind(true);window.JORON_ADDRESS_READY=true;console.log('JORON Address v21 ready');
 }catch(e){console.error('JORON Address v21',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
