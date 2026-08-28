// JORON Smart Biodata — Address FINAL v6
// Order: Division → District → Upazila/Thana → Union/Pouroshava → Ward → Post Office → Postal Code → Village/Mohalla → Area
// Permanent + Present. Keeps legacy parea/area synchronized for existing Firebase save code.
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const GEO='https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json';
const POST='https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json';
let TREE=[],P=[];
const stat=(t,e=false)=>{const x=$('locationStatus');if(x){x.textContent=t;x.style.display='block';x.style.color=e?'#a80000':'#087b59'}};
const text=x=>String(x?.bn_name??x?.bnName??x?.name??x?.title??'').trim();
const en=x=>String(x?.en_name??x?.enName??x?.name??x?.title??'').trim();
const norm=s=>String(s??'').trim().toLowerCase().replace(/\s+/g,' ');
const same=(a,b)=>norm(a)===norm(b)||norm(a)===norm(text(b))||norm(a)===norm(en(b));
const fill=(s,rows,ph,selected='')=>{
 if(!s)return;
 s.replaceChildren(new Option(ph,''));
 const seen=new Set();
 for(const r of rows||[]){
   const label=text(r)||en(r)||String(r??'').trim();
   const value=en(r)||label;
   const key=norm(value)||norm(label);
   if(label&&!seen.has(key)){seen.add(key);s.add(new Option(label,value))}
 }
 s.disabled=seen.size===0;
 if(selected){const o=[...s.options].find(o=>same(o.value,selected)||same(o.textContent,selected));if(o)s.value=o.value}
};
const reset=(s,ph)=>{if(s){s.replaceChildren(new Option(ph,''));s.value='';s.disabled=true}};
const hide=id=>{const e=$(id);if(e?.closest('.field'))e.closest('.field').style.display='none'};
function addSelect(id,label,ph,before){let e=$(id);if(e)return e;const b=$(before);if(!b)return null;const w=document.createElement('div');w.className='field joron-address-extra';w.innerHTML=`<label for="${id}">${label}</label><select id="${id}" disabled><option value="">${ph}</option></select>`;b.closest('.field')?.insertAdjacentElement('beforebegin',w);return $(id)}
function addInput(id,label,ph,before){let e=$(id);if(e)return e;const b=$(before);if(!b)return null;const w=document.createElement('div');w.className='field joron-address-extra';w.innerHTML=`<label for="${id}">${label}</label><input id="${id}" placeholder="${ph}">`;b.closest('.field')?.insertAdjacentElement('beforebegin',w);return $(id)}
function hidden(id,v){const e=$(id);if(!e)return;e.replaceChildren(new Option(v||'',v||''));e.value=v||''}
function unionRows(u){return [...(u?.unions||[]),...(u?.unionParishads||[]),...(u?.union_parishads||[]),...(u?.pourashavas||[]),...(u?.municipalities||[]),...(u?.pouroshavas||[])];}
function wardRows(u,un){
 const direct=[...(un?.wards||[]),...(un?.ward||[]),...(un?.wardList||[])];
 if(direct.length)return direct;
 const all=[...(u?.wards||[]),...(u?.ward||[])];
 return all;
}
function wardsFallback(s,selected=''){
 if(!s)return;
 s.replaceChildren(new Option('ওয়ার্ড নির্বাচন করুন',''));
 for(let i=1;i<=99;i++)s.add(new Option(`ওয়ার্ড ${String(i).replace(/[0-9]/g,d=>'০১২৩৪৫৬৭৮৯'[d])}`,String(i)));
 s.disabled=false;
 if(selected)s.value=String(selected).replace(/\D/g,'');
}
function findDivision(v){return TREE.find(x=>same(v,x))}
function findDistrict(v){for(const d of TREE.flatMap(x=>x.districts||[]))if(same(v,d))return d;return null}
function findUpazila(v){for(const d of TREE.flatMap(x=>x.districts||[]))for(const u of d.upazilas||[])if(same(v,u))return u;return null}
function postName(x){return String(x?.postOffice??x?.postoffice??x?.suboffice??x?.post_office??x?.name??'').trim()}
function postCode(x){return String(x?.postCode??x?.postcode??x?.post_code??x?.postalCode??'').trim()}
function setup(pre){
 const p=pre?'p':'',L=pre?'Permanent':'Present';
 const dv=$(p+'division'),di=$(p+'district'),up=$(p+'upazila'),po=$(p+'postOffice'),pc=$(pre?'ppostalCode':'postalCode'),legacy=$(pre?'parea':'area');
 if(!dv||!di||!up||!po)return;
 const un=addSelect(p+'union',L+' ইউনিয়ন / পৌরসভা',L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন',p+'postOffice');
 const wd=addSelect(p+'ward',L+' ওয়ার্ড',L+' ওয়ার্ড নির্বাচন করুন',p+'postOffice');
 const vl=addInput(p+'village',L+' গ্রাম / মহল্লা',L+' গ্রামের / মহল্লার নাম লিখুন',p+'postOffice');
 const ar=addInput(p+'areaText',L+' এলাকা',L+' এলাকার নাম লিখুন',p+'postOffice');
 hide(pre?'parea':'area');
 const sync=()=>{const parts=[un?.selectedOptions[0]?.textContent?.trim(),wd?.selectedOptions[0]?.textContent?.trim(),vl?.value.trim(),ar?.value.trim()].filter(Boolean);hidden(legacy?.id,parts.join(' | '))};
 const clearLower=()=>{reset(un,L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন');reset(wd,L+' ওয়ার্ড নির্বাচন করুন');if(vl)vl.value='';if(ar)ar.value='';reset(po,L+' Post Office নির্বাচন করুন');if(pc)pc.value='';hidden(legacy?.id,'')};
 dv.onchange=()=>{reset(di,L+' জেলা নির্বাচন করুন');reset(up,L+' উপজেলা / থানা নির্বাচন করুন');clearLower();const d=findDivision(dv.value);fill(di,d?.districts||[],L+' জেলা নির্বাচন করুন')};
 di.onchange=()=>{reset(up,L+' উপজেলা / থানা নির্বাচন করুন');clearLower();const d=findDistrict(di.value);fill(up,d?.upazilas||[],L+' উপজেলা / থানা নির্বাচন করুন')};
 up.onchange=()=>{
   clearLower();
   const u=findUpazila(up.value);
   fill(un,unionRows(u),L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন');
   const rows=P.filter(x=>{const n=String(x?.upazila??x?.upazila_name??x?.upazila_bn??'').trim();return same(n,u)});
   fill(po,rows.map(x=>({name:postName(x),bn_name:postName(x)})).filter(x=>x.name),L+' Post Office নির্বাচন করুন');
   if(wd){wd.replaceChildren(new Option(L+' ওয়ার্ড নির্বাচন করুন',''));wd.disabled=true}
 };
 un.onchange=()=>{
   const u=findUpazila(up.value);
   const selectedUnion=un.options[un.selectedIndex]?.textContent||'';
   const unionObj=unionRows(u).find(x=>same(selectedUnion,x)||same(un.value,x));
   const rows=wardRows(u,unionObj);
   if(rows.length) fill(wd,rows,L+' ওয়ার্ড নির্বাচন করুন');
   else wardsFallback(wd);
   sync();
 };
 wd.onchange=sync;vl.oninput=sync;ar.oninput=sync;
 po.onchange=()=>{const t=po.selectedOptions[0]?.textContent?.trim()||'';const r=P.find(x=>postName(x)===t);if(pc)pc.value=r?postCode(r):'';sync()};
}
function restore(pre){
 const legacy=$(pre?'parea':'area');if(!legacy?.value)return;
 const a=legacy.value.split(' | '),p=pre?'p':'',un=$(p+'union'),wd=$(p+'ward'),vl=$(p+'village'),ar=$(p+'areaText');
 if(un&&a[0]){const o=[...un.options].find(x=>norm(x.textContent)===norm(a[0]));if(o){un.value=o.value;un.dispatchEvent(new Event('change'))}}
 if(wd&&a[1]){const n=a[1].match(/(\d+)/)?.[1];if(n)wd.value=n}
 if(vl)vl.value=a[2]||'';if(ar)ar.value=a.slice(3).join(' | ')||'';
}
async function get(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
async function init(){
 try{
  stat('📍 বাংলাদেশের ঠিকানার তালিকা লোড হচ্ছে...');
  const geo=await get(GEO);TREE=Array.isArray(geo)?geo:(geo?.divisions||geo?.data||[]);if(!TREE.length)throw Error('Bangladesh geo data empty');
  fill($('pdivision'),TREE,'Permanent বিভাগ নির্বাচন করুন');fill($('division'),TREE,'Present বিভাগ নির্বাচন করুন');
  setup(true);setup(false);
  try{const j=await get(POST);P=Array.isArray(j)?j:(j?.postcodes||j?.data||[])}catch(e){console.warn('Postcode source unavailable',e)}
  stat('✅ বিভাগ → জেলা → উপজেলা/থানা → ইউনিয়ন/পৌরসভা → ওয়ার্ড প্রস্তুত');
  setTimeout(()=>{restore(true);restore(false)},250);
 }catch(e){console.error('JORON address error:',e);stat('❌ ঠিকানার তালিকা লোড হয়নি। Internet চালু করে Refresh করুন।',true)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
