// JORON Address Fix v24
// Division → District → Upazila/Thana → Union/Pouroshava → Ward → Village → Post Office
(()=>{
'use strict';
const GEO='https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json';
const POST='https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json';
const $=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
const same=(a,b)=>norm(a)===norm(b);
const text=x=>String(x?.bn_name??x?.name??x?.title??x??'').trim();

function replaceSelect(id){
  const old=$(id); if(!old)return null;
  const n=old.cloneNode(false); n.innerHTML=''; old.replaceWith(n); return n;
}
function fill(s,rows,ph){
  if(!s)return;
  s.innerHTML=''; s.add(new Option(ph,''));
  for(const r of rows||[]){
    const t=text(r); if(t)s.add(new Option(t,String(r?.name??r?.id??t)));
  }
  s.disabled=!(rows||[]).length;
}
function reset(s,ph){
  if(!s)return;
  s.innerHTML=''; s.add(new Option(ph,'')); s.value=''; s.disabled=true;
}
function makeField(id,label,before){
  const existing=$(id); if(existing)return existing;
  const b=$(before); if(!b)return null;
  const w=document.createElement('div'); w.className='field';
  w.innerHTML=`<label>${label}</label><select id="${id}" disabled><option value="">${label} নির্বাচন করুন</option></select>`;
  b.closest('.field')?.insertAdjacentElement('beforebegin',w);
  return $(id);
}

// The old page contains an older copy of Education/Profession/Family/Lifestyle.
// Remove only duplicate cards by duplicate field IDs; keep the first/current card.
function removeDuplicateCards(){
  const ids=['eduHighest','trainingName','profession','professionType','fatherName','familyType','smoking','personality'];
  const kept=new Set();
  ids.forEach(id=>{
    const els=[...document.querySelectorAll(`[id="${id}"]`)];
    els.slice(1).forEach(el=>{
      const card=el.closest('section.card');
      if(card && !kept.has(card)){card.remove(); kept.add(card);}
    });
  });
}

function normalizeTree(g){
  if(Array.isArray(g))return g;
  return g?.divisions||g?.data||[];
}
function normalizePosts(p){
  if(Array.isArray(p))return p;
  return p?.postcodes||p?.data||[];
}

async function init(){
  removeDuplicateCards();
  let tree=[];
  let posts=[];

  // Address must never fail just because Post Office data fails.
  try{
    const r=await fetch(GEO,{cache:'no-store'});
    if(!r.ok)throw Error('Geo HTTP '+r.status);
    tree=normalizeTree(await r.json());
  }catch(e){
    console.error('JORON Geo error',e);
    const s=$('locationStatus');
    if(s){s.textContent='❌ ঠিকানা ডেটা লোড হয়নি। Internet চালু করে Refresh করুন।';s.style.display='block';}
    return;
  }

  try{
    const r=await fetch(POST,{cache:'no-store'});
    if(r.ok)posts=normalizePosts(await r.json());
  }catch(e){console.warn('JORON Post Office data unavailable; address dropdowns will still work.',e)}

  const bind=(pre)=>{
    const x=pre?'p':'';
    const prefix=pre?'Permanent ':'Present ';
    const dv=replaceSelect(x+'division');
    const di=replaceSelect(x+'district');
    const th=replaceSelect(x+'upazila');
    const po=replaceSelect(x+'postOffice');
    if(!dv||!di||!th||!po)return;

    const area=replaceSelect(x+'area');
    const pc=$(pre?'ppostalCode':'postalCode');
    if(pc)pc.closest('.field')?.style.setProperty('display','none');

    const oldW=$(x+'ward'); if(oldW)oldW.closest('.field')?.remove();
    const oldV=$(x+'village'); if(oldV)oldV.closest('.field')?.remove();
    const wd=makeField(x+'ward',prefix+'ওয়ার্ড',x+'postOffice');
    const vl=makeField(x+'village',prefix+'গ্রাম / মহল্লা',x+'ward');

    const localPh=prefix+'ইউনিয়ন / পৌরসভা নির্বাচন করুন';
    fill(dv,tree,prefix+'বিভাগ নির্বাচন করুন');
    reset(di,prefix+'জেলা নির্বাচন করুন');
    reset(th,prefix+'উপজেলা / থানা নির্বাচন করুন');
    reset(area,localPh);
    reset(wd,prefix+'ওয়ার্ড নির্বাচন করুন');
    reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন');
    reset(po,prefix+'Post Office নির্বাচন করুন');

    const getDiv=()=>tree.find(r=>same(r.name,dv.value)||same(r.bn_name,dv.value));
    const clearBelow=()=>{
      reset(di,prefix+'জেলা নির্বাচন করুন');
      reset(th,prefix+'উপজেলা / থানা নির্বাচন করুন');
      reset(area,localPh);
      reset(wd,prefix+'ওয়ার্ড নির্বাচন করুন');
      reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন');
      reset(po,prefix+'Post Office নির্বাচন করুন');
      if(pc)pc.value='';
    };

    dv.addEventListener('change',()=>{
      clearBelow();
      const d=getDiv();
      fill(di,d?.districts||[],prefix+'জেলা নির্বাচন করুন');
    });

    di.addEventListener('change',()=>{
      reset(th,prefix+'উপজেলা / থানা নির্বাচন করুন');
      reset(area,localPh); reset(wd,prefix+'ওয়ার্ড নির্বাচন করুন');
      reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন'); reset(po,prefix+'Post Office নির্বাচন করুন');
      if(pc)pc.value='';
      const d=getDiv();
      const r=(d?.districts||[]).find(a=>same(a.name,di.value)||same(a.bn_name,di.value));
      fill(th,r?.upazilas||[],prefix+'উপজেলা / থানা নির্বাচন করুন');
    });

    th.addEventListener('change',()=>{
      reset(area,localPh); reset(wd,prefix+'ওয়ার্ড নির্বাচন করুন');
      reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন'); reset(po,prefix+'Post Office নির্বাচন করুন');
      if(pc)pc.value='';
      const d=getDiv();
      const r=(d?.districts||[]).find(a=>same(a.name,di.value)||same(a.bn_name,di.value));
      const t=(r?.upazilas||[]).find(a=>same(a.name,th.value)||same(a.bn_name,th.value));
      const locals=[...(t?.unions||[]).map(a=>({...a,__kind:'ইউনিয়ন'})),...(t?.pourashavas||[]).map(a=>({...a,__kind:'পৌরসভা'}))];
      if(area){
        area.innerHTML=''; area.add(new Option(localPh,''));
        locals.forEach(a=>area.add(new Option(text(a)+' — '+a.__kind,String(a.name||a.id||text(a)))));
        area.disabled=!locals.length;
      }
      const dn=norm(r?.name||r?.bn_name||'');
      const tn=norm(t?.name||t?.bn_name||'');
      const rows=posts.filter(a=>{
        const ad=norm(a.district||a.district_name||a.districtBn||'');
        const at=norm(a.upazila||a.upazila_name||a.thana||a.upazilaBn||'');
        return ad===dn||at===tn;
      });
      if(rows.length){
        fill(po,rows.map(a=>({name:(a.postOffice||a.postoffice||a.suboffice||a.name||'')+(a.postCode||a.postcode||a.postalCode?' — '+(a.postCode||a.postcode||a.postalCode):'')})),prefix+'Post Office নির্বাচন করুন');
      }else{
        reset(po,prefix+'Post Office নির্বাচন করুন');
      }
    });

    area?.addEventListener('change',()=>{
      reset(wd,prefix+'ওয়ার্ড নির্বাচন করুন');
      reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন');
      if(!area.value)return;
      // Union/Pouroshava datasets do not contain ward numbers; provide the standard 1–9 selector.
      fill(wd,Array.from({length:9},(_,i)=>({name:'Ward No-'+String(i+1).padStart(2,'0'),bn_name:'ওয়ার্ড '+String(i+1).padStart(2,'0')})),prefix+'ওয়ার্ড নির্বাচন করুন');
    });

    wd?.addEventListener('change',()=>{
      // Village names are not present in the selected geo dataset, so keep a clean editable selector.
      reset(vl,prefix+'গ্রাম / মহল্লা নির্বাচন করুন');
      if(wd.value){
        vl.disabled=false;
        vl.innerHTML='';
        vl.add(new Option(prefix+'গ্রাম / মহল্লা নির্বাচন করুন',''));
      }
    });

    po.addEventListener('change',()=>{
      const n=po.selectedOptions?.[0]?.textContent||'';
      const code=(n.match(/—\s*(\d{4})$/)||[])[1]||'';
      if(pc)pc.value=code;
    });
  };

  bind(false);
  bind(true);
  window.JORON_ADDRESS_READY=true;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
