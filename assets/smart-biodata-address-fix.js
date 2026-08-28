// JORON Smart Biodata — Address FINAL v4
// Stable nested source: Division → District → Upazila/Thana → Union/Pouroshava → Ward → Village/Mohalla → Area → Post Office → Postal Code
// Firebase-compatible legacy parea/area fields are retained.
(()=>{
const $=id=>document.getElementById(id);
const GEO='https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json';
const POST='https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json';
let TREE=[],P=[];
const stat=(t,e=false)=>{const x=$('locationStatus');if(x){x.textContent=t;x.style.display='block';x.style.color=e?'#a80000':'#087b59'}};
const bn=x=>String(x?.bn_name||x?.name||'').trim();
const en=x=>String(x?.name||'').trim();
const fill=(s,rows,ph)=>{if(!s)return;s.replaceChildren(new Option(ph,''));const seen=new Set();for(const r of rows||[]){const n=bn(r),v=en(r)||n;if(n&&!seen.has(v)){seen.add(v);s.add(new Option(n,v))}}s.disabled=!seen.size};
const reset=(s,ph)=>{if(s){s.replaceChildren(new Option(ph,''));s.value='';s.disabled=true}};
const hide=id=>{const e=$(id);if(e?.closest('.field'))e.closest('.field').style.display='none'};
function addSelect(id,label,ph,before){let e=$(id);if(e)return e;const b=$(before);if(!b)return null;const w=document.createElement('div');w.className='field joron-address-extra';w.innerHTML=`<label for="${id}">${label}</label><select id="${id}" disabled><option value="">${ph}</option></select>`;b.closest('.field')?.insertAdjacentElement('beforebegin',w);return $(id)}
function addInput(id,label,ph,before){let e=$(id);if(e)return e;const b=$(before);if(!b)return null;const w=document.createElement('div');w.className='field joron-address-extra';w.innerHTML=`<label for="${id}">${label}</label><input id="${id}" placeholder="${ph}">`;b.closest('.field')?.insertAdjacentElement('beforebegin',w);return $(id)}
function hidden(id,v){const e=$(id);if(!e)return;e.replaceChildren(new Option(v||'',v||''));e.value=v||''}
function wards(s){if(!s)return;s.replaceChildren(new Option('ওয়ার্ড নির্বাচন করুন',''));for(let i=1;i<=99;i++){const b=String(i).replace(/[0-9]/g,d=>'০১২৩৪৫৬৭৮৯'[d]);s.add(new Option(`ওয়ার্ড ${b}`,String(i)))}s.disabled=false}
function setup(pre){
 const p=pre?'p':'',L=pre?'Permanent':'Present';
 const dv=$(p+'division'),di=$(p+'district'),up=$(p+'upazila'),po=$(p+'postOffice'),pc=$(pre?'ppostalCode':'postalCode'),legacy=$(pre?'parea':'area');
 const un=addSelect(p+'union',L+' ইউনিয়ন / পৌরসভা',L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন',p+'postOffice');
 const wd=addSelect(p+'ward',L+' ওয়ার্ড',L+' ওয়ার্ড নির্বাচন করুন',p+'postOffice');
 const vl=addInput(p+'village',L+' গ্রাম / মহল্লা',L+' গ্রামের / মহল্লার নাম লিখুন',p+'postOffice');
 const ar=addInput(p+'areaText',L+' এলাকা',L+' এলাকার নাম লিখুন',p+'postOffice');
 hide(pre?'parea':'area');
 const sync=()=>{const parts=[un?.selectedOptions[0]?.textContent?.trim(),wd?.selectedOptions[0]?.textContent?.trim(),vl?.value.trim(),ar?.value.trim()].filter(Boolean);hidden(legacy?.id,parts.join(' | '))};
 dv.onchange=()=>{reset(di,L+' জেলা নির্বাচন করুন');reset(up,L+' উপজেলা / থানা নির্বাচন করুন');reset(un,L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন');reset(wd,L+' ওয়ার্ড নির্বাচন করুন');if(vl)vl.value='';if(ar)ar.value='';reset(po,L+' Post Office নির্বাচন করুন');if(pc)pc.value='';hidden(legacy?.id,'');const d=TREE.find(x=>bn(x)===dv.value||en(x)===dv.value);fill(di,d?.districts||[],L+' জেলা নির্বাচন করুন')};
 di.onchange=()=>{reset(up,L+' উপজেলা / থানা নির্বাচন করুন');reset(un,L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন');reset(wd,L+' ওয়ার্ড নির্বাচন করুন');if(vl)vl.value='';if(ar)ar.value='';reset(po,L+' Post Office নির্বাচন করুন');if(pc)pc.value='';hidden(legacy?.id,'');const d=TREE.flatMap(x=>x.districts||[]).find(x=>bn(x)===di.value||en(x)===di.value);fill(up,d?.upazilas||[],L+' উপজেলা / থানা নির্বাচন করুন')};
 up.onchange=()=>{reset(un,L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন');reset(wd,L+' ওয়ার্ড নির্বাচন করুন');if(vl)vl.value='';if(ar)ar.value='';reset(po,L+' Post Office নির্বাচন করুন');if(pc)pc.value='';hidden(legacy?.id,'');const u=TREE.flatMap(x=>x.districts||[]).flatMap(x=>x.upazilas||[]).find(x=>bn(x)===up.value||en(x)===up.value);const list=[...(u?.unions||[]),...(u?.pourashavas||[])];fill(un,list,L+' ইউনিয়ন / পৌরসভা নির্বাচন করুন');wards(wd);const rows=P.filter(x=>{const n=String(x.upazila||x.upazila_name||x.upazila_bn||'').trim();return n===en(u)||n===bn(u)});fill(po,rows.map(x=>({name:String(x.postOffice||x.postoffice||x.suboffice||x.name||''),bn_name:String(x.postOffice||x.postoffice||x.suboffice||x.name||'')})),L+' Post Office নির্বাচন করুন')};
 un.onchange=sync;wd.onchange=sync;vl.oninput=sync;ar.oninput=sync;
 po.onchange=()=>{const t=po.selectedOptions[0]?.textContent?.trim()||'';const r=P.find(x=>String(x.postOffice||x.postoffice||x.suboffice||x.name||'').trim()===t);if(pc)pc.value=r?String(r.postCode||r.postcode||r.post_code||''):''};
}
function restore(pre){const legacy=$(pre?'parea':'area');if(!legacy?.value)return;const a=legacy.value.split(' | '),p=pre?'p':'',un=$(p+'union'),wd=$(p+'ward'),vl=$(p+'village'),ar=$(p+'areaText');if(un&&a[0]){const o=[...un.options].find(x=>x.textContent.trim()===a[0]);if(o)un.value=o.value}if(wd&&a[1]){const n=a[1].match(/(\d+)/)?.[1];if(n)wd.value=n}if(vl)vl.value=a[2]||'';if(ar)ar.value=a.slice(3).join(' | ')||''}
async function get(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
async function init(){try{stat('📍 বাংলাদেশের ঠিকানার তালিকা লোড হচ্ছে...');const geo=await get(GEO);if(!Array.isArray(geo)||geo.length!==8)throw Error('Incomplete Bangladesh geo data');TREE=geo;fill($('pdivision'),TREE,'Permanent বিভাগ নির্বাচন করুন');fill($('division'),TREE,'Present বিভাগ নির্বাচন করুন');setup(true);setup(false);try{const j=await get(POST);P=Array.isArray(j)?j:j.postcodes||j.data||[]}catch(e){console.warn('Postcode source unavailable',e)}stat('✅ বিভাগ → জেলা → উপজেলা/থানা → ইউনিয়ন/পৌরসভা → ওয়ার্ড প্রস্তুত');setTimeout(()=>{restore(true);restore(false)},200)}catch(e){console.error('JORON address error:',e);stat('❌ ঠিকানার তালিকা লোড হয়নি। Internet চালু করে Refresh করুন।',true)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();