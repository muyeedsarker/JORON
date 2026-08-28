// JORON Smart Biodata — stable dependent Bangladesh address system
// Keeps existing Firebase fields intact and adds Union/Paurashava, Ward and Village selectors.
// Hierarchy: Division -> District -> Upazila/Thana -> Union/Paurashava -> Ward -> Post Office -> Postal Code -> Village.
// Note: bd-geo models Union and Ward as sibling areas under the same Upazila; Village belongs to Union.

const JORON_POST_URL="https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";
const JORON_GEO_MODULE="https://esm.sh/@olism/bd-geo@0.1.6?bundle";
const $=id=>document.getElementById(id);
let divisions=[],districts=[],upazilas=[],areas=[],villages=[],posts=[];

function status(text,error=false){const b=$("locationStatus");if(!b)return;b.textContent=text;b.style.display="block";b.style.color=error?"#a80000":"#087b59";}
function reset(el,ph){if(!el)return;el.replaceChildren(new Option(ph,""));el.value="";el.disabled=true;}
function labelOf(r){return String(r?.nameBn||r?.bn_name||r?.name||r?.title||"").trim();}
function codeOf(r){return String(r?.postCode??r?.postcode??r?.post_code??r?.postalCode??r?.postal_code??"").trim();}
function officeOf(r){return String(r?.postOffice??r?.postoffice??r?.suboffice??r?.post_office??r?.name||"").trim();}
function postLabel(r){const o=officeOf(r),c=codeOf(r);return o?(c?`${o} — ${c}`:o):"";}
function byId(rows,id){return(rows||[]).find(x=>String(x.id)===String(id));}
function fill(el,rows,ph,fn=labelOf){if(!el)return;el.replaceChildren(new Option(ph,""));const seen=new Set();(rows||[]).forEach(r=>{const label=String(fn(r)||"").trim();if(!label||seen.has(label))return;seen.add(label);el.add(new Option(label,String(r.id??r.value??label)));});el.disabled=seen.size===0;}

function ensureInput(id,placeholder){const old=$(id);if(!old)return null;if(old.tagName.toLowerCase()==="input")return old;const input=document.createElement("input");input.id=id;input.name=id;input.type="text";input.readOnly=true;input.placeholder=placeholder;input.className=old.className;old.replaceWith(input);return input;}
function makeSelect(id,label,placeholder,afterId){if($(id))return $(id);const anchor=$(afterId);if(!anchor)return null;const holder=document.createElement("div");holder.className="field joron-address-extra";holder.innerHTML=`<label for="${id}">${label}</label><select id="${id}" name="${id}"><option value="">${placeholder}</option></select>`;anchor.closest(".field")?.insertAdjacentElement("beforebegin",holder);return $(id);}
function ensureFields(permanent){const P=permanent?"p":"",L=permanent?"Permanent":"Present";const area=ensureInput(P?"parea":"area",`${L} ঠিকানার সারাংশ`);const union=makeSelect(P+"union",`${L} ইউনিয়ন / পৌরসভা`,`${L} ইউনিয়ন / পৌরসভা নির্বাচন করুন`,P?"ppostOffice":"postOffice");const ward=makeSelect(P+"ward",`${L} ওয়ার্ড`,`${L} ওয়ার্ড নির্বাচন করুন`,P?"ppostOffice":"postOffice");const village=makeSelect(P+"village",`${L} গ্রাম / মহল্লা`,`${L} গ্রাম নির্বাচন করুন`,P?"addressPrivacy":"addressPrivacy");return{union,ward,village,area};}

function summary(permanent){const P=permanent?"p":"",f=ensureFields(permanent);if(!f.area)return;const vals=[[P+"union","ইউনিয়ন/পৌরসভা"],[P+"ward","ওয়ার্ড"],[P+"village","গ্রাম/মহল্লা"]];const parts=[];vals.forEach(([id,k])=>{const e=$(id),t=e?.selectedOptions?.[0]?.textContent?.trim();if(t&&t!==e.options[0]?.textContent?.trim())parts.push(`${k}: ${t}`);});f.area.value=parts.join(" | ");}
function summaryValue(permanent,key){const a=$(permanent?"parea":"area");if(!a?.value)return"";const m=a.value.match(new RegExp(key+":\\s*([^|]+)","u"));return m?m[1].trim():"";}
function findLabel(rows,text){return(rows||[]).find(x=>labelOf(x)===String(text||"").trim());}

function setup(permanent){
 const P=permanent?"p":"",L=permanent?"Permanent":"Present";
 const dv=$(P+"division"),di=$(P+"district"),up=$(P+"upazila"),po=$(P+"postOffice"),pc=$(permanent?"ppostalCode":"postalCode"),f=ensureFields(permanent);
 if(!dv||!di||!up||!po)return;
 const ph={d:`${L} জেলা নির্বাচন করুন`,u:`${L} উপজেলা / থানা নির্বাচন করুন`,a:`${L} ইউনিয়ন / পৌরসভা নির্বাচন করুন`,w:`${L} ওয়ার্ড নির্বাচন করুন`,p:`${L} Post Office নির্বাচন করুন`,v:`${L} গ্রাম নির্বাচন করুন`};
 dv.addEventListener("change",()=>{reset(di,ph.d);reset(up,ph.u);reset(f.union,ph.a);reset(f.ward,ph.w);reset(f.village,ph.v);reset(po,ph.p);if(pc)pc.value="";f.area.value="";const d=byId(divisions,dv.value);fill(di,districts.filter(x=>String(x.divisionId)===String(d?.id)),ph.d);});
 di.addEventListener("change",()=>{reset(up,ph.u);reset(f.union,ph.a);reset(f.ward,ph.w);reset(f.village,ph.v);reset(po,ph.p);if(pc)pc.value="";f.area.value="";const d=byId(districts,di.value);fill(up,upazilas.filter(x=>String(x.districtId)===String(d?.id)),ph.u);});
 up.addEventListener("change",()=>{reset(f.union,ph.a);reset(f.ward,ph.w);reset(f.village,ph.v);reset(po,ph.p);if(pc)pc.value="";f.area.value="";const u=byId(upazilas,up.value);if(!u)return;const a=areas.filter(x=>String(x.upazilaId)===String(u.id));fill(f.union,a.filter(x=>x.type==="union"),ph.a);fill(f.ward,a.filter(x=>x.type==="ward"),ph.w);const names=[u.name,u.nameBn].filter(Boolean).map(String);const pRows=posts.filter(r=>names.includes(String(r.upazila??r.upazila_name??r.upazila_bn??"").trim()));fill(po,pRows,ph.p,postLabel);});
 f.union?.addEventListener("change",()=>{reset(f.village,ph.v);const u=byId(areas,f.union.value);if(u?.type==="union")fill(f.village,villages.filter(v=>String(v.areaId)===String(u.id)),ph.v);summary(permanent);});
 // Ward is a sibling area under the same Upazila, not a child of Union. It becomes usable after Union is selected so the UI remains simple and sequential.
 f.ward?.addEventListener("change",()=>summary(permanent));
 f.village?.addEventListener("change",()=>summary(permanent));
 po.addEventListener("change",()=>{const row=posts.find(r=>postLabel(r)===po.options[po.selectedIndex]?.textContent);if(pc)pc.value=row?codeOf(row):"";summary(permanent);});
}

function setCascade(permanent,values){
 const P=permanent?"p":"",dv=$(P+"division"),di=$(P+"district"),up=$(P+"upazila"),po=$(P+"postOffice"),pc=$(permanent?"ppostalCode":"postalCode"),f=ensureFields(permanent);if(!dv||!di||!up||!po)return;
 const L=permanent?"Permanent":"Present";
 if(values.division){dv.value=values.division;const d=byId(divisions,dv.value);fill(di,districts.filter(x=>String(x.divisionId)===String(d?.id)),`${L} জেলা নির্বাচন করুন`);}
 if(values.district){di.value=values.district;const d=byId(districts,di.value);fill(up,upazilas.filter(x=>String(x.districtId)===String(d?.id)),`${L} উপজেলা / থানা নির্বাচন করুন`);}
 if(values.upazila){up.value=values.upazila;const u=byId(upazilas,up.value);const a=areas.filter(x=>String(x.upazilaId)===String(u?.id));fill(f.union,a.filter(x=>x.type==="union"),`${L} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);fill(f.ward,a.filter(x=>x.type==="ward"),`${L} ওয়ার্ড নির্বাচন করুন`);const names=[u?.name,u?.nameBn].filter(Boolean).map(String);fill(po,posts.filter(r=>names.includes(String(r.upazila??r.upazila_name??r.upazila_bn??"").trim())),`${L} Post Office নির্বাচন করুন`,postLabel);}
 if(values.union){const u=findLabel(areas.filter(a=>a.type==="union"),values.union);if(u){f.union.value=String(u.id);fill(f.village,villages.filter(v=>String(v.areaId)===String(u.id)),`${L} গ্রাম নির্বাচন করুন");}}
 if(values.ward){const w=findLabel(areas.filter(a=>a.type==="ward"),values.ward);if(w)f.ward.value=String(w.id);}
 if(values.village){const v=findLabel(villages,values.village);if(v)f.village.value=String(v.id);}
 if(values.postOffice){const row=posts.find(r=>postLabel(r)===values.postOffice||officeOf(r)===values.postOffice);if(row){const option=[...po.options].find(o=>o.textContent===postLabel(row));if(option)po.value=option.value;if(pc)pc.value=codeOf(row);}}
 summary(permanent);
}

function savedValues(permanent){const P=permanent?"p":"";return{division:$(P+"division")?.value||"",district:$(P+"district")?.value||"",upazila:$(P+"upazila")?.value||"",postOffice:$(P+"postOffice")?.value||"",union:$(P+"union")?.value||summaryValue(permanent,"ইউনিয়ন/পৌরসভা"),ward:$(P+"ward")?.value||summaryValue(permanent,"ওয়ার্ড"),village:$(P+"village")?.value||summaryValue(permanent,"গ্রাম/মহল্লা")};}
function restoreFromSummary(permanent){const P=permanent?"p":"",f=ensureFields(permanent);const s={union:summaryValue(permanent,"ইউনিয়ন/পৌরসভা"),ward:summaryValue(permanent,"ওয়ার্ড"),village:summaryValue(permanent,"গ্রাম/মহল্লা")};if(!s.union&&!s.ward&&!s.village)return;const u=findLabel(areas.filter(a=>a.type==="union"),s.union);if(u){f.union.value=String(u.id);fill(f.village,villages.filter(v=>String(v.areaId)===String(u.id)),`${permanent?"Permanent":"Present"} গ্রাম নির্বাচন করুন`);}const w=findLabel(areas.filter(a=>a.type==="ward"),s.ward);if(w)f.ward.value=String(w.id);const v=findLabel(villages,s.village);if(v)f.village.value=String(v.id);summary(permanent);}

async function loadData(){try{status("📍 বাংলাদেশের সম্পূর্ণ Address data লোড হচ্ছে...");const mod=await import(JORON_GEO_MODULE);divisions=mod.getDivisions?.()||[];districts=mod.getDistricts?.()||[];upazilas=mod.getUpazilas?.()||[];areas=mod.getAreas?.()||[];villages=mod.getVillages?.()||[];if(!divisions.length||!districts.length||!upazilas.length||!areas.length)throw new Error("Incomplete bd-geo dataset");try{const r=await fetch(JORON_POST_URL,{cache:"no-store"});if(r.ok){const j=await r.json();posts=Array.isArray(j)?j:(j.postcodes||j.data||[]);}}catch(e){console.warn("Postcode dataset unavailable",e);}fill($("pdivision"),divisions,"Permanent বিভাগ নির্বাচন করুন");fill($("division"),divisions,"Present বিভাগ নির্বাচন করুন");setup(true);setup(false);status(`✅ Address data ready — ${divisions.length} বিভাগ | Division → District → Upazila/Thana → Union/Paurashava → Ward → Post Office → Postal Code → Village`);setTimeout(()=>{restoreFromSummary(true);restoreFromSummary(false);},300);}catch(e){console.error("JORON address error",e);status("⚠️ Address data লোড হয়নি। Internet চালু করে Refresh করুন।",true);}}

function defaults(){const a=$("about"),p=$("partner");if(a&&!a.value.trim())a.value="আমি একজন সহজ-সরল, দায়িত্বশীল ও পরিবারকে মূল্য দেওয়া মানুষ। পারস্পরিক সম্মান, বিশ্বাস, সততা ও সুন্দর বোঝাপড়াকে একটি ভালো সম্পর্কের ভিত্তি মনে করি। জীবনে সুখ-দুঃখ একসঙ্গে ভাগ করে নিয়ে শান্তিপূর্ণ ও সুন্দর একটি পরিবার গড়ে তুলতে চাই।";if(p&&!p.value.trim())p.value="আমি এমন একজন জীবনসঙ্গী প্রত্যাশা করি যিনি সৎ, দায়িত্বশীল, ভদ্র, আন্তরিক ও পরিবারকে সম্মান করেন। পারস্পরিক বিশ্বাস, সম্মান, বোঝাপড়া ও সহযোগিতাকে সবচেয়ে বেশি গুরুত্ব দিই। ভালো চরিত্র, মানবিক মূল্যবোধ ও সুন্দর মানসিকতাকে অগ্রাধিকার দেওয়া হবে।";}
function init(){defaults();ensureFields(true);ensureFields(false);loadData();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();