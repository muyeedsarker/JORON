import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { auth, db } from "./firebase-client.js";

const form=document.getElementById("form");
const get=id=>document.getElementById(id)?.value?.trim()||"";
const hidden=(id,value)=>{if(value===undefined||value===null)return;let e=document.getElementById(id);if(!e){e=document.createElement("input");e.type="hidden";e.id=id;e.name=id;form?.appendChild(e)}e.value=String(value)};
const readOnboarding=()=>{try{return JSON.parse(localStorage.getItem("joronOnboarding")||"{}")||{}}catch{return {}}};
const writeOnboarding=(patch)=>{try{const o=readOnboarding();Object.assign(o,patch);localStorage.setItem("joronOnboarding",JSON.stringify(o))}catch{}};
const options=r=>({"ইসলাম":["সুন্নি","শিয়া","আহলে হাদিস","অন্যান্য"],"হিন্দু":["সনাতন হিন্দু","অন্যান্য"],"বৌদ্ধ":["থেরবাদ","অন্যান্য"],"খ্রিস্টান":["ক্যাথলিক","প্রোটেস্ট্যান্ট","অন্যান্য"]}[r]||["অন্যান্য"]);
const PREFS=["partnerGender","partnerAgeMin","partnerAgeMax","partnerReligion","partnerCommunity","partnerDistrict","partnerEducation"];

function addPreferencePanel(){
 if(!form||document.getElementById("joronPartnerPreferencePanel"))return;
 const cards=[...form.querySelectorAll(":scope > .card")];const target=cards[cards.length-1];if(!target)return;
 const box=document.createElement("section");box.id="joronPartnerPreferencePanel";box.className="card";
 box.innerHTML=`<h2>💍 জীবনসঙ্গীর পছন্দ</h2><p class="hint">Onboarding-এর পছন্দ এখানে অটো-সিঙ্ক হবে। এখানে পরিবর্তন করলে Onboarding-এর তথ্যও আপডেট হবে।</p><div class="grid"><div class="field"><label>Partner Gender<select id="partnerGenderPref"><option value="">অটো নির্বাচন</option><option value="পুরুষ">পুরুষ</option><option value="নারী">নারী</select></label></div><div class="field"><label>বয়স — সর্বনিম্ন<input id="partnerAgeMinPref" type="number" min="18" max="100" placeholder="২৫"></label></div><div class="field"><label>বয়স — সর্বোচ্চ<input id="partnerAgeMaxPref" type="number" min="18" max="100" placeholder="৩৫"></label></div><div class="field"><label>ধর্ম<select id="partnerReligionPref"><option value="">যেকোনো ধর্ম</option><option>ইসলাম</option><option>হিন্দু</option><option>বৌদ্ধ</option><option>খ্রিস্টান</option><option>অন্যান্য</option></select></label></div><div class="field"><label>Community<select id="partnerCommunityPref"><option value="">যেকোনো Community</option></select></label></div><div class="field"><label>জেলা<input id="partnerDistrictPref" placeholder="যেকোনো জেলা"></label></div><div class="field"><label>শিক্ষা<select id="partnerEducationPref"><option value="">যেকোনো শিক্ষা</option><option>SSC+</option><option>এইচএসসি</option><option>স্নাতক</option><option>স্নাতকোত্তর</option><option>দাওরায়ে হাদিস</option><option>পিএইচডি</option><option>অন্যান্য</option></select></label></div></div>`;
 target.appendChild(box);
 const o=readOnboarding();
 const g=get("gender");
 const set=(id,v)=>{if(v!==undefined&&v!==null&&String(v)!==""){const e=document.getElementById(id);if(e)e.value=String(v)}};
 set("partnerGenderPref",o.partnerGender||((g)==="পুরুষ"?"নারী":g==="নারী"?"পুরুষ":""));
 set("partnerAgeMinPref",o.partnerAgeMin);set("partnerAgeMaxPref",o.partnerAgeMax);
 set("partnerReligionPref",o.partnerReligion);set("partnerDistrictPref",o.partnerDistrict||o.prefDistrict);
 set("partnerEducationPref",o.partnerEducation||o.educationPreference||o.education);
 const pr=document.getElementById("partnerReligionPref"),pc=document.getElementById("partnerCommunityPref");
 function syncCommunity(){const wanted=readOnboarding().partnerCommunity||"";const old=pc.value;pc.innerHTML='<option value="">যেকোনো Community</option>'+options(pr.value).map(x=>`<option value="${x}">${x}</option>`).join("");if([...pc.options].some(x=>x.value===old))pc.value=old;if(wanted&&!pc.value&&[...pc.options].some(x=>x.value===wanted))pc.value=wanted;hidden("partnerCommunity",pc.value)}
 pr.addEventListener("change",()=>{syncCommunity();syncHidden()});syncCommunity();
 const gEl=document.getElementById("gender"),pg=document.getElementById("partnerGenderPref");
 gEl?.addEventListener("change",()=>{pg.value=gEl.value==="পুরুষ"?"নারী":gEl.value==="নারী"?"পুরুষ":"";syncHidden()});
 ["partnerGenderPref","partnerAgeMinPref","partnerAgeMaxPref","partnerReligionPref","partnerCommunityPref","partnerDistrictPref","partnerEducationPref"].forEach(id=>document.getElementById(id)?.addEventListener("input",syncHidden));
 ["partnerGenderPref","partnerAgeMinPref","partnerAgeMaxPref","partnerReligionPref","partnerCommunityPref","partnerDistrictPref","partnerEducationPref"].forEach(id=>document.getElementById(id)?.addEventListener("change",syncHidden));
 function syncHidden(){
  const patch={partnerGender:get("partnerGenderPref"),partnerAgeMin:get("partnerAgeMinPref"),partnerAgeMax:get("partnerAgeMaxPref"),partnerReligion:get("partnerReligionPref"),partnerCommunity:get("partnerCommunityPref"),partnerDistrict:get("partnerDistrictPref"),partnerEducation:get("partnerEducationPref")};
  Object.entries(patch).forEach(([k,v])=>hidden(k,v));
  writeOnboarding(patch);
 }
 syncHidden();
}

async function loadSavedPreferences(){
 const user=auth.currentUser;if(!user||!form)return;
 try{
  const snap=await getDoc(doc(db,"privateBiodata",user.uid));
  if(!snap.exists())return;
  const data=snap.data()||{};const patch={};
  PREFS.forEach(k=>{if(data[k]!==undefined&&data[k]!==null&&String(data[k])!=="")patch[k]=data[k]});
  if(!Object.keys(patch).length)return;
  writeOnboarding(patch);
  Object.entries(patch).forEach(([k,v])=>hidden(k,v));
  const map={partnerGender:"partnerGenderPref",partnerAgeMin:"partnerAgeMinPref",partnerAgeMax:"partnerAgeMaxPref",partnerReligion:"partnerReligionPref",partnerCommunity:"partnerCommunityPref",partnerDistrict:"partnerDistrictPref",partnerEducation:"partnerEducationPref"};
  Object.entries(map).forEach(([k,id])=>{const e=document.getElementById(id);if(e&&patch[k]!==undefined)e.value=String(patch[k])});
  const pr=document.getElementById("partnerReligionPref"),pc=document.getElementById("partnerCommunityPref");
  if(pr&&pc){pc.innerHTML='<option value="">যেকোনো Community</option>'+options(pr.value).map(x=>`<option value="${x}">${x}</option>`).join("");if(patch.partnerCommunity)pc.value=String(patch.partnerCommunity);hidden("partnerCommunity",pc.value)}
 }catch(e){console.error("JORON preference bridge load",e)}
}

function savePublicMatchProjection(user){
 const data={
  name:get("name"),nickname:get("nickname"),age:get("age"),gender:get("gender"),height:get("height"),marital:get("marital"),
  division:get("division"),district:get("district"),upazila:get("upazila"),education:get("education"),profession:get("profession"),
  photoUrl:get("photoUrl"),visibility:get("visibility")||"public",religion:get("religion"),community:get("community"),
  partnerGender:get("partnerGender"),partnerAgeMin:get("partnerAgeMin"),partnerAgeMax:get("partnerAgeMax"),
  partnerReligion:get("partnerReligion"),partnerCommunity:get("partnerCommunity"),partnerDistrict:get("partnerDistrict"),partnerEducation:get("partnerEducation")
 };
 Object.keys(data).forEach(k=>{if(data[k]==="")delete data[k]});
 return setDoc(doc(db,"publicProfiles",user.uid),{...data,updatedAt:serverTimestamp()},{merge:true});
}

addPreferencePanel();
if(auth.currentUser)loadSavedPreferences();
auth.onAuthStateChanged?.(user=>{if(user)loadSavedPreferences()});

form?.addEventListener("submit",async()=>{
 const user=auth.currentUser;if(!user)return;
 const data={partnerGender:get("partnerGender"),partnerAgeMin:get("partnerAgeMin"),partnerAgeMax:get("partnerAgeMax"),partnerReligion:get("partnerReligion"),partnerCommunity:get("partnerCommunity"),partnerDistrict:get("partnerDistrict"),partnerEducation:get("partnerEducation"),country:get("country"),profileFor:get("profileFor"),motherTongue:get("motherTongue")};
 Object.keys(data).forEach(k=>{if(!data[k])delete data[k]});
 if(!Object.keys(data).length)return;
 try{
  await setDoc(doc(db,"privateBiodata",user.uid),{...data,updatedAt:serverTimestamp()},{merge:true});
  await setDoc(doc(db,"biodata",user.uid),{...data,updatedAt:serverTimestamp()},{merge:true});
  await savePublicMatchProjection(user);
 }catch(e){console.error("JORON preference bridge save",e)}
});
