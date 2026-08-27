import { auth, db } from './firebase-client.js';
import { collection, doc, getDocs, query, where, setDoc, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

function uid(){const user=auth.currentUser;if(!user)throw new Error('AUTH_REQUIRED');return user.uid;}

export async function followProfile(profileId){const fromUserId=uid();if(!profileId||profileId===fromUserId)throw new Error('INVALID_PROFILE');const followId=`${fromUserId}_${profileId}`;await setDoc(doc(db,'follows',followId),{fromUserId,profileId,createdAt:serverTimestamp()});return followId;}
export async function unfollowProfile(profileId){const fromUserId=uid();if(!profileId||profileId===fromUserId)throw new Error('INVALID_PROFILE');await deleteDoc(doc(db,'follows',`${fromUserId}_${profileId}`));}
export async function getFollowing(){const userId=uid();const snap=await getDocs(query(collection(db,'follows'),where('fromUserId','==',userId)));return snap.docs.map(d=>({id:d.id,...d.data()}));}
export async function isFollowing(profileId){const list=await getFollowing();return list.some(x=>x.profileId===profileId);}
