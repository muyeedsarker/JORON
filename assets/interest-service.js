import { db, auth } from "./firebase-client.js";
import { collection, doc, getDocs, query, where, setDoc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

function uid(){const id=auth.currentUser?.uid;if(!id)throw new Error("Authentication required");return id;}

export async function likeProfile(profileId){const fromUserId=uid();if(!profileId||profileId===fromUserId)throw new Error("Invalid profile");await setDoc(doc(db,"interests",`${fromUserId}_${profileId}`),{fromUserId,profileId,status:"pending",createdAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});}
export async function removeLike(profileId){const fromUserId=uid();if(!profileId||profileId===fromUserId)return;await deleteDoc(doc(db,"interests",`${fromUserId}_${profileId}`));}
export async function getOutgoingInterests(){const fromUserId=uid();const snap=await getDocs(query(collection(db,"interests"),where("fromUserId","==",fromUserId)));return snap.docs.map(d=>({id:d.id,...d.data()}));}
export async function getIncomingInterests(){const profileId=uid();const snap=await getDocs(query(collection(db,"interests"),where("profileId","==",profileId)));return snap.docs.map(d=>({id:d.id,...d.data()}));}
export async function respondToInterest(interestId,status){const profileId=uid();if(!["accepted","rejected","pending"].includes(status))throw new Error("Invalid interest status");await updateDoc(doc(db,"interests",interestId),{status,updatedAt:serverTimestamp()});}
export async function getMutualInterestIds(){const me=uid();const[outgoing,incoming]=await Promise.all([getOutgoingInterests(),getIncomingInterests()]);const accepted=new Set(outgoing.filter(x=>x.status==="accepted").map(x=>x.profileId));return incoming.filter(x=>x.status==="accepted"&&accepted.has(x.fromUserId)).map(x=>x.fromUserId);}
