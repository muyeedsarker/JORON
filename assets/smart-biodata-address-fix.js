// JORON Smart Biodata — FINAL stable dependent Bangladesh address system
// Division -> District -> Upazila/Thana -> Union/Paurashava -> Ward -> Post Office -> Postal Code -> Village
// Permanent + Present are independent. Existing Firebase/save logic is untouched.

const GEO="https://esm.sh/@olism/bd-geo@0.1.6?bundle";
const POST="https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";
const $=id=>document.getElementById(id);
let D=[],Z=[],U=[],A=[],V=[],P=[];
const label=x=>String(x?.nameBn||x?.bn_name||x?.name||x?.title||"").trim();
const office=x=>String(x?.postOffice??x?.postoffice??x?.suboffice??x?.post_office??x?.name??"").trim();
const code=x=>String(x?.postCode??x?.postcode??x?.post_code??x?.postalCode??x?.postal_code??"").trim();
const postLabel=x=>{const o=office(x),c=code(x);return o?(c?`${o} — ${c}`:o):""};
function status(t,err=false){const e=$("locationStatus");if(!e)return;e.textContent=t;e.style.display="block";e.style.color=err?"#a80000":"#087b59";}
function reset(e,t){if(!e)return;e.replaceChildren(new Option(t,""));e.value="";e.disabled=true;}
function fill(e,rows,t,fn=label){if(!e)return;e.replaceChildren(new Option(t,""));const seen=new Set();for(const r of rows||[]){const n=String(fn(r)||"").trim();if(!n||seen.has(n))continue;seen.add(n);e.add(new Option(n,String(r.id??n)));}e.disabled=seen.size===0;}
function makeSelect(id,text,ph,anchorId){if($(id))return $(id);const a=$(anchorId);if(!a)return null;const h=document.createElement("div");h.className="field joron-address-extra";h.innerHTML=`<label for="${id}">${text}</label><select id="${id}" name="${id}"><option value="">${ph}</option></select>`;a.closest(".field")?.insertAdjacentElement("beforebegin",h);return $(id);}
function makeAreaInput(id,placeholder){const e=$(id);if(!e)return null;if(e.tagName.toLowerCase()==="input")return e;const n=document.createElement("input");n.id=id;n.name=id;n.readOnly=true;n.placeholder=placeholder;n.className=e.className;e.replaceWith(n);return n;}
function summary(permanent){const p=permanent?"p":"",area=$(permanent?"parea":"area");if(!area)return;const parts=[];for(const [id,k] of [[p+"union","ইউনিয়ন/পৌরসভা"],[p+"ward","ওয়ার্ড"],[p+"village","গ্রাম/মহল্লা"]]){const e=$(id);if(!e||e.selectedIndex<=0)continue;const t=e.options[e.selectedIndex]?.textContent?.trim();if(t)parts.push(`${k}: ${t}`)}area.value=parts.join(" | ");}
function setup(permanent){
 const p=permanent?"p":"",L=permanent?"Permanent":"Present";
 const dv=$(p+"division"),di=$(p+"district"),up=$(p+"upazila"),po=$(p+"postOffice"),pc=$(permanent?"ppostalCode":"postalCode"),area=makeAreaInput(permanent?"parea":"area",`${L} ঠিকানার সারাংশ`);
 // All new fields are inserted directly before Post Office, so both address blocks stay in order.
 const union=makeSelect(p+"union",`${L} ইউনিয়ন / পৌরসভা`,`${L} ইউনিয়ন / পৌরসভা নির্বাচন করুন`,p+"postOffice");
 const ward=makeSelect(p+"ward",`${L} ওয়ার্ড`,`${L} ওয়ার্ড নির্বাচন করুন`,p+"postOffice");
 const village=makeSelect(p+"village",`${L} গ্রাম / মহল্লা`,`${L} গ্রাম নির্বাচন করুন`,p+"postOffice");
 if(!dv||!di||!up||!po||!union||!ward||!village)return;
 const ph={d:`${L} জেলা নির্বাচন করুন`,u:`${L} উপজেলা / থানা নির্বাচন করুন`,a:`${L} ইউনিয়ন / পৌরসভা নির্বাচন করুন`,w:`${L} ওয়ার্ড নির্বাচন করুন`,v:`${L} গ্রাম নির্বাচন করুন`,p:`${L} Post Office নির্বাচন করুন`};
 dv.addEventListener("change",()=>{reset(di,ph.d);reset(up,ph.u);reset(union,ph.a);reset(ward,ph.w);reset(village,ph.v);reset(po,ph.p);if(pc)pc.value="";if(area)area.value="";const d=D.find(x=>String(x.id)===String(dv.value));fill(di,Z.filter(x=>String(x.divisionId)===String(d?.id)),ph.d);});
 di.addEventListener("change",()=>{reset(up,ph.u);reset(union,ph.a);reset(ward,ph.w);reset(village,ph.v);reset(po,ph.p);if(pc)pc.value="";if(area)area.value="";const d=Z.find(x=>String(x.id)===String(di.value));fill(up,U.filter(x=>String(x.districtId)===String(d?.id)),ph.u);});
 up.addEventListener("change",()=>{reset(union,ph.a);reset(ward,ph.w);reset(village,ph.v);reset(po,ph.p);if(pc)pc.value="";if(area)area.value="";const u=U.find(x=>String(x.id)===String(up.value));if(!u)return;const a=A.filter(x=>String(x.upazilaId)===String(u.id));fill(union,a.filter(x=>x.type==="union"),ph.a);fill(ward,a.filter(x=>x.type==="ward"),ph.w);const names=[u.name,u.nameBn].filter(Boolean).map(String);fill(po,P.filter(x=>names.includes(String(x.upazila??x.upazila_name??x.upazila_bn??"").trim())),ph.p,postLabel);});
 union.addEventListener("change",()=>{reset(village,ph.v);const u=A.find(x=>String(x.id)===String(union.value)&&x.type==="union");if(u)fill(village,V.filter(x=>String(x.areaId)===String(u.id)),ph.v);summary(permanent);});
 ward.addEventListener("change",()=>summary(permanent));
 village.addEventListener("change",()=>summary(permanent));
 po.addEventListener("change",()=>{const row=P.find(x=>postLabel(x)===po.options[po.selectedIndex]?.textContent);if(pc)pc.value=row?code(row):"";});
}
async function init(){try{status("📍 বাংলাদেশের সম্পূর্ণ Address data লোড হচ্ছে...");const m=await import(GEO);D=m.getDivisions?.()||[];Z=m.getDistricts?.()||[];U=m.getUpazilas?.()||[];A=m.getAreas?.()||[];V=m.getVillages?.()||[];if(!D.length||!Z.length||!U.length||!A.length||!V.length)throw new Error("Incomplete address dataset");try{const r=await fetch(POST,{cache:"no-store"});if(r.ok){const j=await r.json();P=Array.isArray(j)?j:(j.postcodes||j.data||[]);}}catch(e){console.warn("Postcode data unavailable",e)}fill($("pdivision"),D,"Permanent বিভাগ নির্বাচন করুন");fill($("division"),D,"Present বিভাগ নির্বাচন করুন");setup(true);setup(false);status(`✅ Address ready — ${D.length} বিভাগ | বিভাগ → জেলা → উপজেলা/থানা → ইউনিয়ন/পৌরসভা → ওয়ার্ড → Post Office → Postal Code → গ্রাম`);}catch(e){console.error("JORON address error",e);status("⚠️ Address data লোড হয়নি। Internet চালু করে Refresh করুন।",true)}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
