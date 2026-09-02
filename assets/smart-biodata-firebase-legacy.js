import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { auth, db, onAuthStateChanged, persistenceReady } from "./firebase-client.js";

const form=document.getElementById("form"),notice=document.getElementById("notice");
const ids=["name","nickname","dob","age","gender","height","blood","marital","nationality","language","religion","practice","division","district","upazila","postOffice","postalCode","area","ward","village","birthPlace","pdivision","pdistrict","pupazila","ppostOffice","ppostalCode","parea","pward","pvillage","addressPrivacy","eduSystem","education","eduDegree","eduInstitution","eduSubject","eduYear","profession","workplace","designation","experience","familyType","childCount","smoking","personality","about","prefAge","prefDistrict","top3","photoUrl","visibility"];
const publicIds=["name","nickname","age","gender","height","marital","division","district","upazila","postOffice","postalCode","area","eduSystem","education","profession","familyType","personality","photoUrl","visibility"];
const valueOf=id=>{const e=document.getElementById(id);if(!e)return "";return e.type==="checkbox"?e.checked:e.value};
const collect=()=>{const d={};ids.forEach(id=>{const e=document.getElementById(id);if(e)d[id]=valueOf(id)});return d};
const project=d=>{const o={};publicIds.forEach(id=>{if(d[id]!==undefined)o[id]=d[id]});return o};
function ageFromDob(){const v=document.getElementById("dob")?.value;if(!v)return;const b=new Date(v+"T00:00:00"),n=new Date();let a=n.getFullYear()-b.getFullYear();if(n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))a--;const e=document.getElementById("age");if(e)e.value=a>=0&&a<130?String(a):""}
document.getElementById("dob")?.addEventListener("change",ageFromDob);
function fill(d){ids.forEach(id=>{const e=document.getElementById(id);if(!e||d[id]===undefined||d[id]===null)return;if(e.type==="checkbox")e.checked=!!d[id];else e.value=d[id]});ageFromDob()}

function ensureHidden(id,value){if(value===undefined||value===null||value==="")return;let e=document.getElementById(id);if(!e){e=document.createElement("input");e.type="hidden";e.id=id;e.name=id;form?.appendChild(e)}e.value=String(value)}

function applyOnboarding(){
 try{
  const raw=localStorage.getItem("joronOnboarding"); if(!raw)return;
  const o=JSON.parse(raw)||{};
  const map={gender:o.gender,marital:o.marital,education:o.education,religion:o.religion,division:o.division,district:o.district,language:o.language};
  const countryNames={BD:"বাংলাদেশি",IN:"ভারতীয়",PK:"পাকিস্তানি",SA:"সৌদি আরবের",AE:"সংযুক্ত আরব আমিরাতের",MY:"মালয়েশীয়",SG:"সিঙ্গাপুরের",GB:"ব্রিটিশ",US:"আমেরিকান",CA:"কানাডিয়ান",AU:"অস্ট্রেলিয়ান",IT:"ইতালীয়",DE:"জার্মান",FR:"ফরাসি",JP:"জাপানি",KR:"দক্ষিণ কোরীয়",QA:"কাতারি",KW:"কুয়েতি",OM:"ওমানি",OTHER:""};
  if(o.country&&countryNames[o.country])map.nationality=countryNames[o.country];
  Object.entries(map).forEach(([id,val])=>{if(val!==undefined&&val!==null&&String(val)!===""){const e=document.getElementById(id);if(e&&!e.value)e.value=String(val)}});
  ensureHidden("country",o.country); ensureHidden("profileFor",o.profileFor); ensureHidden("community",o.community);
  const g=document.getElementById("gender");
  if(o.partnerGender){ensureHidden("partnerGender",o.partnerGender);}
  if(g && !g.value && o.gender)g.value=o.gender;
  if(o.gender && !o.partnerGender){ensureHidden("partnerGender",o.gender==="পুরুষ"?"নারী":"পুরুষ")}
 }catch(e){console.warn("JORON onboarding bridge",e)}
}
applyOnboarding();

function autoProfileLogic(){
 const gender=document.getElementById("gender"), religion=document.getElementById("religion"), dob=document.getElementById("dob");
 const partner=()=>{if(!gender)return;const v=gender.value;const p=v==="পুরুষ"?"নারী":v==="নারী"?"পুরুষ":"";if(p)ensureHidden("partnerGender",p)};
 gender?.addEventListener("change",partner); partner();
 dob?.addEventListener("change",ageFromDob); ageFromDob();
 if(religion){const communityOptions={"ইসলাম":["সুন্নি","শিয়া","আহলে হাদিস","অন্যান্য"],"হিন্দু":["সনাতন হিন্দু","অন্যান্য"],"বৌদ্ধ":["থেরবাদ","অন্যান্য"],"খ্রিস্টান":["ক্যাথলিক","প্রোটেস্ট্যান্ট","অন্যান্য"],"অন্যান্য":["অন্যান্য"]};
  let c=document.getElementById("community");
  if(!c||c.type==="hidden"){
   const wrap=document.createElement("div");wrap.className="field";wrap.id="communityField";
   wrap.innerHTML='<label>সম্প্রদায় <select id="communitySelect"><option value="">নির্বাচন করুন</option></select></label>';
   religion.closest(".grid")?.appendChild(wrap);c=wrap.querySelector("select");
   const hidden=document.getElementById("community");
   if(hidden)c.value=hidden.value;
  }
  const sync=()=>{const opts=communityOptions[religion.value]||["অন্যান্য"];const old=c.value;c.innerHTML='<option value="">নির্বাচন করুন</option>'+opts.map(x=>`<option>${x}</option>`).join("");if(opts.includes(old))c.value=old;ensureHidden("community",c.value)};
  c.addEventListener("change",()=>ensureHidden("community",c.value)); religion.addEventListener("change",sync); sync();
 }
}
autoProfileLogic();

// Visible LIMIT-style automatic profile choices.
function initAutoProfilePanel(){
 const form=document.getElementById("form");if(!form)return;
 const sections=[...form.querySelectorAll(":scope > section.card")];if(!sections.length)return;
 const personal=sections[0];
 const panel=document.createElement("div");panel.id="joronAutoProfilePanel";panel.className="card";
 panel.innerHTML='<h2>✨ Smart Auto Selection</h2><p class="hint">একটি তথ্য নির্বাচন করলে JORON প্রয়োজনীয় পরের তথ্য নিজে সাজিয়ে দেবে।</p><div class="grid"><div class="field"><label>এই Profile কার জন্য?<select id="profileForSelect"><option value="">নির্বাচন করুন</option><option value="Myself">নিজের জন্য (Myself)</option><option value="Son">ছেলের জন্য (Son)</option><option value="Daughter">মেয়ের জন্য (Daughter)</option><option value="Brother">ভাইয়ের জন্য (Brother)</option><option value="Sister">বোনের জন্য (Sister)</option><option value="Friend">বন্ধুর জন্য (Friend)</option><option value="Relative">আত্মীয়ের জন্য (Relative)</option></select></label></div><div class="field"><label>জীবনসঙ্গী হিসেবে খুঁজছি<select id="partnerGenderSelect"><option value="">অটো নির্বাচন হবে</option><option value="পুরুষ">পুরুষ</option><option value="নারী">নারী</option></select></label></div><div class="field"><label>মাতৃভাষা<select id="motherTongueSelect"><option>বাংলা</option><option>হিন্দি</option><option>উর্দু</option><option>আরবি</option><option>ইংরেজি</option><option>অন্যান্য</option></select></label></div><div class="field"><label>দেশ<select id="countrySelect"><option value="BD">বাংলাদেশ</option><option value="IN">ভারত</option><option value="PK">পাকিস্তান</option><option value="SA">সৌদি আরব</option><option value="AE">সংযুক্ত আরব আমিরাত</option><option value="MY">মালয়েশিয়া</option><option value="GB">যুক্তরাজ্য</option><option value="US">যুক্তরাষ্ট্র</option><option value="CA">কানাডা</option><option value="AU">অস্ট্রেলিয়া</option><option value="OTHER">অন্যান্য</option></select></label></div></div>';
 personal.insertBefore(panel,personal.firstElementChild);
 const pf=document.getElementById("profileForSelect"),pg=document.getElementById("partnerGenderSelect"),mt=document.getElementById("motherTongueSelect"),cs=document.getElementById("countrySelect"),g=document.getElementById("gender"),lang=document.getElementById("language"),nat=document.getElementById("nationality");
 let o={};try{o=JSON.parse(localStorage.getItem("joronOnboarding")||"{}")||{}}catch{}
 if(o.profileFor)pf.value=o.profileFor;
 const setPartner=()=>{const v=g?.value;const pv=v==="পুরুষ"?"নারী":v==="নারী"?"পুরুষ":"";if(pv){pg.value=pv;ensureHidden("partnerGender",pv)}};
 if(o.partnerGender)pg.value=o.partnerGender;else setPartner();
 if(o.language){lang.value=o.language;mt.value=o.language==="বাংলা"?"বাংলা":mt.value}
 if(o.country)cs.value=o.country;
 const countryNames={BD:"বাংলাদেশি",IN:"ভারতীয়",PK:"পাকিস্তানি",SA:"সৌদি আরবের",AE:"সংযুক্ত আরব আমিরাতের",MY:"মালয়েশীয়",GB:"ব্রিটিশ",US:"আমেরিকান",CA:"কানাডিয়ান",AU:"অস্ট্রেলিয়ান",OTHER:""};
 const saveState=()=>{try{const x=JSON.parse(localStorage.getItem("joronOnboarding")||"{}")||{};x.profileFor=pf.value;x.partnerGender=pg.value;x.country=cs.value;x.motherTongue=mt.value;localStorage.setItem("joronOnboarding",JSON.stringify(x))}catch{}};
 pf.onchange=()=>{ensureHidden("profileFor",pf.value);saveState()};pg.onchange=()=>{ensureHidden("partnerGender",pg.value);saveState()};mt.onchange=()=>{ensureHidden("motherTongue",mt.value);saveState()};cs.onchange=()=>{ensureHidden("country",cs.value);if(nat&&!nat.value&&countryNames[cs.value])nat.value=countryNames[cs.value];saveState()};g?.addEventListener("change",()=>{setPartner();saveState()});
 ensureHidden("profileFor",pf.value);ensureHidden("partnerGender",pg.value);ensureHidden("motherTongue",mt.value);ensureHidden("country",cs.value);
}
initAutoProfilePanel();

function initGuidedSteps(){
 if(!form)return;
 const sections=[...form.querySelectorAll(":scope > section.card")];
 if(sections.length<2)return;
 const labels=["👤 Personal","📍 Address","🎓 Education","👨‍👩‍👧 Family","🌿 Lifestyle","💍 Partner Preference","🔐 Privacy & Save"];
 const wrap=document.createElement("div");wrap.className="joron-stepper-wrap";
 wrap.innerHTML='<div class="joron-stepper" aria-label="Biodata progress">'+labels.map((x,i)=>`<div class="joron-step" data-step="${i}"><span>${i+1}</span><small>${x.replace(/^\S+\s/,"")}</small></div>`).join("")+'</div><div class="joron-step-progress"><i></i></div><div class="joron-step-title"></div>';
 form.parentNode.insertBefore(wrap,form);
 const style=document.createElement("style");style.textContent=`
 .joron-stepper-wrap{width:min(920px,94%);margin:0 auto 18px}.joron-stepper{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;align-items:start}.joron-step{text-align:center;color:#746e65;font-size:10px;font-weight:800}.joron-step span{display:flex;width:34px;height:34px;margin:0 auto 5px;border-radius:50%;align-items:center;justify-content:center;border:2px solid #dfcda8;background:#fffdf8;color:#8d682d;font-size:12px}.joron-step.active span{background:#c79a45;color:#fff;border-color:#c79a45;box-shadow:0 5px 15px rgba(199,154,69,.25)}.joron-step.done span{background:#667a67;color:#fff;border-color:#667a67}.joron-step.active,.joron-step.done{color:#8d682d}.joron-step-progress{height:4px;background:#ead9b5;border-radius:99px;margin:-19px 22px 14px;overflow:hidden}.joron-step-progress i{display:block;height:100%;width:14.28%;background:linear-gradient(90deg,#c79a45,#a85d68);transition:width .25s}.joron-step-title{font-weight:900;color:#8d682d;text-align:center;font-size:14px}.guided-actions{display:flex;gap:10px;margin-top:18px}.guided-actions button{flex:1;border:0;border-radius:15px;padding:14px;font:inherit;font-weight:900;cursor:pointer}.guided-back{background:#fff;border:1px solid #dfcda8!important;color:#5d554b}.guided-next{background:linear-gradient(135deg,#c79a45,#8d682d);color:#fff}.guided-save{background:linear-gradient(135deg,#a85d68,#8d682d);color:#fff}.guided-actions button:disabled{opacity:.45;cursor:not-allowed}@media(max-width:650px){.joron-stepper-wrap{width:calc(100% - 24px)}.joron-stepper{grid-template-columns:repeat(7,minmax(44px,1fr));overflow-x:auto;padding:2px 0 4px}.joron-step{min-width:44px}.joron-step small{display:block;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.joron-step-progress{display:none}.guided-actions{position:sticky;bottom:0;background:#fbf7ef;padding:10px 0;z-index:5}.guided-actions button{min-height:48px}}
 `;document.head.appendChild(style);
 let current=Number(localStorage.getItem("joronBiodataStep")||0);if(!Number.isInteger(current)||current<0||current>=sections.length)current=0;
 sections.forEach((sec,i)=>{sec.dataset.guidedStep=i;sec.hidden=i!==current;sec.querySelectorAll("input,select,textarea,button").forEach(el=>{if(i!==current)el.disabled=true})});
 const actions=document.createElement("div");actions.className="guided-actions";actions.innerHTML='<button type="button" class="guided-back">← Back</button><button type="button" class="guided-next">Next →</button>';
 form.appendChild(actions);
 const title=wrap.querySelector(".joron-step-title"),bar=wrap.querySelector(".joron-step-progress i");
 function render(){sections.forEach((sec,i)=>{const active=i===current;sec.hidden=!active;sec.querySelectorAll("input,select,textarea,button").forEach(el=>el.disabled=!active)});wrap.querySelectorAll(".joron-step").forEach((s,i)=>{s.classList.toggle("active",i===current);s.classList.toggle("done",i<current)});title.textContent=labels[current];bar.style.width=((current+1)/sections.length*100)+"%";actions.querySelector(".guided-back").disabled=current===0;actions.querySelector(".guided-next").textContent=current===sections.length-1?"💾 Save & Finish":"Next →";actions.querySelector(".guided-next").classList.toggle("guided-save",current===sections.length-1);window.scrollTo({top:0,behavior:"smooth"});localStorage.setItem("joronBiodataStep",String(current));}
 function validStep(){const fields=[...sections[current].querySelectorAll("input:not([type=hidden]),select,textarea")].filter(e=>!e.disabled);for(const el of fields){if(!el.checkValidity()){el.reportValidity();el.focus();return false}}return true}
 actions.querySelector(".guided-back").onclick=()=>{if(current>0){current--;render()}};
 actions.querySelector(".guided-next").onclick=()=>{if(!validStep())return;if(current<sections.length-1){current++;render()}else form.requestSubmit()};
 render();
}

initGuidedSteps();

await import("./biodata-smart-fields.js");
await persistenceReady;
onAuthStateChanged(auth,async user=>{
 if(!user){location.replace("login.html?next=smart-biodata.html");return}
 try{const s=await getDoc(doc(db,"privateBiodata",user.uid));if(s.exists()){fill(s.data());ageFromDob();autoProfileLogic();initAutoProfilePanel()}}catch(e){console.error("JORON biodata load",e)}
});

form?.addEventListener("submit",async e=>{
 e.preventDefault();
 const user=auth.currentUser;if(!user){location.replace("login.html?next=smart-biodata.html");return}
 const data=collect();["country","profileFor","community","partnerGender","motherTongue"].forEach(id=>{const v=valueOf(id);if(v)data[id]=v});
 data.uid=user.uid;data.email=user.email||"";data.updatedAt=serverTimestamp();
 try{
  await setDoc(doc(db,"privateBiodata",user.uid),data,{merge:true});
  await setDoc(doc(db,"biodata",user.uid),{...project(data),uid:user.uid,updatedAt:serverTimestamp()},{merge:true});
  localStorage.removeItem("joronBiodataStep");
  if(notice){notice.textContent="❤️ আপনার Smart Biodata Firebase-এ নিরাপদভাবে সংরক্ষিত হয়েছে।";notice.style.display="block"}
  alert("Smart Biodata সফলভাবে সংরক্ষণ হয়েছে।");
 }catch(err){console.error("JORON Smart Biodata save failed",err);alert("তথ্য সংরক্ষণ করা যায়নি। Firebase/নেটওয়ার্ক সংযোগ পরীক্ষা করুন।")}
},true);
