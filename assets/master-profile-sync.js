// JORON Master Profile v2 — one-form data sync foundation
// Keeps one canonical profile while projecting data to Profile/Biodata/Preferences.
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { auth, db } from "./firebase-client.js";

const LOCAL_KEY = "joron_master_profile_v2";
const PROFILE_FIELDS = ["name","nickname","dob","age","gender","height","blood","marital","nationality","language","religion","practice","division","district","upazila","postOffice","postalCode","area","education","eduHighest","eduDegree","eduInstitution","eduSubject","eduYear","eduResult","profession","professionType","workplace","designation","experience","currentlyEmployed","familyType","childCount","personality","about","prefAge","prefDistrict","top3","photoUrl","visibility"];

export function collectMasterProfile(form=document.querySelector("form")) {
  if (!form) return {};
  const data={};
  form.querySelectorAll("input,select,textarea").forEach(el=>{
    const key=el.name||el.id;
    if(!key) return;
    if(el.type==="checkbox"||el.type==="radio") data[key]=el.checked;
    else data[key]=el.value;
  });
  data.savedAt=new Date().toISOString();
  return data;
}

export function saveMasterDraft(data) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch(e) { console.warn("JORON draft save failed",e); }
}

export function restoreMasterDraft(form=document.querySelector("form")) {
  try {
    const data=JSON.parse(localStorage.getItem(LOCAL_KEY)||"null");
    if(!data||!form) return false;
    form.querySelectorAll("input,select,textarea").forEach(el=>{
      const key=el.name||el.id;
      if(!key||!(key in data)) return;
      if(el.type==="checkbox"||el.type==="radio") el.checked=!!data[key];
      else el.value=data[key] ?? "";
    });
    return true;
  } catch(e) { return false; }
}

export async function syncMasterProfile(data, user=auth.currentUser) {
  saveMasterDraft(data);
  if(!user) return {localOnly:true};
  const publicData=Object.fromEntries(PROFILE_FIELDS.filter(k=>data[k]!==undefined).map(k=>[k,data[k]]));
  publicData.uid=user.uid;
  publicData.email=user.email||"";
  publicData.profileCompleted=true;
  publicData.updatedAt=serverTimestamp();
  await setDoc(doc(db,"privateBiodata",user.uid),{...data,uid:user.uid,email:user.email||"",updatedAt:serverTimestamp()},{merge:true});
  await setDoc(doc(db,"biodata",user.uid),publicData,{merge:true});
  return {localOnly:false,uid:user.uid};
}

export function bindMasterAutosave(form=document.querySelector("form")) {
  if(!form||form.dataset.masterAutosaveBound) return;
  form.dataset.masterAutosaveBound="1";
  let timer;
  const save=()=>{ clearTimeout(timer); timer=setTimeout(()=>saveMasterDraft(collectMasterProfile(form)),500); };
  form.addEventListener("input",save);
  form.addEventListener("change",()=>saveMasterDraft(collectMasterProfile(form)));
  restoreMasterDraft(form);
}
