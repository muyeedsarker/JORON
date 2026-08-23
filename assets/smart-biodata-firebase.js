import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const form = document.getElementById("form");
const notice = document.getElementById("notice");

const ids = [
  "name","nickname","dob","age","gender","height","blood","marital",
  "nationality","language","religion","practice","division","district",
  "upazila","postOffice","area","pdistrict","addressPrivacy","eduSystem",
  "education","profession","workplace","familyType","childCount","smoking",
  "personality","about","prefAge","prefDistrict","top3","photoUrl","visibility"
];

// Only these non-sensitive fields are published to the searchable public profile projection.
const publicIds = [
  "name","nickname","age","gender","height","marital","division","district",
  "upazila","eduSystem","education","profession","familyType","personality","photoUrl","visibility"
];

const valueOf = id => {
  const el = document.getElementById(id);
  if (!el) return "";
  if (el.type === "checkbox") return el.checked;
  return el.value;
};

function collect() {
  const data = {};
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id] = valueOf(id);
  });
  return data;
}

function fill(data) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el || data[id] === undefined || data[id] === null) return;
    if (el.type === "checkbox") el.checked = Boolean(data[id]);
    else el.value = data[id];
  });
  document.getElementById("dob")?.dispatchEvent(new Event("change"));
}

function publicProjection(data) {
  const out = {};
  publicIds.forEach(id => {
    if (data[id] !== undefined) out[id] = data[id];
  });
  return out;
}

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.href = "login.html?next=smart-biodata.html";
    return;
  }
  try {
    const snap = await getDoc(doc(db, "biodata", user.uid));
    if (snap.exists()) fill(snap.data());
  } catch (error) {
    console.error("JORON Smart Biodata load failed:", error);
  }
});

// Capture the submit before the old localStorage-only handler. This makes Firestore the source of truth.
form?.addEventListener("submit", async event => {
  event.preventDefault();
  event.stopImmediatePropagation();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("আগে Login করুন।");
    location.href = "login.html?next=smart-biodata.html";
    return;
  }

  const data = collect();
  data.uid = user.uid;
  data.email = user.email || "";
  data.updatedAt = serverTimestamp();

  try {
    await setDoc(doc(db, "biodata", user.uid), data, { merge: true });
    await setDoc(
      doc(db, "publicProfiles", user.uid),
      { ...publicProjection(data), uid: user.uid, updatedAt: serverTimestamp() },
      { merge: true }
    );

    // Keep a local draft as a convenience, never as the authoritative database.
    const local = { ...data, updatedAt: Date.now() };
    delete local.email;
    localStorage.setItem("joronSmartBiodata", JSON.stringify(local));

    if (notice) {
      notice.textContent = "❤️ আপনার Smart Biodata Firebase-এ সংরক্ষিত হয়েছে।";
      notice.style.display = "block";
    }
    alert("Smart Biodata সফলভাবে সংরক্ষিত হয়েছে।");
  } catch (error) {
    console.error("JORON Smart Biodata save failed:", error);
    alert("তথ্য সংরক্ষণ করা যায়নি। Firebase/নেটওয়ার্ক সংযোগ পরীক্ষা করুন।");
  }
}, true);
