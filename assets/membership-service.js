import { db } from './firebase-client.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

export async function getMembership(uid){
  if(!uid) return null;
  const snap=await getDoc(doc(db,'users',uid));
  return snap.exists()?snap.data():null;
}

export async function startMembershipRequest(uid, plan='premium'){
  if(!uid) throw new Error('Login required');
  await setDoc(doc(db,'users',uid),{membershipPlan:plan,membershipStatus:'pending',paymentStatus:'pending',membershipRequestedAt:serverTimestamp()},{merge:true});
  await setDoc(doc(db,'payments',uid),{uid,plan,membershipStatus:'pending',paymentStatus:'pending',createdAt:serverTimestamp()},{merge:true});
}
