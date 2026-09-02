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

// Guided onboarding → Smart Biodata bridge.
// Existing Firebase biodata remains authoritative; onboarding only fills blank fields.
function applyOnboarding(){
 try{
  const raw=localStorage.getItem("joronOnboarding");
  if(!raw)return;
  const o=JSON.parse(raw)||{};
  const map={gender:o.gender,marital:o.marital,education:o.education,religion:o.religion,division:o.division,district:o.district,language:o.language};
  const countryNames={BD:"বাংলাদেশি",IN:"ভারতীয়",PK:"পাকিস্তানি",SA:"সৌদি আরবের",AE:"সংযুক্ত আরব আমিরাতের",MY:"মালয়েশীয়",SG:"সিঙ্গাপুরের",GB:"ব্রিটিশ",US:"আমেরিকান",CA:"কানাডিয়ান",AU:"অস্ট্রেলিয়ান",IT:"ইতালীয়",DE:"জার্মান",FR:"ফরাসি",JP:"জাপানি",KR:"দক্ষিণ কোরীয়",QA:"কাতারি",KW:"কুয়েতি",OM:"ওমানি",OTHER:""};
  if(o.country&&countryNames[o.country])map.nationality=countryNames[o.country];
  Object.entries(map).forEach(([id,val])=>{if(val!==undefined&&val!==null&&String(val)!===""){const e=document.getElementById(id);if(e&&!e.value)e.value=String(val)}});
  if(o.community&&!document.getElementById("community")){
   const hidden=document.createElement("input");hidden.type="hidden";hidden.id="community";hidden.name="community";hidden.value=o.community;form?.appendChild(hidden);
  }
  const hiddenKeys={country:o.country,profileFor:o.profileFor,community:o.community};
  Object.entries(hiddenKeys).forEach(([id,val])=>{if(!val)return;let e=document.getElementById(id);if(!e){e=document.createElement("input");e.type="hidden";e.id=id;e.name=id;form?.appendChild(e)}e.value=String(val)});
 }catch(e){console.warn("JORON onboarding bridge",e)}
}
applyOnboarding();

// Load the fixed address engine after the page DOM exists.
await import("./biodata-smart-fields.js");
await persistenceReady;

onAuthStateChanged(auth,async user=>{
 if(!user){location.replace("login.html?next=smart-biodata.html");return}
 try{const s=await getDoc(doc(db,"privateBiodata",user.uid));if(s.exists())fill(s.data())}catch(e){console.error("JORON biodata load",e)}
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
  if(notice){notice.textContent="❤️ আপনার Smart Biodata Firebase-এ নিরাপদভাবে সংরক্ষিত হয়েছে।";notice.style.display="block"}
  alert("Smart Biodata সফলভাবে সংরক্ষণ হয়েছে।");
 }catch(err){console.error("JORON Smart Biodata save failed",err);alert("তথ্য সংরক্ষণ করা যায়নি। Firebase/নেটওয়ার্ক সংযোগ পরীক্ষা করুন।")}
},true);