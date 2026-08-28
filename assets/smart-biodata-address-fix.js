// JORON — Post Office fix only.
// IMPORTANT: Do not replace the existing Division → District → Upazila/Area logic.
// The legacy address module owns those selectors. This module only supplies Post Office
// after the legacy module finishes loading an Upazila, for BOTH Present and Permanent.

const JORON_POSTCODE_URL = "https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";
const jQ = id => document.getElementById(id);
let joronPostRows = null;
let joronPostLoading = null;

const clean = value => String(value ?? "")
  .toLowerCase()
  .replace(/[().,\-_/]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

async function loadJoronPostcodes(){
  if (joronPostRows) return joronPostRows;
  if (joronPostLoading) return joronPostLoading;
  joronPostLoading = fetch(JORON_POSTCODE_URL, { cache: "force-cache" })
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
  const office = row?.postOffice ?? row?.postoffice ?? "";
  const code = row?.postCode ?? row?.postcode ?? "";
  return code ? `${office} — ${code}` : office;
}

function resetPost(select, placeholder){
  if (!select) return;
  select.replaceChildren(new Option(placeholder, ""));
  select.disabled = true;
}

function fillPost(select, rows, placeholder, previousValue = ""){
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
  if (previousValue && [...select.options].some(o => o.value === previousValue)) {
    select.value = previousValue;
  }
}

function matchingRows(upazilaValue){
  const q = clean(upazilaValue);
  if (!q || !joronPostRows?.length) return [];
  return joronPostRows.filter(row => {
    const u = clean(row.upazila);
    if (!u) return false;
    // Handle common "UPO" / "Sadar" spelling differences.
    return u === q || u.replace(/\s+upo$/, "") === q || q.replace(/\s+upo$/, "") === u;
  });
}

async function updatePostOffice(prefix){
  const upazila = jQ(prefix ? "pupazila" : "upazila");
  const post = jQ(prefix ? "ppostOffice" : "postOffice");
  const label = prefix ? "Permanent" : "Present";
  if (!upazila || !post) return;

  const old = post.value;
  resetPost(post, `${label} পোস্ট অফিস লোড হচ্ছে...`);
  const rows = matchingRows(upazila.value);
  fillPost(post, rows, rows.length ? `${label} পোস্ট অফিস নির্বাচন করুন` : `${label} পোস্ট অফিস পাওয়া যায়নি`, old);

  const status = jQ("locationStatus");
  if (status && rows.length) {
    status.textContent = `✅ ${label} পোস্ট অফিসের ${rows.length}টি অপশন প্রস্তুত।`;
    status.style.display = "block";
  }
}

function bindPostOffice(prefix){
  const upazila = jQ(prefix ? "pupazila" : "upazila");
  if (!upazila || upazila.dataset.joronPostBound === "1") return;
  upazila.dataset.joronPostBound = "1";
  upazila.addEventListener("change", () => updatePostOffice(prefix));
}

async function initJoronPostOffice(){
  // Do NOT clone or replace any address select. That was causing the previous conflict.
  bindPostOffice("");
  bindPostOffice("p");
  await loadJoronPostcodes();
  await updatePostOffice("");
  await updatePostOffice("p");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initJoronPostOffice, { once: true });
} else {
  initJoronPostOffice();
}