// JORON Smart Biodata — COMPLETE ADDRESS SYSTEM
// Division → District → Upazila/Thana → Area (Union/Ward) → Village
// Post Office is populated independently from the selected Upazila/Thana.
// Works for BOTH Permanent and Present addresses.

import {
  getDivisions,
  getDistricts,
  getUpazilas,
  getAreas,
  getVillages
} from "https://esm.sh/@olism/bd-geo@0.1.6";

const $ = id => document.getElementById(id);
const POSTCODE_URL = "https://raw.githubusercontent.com/TanjidulIslamToha/bangladesh-postal-codes-database/main/postcodes-pretty.json";

let divisions = [];
let districts = [];
let upazilas = [];
let areas = [];
let villages = [];
let postcodes = [];

const clean = value => String(value ?? "")
  .toLowerCase()
  .replace(/[().,\-_/]/g, " ")
  .replace(/\b(upazila|upo|sadar|thana)\b/g, "")
  .replace(/উপজেলা|থানা|সদর/g, "")
  .replace(/\s+/g, " ")
  .trim();

function status(text, error = false) {
  const box = $("locationStatus");
  if (!box) return;
  box.textContent = text;
  box.style.display = "block";
  box.style.color = error ? "#a80000" : "#087b59";
}

function reset(select, placeholder) {
  if (!select) return;
  select.replaceChildren(new Option(placeholder, ""));
  select.value = "";
  select.disabled = true;
}

function fill(select, rows, placeholder, text = row => row?.nameBn ?? row?.bn_name ?? row?.name ?? row?.title) {
  if (!select) return;
  select.replaceChildren(new Option(placeholder, ""));
  const seen = new Set();
  (rows || []).forEach(row => {
    const label = String(text(row) ?? "").trim();
    if (!label || seen.has(label)) return;
    seen.add(label);
    const value = row?.id ?? row?.value ?? label;
    select.add(new Option(label, String(value)));
  });
  select.disabled = seen.size === 0;
}

function addVillageSelect(prefix) {
  const id = prefix ? "pvillage" : "village";
  const areaId = prefix ? "parea" : "area";
  if ($(id)) return $(id);
  const area = $(areaId);
  if (!area) return null;
  const field = area.closest(".field");
  if (!field) return null;

  const box = document.createElement("div");
  box.className = "field full joron-village-field";
  box.innerHTML = `
    <label>${prefix ? "Permanent" : "Present"} এলাকা / গ্রামের নাম</label>
    <select id="${id}" name="${id}" disabled>
      <option value="">${prefix ? "Permanent" : "Present"} গ্রাম নির্বাচন করুন</option>
    </select>
    <div class="hint">এলাকা/ইউনিয়ন নির্বাচন করার পর সংশ্লিষ্ট গ্রামের নাম দেখাবে।</div>`;
  field.insertAdjacentElement("afterend", box);
  return $(id);
}

function selected(select) {
  if (!select?.value) return null;
  return Number.isNaN(Number(select.value)) ? null : Number(select.value);
}

function postMatches(row, upazila) {
  const selectedName = clean(upazila?.options?.[upazila.selectedIndex]?.textContent);
  const selectedId = clean(upazila?.value);
  const names = [
    row?.bn?.thana, row?.bn?.upazila, row?.bn?.thana_bn,
    row?.en?.thana, row?.en?.upazila, row?.en?.thana_en,
    row?.thana, row?.upazila, row?.upazila_bn, row?.upazila_name
  ].filter(Boolean).map(clean);
  return names.some(name =>
    name === selectedName || name === selectedId ||
    name.includes(selectedName) || selectedName.includes(name)
  );
}

function postLabel(row) {
  const bn = row?.bn || {};
  const en = row?.en || {};
  const office = bn.suboffice || bn.postoffice || bn.post_office || en.suboffice || en.postoffice || "";
  const code = bn.postcode || en.postcode || row?.postcode || row?.postCode || "";
  return code ? `${office} — ${code}` : office;
}

function updatePost(prefix) {
  const up = $(prefix ? "pupazila" : "upazila");
  const post = $(prefix ? "ppostOffice" : "postOffice");
  const label = prefix ? "Permanent" : "Present";
  if (!up || !post) return;
  reset(post, `${label} পোস্ট অফিস নির্বাচন করুন`);
  if (!up.value) return;

  const rows = postcodes.filter(row => postMatches(row, up));
  const seen = new Set();
  rows.forEach(row => {
    const labelText = postLabel(row);
    if (!labelText || seen.has(labelText)) return;
    seen.add(labelText);
    post.add(new Option(labelText, labelText));
  });
  post.disabled = seen.size === 0;
  if (!seen.size) post.firstChild.textContent = `${label} পোস্ট অফিস পাওয়া যায়নি`;
}

function updateVillages(prefix) {
  const area = $(prefix ? "parea" : "area");
  const village = addVillageSelect(prefix);
  const label = prefix ? "Permanent" : "Present";
  if (!area || !village) return;
  reset(village, `${label} গ্রাম নির্বাচন করুন`);
  const areaId = selected(area);
  if (!areaId) return;

  const rows = villages.filter(v => Number(v.areaId) === areaId);
  const seen = new Set();
  rows.forEach(row => {
    const text = String(row?.nameBn || row?.name || "").trim();
    if (!text || seen.has(text)) return;
    seen.add(text);
    village.add(new Option(text, String(row.id)));
  });
  village.disabled = seen.size === 0;
  if (!seen.size) village.firstChild.textContent = `${label} গ্রামের তথ্য পাওয়া যায়নি`;
}

function wire(prefix) {
  const p = prefix ? "p" : "";
  const division = $(p + "division");
  const district = $(p + "district");
  const upazila = $(p + "upazila");
  const post = $(p + "postOffice");
  const area = $(p + "area");
  if (!division || !district || !upazila || !area) return;

  division.addEventListener("change", () => {
    reset(district, prefix ? "Permanent জেলা নির্বাচন করুন" : "Present জেলা নির্বাচন করুন");
    reset(upazila, prefix ? "Permanent উপজেলা / থানা নির্বাচন করুন" : "Present উপজেলা / থানা নির্বাচন করুন");
    if (post) reset(post, prefix ? "Permanent পোস্ট অফিস নির্বাচন করুন" : "Present পোস্ট অফিস নির্বাচন করুন");
    reset(area, prefix ? "Permanent এলাকা / ইউনিয়ন নির্বাচন করুন" : "Present এলাকা / ইউনিয়ন নির্বাচন করুন");
    reset(addVillageSelect(prefix), prefix ? "Permanent গ্রাম নির্বাচন করুন" : "Present গ্রাম নির্বাচন করুন");
    const id = selected(division);
    fill(district, districts.filter(d => Number(d.divisionId) === id), prefix ? "Permanent জেলা নির্বাচন করুন" : "Present জেলা নির্বাচন করুন");
  });

  district.addEventListener("change", () => {
    reset(upazila, prefix ? "Permanent উপজেলা / থানা নির্বাচন করুন" : "Present উপজেলা / থানা নির্বাচন করুন");
    if (post) reset(post, prefix ? "Permanent পোস্ট অফিস নির্বাচন করুন" : "Present পোস্ট অফিস নির্বাচন করুন");
    reset(area, prefix ? "Permanent এলাকা / ইউনিয়ন নির্বাচন করুন" : "Present এলাকা / ইউনিয়ন নির্বাচন করুন");
    reset(addVillageSelect(prefix), prefix ? "Permanent গ্রাম নির্বাচন করুন" : "Present গ্রাম নির্বাচন করুন");
    const id = selected(district);
    fill(upazila, upazilas.filter(u => Number(u.districtId) === id), prefix ? "Permanent উপজেলা / থানা নির্বাচন করুন" : "Present উপজেলা / থানা নির্বাচন করুন");
  });

  upazila.addEventListener("change", () => {
    if (post) reset(post, prefix ? "Permanent পোস্ট অফিস নির্বাচন করুন" : "Present পোস্ট অফিস নির্বাচন করুন");
    reset(area, prefix ? "Permanent এলাকা / ইউনিয়ন নির্বাচন করুন" : "Present এলাকা / ইউনিয়ন নির্বাচন করুন");
    reset(addVillageSelect(prefix), prefix ? "Permanent গ্রাম নির্বাচন করুন" : "Present গ্রাম নির্বাচন করুন");
    const id = selected(upazila);
    // Area contains both unions and wards. Show both so metropolitan addresses are not lost.
    fill(area, areas.filter(a => Number(a.upazilaId) === id), prefix ? "Permanent এলাকা / ইউনিয়ন নির্বাচন করুন" : "Present এলাকা / ইউনিয়ন নির্বাচন করুন");
    updatePost(prefix);
  });

  area.addEventListener("change", () => updateVillages(prefix));
}

async function init() {
  try {
    status("📍 সম্পূর্ণ Bangladesh address data প্রস্তুত হচ্ছে...");

    divisions = getDivisions() || [];
    districts = getDistricts() || [];
    upazilas = getUpazilas() || [];
    areas = getAreas() || [];
    villages = getVillages() || [];

    // Load divisions directly from the same authoritative parent-child dataset.
    fill($("pdivision"), divisions, "Permanent বিভাগ নির্বাচন করুন");
    fill($("division"), divisions, "Present বিভাগ নির্বাচন করুন");

    // Clear all dependent fields at startup so no stale/dummy values remain.
    ["pdistrict","pupazila","ppostOffice","parea","district","upazila","postOffice","area"].forEach(id => {
      const el = $(id);
      if (el) el.disabled = true;
    });

    addVillageSelect("");
    addVillageSelect("p");
    wire("");
    wire("p");

    try {
      const response = await fetch(POSTCODE_URL, { cache: "force-cache" });
      if (response.ok) {
        const json = await response.json();
        postcodes = Object.values(json || {});
      }
    } catch (e) {
      console.warn("JORON postal dataset unavailable:", e);
    }

    status(`✅ Address system প্রস্তুত: বিভাগ → জেলা → উপজেলা/থানা → এলাকা/ইউনিয়ন → গ্রাম`);
  } catch (error) {
    console.error("JORON address initialization failed:", error);
    status("⚠️ Address data লোড হয়নি। পেজটি Refresh করুন।", true);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
