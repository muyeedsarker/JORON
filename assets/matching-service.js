import { db } from "./firebase-client.js";
import { collection, getDocs, limit, query, where } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const clean = (value) => String(value ?? "").trim().toLowerCase();
function number(value) { const n = Number(value); return Number.isFinite(n) && n > 0 ? n : null; }
function textMatch(a,b){const x=clean(a),y=clean(b);if(!x||!y)return 0;if(x===y)return 1;if(x.includes(y)||y.includes(x))return .65;return 0;}
function ageInRange(age,min,max){const a=number(age),lo=number(min),hi=number(max);if(!a||(!lo&&!hi))return null;if(lo&&hi)return a>=lo&&a<=hi;if(lo)return a>=lo;return a<=hi;}

export function calculateMatchScore(me,candidate){
  const weights=[["agePreference",25],["reciprocalAgePreference",15],["district",10],["education",12],["profession",10],["marital",8],["educationPreference",10],["professionPreference",10]];
  let earned=0,available=0;
  for(const [key,weight] of weights){let value=0;
    if(key==="agePreference"){const ok=ageInRange(candidate.age,me.partnerAgeMin,me.partnerAgeMax);if(ok===null)continue;value=ok?1:0}
    else if(key==="reciprocalAgePreference"){const ok=ageInRange(me.age,candidate.partnerAgeMin,candidate.partnerAgeMax);if(ok===null)continue;value=ok?1:0}
    else if(key==="district")value=textMatch(me.district,candidate.district);
    else if(key==="education")value=textMatch(me.education,candidate.education);
    else if(key==="profession")value=textMatch(me.profession,candidate.profession);
    else if(key==="marital")value=textMatch(me.marital,candidate.marital);
    else if(key==="educationPreference"){if(!clean(me.partnerEducation))continue;value=textMatch(me.partnerEducation,candidate.education)}
    else if(key==="professionPreference"){if(!clean(me.partnerProfession))continue;value=textMatch(me.partnerProfession,candidate.profession)}
    available+=weight;earned+=weight*value;
  }
  return available?Math.round(earned/available*100):0;
}
function genderCompatible(me,candidate){if(!clean(me.gender)||!clean(candidate.gender))return true;return clean(me.gender)!==clean(candidate.gender)}

export async function findMatches(currentUid,myProfile,maxProfiles=100){
  if(!currentUid)throw new Error("Authentication required");
  const snapshot=await getDocs(query(collection(db,"publicProfiles"),where("visibility","==","public"),limit(maxProfiles)));
  return snapshot.docs.filter(item=>item.id!==currentUid).map(item=>{const profile=item.data()||{};return{
    id:item.id,score:calculateMatchScore(myProfile,profile),compatible:genderCompatible(myProfile,profile),
    age:profile.age??null,name:profile.name??"J❤️R❤️N Member",district:profile.district??null,city:profile.city??null,
    education:profile.education??null,profession:profile.profession??null,marital:profile.marital??null,gender:profile.gender??null,about:profile.about??null
  }}).filter(x=>x.compatible).sort((a,b)=>b.score-a.score);
}
