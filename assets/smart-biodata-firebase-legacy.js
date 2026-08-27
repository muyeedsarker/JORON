import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { auth, db, onAuthStateChanged, persistenceReady } from "./firebase-client.js";

const form = document.getElementById("form");
const notice = document.getElementById("notice");

const ids = [
  "name","nickname","dob","age","gender","height","blood","marital",
  "nationality","language","religion","practice","division","district",
  "upazila","postOffice","area","pdistrict","pdivision","pupazila","ppostOffice","parea",
  "addressPrivacy","eduSystem","education","profession","workplace","familyType","childCount","smoking",
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

const fallbackDistrictsByDivision = {
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
  [...new Set(values.filter(Boolean))].forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  if (selected) select.value = selected;
}

function addPermanentFields() {
  const pdistrict = document.getElementById("pdistrict");
  if (!pdistrict || document.getElementById("pdivision")) return;
  const wrap = pdistrict.closest(".field");
  if (!wrap) return;
  wrap.insertAdjacentHTML("afterend", `
    <div class="field"><label>Permanent বিভাগ</label><select id="pdivision"><option>ঢাকা</option><option>চট্টগ্রাম</option><option>রাজশাহী</option><option>খুলনা</option><option>বরিশাল</option><option>সিলেট</option><option>রংপুর</option><option>ময়মনসিংহ</option></select></div>
    <div class="field"><label>Permanent উপজেলা / থানা</label><select id="pupazila"><option value="">উপজেলা / থানা নির্বাচন করুন</option></select></div>
    <div class="field"><label>Permanent Post Office</label><select id="ppostOffice"><option value="">পোস্ট অফিস নির্বাচন করুন</option></select></div>
    <div class="field"><label>Permanent এলাকা / গ্রাম</label><select id="parea"><option value="">এলাকা / গ্রাম / ইউনিয়ন নির্বাচন করুন</option></select></div>
  `);
}

addPermanentFields();

let geoTree = [];
let postalRows = [];

function findDivision(name) {
  return geoTree.find(x => x.bn_name === name || x.name === name);
}
function findDistrict(division, name) {
  return (division?.districts || []).find(x => x.bn_name === name || x.name === name);
}
function findUpazila(district, name) {
  return (district?.upazilas || []).find(x => x.bn_name === name || x.name === name);
}

function refreshPresentDistrict(selected = "") {
  const div = document.getElementById("division")?.value || "ঢাকা";
  const d = findDivision(div);
  const values = d?.districts?.map(x => x.bn_name || x.name) || fallbackDistrictsByDivision[div] || [];
  setOptions(document.getElementById("district"), "জেলা নির্বাচন করুন", values, selected);
}

function refreshPermanentDistrict(selected = "") {
  const div = document.getElementById("pdivision")?.value || "ঢাকা";
  const d = findDivision(div);
  const values = d?.districts?.map(x => x.bn_name || x.name) || fallbackDistrictsByDivision[div] || [];
  setOptions(document.getElementById("pdistrict"), "Permanent জেলা নির্বাচন করুন", values, selected);
}

function refreshUpazila(prefix = "", selected = "") {
  const divisionId = prefix ? "pdivision" : "division";
  const districtId = prefix ? "pdistrict" : "district";
  const upazilaId = prefix ? "pupazila" : "upazila";
  const div = findDivision(document.getElementById(divisionId)?.value || "");
  const district = findDistrict(div, document.getElementById(districtId)?.value || "");
  const values = district?.upazilas?.map(x => x.bn_name || x.name) || [];
  setOptions(document.getElementById(upazilaId), "উপজেলা / থানা নির্বাচন করুন", values, selected);
}

function refreshPostalAndArea(prefix = "", selectedPost = "", selectedArea = "") {
  const districtId = prefix ? "pdistrict" : "district";
  const upazilaId = prefix ? "pupazila" : "upazila";
  const postId = prefix ? "ppostOffice" : "postOffice";
  const areaId = prefix ? "parea" : "area";
  const district = document.getElementById(districtId)?.value || "";
  const upazila = document.getElementById(upazilaId)?.value || "";

  const rows = postalRows.filter(r => {
    const b = r.bn || {};
    const e = r.en || {};
    const districtOk = !district || b.district === district || e.district === district;
    const upazilaOk = !upazila || b.thana === upazila || e.thana === upazila;
    return districtOk && upazilaOk;
  });

  const posts = rows.map(r => r.bn?.suboffice || r.en?.suboffice || r.bn?.postOffice || r.en?.postOffice);
  setOptions(document.getElementById(postId), "পোস্ট অফিস নির্বাচন করুন", posts, selectedPost);

  // The public postal dataset provides service-area/post-office names; these are used
  // as structured local-area choices instead of forcing free-text entry.
  const areas = rows.map(r => r.bn?.suboffice || r.en?.suboffice || r.bn?.postOffice || r.en?.postOffice);
  setOptions(document.getElementById(areaId), "এলাকা / গ্রাম / পোস্ট-এলাকা নির্বাচন করুন", areas, selectedArea);
}

function bindAddressEvents() {
  document.getElementById("division")?.addEventListener("change", () => {
    refreshPresentDistrict();
    refreshUpazila();
    refreshPostalAndArea();
  });
  document.getElementById("district")?.addEventListener("change", () => {
    refreshUpazila();
    refreshPostalAndArea();
  });
  document.getElementById("upazila")?.addEventListener("change", () => refreshPostalAndArea());

  document.getElementById("pdivision")?.addEventListener("change", () => {
    refreshPermanentDistrict();
    refreshUpazila("p");
    refreshPostalAndArea("p");
  });
  document.getElementById("pdistrict")?.addEventListener("change", () => {
    refreshUpazila("p");
    refreshPostalAndArea("p");
  });
  document.getElementById("pupazila")?.addEventListener("change", () => refreshPostalAndArea("p"));
}

refreshPresentDistrict();
refreshPermanentDistrict();
bindAddressEvents();

// Public, bilingual Bangladesh hierarchy: 8 divisions, 64 districts, 495 upazilas and unions.
// Postal data is loaded separately so the selector remains structured and does not require typing.
try {
  const [geoRes, postalRes] = await Promise.all([
    fetch("https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json"),
    fetch("https://huggingface.co/datasets/ahnafch01/Bangladesh_Locations/resolve/main/bangladesh_postcodes_flat.json")
  ]);
  if (geoRes.ok) geoTree = await geoRes.json();
  if (postalRes.ok) postalRows = await postalRes.json();
  refreshPresentDistrict();
  refreshPermanentDistrict();
  refreshUpazila();
  refreshUpazila("p");
  refreshPostalAndArea();
  refreshPostalAndArea("p");
} catch (error) {
  console.warn("JORON address dataset could not be loaded; district fallback remains active.", error);
}

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
      document.getElementById("division").value = data.division || "ঢাকা";
      document.getElementById("pdivision").value = data.pdivision || data.division || "ঢাকা";
      refreshPresentDistrict(data.district || "");
      refreshPermanentDistrict(data.pdistrict || "");
      refreshUpazila("", data.upazila || "");
      refreshUpazila("p", data.pupazila || "");
      refreshPostalAndArea("", data.postOffice || "", data.area || "");
      refreshPostalAndArea("p", data.ppostOffice || "", data.parea || "");
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
