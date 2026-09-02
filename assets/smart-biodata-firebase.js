import "./address-fix-v21.js";
import "./smart-biodata-save-guard.js";
import "./smart-biodata-personal.js";
import "./smart-biodata-education.js";
import "./smart-biodata-profession.js";
import "./smart-biodata-family.js";
import "./smart-biodata-lifestyle.js";
import "./smart-biodata-extra-fields.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { auth, db, onAuthStateChanged, persistenceReady } from "./firebase-client.js";

const form = document.getElementById("form");
const notice = document.getElementById("notice");
const IDS = ["name","nickname","dob","age","gender","height","blood","complexion","marital","nationality","language","religion","practice","division","district","upazila","postOffice","postalCode","area","ward","birthPlace","pdistrict","pdivision","pupazila","ppostOffice","ppostalCode","parea","addressPrivacy","eduSystem","education","eduHighest","eduDegree","eduInstitution","eduSubject","eduYear","eduResult","trainingName","trainingInstitution","trainingSubject","trainingDuration","trainingCertificate","profession","professionType","workplace","designation","workAddress","monthlyIncome","incomePrivacy","experience","currentlyEmployed","workDetails","fatherName","fatherProfession","motherName","motherProfession","siblingsBrothers","siblingsSisters","familyType","childCount","familyValues","familyDescription","smoking","personality","hobbies","about","guardianPermission","guardianPhone","prefAge","prefDistrict","top3","photoUrl","visibility"];
const PUBLIC_IDS = ["name","nickname","age","gender","height","marital","division","district","upazila","postOffice","postalCode","religion","eduSystem","education","eduHighest","eduDegree","eduInstitution","eduSubject","eduYear","eduResult","profession","professionType","workplace","designation","experience","currentlyEmployed","familyType","childCount","personality","about","prefAge","prefDistrict","top3","photoUrl","visibility"];
const collect = () => Object.fromEntries(IDS.map(id => [id, document.getElementById(id)?.value ?? ""]));
const localData = () => { try { return JSON.parse(localStorage.getItem("joronSmartBiodata") || "{}"); } catch { return {}; } };
const show = (msg, ok=true) => { if (!notice) return; notice.textContent=msg; notice.style.display="block"; notice.style.background=ok?"#eaf9f3":"#fff1f1"; notice.style.color=ok?"#087b59":"#a80000"; setTimeout(()=>notice.style.display="none",4500); };
const saveLocal = data => localStorage.setItem("joronSmartBiodata", JSON.stringify({...data,savedAt:new Date().toISOString()}));
const setSelectValue = (id,value) => { const el=document.getElementById(id); if(!el || value===undefined || value===null) return; const wanted=String(value); const option=[...el.options].find(o=>String(o.value)===wanted); if(option) el.value=wanted; };
const fill = data => {
 IDS.forEach(id=>{const el=document.getElementById(id);if(el&&data[id]!==undefined&&data[id]!==null&&!((id==='division'||id==='district'||id==='upazila'||id==='postOffice'||id==='pdivision'||id==='pdistrict'||id==='pupazila'||id==='ppostOffice')&&el.options.length<=1))el.value=data[id];});
 document.getElementById("dob")?.dispatchEvent(new Event("change"));
};
const restoreAddress = data => {
 const run=()=>{
  const pairs=[['division','district','upazila','postOffice','postalCode'],['pdivision','pdistrict','pupazila','ppostOffice','ppostalCode']];
  pairs.forEach(([dv,di,th,po,pc])=>{
   const d=document.getElementById(dv),dist=document.getElementById(di),up=document.getElementById(th),post=document.getElementById(po),code=document.getElementById(pc);
   if(!d||!dist||!up||!post)return;
   if(data[dv]){d.value=String(data[dv]);d.dispatchEvent(new Event('change'));}
   setTimeout(()=>{if(data[di]){dist.value=String(data[di]);dist.dispatchEvent(new Event('change'));}setTimeout(()=>{if(data[th]){up.value=String(data[th]);up.dispatchEvent(new Event('change'));}setTimeout(()=>{if(data[po]){post.value=String(data[po]);post.dispatchEvent(new Event('change'));}if(code&&data[pc])code.value=String(data[pc]);},80);},80);},80);
  });
 };
 if(window.JORON_ADDRESS_READY)run();else window.addEventListener('joron-address-ready',run,{once:true});
};
const publicProjection = data => Object.fromEntries(PUBLIC_IDS.filter(id=>data[id]!==undefined).map(id=>[id,data[id]]));
const profileProjection = data => ({...publicProjection(data),educationSystem:data.eduSystem||data.education||"",institution:data.eduInstitution||"",subject:data.eduSubject||"",passingYear:data.eduYear||"",result:data.eduResult||"",partner:data.top3||"",profileCompleted:true});
async function restore(user){const local=localData();if(Object.keys(local).length){fill(local);restoreAddress(local);}try{const snap=await getDoc(doc(db,"privateBiodata",user.uid));if(snap.exists()){const data=snap.data();fill(data);restoreAddress(data);saveLocal(data);}}catch(e){console.warn("Firebase restore failed; local draft retained",e);}}
async function save(){const data=collect();saveLocal(data);const user=auth.currentUser;if(!user){show("💾 Draft সংরক্ষিত হয়েছে। Smart Biodata-এর জন্য আগে Login করুন।");return;}try{await setDoc(doc(db,"privateBiodata",user.uid),{...data,uid:user.uid,email:user.email||"",profileCompleted:true,updatedAt:serverTimestamp()},{merge:true});await setDoc(doc(db,"biodata",user.uid),{...publicProjection(data),uid:user.uid,updatedAt:serverTimestamp()},{merge:true});await setDoc(doc(db,"publicProfiles",user.uid),{...profileProjection(data),uid:user.uid,updatedAt:serverTimestamp()},{merge:true});show("🎉 আলহামদুলিল্লাহ! আপনার Biodata সফলভাবে সংরক্ষণ হয়েছে। Profile, Search ও Matching-এ এই তথ্য ব্যবহার করা হবে।");setTimeout(()=>{location.href=`profile.html?id=${encodeURIComponent(user.uid)}`;},2500);}catch(e){console.error("JORON Firebase save failed",e);show("💾 তথ্য ফোনে সংরক্ষিত হয়েছে, কিন্তু Firebase-এ Save হয়নি। আবার চেষ্টা করুন।",false);}}
await persistenceReady;
onAuthStateChanged(auth,user=>{if(user)restore(user);});
if(form&&!window.__JORON_SAVE_BOUND){window.__JORON_SAVE_BOUND=true;form.addEventListener("submit",async e=>{e.preventDefault();e.stopImmediatePropagation();if(!form.checkValidity()){form.reportValidity();return;}await save();},true);}
const draft=document.getElementById("draftBtn");if(draft&&!window.__JORON_DRAFT_BOUND){window.__JORON_DRAFT_BOUND=true;draft.addEventListener("click",()=>{saveLocal(collect());show("💾 Draft সংরক্ষিত হয়েছে।");},true);}
