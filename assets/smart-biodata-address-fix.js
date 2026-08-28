// JORON Smart Biodata — Address compatibility fix
// Keeps existing Division → District → Upazila → Area logic untouched.
// Supplies Post Office + Village for BOTH Present and Permanent addresses.

import { getVillages } from "https://esm.sh/@olism/bd-geo@0.1.6";

const JORON_POSTCODE_URL = "https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";
const jQ = id => document.getElementById(id);
let joronPostRows = null;
let joronPostLoading = null;
let joronVillages = [];

const clean = value => String(value ?? "")
  .toLowerCase()
  .replace(/[().,\-_/]/g, " ")
  .replace(/\b(upazila|upo|sadar|thana)\b/g, "")
  .replace(/\s+/g, " ")
  .trim();

async function loadJoronPostcodes(){
  if (joronPostRows) return joronPostRows;
  if (joronPostLoading) return joronPostLoading;
  joronPostLoading = fetch(JORON_POSTCODE_URL, { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error(`postcode dataset HTTP ${r.status}`);
      return r.json();
    })
    .then(json => {
      joronPostRows = Array.isArray(json) ? json : (json.postcodes || []);
      return joronPostRows;
    })
    .catch(err => {
      console.error("JORON Post Office dataset failed:", err);
      joronPostRows = [];
      return joronPostRows;
    });
  return joronPostLoading;
}

function optionText(row){
  const office = row?.postOffice ?? row?.postoffice ?? row?.post_office ?? row?.office ?? "";
  const code = row?.postCode ?? row?.postcode ?? row?.post_code ?? row?.code ?? "";
  return code ? `${office} — ${code}` : office;
}

function selectedUpazilaText(select){
  if (!select) return "";
  const opt = select.options?.[select.selectedIndex];
  return opt?.textContent?.trim() || select.value || "";
}

function matchingRows(upazilaSelect){
  if (!upazilaSelect || !joronPostRows?.length) return [];
  const selected = clean(selectedUpazilaText(upazilaSelect));
  const rawValue = clean(upazilaSelect.value);
  if (!selected && !rawValue) return [];
  return joronPostRows.filter(row => {
    const candidates = [row.upazila, row.upazila_bn, row.upazilaBn, row.upazila_name, row.upazilaName];
    return candidates.some(v => {
      const x = clean(v);
      return x && (x === selected || x === rawValue || x.includes(selected) || selected.includes(x));
    });
  });
}

function resetSelect(select, placeholder){
  if (!select) return;
  select.replaceChildren(new Option(placeholder, ""));
  select.value = "";
  select.disabled = true;
}

function fillPost(select, rows, placeholder){
  if (!select) return;
  select.replaceChildren(new Option(placeholder, ""));
  const seen = new Set();
  rows.forEach(row => {
    const text = optionText(row);
    if (!text || seen.has(text)) return;
    seen.add(text);
    select.add(new Option(text, text));
  });
  select.disabled = seen.size === 0;
}

function villageText(row){
  return String(row?.nameBn ?? row?.bn_name ?? row?.name ?? row?.name_en ?? "").trim();
}

function ensureVillageSelect(prefix){
  const id = prefix ? "pvillage" : "village";
  const areaId = prefix ? "parea" : "area";
  let village = jQ(id);
  if (village) return village;

  const area = jQ(areaId);
  if (!area) return null;
  const field = area.closest(".field");
  if (!field) return null;

  const box = document.createElement("div");
  box.className = "field full";
  box.innerHTML = `<label>${prefix ? "স্থায়ী" : "বর্তমান"} গ্রামের নাম</label><select id="${id}" disabled><option value="">${prefix ? "স্থায়ী" : "বর্তমান"} গ্রাম নির্বাচন করুন</option></select><div class="hint">ইউনিয়ন/এলাকা নির্বাচন করার পর গ্রামের তালিকা দেখাবে।</div>`;
  field.insertAdjacentElement("afterend", box);
  village = jQ(id);
  return village;
}

function areaIdFromSelect(prefix){
  const area = jQ(prefix ? "parea" : "area");
  return area?.value || "";
}

function fillVillage(prefix){
  const village = ensureVillageSelect(prefix);
  if (!village) return;
  const areaId = Number(areaIdFromSelect(prefix));
  const label = prefix ? "স্থায়ী" : "বর্তমান";
  if (!areaId) {
    resetSelect(village, `${label} গ্রাম নির্বাচন করুন`);
    return;
  }
  const rows = joronVillages.filter(v => Number(v.areaId ?? v.unionId ?? v.parentId) === areaId);
  village.replaceChildren(new Option(rows.length ? `${label} গ্রাম নির্বাচন করুন` : `${label} গ্রাম পাওয়া যায়নি`, ""));
  const seen = new Set();
  rows.forEach(row => {
    const text = villageText(row);
    if (!text || seen.has(text)) return;
    seen.add(text);
    village.add(new Option(text, text));
  });
  village.disabled = seen.size === 0;
}

function bindVillage(prefix){
  const area = jQ(prefix ? "parea" : "area");
  if (!area || area.dataset.joronVillageBound === "1") return;
  area.dataset.joronVillageBound = "1";
  area.addEventListener("change", () => setTimeout(() => fillVillage(prefix), 0));
}

function updatePostOffice(prefix){
  const upazila = jQ(prefix ? "pupazila" : "upazila");
  const post = jQ(prefix ? "ppostOffice" : "postOffice");
  const label = prefix ? "Permanent" : "Present";
  if (!upazila || !post) return;
  resetSelect(post, `${label} পোস্ট অফিস লোড হচ্ছে...`);
  const rows = matchingRows(upazila);
  fillPost(post, rows, rows.length ? `${label} পোস্ট অফিস নির্বাচন করুন` : `${label} পোস্ট অফিস পাওয়া যায়নি`);
}

function bindPostOffice(prefix){
  const upazila = jQ(prefix ? "pupazila" : "upazila");
  if (!upazila || upazila.dataset.joronPostBound === "1") return;
  upazila.dataset.joronPostBound = "1";
  upazila.addEventListener("change", () => setTimeout(() => updatePostOffice(prefix), 0));
}

async function initJoronAddressFix(){
  // Never clone, replace, or overwrite the existing address selectors.
  bindPostOffice("");
  bindPostOffice("p");
  bindVillage("");
  bindVillage("p");

  try { joronVillages = getVillages() || []; } catch(e) { console.warn("JORON village dataset unavailable", e); }
  await loadJoronPostcodes();

  ensureVillageSelect("");
  ensureVillageSelect("p");
  updatePostOffice("");
  updatePostOffice("p");
  fillVillage("");
  fillVillage("p");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initJoronAddressFix, { once: true });
} else {
  initJoronAddressFix();
}