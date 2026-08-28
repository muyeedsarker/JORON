// JORON — Post Office fix only.
// Keeps the existing Division → District → Upazila → Area logic untouched.
// Supplies Post Office options for BOTH Present and Permanent addresses.

const JORON_POSTCODE_URL = "https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";
const jQ = id => document.getElementById(id);
let joronPostRows = null;
let joronPostLoading = null;

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

function resetPost(select, placeholder){
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

async function updatePostOffice(prefix){
  const upazila = jQ(prefix ? "pupazila" : "upazila");
  const post = jQ(prefix ? "ppostOffice" : "postOffice");
  const label = prefix ? "Permanent" : "Present";
  if (!upazila || !post) return;

  resetPost(post, `${label} পোস্ট অফিস লোড হচ্ছে...`);
  const rows = matchingRows(upazila);
  fillPost(post, rows, rows.length ? `${label} পোস্ট অফিস নির্বাচন করুন` : `${label} পোস্ট অফিস পাওয়া যায়নি`);

  console.info(`JORON ${label} Post Office`, {
    upazila: selectedUpazilaText(upazila),
    count: rows.length
  });
}

function bindPostOffice(prefix){
  const upazila = jQ(prefix ? "pupazila" : "upazila");
  if (!upazila || upazila.dataset.joronPostBound === "1") return;
  upazila.dataset.joronPostBound = "1";
  upazila.addEventListener("change", () => {
    // Wait one tick so the legacy module has finished clearing its dependent fields.
    setTimeout(() => updatePostOffice(prefix), 0);
  });
}

async function initJoronPostOffice(){
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