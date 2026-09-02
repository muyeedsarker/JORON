import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { auth, db } from "./firebase-client.js";

const form=document.getElementById("form");
const get=id=>document.getElementById(id)?.value?.trim()||"";
const hidden=(id,value)=>{if(!value)return;let e=document.getElementById(id);if(!e){e=document.createElement("input");e.type="hidden";e.id=id;e.name=id;form?.appendChild(e)}e.value=value};
const options=r=>({"ইসলাম":["সুন্নি","শিয়া","আহলে হাদিস","অন্যান্য"],"হিন্দু":["সনাতন হিন্দু","অন্যান্য"],"বৌদ্ধ":["থেরবাদ","অন্যান্য"],"খ্রিস্টান":["ক্যাথলিক","প্রোটেস্ট্যান্ট","অন্যান্য"]}[r]||["অন্যান্য"]);

function addPreferencePanel(){
 if(!form||document.getElementById("joronPartnerPreferencePanel"))return;
 const cards=[...form.querySelectorAll(":scope > .card")];const target=cards[cards.length-1];if(!target)return;
 const box=document.createElement("section");box.id="joronPartnerPreferencePanel";box.className="card";
 box.innerHTML=`<h2>💍 জীবনসঙ্গীর পছন্দ</h2><p class="hint">এই তথ্যগুলো JORON Matching সরাসরি ব্যবহার করবে।</p><div class="grid"><div class="field"><label>Partner Gender<select id="partnerGenderPref"><option value="">অটো নির্বাচন</option><option>পুরুষ</option><option>নারী</option></select></label></div><div class="field"><label>বয়স — সর্বনিম্ন<input id="partnerAgeMinPref" type="number" min="18" max="100" placeholder="২৫"></label></div><div class="field"><label>বয়স — সর্বোচ্চ<input id="partnerAgeMaxPref" type="number" min="18" max="100" placeholder="৩৫"></label></div><div class="field"><label>ধর্ম<select id="partnerReligionPref"><option value="">যেকোনো ধর্ম</option><option>ইসলাম</option><option>হিন্দু</option><option>বৌদ্ধ</option><option>খ্রিস্টান</option><option>অন্যান্য</option></select></label></div><div class="field"><label>Community<select id="partnerCommunityPref"><option value="">যেকোনো Community</option></select></label></div><div class="field"><label>জেলা<input id="partnerDistrictPref" placeholder="যেকোনো জেলা"></label></div><div class="field"><label>শিক্ষা<select id="partnerEducationPref"><option value="">যেকোনো শিক্ষা</option><option>SSC+</option><option>এইচএসসি</option><option>স্নাতক</option><option>স্নাতকোত্তর</option><option>দাওরায়ে হাদিস</option><option>পিএইচডি</option><option>অন্যান্য</option></select></label></div></div>`;
 target.appendChild(box);
 const o=(()=>{try{return JSON.parse(localStorage.getItem("joronOnboarding")||"{}")||{}}catch{return {}}})();
 const g=get("gender");
 const set=(id,v)=>{if(v!==undefined&&v!==null&&String(v)!==""){const e=document.getElementById(id);if(e)e.value=String(v)}};
 set("partnerGenderPref",o.partnerGender||((g)==="পুরুষ"?"নারী":g==="নারী"?"পুরুষ":""));set("partnerAgeMinPref",o.partnerAgeMin);set("partnerAgeMaxPref",o.partnerAgeMax);set("partnerReligionPref",o.partnerReligion);set("partnerDistrictPref",o.partnerDistrict||o.prefDistrict);set("partnerEducationPref",o.partnerEducation||o.educationPreference);
 const pr=document.getElementById("partnerReligionPref"),pc=document.getElementById("partnerCommunityPref");
 function syncCommunity(){const old=pc.value;pc.innerHTML='<option value="">যেকোনো Community</option>'+options(pr.value).map(x=>`<option>${x}</option>`).join("");if([...pc.options].some(x=>x.value===old))pc.value=old;if(o.partnerCommunity&&!pc.value)pc.value=o.partnerCommunity;hidden("partnerCommunity",pc.value)}
 pr.addEventListener("change",syncCommunity);syncCommunity();
 const gEl=document.getElementById("gender"),pg=document.getElementById("partnerGenderPref");gEl?.addEventListener("change",()=>{const p=gEl.value==="পুরুষ"?"নারী":gEl.value==="নারী"?"পুরুষ":"";if(p&&!pg.value)pg.value=p;hidden("partnerGender",pg.value)});
 ["partnerGenderPref","partnerAgeMinPref","partnerAgeMaxPref","partnerReligionPref","partnerCommunityPref","partnerDistrictPref","partnerEducationPref"].forEach(id=>document.getElementById(id)?.addEventListener("change",()=>syncHidden()));
 function syncHidden(){hidden("partnerGender",get("partnerGenderPref"));hidden("partnerAgeMin",get("partnerAgeMinPref"));hidden("partnerAgeMax",get("partnerAgeMaxPref"));hidden("partnerReligion",get("partnerReligionPref"));hidden("partnerCommunity",get("partnerCommunityPref"));hidden("partnerDistrict",get("partnerDistrictPref"));hidden("partnerEducation",get("partnerEducationPref"))}
 syncHidden();
}

addPreferencePanel();

form?.addEventListener("submit",async()=>{
 const user=auth.currentUser;if(!user)return;
 const data={partnerGender:get("partnerGender"),partnerAgeMin:get("partnerAgeMin"),partnerAgeMax:get("partnerAgeMax"),partnerReligion:get("partnerReligion"),partnerCommunity:get("partnerCommunity"),partnerDistrict:get("partnerDistrict"),partnerEducation:get("partnerEducation"),country:get("country"),profileFor:get("profileFor"),motherTongue:get("motherTongue")};
 Object.keys(data).forEach(k=>{if(!data[k])delete data[k]});
 if(!Object.keys(data).length)return;
 try{await setDoc(doc(db,"privateBiodata",user.uid),{...data,updatedAt:serverTimestamp()},{merge:true});await setDoc(doc(db,"biodata",user.uid),{...data,updatedAt:serverTimestamp()},{merge:true})}catch(e){console.error("JORON preference bridge save",e)}
});
