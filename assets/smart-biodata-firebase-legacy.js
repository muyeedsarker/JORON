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
 const data=collect();data.uid=user.uid;data.email=user.email||"";data.updatedAt=serverTimestamp();
 try{
  await setDoc(doc(db,"privateBiodata",user.uid),data,{merge:true});
  await setDoc(doc(db,"biodata",user.uid),{...project(data),uid:user.uid,updatedAt:serverTimestamp()},{merge:true});
  if(notice){notice.textContent="❤️ আপনার Smart Biodata Firebase-এ নিরাপদভাবে সংরক্ষিত হয়েছে।";notice.style.display="block"}
  alert("Smart Biodata সফলভাবে সংরক্ষিত হয়েছে।");
 }catch(err){console.error("JORON Smart Biodata save failed",err);alert("তথ্য সংরক্ষণ করা যায়নি। Firebase/নেটওয়ার্ক সংযোগ পরীক্ষা করুন।")}
},true);