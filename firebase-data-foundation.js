import { db, storage, auth } from './assets/firebase-client.js';
import { collection, doc, setDoc, getDoc, updateDoc, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js';

export async function saveProfile(data){
  if(!auth.currentUser) throw new Error('LOGIN_REQUIRED');
  const uid=auth.currentUser.uid;
  await setDoc(doc(db,'profiles',uid),{...data,uid,updatedAt:serverTimestamp()},{merge:true});
  return uid;
}
export async function getProfile(uid=auth.currentUser?.uid){
  if(!uid) throw new Error('LOGIN_REQUIRED');
  const snap=await getDoc(doc(db,'profiles',uid));
  return snap.exists()?snap.data():null;
}
export async function uploadProfilePhoto(file,slot='main'){
  if(!auth.currentUser) throw new Error('LOGIN_REQUIRED');
  const uid=auth.currentUser.uid;
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
  const storageRef=ref(storage,`profiles/${uid}/${slot}-${Date.now()}-${safe}`);
  await uploadBytes(storageRef,file,{contentType:file.type||'image/jpeg'});
  const url=await getDownloadURL(storageRef);
  await updateDoc(doc(db,'profiles',uid),{[`photos.${slot}`]:url,updatedAt:serverTimestamp()});
  return url;
}
export async function reportUser(targetUid,reason,details=''){
  if(!auth.currentUser) throw new Error('LOGIN_REQUIRED');
  return addDoc(collection(db,'reports'),{reporterUid:auth.currentUser.uid,targetUid,reason,details,status:'open',createdAt:serverTimestamp()});
}
export async function blockUser(targetUid){
  if(!auth.currentUser) throw new Error('LOGIN_REQUIRED');
  await setDoc(doc(db,'users',auth.currentUser.uid,'blocks',targetUid),{targetUid,createdAt:serverTimestamp()});
}
export async function sendMessage(chatId,text){
  if(!auth.currentUser) throw new Error('LOGIN_REQUIRED');
  return addDoc(collection(db,'chats',chatId,'messages'),{senderUid:auth.currentUser.uid,text:text.trim(),createdAt:serverTimestamp()});
}
export async function findProfiles(filters={}){
  const constraints=[where('isVisible','==',true),limit(30)];
  if(filters.gender) constraints.splice(1,0,where('gender','==',filters.gender));
  const snap=await getDocs(query(collection(db,'profiles'),...constraints));
  return snap.docs.map(d=>d.data());
}
