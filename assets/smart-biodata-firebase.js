// JORON final address compatibility layer.
// The legacy address script may be present, but this module is the authoritative final initializer.
// Firebase save/load remains in biodata.html; parea/area receive a complete human-readable address summary.

const $=id=>document.getElementById(id);
const GEO="https://esm.sh/@olism/bd-geo@0.1.6?bundle";
const POST="https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";
let D=[],Z=[],U=[],A=[],V=[],P=[];
const bn=x=>String(x?.nameBn||x?.bn_name||x?.name||"").trim();
const office=x=>String(x?.postOffice??x?.postoffice??x?.suboffice??x?.post_office??x?.name||"").trim();
const code=x=>String(x?.postCode??x?.postcode??x?.post_code??x?.postalCode??x?.postal_code??"").trim();
const postText=x=>{const o=office(x),c=code(x);return o?(c?`${o} — ${c}`:o):""};
function reset(e,t){if(!e)return;e.replaceChildren(new Option(t,""));e.value="";e.disabled=true;}
function fill(e,rows,t,fn=bn){if(!e)return;e.replaceChildren(new Option(t,""));const s=new Set();for(const r of rows||[]){const n=String(fn(r)||"").trim();if(!n||s.has(n))continue;s.add(n);e.add(new Option(n,String(r.id??n)));}e.disabled=!s.size;}
function get(id){return $(id);}
function ensureSelect(id,label,placeholder,anchorId){if(get(id))return get(id);const a=get(anchorId);if(!a)return null;const h=document.createElement("div");h.className="field joron-final-address-field";h.innerHTML=`<label for="${id}">${label}</label><select id="${id}" name="${id}"><option value="">${placeholder}</option></select>`;a.closest(".field")?.insertAdjacentElement("beforebegin",h);return get(id);}
function ensureInput(id,placeholder){const e=get(id);if(!e)return null;if(e.tagName.toLowerCase()==="input")return e;const n=document.createElement("input");n.id=id;n.name=id;n.readOnly=true;n.placeholder=placeholder;n.className=e.className;e.replaceWith(n);return n;}
function initSide(prefix){
 const L=prefix?"Permanent":"Present",p=prefix?"p":"";
 const dv=get(p+"division"),dz=get(p+"district"),up=get(p+"upazila"),po=get(p+"postOffice"),pc=get(prefix?"ppostalCode":"postalCode"),summary=ensureInput(prefix?"parea":"area",`${L} ঠিকানার সারাংশ`);
 const union=ensureSelect(p+"union",`${L} ইউনিয়ন / পৌরসভা`,`${L} ইউনিয়ন / পৌরসভা নির্বাচন করুন`,p+"postOffice");
 const ward=ensureSelect(p+"ward",`${L} ওয়ার্ড`,`${L} ওয়ার্ড নির্বাচন করুন`,p+"postOffice");
 const village=ensureSelect(p+"village",`${L} গ্রাম / মহল্লা`,`${L} গ্রাম নির্বাচন করুন`,prefix?"addressPrivacy":"addressPrivacy");
 if(!dv||!dz||!up||!po||!union||!ward||!village)return;
 const ph={d:`${L} জেলা নির্বাচন করুন`,u:`${L} উপজেলা / থানা নির্বাচন করুন`,a:`${L} ইউনিয়ন / পৌরসভা নির্বাচন করুন`,w:`${L} ওয়ার্ড নির্বাচন করুন`,p:`${L} Post Office নির্বাচন করুন`,v:`${L} গ্রাম নির্বাচন করুন`};
 const updateSummary=()=>{const parts=[];for(const [e,k] of [[union,"ইউনিয়ন/পৌরসভা"],[ward,"ওয়ার্ড"],[village,"গ্রাম/মহল্লা"]]){const t=e.selectedOptions?.[0]?.textContent?.trim();if(t&&e.selectedIndex>0)parts.push(`${k}: ${t}`);}if(summary)summary.value=parts.join(" | ");};
 dv.addEventListener("change",()=>{reset(dz,ph.d);reset(up,ph.u);reset(union,ph.a);reset(ward,ph.w);reset(village,ph.v);reset(po,ph.p);if(pc)pc.value="";if(summary)summary.value="";const d=D.find(x=>String(x.id)===String(dv.value));fill(dz,Z.filter(x=>String(x.divisionId)===String(d?.id)),ph.d);});
 dz.addEventListener("change",()=>{reset(up,ph.u);reset(union,ph.a);reset(ward,ph.w);reset(village,ph.v);reset(po,ph.p);if(pc)pc.value="";if(summary)summary.value="";const d=Z.find(x=>String(x.id)===String(dz.value));fill(up,U.filter(x=>String(x.districtId)===String(d?.id)),ph.u);});
 up.addEventListener("change",()=>{reset(union,ph.a);reset(ward,ph.w);reset(village,ph.v);reset(po,ph.p);if(pc)pc.value="";if(summary)summary.value="";const u=U.find(x=>String(x.id)===String(up.value));if(!u)return;const aa=A.filter(x=>String(x.upazilaId)===String(u.id));fill(union,aa.filter(x=>x.type==="union"),ph.a);fill(ward,aa.filter(x=>x.type==="ward"),ph.w);const names=[u.name,u.nameBn].filter(Boolean).map(String);fill(po,P.filter(x=>names.includes(String(x.upazila??x.upazila_name??x.upazila_bn??"").trim())),ph.p,postText);});
 union.addEventListener("change",()=>{reset(village,ph.v);const u=A.find(x=>String(x.id)===String(union.value)&&x.type==="union");if(u)fill(village,V.filter(x=>String(x.areaId)===String(u.id)),ph.v);updateSummary();});
 ward.addEventListener("change",updateSummary);
 village.addEventListener("change",updateSummary);
 po.addEventListener("change",()=>{const row=P.find(x=>postText(x)===po.options[po.selectedIndex]?.textContent);if(pc)pc.value=row?code(row):"";updateSummary();});
 return {dv,dz,up,po,pc,union,ward,village,summary,ph};
}
async function start(){
 try{
  const m=await import(GEO);D=m.getDivisions?.()||[];Z=m.getDistricts?.()||[];U=m.getUpazilas?.()||[];A=m.getAreas?.()||[];V=m.getVillages?.()||[];
  try{const r=await fetch(POST,{cache:"no-store"});if(r.ok){const j=await r.json();P=Array.isArray(j)?j:(j.postcodes||j.data||[]);}}catch(e){console.warn("postcode data unavailable",e);}
  fill(get("pdivision"),D,"Permanent বিভাগ নির্বাচন করুন");fill(get("division"),D,"Present বিভাগ নির্বাচন করুন");
  const p=initSide(true),c=initSide(false);
  if(p&&c){const s=get("locationStatus");if(s){s.textContent=`✅ Address ready — ${D.length} বিভাগ | Division → District → Upazila/Thana → Union/Paurashava → Ward → Post Office → Postal Code → Village`;s.style.display="block";}}
 }catch(e){console.error("Final JORON address loader failed",e);const s=get("locationStatus");if(s){s.textContent="⚠️ Address data লোড হয়নি। Internet চালু করে Refresh করুন।";s.style.display="block";s.style.color="#a80000";}}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();