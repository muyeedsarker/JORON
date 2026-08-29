// JORON Smart Biodata — Address Engine v17
// Final UI: Division → District → Thana → Post Office → Ward → Village/Mohalla
// All six are automatic dependent selectors. No Upazila field and no Union/Pouroshava field shown.
(()=>{
'use strict';
if(window.__JORON_ADDRESS_V17_READY)return;
const $=id=>document.getElementById(id);
const GEO='https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json';
const POST='https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json';
const WARD='https://gis.dghs.gov.bd/server/rest/services/Hosted/All_Wards_main/FeatureServer/0/query';
const OLISM='https://esm.sh/@olism/bd-geo@0.1.6';
let TREE=[],POSTS=[],GEO2=null,AREAS=[],VILLAGES=[],WC=new Map();
const norm=v=>String(v??'').trim().toLowerCase().replace(/[‐‑‒–—−]/g,'-').replace(/\s+/g,' ');
const same=(a,b)=>{const x=norm(a),y=norm(b);return !!x&&!!y&&(x===y||x.replace(/[^\p{L}\p{N}]+/gu,'')===y.replace(/[^\p{L}\p{N}]+/gu,''));};
const bn=x=>String(x?.bn_name??x?.nameBn??x?.bnName??x?.name??x?.title??x??'').trim();
const en=x=>String(x?.name??x?.en_name??x?.enName??x?.title??x??'').trim();
const L=pre=>pre?'Permanent':'Present';
const msg=(t,bad=false)=>{const e=$('locationStatus');if(e){e.textContent=t;e.style.display='block';e.style.color=bad?'#a80000':'#087b59';}};
function fill(s,rows,ph,selected=''){if(!s)return;s.replaceChildren(new Option(ph,''));const seen=new Set();for(const r of rows||[]){const text=bn(r)||en(r);const val=en(r)||text;const k=norm(text)+'|'+norm(val);if(text&&!seen.has(k)){seen.add(k);s.add(new Option(text,val));}}s.disabled=!seen.size;if(selected){const o=[...s.options].find(o=>same(o.value,selected)||same(o.textContent,selected));if(o)s.value=o.value;}}
function reset(s,ph){if(s){s.replaceChildren(new Option(ph,''));s.value='';s.disabled=true;}}
function div(v){return TREE.find(x=>same(v,en(x))||same(v,bn(x)));}
function dist(d,v){return (div(d)?.districts||[]).find(x=>same(v,en(x))||same(v,bn(x)));}
function upz(d,di,v){return (dist(d,di)?.upazilas||[]).find(x=>same(v,en(x))||same(v,bn(x)));}
function addSelect(id,label,ph,before){let e=$(id);if(e)return e;const b=$(before);if(!b)return null;const w=document.createElement('div');w.className='field joron-address-v17';w.innerHTML=`<label for="${id}">${label}</label><select id="${id}" disabled><option value="">${ph}</option></select>`;b.closest('.field').insertAdjacentElement('beforebegin',w);return $(id);}
function hideField(id){const e=$(id);if(e?.closest('.field'))e.closest('.field').style.display='none';}
function postName(x){return String(x?.postOffice??x?.postoffice??x?.suboffice??x?.post_office??x?.name??'').trim();}
function postCode(x){return String(x?.postCode??x?.postcode??x?.post_code??x?.postalCode??'').trim();}
function postRows(d,di,t){const U=upz(d,di,t),un=norm(en(U)||bn(U)),dn=norm(en(dist(d,di))||bn(dist(d,di)));return POSTS.filter(x=>{const xu=norm(x?.upazila??x?.upazila_name),xd=norm(x?.district??x?.district_name??x?.district_id);return (xu&&xu===un)||(xd&&xd===dn&&!xu);});}
function upId(d,di,t){const U=upz(d,di,t);return U?.id??U?.value??U?.code??U?.upazilaId??null;}
function areaRows(id,type){return (AREAS||[]).filter(a=>(a.upazilaId??a.upazila_id)===id && (!type||a.type===type));}
function villageRows(id){const unionIds=new Set(areaRows(id,'union').map(a=>a.id));return (VILLAGES||[]).filter(v=>unionIds.has(v.areaId??v.area_id));}
async function wardRows(d,di,t){const key=[d,di,t].map(norm).join('|');if(WC.has(key))return WC.get(key);const D=en(dist(d,di))||di,U=en(upz(d,di,t))||t;const where=`district='${String(D).replace(/'/g,"''")}' AND upazila='${String(U).replace(/'/g,"''")}'`;try{const r=await fetch(WARD+'?where='+encodeURIComponent(where)+'&outFields=division,district,upazila,union_,ward_name&returnGeometry=false&f=json',{cache:'no-store'});const j=await r.json();const rows=(j.features||[]).map(f=>f.attributes||f).filter(x=>x.ward_name);WC.set(key,rows);return rows;}catch(e){return [];}}
function setup(pre){const p=pre?'p':'',dv=$(p+'division'),di=$(p+'district'),th=$(p+'upazila'),po=$(p+'postOffice'),pc=$(pre?'ppostalCode':'postalCode');if(!dv||!di||!th||!po)return;
  hideField(p+'area');hideField(p+'parea');
  const wd=addSelect(p+'ward',L(pre)+' ওয়ার্ড',L(pre)+' ওয়ার্ড নির্বাচন করুন',p+'postOffice');
  const vl=addSelect(p+'village',L(pre)+' গ্রাম / মহল্লা',L(pre)+' গ্রাম / মহল্লা নির্বাচন করুন',p+'postOffice');
  const legacy=$(pre?'parea':'area');
  const sync=()=>{if(legacy)legacy.value=[wd?.selectedOptions?.[0]?.textContent,vl?.selectedOptions?.[0]?.textContent].map(x=>String(x||'').trim()).filter(x=>x&&!/নির্বাচন করুন/.test(x)).join(' | ');};
  const clear=()=>{reset(th,L(pre)+' থানা নির্বাচন করুন');reset(po,L(pre)+' পোঃ নির্বাচন করুন');reset(wd,L(pre)+' ওয়ার্ড নির্বাচন করুন');reset(vl,L(pre)+' গ্রাম / মহল্লা নির্বাচন করুন');if(pc)pc.value='';sync();};
  dv.addEventListener('change',()=>{reset(di,L(pre)+' জেলা নির্বাচন করুন');clear();fill(di,div(dv.value)?.districts||[],L(pre)+' জেলা নির্বাচন করুন');});
  di.addEventListener('change',()=>{reset(th,L(pre)+' থানা নির্বাচন করুন');clear();fill(th,dist(dv.value,di.value)?.upazilas||[],L(pre)+' থানা নির্বাচন করুন');});
  th.addEventListener('change',async()=>{reset(po,L(pre)+' পোঃ নির্বাচন করুন');reset(wd,L(pre)+' ওয়ার্ড নির্বাচন করুন');reset(vl,L(pre)+' গ্রাম / মহল্লা নির্বাচন করুন');if(pc)pc.value='';const pr=postRows(dv.value,di.value,th.value).map(x=>({name:postName(x),bn_name:postName(x)})).filter(x=>x.name);fill(po,pr,L(pre)+' পোঃ নির্বাচন করুন');const id=upId(dv.value,di.value,th.value);if(id!=null){const a=areaRows(id,'ward');if(a.length)fill(wd,a,L(pre)+' ওয়ার্ড নির্বাচন করুন');else{const rows=await wardRows(dv.value,di.value,th.value);fill(wd,[...new Map(rows.map(x=>[norm(x.ward_name),{name:x.ward_name,bn_name:x.ward_name}])).values()],L(pre)+' ওয়ার্ড নির্বাচন করুন');}const vs=villageRows(id);fill(vl,vs,L(pre)+' গ্রাম / মহল্লা নির্বাচন করুন');}sync();msg('✅ বিভাগ → জেলা → থানা → পোঃ → ওয়ার্ড → গ্রাম প্রস্তুত');});
  po.addEventListener('change',()=>{const t=po.selectedOptions?.[0]?.textContent?.trim();const r=postRows(dv.value,di.value,th.value).find(x=>postName(x)===t);if(pc)pc.value=r?postCode(r):'';sync();});wd?.addEventListener('change',sync);vl?.addEventListener('change',sync);
}
async function init(){try{msg('📍 Final Address Engine v17 লোড হচ্ছে...');let pd=$('pdivision');if(!pd&&$('pdistrict')){const b=$('pdistrict'),w=document.createElement('div');w.className='field';w.innerHTML='<label>Permanent বিভাগ *</label><select id="pdivision"><option value="">Permanent বিভাগ নির্বাচন করুন</option></select>';b.closest('.field').insertAdjacentElement('beforebegin',w);pd=$('pdivision');}
    const [g,p,m]=await Promise.all([fetch(GEO,{cache:'no-store'}).then(r=>r.json()),fetch(POST,{cache:'no-store'}).then(r=>r.json()),import(OLISM)]);
    TREE=Array.isArray(g)?g:(g?.divisions||g?.data||[]);POSTS=Array.isArray(p)?p:(p?.postcodes||p?.data||[]);
    GEO2=m;AREAS=typeof m.getAreas==='function'?m.getAreas():[];VILLAGES=typeof m.getVillages==='function'?m.getVillages():[];
    fill($('division'),TREE,'Present বিভাগ নির্বাচন করুন');fill($('pdivision'),TREE,'Permanent বিভাগ নির্বাচন করুন');setup(false);setup(true);
    window.__JORON_ADDRESS_V17_READY=true;window.JORON_ADDRESS_READY=true;window.dispatchEvent(new CustomEvent('joronAddressReady'));msg('✅ Final Address: বিভাগ → জেলা → থানা → পোঃ → ওয়ার্ড → গ্রাম');
  }catch(e){console.error('JORON Address v17',e);msg('❌ ঠিকানা engine লোড হয়নি। Internet চালু করে Refresh করুন।',true);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
