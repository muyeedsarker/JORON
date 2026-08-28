// JORON Smart Biodata — Address FINAL v7
// Order: Division → District → Upazila/Thana → Union/Pouroshava → Ward → Post Office → Postal Code → Village/Mohalla → Area
// Permanent + Present. Legacy parea/area stay synchronized for the existing Firebase save system.
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const GEO='https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json';
const POST='https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json';
let TREE=[], P=[];
const stat=(t,error=false)=>{const x=$('locationStatus');if(x){x.textContent=t;x.style.display='block';x.style.color=error?'#a80000':'#087b59'}};
const norm=s=>String(s??'').trim().toLowerCase().replace(/\s+/g,' ');
const text=x=>String(x?.bn_name??x?.bnName??x?.name??x?.title??x??'').trim();
const en=x=>String(x?.en_name??x?.enName??x?.name??x?.title??x??'').trim();
const same=(a,b)=>norm(a)===norm(b)||norm(a)===norm(text(b))||norm(a)===norm(en(b));
const fill=(s,rows,ph,selected='')=>{
 if(!s)return;
 s.replaceChildren(new Option(ph,''));
 const seen=new Set();
 for(const r of rows||[]){
  const label=text(r)||en(r);
  const value=en(r)||label;
  const key=norm(value)||norm(label);
  if(label&&!seen.has(key)){seen.add(key);s.add(new Option(label,value));}
 }
 s.disabled=seen.size===0;
 if(selected){const o=[...s.options].find(o=>same(o.value,selected)||same(o.textContent,selected));if(o)s.value=o.value;}
};
const reset=(s,ph)=>{if(s){s.replaceChildren(new Option(ph,''));s.value='';s.disabled=true;}};
const addSelect=(id,label,ph,before)=>{
 let e=$(id);if(e)return e;
 const b=$(before);if(!b)return null;
 const w=document.createElement('div');w.className='field joron-address-extra';
 w.innerHTML=`<label for="${id}">${label}</label><select id="${id}" disabled><option value="">${ph}</option></select>`;
 b.closest('.field')?.insertAdjacentElement('beforebegin',w);
 return $(id);
};
const addInput=(id,label,ph,before)=>{
 let e=$(id);if(e)return e;
 const b=$(before);if(!b)return null;
 const w=document.createElement('div');w.className='field joron-address-extra';
 w.innerHTML=`<label for="${id}">${label}</label><input id="${id}" placeholder="${ph}">`;
 b.closest('.field')?.insertAdjacentElement('beforebegin',w);
 return $(id);
};
const hideLegacy=id=>{const e=$(id);if(e?.closest('.field'))e.closest('.field').style.display='none';};
const unionRows=u=>[...(u?.unions||[]),...(u?.unionParishads||[]),...(u?.union_parishads||[]),...(u?.pourashavas||[]),...(u?.municipalities||[]),...(u?.pouroshavas||[])];
const wardRows=(u,un)=>[...(un?.wards||[]),...(un?.ward||[]),...(un?.wardList||[]),...(u?.wards||[]),...(u?.ward||[])];
const findDivision=v=>TREE.find(x=>same(v,x));
const findDistrict=v=>{for(const d of TREE.flatMap(x=>x.districts||[]))if(same(v,d))return d;return null;};
const findUpazila=v=>{for(const d of TREE.flatMap(x=>x.districts||[]))for(const u of d.upazilas||[])if(same(v,u))return u;return null;};
const postName=x=>String(x?.postOffice??x?.postoffice??x?.suboffice??x?.post_office??x?.name??'').trim();
const postCode=x=>String(x?.postCode??x?.postcode??x?.post_code??x?.postalCode??'').trim();
const wardsFallback=(s,selected='')=>{if(!s)return;s.replaceChildren(new Option('ওয়ার্ড নির্বাচন করুন',''));for(let i=1;i<=99;i++){const bn=String(i).replace(/[0-9]/g,d=>'০১২৩৪৫৬৭৮৯'[d]);s.add(new Option(`${bn} নং ওয়ার্ড`,String(i)));}s.disabled=false;if(selected){const n=String(selected).match(/\d+/)?.[0];if(n)s.value=n;}};
function setup(pre){
 const p=pre?'p':'',L=pre?'Permanent':'Present';
 const dv=$(p+'division'),di=$(p+'district'),up=$(p+'upazila'),po=$(p+'postOffice'),pc=$(pre?'ppostalCode':'postalCode'),legacy=$(pre?'parea':'area');
 if(!dv||!di||!up||!po)return;
 const un=addSelect(p+'union',L+' ইউনিয়ন / পৌরসভা',L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন',p+'postOffice');
 const wd=addSelect(p+'ward',L+' ওয়ার্ড',L+' ওয়ার্ড নির্বাচন করুন',p+'postOffice');
 const vl=addInput(p+'village',L+' গ্রাম / মহল্লা',L+' গ্রামের / মহল্লার নাম লিখুন',p+'postOffice');
 const ar=addInput(p+'areaText',L+' এলাকা',L+' এলাকার নাম লিখুন',p+'postOffice');
 hideLegacy(legacy?.id);
 const sync=()=>{const parts=[un?.selectedOptions[0]?.textContent?.trim(),wd?.selectedOptions[0]?.textContent?.trim(),vl?.value.trim(),ar?.value.trim()].filter(Boolean);if(legacy)legacy.value=parts.join(' | ');};
 const clearLower=()=>{reset(un,L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন');reset(wd,L+' ওয়ার্ড নির্বাচন করুন');if(vl)vl.value='';if(ar)ar.value='';reset(po,L+' Post Office নির্বাচন করুন');if(pc)pc.value='';if(legacy)legacy.value='';};
 dv.addEventListener('change',()=>{reset(di,L+' জেলা নির্বাচন করুন');reset(up,L+' উপজেলা / থানা নির্বাচন করুন');clearLower();fill(di,findDivision(dv.value)?.districts||[],L+' জেলা নির্বাচন করুন');});
 di.addEventListener('change',()=>{reset(up,L+' উপজেলা / থানা নির্বাচন করুন');clearLower();fill(up,findDistrict(di.value)?.upazilas||[],L+' উপজেলা / থানা নির্বাচন করুন');});
 up.addEventListener('change',()=>{clearLower();const u=findUpazila(up.value);fill(un,unionRows(u),L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন');const rows=P.filter(x=>same(x?.upazila??x?.upazila_name??'',u));fill(po,rows.map(x=>({name:postName(x),bn_name:postName(x)})).filter(x=>x.name),L+' Post Office নির্বাচন করুন');});
 un.addEventListener('change',()=>{const u=findUpazila(up.value),selected=un.options[un.selectedIndex]?.textContent||'';const unionObj=unionRows(u).find(x=>same(selected,x)||same(un.value,x));const rows=wardRows(u,unionObj);if(rows.length)fill(wd,rows,L+' ওয়ার্ড নির্বাচন করুন');else wardsFallback(wd);sync();});
 wd.addEventListener('change',sync);vl.addEventListener('input',sync);ar.addEventListener('input',sync);
 po.addEventListener('change',()=>{const t=po.selectedOptions[0]?.textContent?.trim()||'',r=P.find(x=>postName(x)===t);if(pc)pc.value=r?postCode(r):'';sync();});
 return {un,wd,vl,ar,legacy};
}
function restore(pre){
 const legacy=$(pre?'parea':'area');if(!legacy?.value)return;
 const a=String(legacy.value).split(' | '),p=pre?'p':'',un=$(p+'union'),wd=$(p+'ward'),vl=$(p+'village'),ar=$(p+'areaText');
 if(un&&a[0]){const o=[...un.options].find(x=>norm(x.textContent)===norm(a[0]));if(o){un.value=o.value;un.dispatchEvent(new Event('change'));}}
 if(wd&&a[1]){const n=a[1].match(/\d+/)?.[0];if(n)wd.value=n;}
 if(vl)vl.value=a[2]||'';if(ar)ar.value=a.slice(3).join(' | ')||'';
}
async function get(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}
async function init(){
 try{
  stat('📍 বাংলাদেশের ঠিকানার তালিকা লোড হচ্ছে...');
  const [geo,post]=await Promise.all([get(GEO),get(POST)]);
  TREE=Array.isArray(geo)?geo:(geo?.divisions||geo?.data||[]);
  P=Array.isArray(post)?post:(post?.postcodes||post?.data||[]);
  if(!TREE.length)throw Error('Bangladesh geo data empty');
  fill($('pdivision'),TREE,'Permanent বিভাগ নির্বাচন করুন');
  fill($('division'),TREE,'Present বিভাগ নির্বাচন করুন');
  setup(true);setup(false);
  window.JORON_ADDRESS_READY=true;
  window.dispatchEvent(new CustomEvent('joronAddressReady'));
  stat('✅ বিভাগ → জেলা → উপজেলা/থানা → ইউনিয়ন/পৌরসভা → ওয়ার্ড → Post Office প্রস্তুত');
  setTimeout(()=>{restore(true);restore(false);},100);
  let tries=0;const timer=setInterval(()=>{restore(true);restore(false);if(++tries>=40)clearInterval(timer);},250);
 }catch(e){console.error('JORON address error:',e);stat('❌ ঠিকানার তালিকা লোড হয়নি। Internet চালু করে Refresh করুন।',true);}
}
// Firebase may finish loading after the address dataset. Re-run the address restore when biodata arrives.
window.addEventListener('joronBiodataLoaded',()=>{setTimeout(()=>{restore(true);restore(false);},50);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
