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

function applyOnboarding(){
 try{
  const raw=localStorage.getItem("joronOnboarding");if(!raw)return;const o=JSON.parse(raw)||{};
  const map={gender:o.gender,marital:o.marital,education:o.education,religion:o.religion,division:o.division,district:o.district,language:o.language};
  const countryNames={BD:"বাংলাদেশি",IN:"ভারতীয়",PK:"পাকিস্তানি",SA:"সৌদি আরবের",AE:"সংযুক্ত আরব আমিরাতের",MY:"মালয়েশীয়",SG:"সিঙ্গাপুরের",GB:"ব্রিটিশ",US:"আমেরিকান",CA:"কানাডিয়ান",AU:"অস্ট্রেলিয়ান",IT:"ইতালীয়",DE:"জার্মান",FR:"ফরাসি",JP:"জাপানি",KR:"দক্ষিণ কোরীয়",QA:"কাতারি",KW:"কুয়েতি",OM:"ওমানি",OTHER:""};
  if(o.country&&countryNames[o.country])map.nationality=countryNames[o.country];
  Object.entries(map).forEach(([id,val])=>{if(val!==undefined&&val!==null&&String(val)!===""){const e=document.getElementById(id);if(e&&!e.value)e.value=String(val)}});
  const hiddenKeys={country:o.country,profileFor:o.profileFor,community:o.community};
  Object.entries(hiddenKeys).forEach(([id,val])=>{if(!val)return;let e=document.getElementById(id);if(!e){e=document.createElement("input");e.type="hidden";e.id=id;e.name=id;form?.appendChild(e)}e.value=String(val)});
 }catch(e){console.warn("JORON onboarding bridge",e)}
}
applyOnboarding();

await import("./biodata-smart-fields.js");
await persistenceReady;

/* LIMIT-style guided Smart Biodata: one section at a time, saved progress, mobile-first. */
function setupGuidedSteps(){
 if(!form)return;
 const cards=[...form.querySelectorAll(":scope > .card")];
 if(cards.length<7)return;
 const groups=[[0],[1,2],[3],[4],[5,6],[7],[8]];
 const labels=["ব্যক্তিগত","ঠিকানা","শিক্ষা ও পেশা","পরিবার","জীবনধারা","জীবনসঙ্গী","Privacy & Save"];
 let current=Math.max(0,Math.min(6,Number(localStorage.getItem("joronBiodataStep")||0)));
 const style=document.createElement("style");
 style.textContent=`
 .jb-stepper{background:linear-gradient(145deg,#fffdf8,#fff7fb);border:1px solid #eadfea;border-radius:20px;padding:14px;margin:0 0 18px;box-shadow:0 8px 22px rgba(70,25,90,.07)}
 .jb-step-title{font-weight:900;color:#64158f;font-size:14px;margin-bottom:10px}.jb-step-count{float:right;color:#8d682d;font-size:12px}
 .jb-dots{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.jb-dot{text-align:center;font-size:9px;color:#746e65;min-width:0}.jb-dot i{display:flex;width:28px;height:28px;margin:0 auto 4px;border-radius:50%;align-items:center;justify-content:center;background:#fff;border:2px solid #dfcda8;color:#8d682d;font-style:normal;font-weight:900}.jb-dot.active i,.jb-dot.done i{background:#c79a45;border-color:#c79a45;color:#fff}.jb-dot.active{color:#8d682d;font-weight:900}
 .jb-actions{display:flex;gap:10px;margin:18px 0 4px}.jb-actions button{flex:1;min-height:48px;border-radius:15px;font:900 15px inherit;cursor:pointer}.jb-back{background:#fff;border:1px solid #dfcda8;color:#746e65}.jb-next{border:0;background:linear-gradient(135deg,#c79a45,#a85d68);color:#fff;box-shadow:0 8px 18px rgba(168,93,104,.18)}
 .jb-note{padding:10px 12px;margin-bottom:14px;border-radius:13px;background:#f3e4e5;border:1px solid #ead9b5;color:#6b4c50;font-size:12px;font-weight:700}
 @media(max-width:650px){.jb-stepper{padding:12px}.jb-dot{font-size:8px}.jb-dot i{width:27px;height:27px}.jb-actions{position:sticky;bottom:8px;z-index:20;padding:8px;background:#fffdf8dd;backdrop-filter:blur(8px);border-radius:16px}.jb-actions button{min-height:50px}}
 `;document.head.appendChild(style);
 const stepper=document.createElement("div");stepper.className="jb-stepper";
 stepper.innerHTML=`<div class="jb-step-title">📝 আপনার Biodata — ধাপে ধাপে <span class="jb-step-count"></span></div><div class="jb-dots">${labels.map((x,i)=>`<div class="jb-dot"><i>${i+1}</i><span>${x}</span></div>`).join("")}</div>`;
 const note=document.createElement("div");note.className="jb-note";note.textContent="একটি ধাপ পূরণ করে পরের ধাপে যান। আগের তথ্য স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে।";
 const actions=document.createElement("div");actions.className="jb-actions";actions.innerHTML='<button type="button" class="jb-back">← পিছনে</button><button type="button" class="jb-next">পরের ধাপ →</button>';
 form.parentNode.insertBefore(stepper,form);form.insertBefore(note,form.firstElementChild);form.appendChild(actions);
 const originalActions=form.querySelector(".actions");
 if(originalActions)originalActions.style.display="none";
 const finalSubmit=form.querySelector('button[type="submit"]');
 function visibleCards(){return groups[current]||[]}
 function render(){
  cards.forEach((card,i)=>card.style.display=visibleCards().includes(i)?"block":"none");
  stepper.querySelectorAll(".jb-dot").forEach((d,i)=>{d.classList.toggle("active",i===current);d.classList.toggle("done",i<current)});
  stepper.querySelector(".jb-step-count").textContent=`${current+1} / ${labels.length}`;
  actions.querySelector(".jb-back").style.visibility=current===0?"hidden":"visible";
  actions.querySelector(".jb-next").textContent=current===6?"💾 Save & Finish":"পরের ধাপ →";
  if(current===6){note.textContent="শেষ ধাপে Privacy দেখে Save & Finish চাপুন।";if(finalSubmit)finalSubmit.style.display="block"}else{note.textContent="একটি ধাপ পূরণ করে পরের ধাপে যান। আগের তথ্য স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে।";if(finalSubmit)finalSubmit.style.display="none"}
  localStorage.setItem("joronBiodataStep",String(current));
  window.scrollTo({top:0,behavior:"smooth"});
 }
 function validateCurrent(){
  for(const i of visibleCards()){const required=[...cards[i].querySelectorAll("[required]")];for(const e of required){if(!e.checkValidity()){e.reportValidity();e.focus();return false}}}
  return true;
 }
 actions.querySelector(".jb-back").onclick=()=>{if(current>0){current--;render()}};
 actions.querySelector(".jb-next").onclick=()=>{if(!validateCurrent())return;if(current<6){current++;render()}else if(finalSubmit){finalSubmit.click()}};
 render();
}

onAuthStateChanged(auth,async user=>{
 if(!user){location.replace("login.html?next=smart-biodata.html");return}
 try{const s=await getDoc(doc(db,"privateBiodata",user.uid));if(s.exists()){fill(s.data());applyOnboarding()}}catch(e){console.error("JORON biodata load",e)}
 setupGuidedSteps();
});

form?.addEventListener("submit",async e=>{
 e.preventDefault();
 if(!form.checkValidity()){form.reportValidity();return}
 const user=auth.currentUser;
 if(!user){location.replace("login.html?next=smart-biodata.html");return}
 const data=collect();
 ["country","profileFor","community"].forEach(id=>{const v=valueOf(id);if(v)data[id]=v});
 data.uid=user.uid;data.email=user.email||"";data.updatedAt=serverTimestamp();
 try{
  await setDoc(doc(db,"privateBiodata",user.uid),data,{merge:true});
  await setDoc(doc(db,"biodata",user.uid),{...project(data),uid:user.uid,updatedAt:serverTimestamp()},{merge:true});
  localStorage.removeItem("joronBiodataStep");
  if(notice){notice.textContent="❤️ আপনার Smart Biodata Firebase-এ নিরাপদভাবে সংরক্ষিত হয়েছে।";notice.style.display="block"}
  alert("Smart Biodata সফলভাবে সংরক্ষণ হয়েছে।");
 }catch(err){console.error("JORON Smart Biodata save failed",err);alert("তথ্য সংরক্ষণ করা যায়নি। Firebase/নেটওয়ার্ক সংযোগ পরীক্ষা করুন।")}
},true);