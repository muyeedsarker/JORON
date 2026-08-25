import { auth, db, storage } from './firebase-client.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js';
import { doc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

export const PHOTO_STYLES = ['classic','elegant','soft','modern','modest'];

export async function uploadProfilePhoto(file, style='classic') {
  const user = auth.currentUser;
  if (!user) throw new Error('Login required');
  if (!file || !file.type.startsWith('image/')) throw new Error('শুধু ছবি আপলোড করা যাবে');
  if (file.size > 5 * 1024 * 1024) throw new Error('ছবির আকার সর্বোচ্চ 5MB');
  if (!PHOTO_STYLES.includes(style)) style = 'classic';
  const path = `profilePhotos/${user.uid}/profile-${style}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type, cacheControl: 'public,max-age=3600' });
  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db, 'biodata', user.uid), { profilePhoto: url, profilePhotoStyle: style, profilePhotoUpdatedAt: serverTimestamp() });
  return { url, style, path };
}
