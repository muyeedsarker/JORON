import { auth, db } from './firebase-client.js';
import { collection, doc, getDocs, query, where, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

function uid() {
  const user = auth.currentUser;
  if (!user) throw new Error('AUTH_REQUIRED');
  return user.uid;
}

export async function likeProfile(profileId) {
  const fromUserId = uid();
  if (!profileId || profileId === fromUserId) throw new Error('INVALID_PROFILE');
  const interestId = `${fromUserId}_${profileId}`;
  await setDoc(doc(db, 'interests', interestId), {
    fromUserId,
    profileId,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { interestId, status: 'pending' };
}

export async function removeLike(profileId) {
  const fromUserId = uid();
  if (!profileId || profileId === fromUserId) throw new Error('INVALID_PROFILE');
  await deleteDoc(doc(db, 'interests', `${fromUserId}_${profileId}`));
}

export async function getIncomingInterests() {
  const userId = uid();
  const snap = await getDocs(query(collection(db, 'interests'), where('profileId', '==', userId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getOutgoingInterests() {
  const userId = uid();
  const snap = await getDocs(query(collection(db, 'interests'), where('fromUserId', '==', userId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function respondToInterest(interestId, status) {
  if (!['accepted', 'rejected'].includes(status)) throw new Error('INVALID_STATUS');
  uid();
  await updateDoc(doc(db, 'interests', interestId), { status, updatedAt: serverTimestamp() });
}

export async function getMutualInterestIds() {
  const userId = uid();
  const outgoing = await getOutgoingInterests();
  const incoming = await getIncomingInterests();
  const incomingFrom = new Set(incoming.filter(x => x.status === 'accepted').map(x => x.fromUserId));
  return outgoing.filter(x => x.status === 'accepted' && incomingFrom.has(x.profileId)).map(x => x.profileId);
}
