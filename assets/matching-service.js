import { db } from "./firebase-client.js";
import { collection, getDocs, limit, query, where } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const clean = (value) => String(value ?? "").trim().toLowerCase();
function number(value) { const n = Number(value); return Number.isFinite(n) && n > 0 ? n : null; }
function textMatch(a,b){const x=clean(a),y=clean(b);if(!x||!y)return 0;if(x===y)return 1;if(x.includes(y)||y.includes(x))return .65;return 0;}
function ageInRange(age,min,max){const a=number(age),lo=number(min),hi=number(max);if(!a||(!lo&&!hi))return null;if(lo&&hi)return a>=lo&&a<=hi;if(lo)return a>=lo;return a<=hi;}
function rangeFromValue(value){
 const s=String(value??"").trim();
 if(!s)return [null,null];
 const m=s.match(/(\d+)\s*(?:-|–|—|to| থেকে )\s*(\d+)/i);
 if(m)return [Number(m[1]),Number(m[2])];
 const n=Number(s);return Number.isFinite(n)&&n>0?[n,n]:[null,null];
}

export function calculateMatchScore(me,candidate){
  const weights=[["partnerAge",22],["reciprocalAge",12],["partnerGender",16],["religion",12],["community",8],["district",10],["education",10],["marital",5],["educationPreference",5]];
  let earned=0,available=0;
  for(const [key,weight] of weights){let value=0;
    if(key==="partnerAge"){
      let lo=number(me.partnerAgeMin),hi=number(me.partnerAgeMax); if(!lo&&!hi)[lo,hi]=rangeFromValue(me.prefAge);
      const ok=ageInRange(candidate.age,lo,hi);if(ok===null)continue;value=ok?1:0;
    } else if(key==="reciprocalAge"){
      const [lo,hi]=[number(candidate.partnerAgeMin),number(candidate.partnerAgeMax)];const ok=ageInRange(me.age,lo,hi);if(ok===null)continue;value=ok?1:0;
    } else if(key==="partnerGender"){
      if(!clean(me.partnerGender))continue;value=textMatch(me.partnerGender,candidate.gender);
    } else if(key==="religion"){
      if(!clean(me.partnerReligion||me.religionPreference||me.religion))continue;value=textMatch(me.partnerReligion||me.religionPreference||me.religion,candidate.religion);
    } else if(key==="community"){
      if(!clean(me.partnerCommunity))continue;value=textMatch(me.partnerCommunity,candidate.community);
    } else if(key==="district"){
      const pref=me.partnerDistrict||me.prefDistrict;if(!clean(pref))continue;value=textMatch(pref,candidate.district);
    } else if(key==="education")value=textMatch(me.education,candidate.education);
    else if(key==="marital")value=textMatch(me.marital,candidate.marital);
    else if(key==="educationPreference"){if(!clean(me.partnerEducation||me.educationPreference))continue;value=textMatch(me.partnerEducation||me.educationPreference,candidate.education)}
    available+=weight;earned+=weight*value;
  }
  return available?Math.round(earned/available*100):0;
}
function genderCompatible(me,candidate){const wanted=clean(me.partnerGender);if(wanted)return clean(candidate.gender)===wanted;return !clean(me.gender)||!clean(candidate.gender)||clean(me.gender)!==clean(candidate.gender)}
function preferenceCompatible(me,candidate){
 const wantedGender=clean(me.partnerGender);if(wantedGender&&clean(candidate.gender)&&clean(candidate.gender)!==wantedGender)return false;
 const wantedReligion=clean(me.partnerReligion||me.religionPreference);if(wantedReligion&&clean(candidate.religion)&&!textMatch(wantedReligion,candidate.religion))return false;
 const wantedCommunity=clean(me.partnerCommunity);if(wantedCommunity&&clean(candidate.community)&&!textMatch(wantedCommunity,candidate.community))return false;
 const wantedDistrict=clean(me.partnerDistrict||me.prefDistrict);if(wantedDistrict&&clean(candidate.district)&&!textMatch(wantedDistrict,candidate.district))return false;
 let lo=number(me.partnerAgeMin),hi=number(me.partnerAgeMax);if(!lo&&!hi)[lo,hi]=rangeFromValue(me.prefAge);const ageOK=ageInRange(candidate.age,lo,hi);if(ageOK===false)return false;
 return genderCompatible(me,candidate);
}

export async function findMatches(currentUid,myProfile,maxProfiles=100){
  if(!currentUid)throw new Error("Authentication required");
  const snapshot=await getDocs(query(collection(db,"publicProfiles"),where("visibility","==","public"),limit(maxProfiles)));
  return snapshot.docs.filter(item=>item.id!==currentUid).map(item=>{const profile=item.data()||{};return{
    id:item.id,score:calculateMatchScore(myProfile,profile),compatible:preferenceCompatible(myProfile,profile),
    age:profile.age??null,name:profile.name??"JORON Matrimony Member",district:profile.district??null,city:profile.city??null,
    education:profile.education??null,profession:profile.profession??null,marital:profile.marital??null,gender:profile.gender??null,
    religion:profile.religion??null,community:profile.community??null,about:profile.about??null
  }}).filter(x=>x.compatible).sort((a,b)=>b.score-a.score);
}
