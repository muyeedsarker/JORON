import { auth, db } from './firebase-client.js';
import { collection, doc, getDocs, query, where, addDoc, setDoc, serverTimestamp, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

function currentUid(){
  const user = auth.currentUser;
  if(!user) throw new Error('AUTH_REQUIRED');
  return user.uid;
}

function chatIdFor(a,b){ return [a,b].sort().join('_'); }

export async function getMutualChatPartners(){
  const uid = currentUid();
  const sent = await getDocs(query(collection(db,'interests'), where('fromUserId','==',uid), where('status','==','accepted')));
  const received = await getDocs(query(collection(db,'interests'), where('profileId','==',uid), where('status','==','accepted')));
  const receivedFrom = new Set(received.docs.map(d=>d.data().fromUserId));
  return sent.docs.map(d=>d.data().profileId).filter(id=>receivedFrom.has(id));
}

export async function ensureChat(otherUid){
  const uid = currentUid();
  if(!otherUid || otherUid === uid) throw new Error('INVALID_PARTICIPANT');
  const partners = await getMutualChatPartners();
  if(!partners.includes(otherUid)) throw new Error('MUTUAL_INTEREST_REQUIRED');
  const id = chatIdFor(uid,otherUid);
  await setDoc(doc(db,'chats',id), { participants:[uid,otherUid], updatedAt:serverTimestamp() }, {merge:true});
  return id;
}

export async function sendMessage(chatId,text){
  const uid = currentUid();
  const clean = String(text||'').trim();
  if(!clean) return;
  await addDoc(collection(db,'chats',chatId,'messages'), { senderId:uid, text:clean, createdAt:serverTimestamp() });
  await setDoc(doc(db,'chats',chatId), {updatedAt:serverTimestamp()}, {merge:true});
}

export function subscribeMessages(chatId,callback){
  const q = query(collection(db,'chats',chatId,'messages'), orderBy('createdAt','asc'));
  return onSnapshot(q,snap=>callback(snap.docs.map(d=>({id:d.id,...d.data()}))));
}
