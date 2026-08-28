// JORON Smart Biodata — complete dependent Bangladesh address selector.
// Division → District → Upazila/Thana → Post Office → Union/Paurashava → Village.
// Uses verified relationship data and never invents village names.

import { getDivisions, getDistricts, getUpazilas, getAreas, getVillages } from "https://esm.sh/@olism/bd-geo@0.1.6";

const POSTCODE_URL = "https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";
const $ = id => document.getElementById(id);
const uniq = a => [...new Set(a.filter(Boolean))];

let divisions = [], districts = [], upazilas = [], areas = [], villages = [], postcodes = [];

function label(x){ return x?.nameBn ?? x?.bn_name ?? x?.name ?? x?.name_en ?? ""; }
function fill(select, items, placeholder){
  if(!select) return;
  const old = select.value;
  select.replaceChildren(new Option(placeholder, ""));
  items.forEach(x => {
    const value = x?.id ?? x?.value ?? x?.name ?? "";
    const text = label(x);
    if(value !== "" && text) select.add(new Option(text, String(value)));
  });
  select.disabled = items.length === 0;
  if(old && [...select.options].some(o => o.value === old)) select.value = old;
}
function fillStrings(select, values, placeholder){
  if(!select) return;
  const old = select.value;
  select.replaceChildren(new Option(placeholder, ""));
  uniq(values).forEach(v => select.add(new Option(v, v)));
  select.disabled = values.length === 0;
  if(old && [...select.options].some(o => o.value === old)) select.value = old;
}
function reset(select, placeholder){
  if(!select) return;
  select.replaceChildren(new Option(placeholder, ""));
  select.value = "";
  select.disabled = true;
}
function addVillageSelect(prefix){
  const area = $(`${prefix}area`);
  if(!area || $(`${prefix}village`)) return;
  const field = area.closest(".field");
  if(!field) return;
  const box = document.createElement("div");
  box.className = "field full";
  box.innerHTML = `<label>${prefix ? "Permanent" : "Present"} গ্রাম</label><select id="${prefix}village" disabled><option value="">${prefix ? "Permanent" : "Present"} গ্রাম নির্বাচন করুন</option></select><div class="hint">ইউনিয়ন / পৌরসভা নির্বাচন করার পর সংশ্লিষ্ট গ্রামের নাম দেখাবে।</div>`;
  field.insertAdjacentElement("afterend", box);
}
function renameArea(prefix){
  const area = $(`${prefix}area`);
  const labelEl = area?.closest(".field")?.querySelector("label");
  if(labelEl) labelEl.textContent = `${prefix ? "Permanent" : "Present"} ইউনিয়ন / পৌরসভা`;
}
async function loadPostcodes(){
  try{
    const r = await fetch(POSTCODE_URL, {cache:"force-cache"});
    if(!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j) ? j : (j.postcodes || []);
  }catch(e){
    console.warn("JORON postcode dataset unavailable", e);
    return [];
  }
}
function setup(prefix){
  const d = $(`${prefix}division`), di = $(`${prefix}district`), u = $(`${prefix}upazila`), p = $(`${prefix}postOffice`), a = $(`${prefix}area`), v = $(`${prefix}village`);
  if(!d || !di || !u || !p || !a || !v) return;

  fill(d, divisions, `${prefix ? "Permanent" : "Present"} বিভাগ নির্বাচন করুন`);

  d.addEventListener("change", () => {
    const list = districts.filter(x => Number(x.divisionId) === Number(d.value));
    fill(di, list, `${prefix ? "Permanent" : "Present"} জেলা নির্বাচন করুন`);
    reset(u, `${prefix ? "Permanent" : "Present"} উপজেলা / থানা নির্বাচন করুন`);
    reset(p, `${prefix ? "Permanent" : "Present"} পোস্ট অফিস নির্বাচন করুন`);
    reset(a, `${prefix ? "Permanent" : "Present"} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);
    reset(v, `${prefix ? "Permanent" : "Present"} গ্রাম নির্বাচন করুন`);
  });

  di.addEventListener("change", () => {
    const list = upazilas.filter(x => Number(x.districtId) === Number(di.value));
    fill(u, list, `${prefix ? "Permanent" : "Present"} উপজেলা / থানা নির্বাচন করুন`);
    reset(p, `${prefix ? "Permanent" : "Present"} পোস্ট অফিস নির্বাচন করুন`);
    reset(a, `${prefix ? "Permanent" : "Present"} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);
    reset(v, `${prefix ? "Permanent" : "Present"} গ্রাম নির্বাচন করুন`);
  });

  u.addEventListener("change", () => {
    const upId = Number(u.value);
    const unionList = areas.filter(x => Number(x.upazilaId) === upId && x.type === "union");
    fill(a, unionList, `${prefix ? "Permanent" : "Present"} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);
    reset(v, `${prefix ? "Permanent" : "Present"} গ্রাম নির্বাচন করুন`);

    const up = upazilas.find(x => Number(x.id) === upId);
    const districtId = Number(di.value);
    const upName = String(up?.name || "").trim().toLowerCase();
    const posts = postcodes
      .filter(x => Number(x.district_id) === districtId)
      .filter(x => String(x.upazila || "").trim().toLowerCase() === upName)
      .map(x => `${x.postOffice}${x.postCode ? ` (${x.postCode})` : ""}`);
    fillStrings(p, posts, `${prefix ? "Permanent" : "Present"} পোস্ট অফিস নির্বাচন করুন`);
  });

  a.addEventListener("change", () => {
    const areaId = Number(a.value);
    const list = villages.filter(x => Number(x.areaId) === areaId);
    fill(v, list, `${prefix ? "Permanent" : "Present"} গ্রাম নির্বাচন করুন`);
  });
}
async function init(){
  try{
    divisions = getDivisions();
    districts = getDistricts();
    upazilas = getUpazilas();
    areas = getAreas();
    villages = getVillages();
    postcodes = await loadPostcodes();

    ["p", ""].forEach(prefix => { addVillageSelect(prefix); renameArea(prefix); });
    ["p", ""].forEach(setup);

    console.info(`JORON address ready: ${divisions.length} divisions, ${districts.length} districts, ${upazilas.length} upazilas, ${areas.length} areas, ${villages.length} villages, ${postcodes.length} postal records.`);
  }catch(e){
    console.error("JORON address loader failed", e);
    const s = $("locationStatus");
    if(s){ s.textContent = "⚠️ ঠিকানার ডেটা লোড করা যায়নি। Internet connection পরীক্ষা করুন।"; s.style.display = "block"; }
  }
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true}); else init();
