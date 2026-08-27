import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { auth, db, onAuthStateChanged, persistenceReady } from "./firebase-client.js";

const form = document.getElementById("form");
const notice = document.getElementById("notice");

const ids = [
  "name","nickname","dob","age","gender","height","blood","marital",
  "nationality","language","religion","practice","division","district",
  "upazila","postOffice","area","pdistrict","addressPrivacy","eduSystem",
  "education","profession","workplace","familyType","childCount","smoking",
  "personality","about","prefAge","prefDistrict","top3","photoUrl","visibility"
];

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

// Bangladesh's 64 districts, grouped by division. This keeps both Present District
// and Permanent District usable without requiring a separate network/API call.
const districtsByDivision = {
  "ঢাকা": ["ঢাকা","ফরিদপুর","গাজীপুর","গোপালগঞ্জ","কিশোরগঞ্জ","মাদারীপুর","মানিকগঞ্জ","মুন্সিগঞ্জ","নারায়ণগঞ্জ","নরসিংদী","রাজবাড়ী","শরীয়তপুর","টাঙ্গাইল"],
  "চট্টগ্রাম": ["বান্দরবান","ব্রাহ্মণবাড়িয়া","চাঁদপুর","চট্টগ্রাম","কুমিল্লা","কক্সবাজার","ফেনী","খাগড়াছড়ি","লক্ষ্মীপুর","নোয়াখালী","রাঙ্গামাটি"],
  "রাজশাহী": ["বগুড়া","জয়পুরহাট","নওগাঁ","নাটোর","চাঁপাইনবাবগঞ্জ","পাবনা","রাজশাহী","সিরাজগঞ্জ"],
  "খুলনা": ["বাগেরহাট","চুয়াডাঙ্গা","যশোর","ঝিনাইদহ","খুলনা","কুষ্টিয়া","মাগুরা","মেহেরপুর","নড়াইল","সাতক্ষীরা"],
  "বরিশাল": ["বরগুনা","বরিশাল","ভোলা","ঝালকাঠি","পটুয়াখালী","পিরোজপুর"],
  "সিলেট": ["হবিগঞ্জ","মৌলভীবাজার","সুনামগঞ্জ","সিলেট"],
  "রংপুর": ["দিনাজপুর","গাইবান্ধা","কুড়িগ্রাম","লালমনিরহাট","নীলফামারী","পঞ্চগড়","রংপুর","ঠাকুরগাঁও"],
  "ময়মনসিংহ": ["জামালপুর","ময়মনসিংহ","নেত্রকোনা","শেরপুর"]
};

function setOptions(select, placeholder, values, selected = "") {
  if (!select) return;
  select.innerHTML = "";
  const first = document.createElement("option");
  first.value = "";
  first.textContent = placeholder;
  select.appendChild(first);
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  if (selected && values.includes(selected)) select.value = selected;
}

function refreshDistricts(selectedPresent = "", selectedPermanent = "") {
  const division = document.getElementById("division")?.value || "ঢাকা";
  const districts = districtsByDivision[division] || [];
  setOptions(document.getElementById("district"), "জেলা নির্বাচন করুন", districts, selectedPresent);
  setOptions(document.getElementById("pdistrict"), "Permanent জেলা নির্বাচন করুন", districts, selectedPermanent);
}

// Populate immediately so the dropdowns are usable before any Firebase read.
refreshDistricts();
document.getElementById("division")?.addEventListener("change", () => refreshDistricts());

await persistenceReady;

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.replace("login.html?next=smart-biodata.html");
    return;
  }
  try {
    const snap = await getDoc(doc(db, "privateBiodata", user.uid));
    if (snap.exists()) {
      const data = snap.data();
      refreshDistricts(data.district || "", data.pdistrict || "");
      fill(data);
    }
  } catch (error) {
    console.error("JORON Smart Biodata load failed:", error);
  }
});

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
    location.replace("login.html?next=smart-biodata.html");
    return;
  }

  const data = collect();
  data.uid = user.uid;
  data.email = user.email || "";
  data.updatedAt = serverTimestamp();

  try {
    await setDoc(doc(db, "privateBiodata", user.uid), data, { merge: true });
    await setDoc(
      doc(db, "biodata", user.uid),
      { ...publicProjection(data), uid: user.uid, updatedAt: serverTimestamp() },
      { merge: true }
    );

    localStorage.removeItem("joronSmartBiodata");

    if (notice) {
      notice.textContent = "❤️ আপনার Smart Biodata Firebase-এ নিরাপদভাবে সংরক্ষিত হয়েছে।";
      notice.style.display = "block";
    }
    alert("Smart Biodata সফলভাবে সংরক্ষিত হয়েছে।");
  } catch (error) {
    console.error("JORON Smart Biodata save failed:", error);
    alert("তথ্য সংরক্ষণ করা যায়নি। Firebase/নেটওয়ার্ক সংযোগ পরীক্ষা করুন।");
  }
}, true);
