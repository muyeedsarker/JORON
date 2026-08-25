import { db } from './firebase-client.js';
import { collection, addDoc, deleteDoc, doc, getDoc, query, where, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

export async function blockUser(uid, targetUid) {
  if (!uid || !targetUid || uid === targetUid) throw new Error('Invalid user');
  await addDoc(collection(db, 'blocks'), { blockerId: uid, blockedId: targetUid, createdAt: serverTimestamp() });
}

export async function unblockUser(uid, targetUid) {
  const snap = await getDocs(query(collection(db, 'blocks'), where('blockerId','==',uid), where('blockedId','==',targetUid)));
  await Promise.all(snap.docs.map(x => deleteDoc(x.ref)));
}

export async function isBlocked(uid, targetUid) {
  const snap = await getDocs(query(collection(db, 'blocks'), where('blockerId','==',uid), where('blockedId','==',targetUid)));
  return !snap.empty;
}

export async function reportUser(uid, targetUid, reason, details='') {
  if (!uid || !targetUid || uid === targetUid) throw new Error('Invalid report');
  if (!String(reason || '').trim()) throw new Error('Report reason required');
  await addDoc(collection(db, 'reports'), { reporterId: uid, reportedId: targetUid, reason: String(reason).trim(), details: String(details || '').trim().slice(0,1000), status: 'pending', createdAt: serverTimestamp() });
}

export async function getMyVerification(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, 'verificationRequests', uid));
  return snap.exists() ? snap.data() : null;
}

export async function submitVerification(uid, type='profile') {
  if (!uid) throw new Error('Login required');
  await import('https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js').then(async ({setDoc}) => {
    await setDoc(doc(db, 'verificationRequests', uid), { uid, type, status: 'pending', submittedAt: serverTimestamp() }, {merge:true});
  });
}
