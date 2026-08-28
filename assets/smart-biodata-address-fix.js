// JORON Smart Biodata — complete dependent Bangladesh address selector.
// Division → District → Upazila/Thana → Post Office → Union/Paurashava → Village.
// Village names come from the geographic dataset; no fake village names are generated.

import { getDivisions, getDistricts, getUpazilas, getAreas, getVillages } from "https://esm.sh/@olism/bd-geo@0.1.6";

const POSTCODE_URL = "https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";
const $ = id => document.getElementById(id);

let divisions = [];
let districts = [];
let upazilas = [];
let areas = [];
let villages = [];
let postcodes = [];

const uniq = values => [...new Set(values.filter(Boolean))];

function label(item){
  return item?.nameBn ?? item?.bn_name ?? item?.name ?? item?.name_en ?? "";
}

function norm(value){
  return String(value ?? "")
    .toLowerCase()
    .replace(/[().,\-_/]/g, " ")
    .replace(/\b(upazila|upo|sadar|thana|municipality)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function setOptions(select, items, placeholder){
  if(!select) return;
  const old = select.value;
  select.replaceChildren(new Option(placeholder, ""));
  items.forEach(item => {
    const value = item?.id ?? item?.value ?? item?.name ?? "";
    const text = label(item);
    if(value !== "" && text) select.add(new Option(text, String(value)));
  });
  select.disabled = items.length === 0;
  if(old && [...select.options].some(o => o.value === old)) select.value = old;
}

function setStringOptions(select, values, placeholder){
  if(!select) return;
  const old = select.value;
  select.replaceChildren(new Option(placeholder, ""));
  uniq(values).forEach(value => select.add(new Option(value, value)));
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
  box.innerHTML = `<label>${prefix ? "Permanent" : "Present"} গ্রাম</label><select id="${prefix}village" disabled><option value="">${prefix ? "Permanent" : "Present"} গ্রাম নির্বাচন করুন</option></select><div class="hint">ইউনিয়ন নির্বাচন করার পর সংশ্লিষ্ট গ্রামের তালিকা দেখাবে।</div>`;
  field.insertAdjacentElement("afterend", box);
}

function renameArea(prefix){
  const area = $(`${prefix}area`);
  const labelEl = area?.closest(".field")?.querySelector("label");
  if(labelEl) labelEl.textContent = `${prefix ? "Permanent" : "Present"} ইউনিয়ন / পৌরসভা`;
}

async function loadPostcodes(){
  try{
    const response = await fetch(POSTCODE_URL, {cache:"force-cache"});
    if(!response.ok) throw new Error(`postcode HTTP ${response.status}`);
    const json = await response.json();
    return Array.isArray(json) ? json : (json.postcodes || []);
  }catch(error){
    console.warn("JORON postcode dataset unavailable:", error);
    return [];
  }
}

function postOfficesFor(districtId, upazilaId){
  const district = districts.find(x => Number(x.id) === Number(districtId));
  const upazila = upazilas.find(x => Number(x.id) === Number(upazilaId));
  if(!district || !upazila) return [];
  const wanted = norm(upazila.name);
  return postcodes
    .filter(x => Number(x.district_id) === Number(district.id))
    .filter(x => norm(x.upazila) === wanted)
    .map(x => `${x.postOffice}${x.postCode ? ` (${x.postCode})` : ""}`);
}

function setup(prefix){
  const d = $(`${prefix}division`);
  const di = $(`${prefix}district`);
  const u = $(`${prefix}upazila`);
  const p = $(`${prefix}postOffice`);
  const a = $(`${prefix}area`);
  const v = $(`${prefix}village`);
  if(!d || !di || !u || !p || !a || !v) return;

  const name = prefix ? "Permanent" : "Present";
  setOptions(d, divisions, `${name} বিভাগ নির্বাচন করুন`);

  d.addEventListener("change", () => {
    const list = districts.filter(x => Number(x.divisionId) === Number(d.value));
    setOptions(di, list, `${name} জেলা নির্বাচন করুন`);
    reset(u, `${name} উপজেলা / থানা নির্বাচন করুন`);
    reset(p, `${name} পোস্ট অফিস নির্বাচন করুন`);
    reset(a, `${name} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);
    reset(v, `${name} গ্রাম নির্বাচন করুন`);
  });

  di.addEventListener("change", () => {
    const list = upazilas.filter(x => Number(x.districtId) === Number(di.value));
    setOptions(u, list, `${name} উপজেলা / থানা নির্বাচন করুন`);
    reset(p, `${name} পোস্ট অফিস নির্বাচন করুন`);
    reset(a, `${name} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);
    reset(v, `${name} গ্রাম নির্বাচন করুন`);
  });

  u.addEventListener("change", () => {
    const upazilaId = Number(u.value);
    const unionList = areas.filter(x => Number(x.upazilaId) === upazilaId && x.type === "union");
    setOptions(a, unionList, `${name} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);
    reset(v, `${name} গ্রাম নির্বাচন করুন`);
    const posts = postOfficesFor(Number(di.value), upazilaId);
    setStringOptions(p, posts, `${name} পোস্ট অফিস নির্বাচন করুন`);
  });

  a.addEventListener("change", () => {
    const areaId = Number(a.value);
    const villageList = villages.filter(x => Number(x.areaId) === areaId);
    setOptions(v, villageList, `${name} গ্রাম নির্বাচন করুন`);
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

    ["p", ""].forEach(prefix => {
      addVillageSelect(prefix);
      renameArea(prefix);
    });
    ["p", ""].forEach(setup);

    const status = $("locationStatus");
    if(status){
      status.textContent = "✅ বাংলাদেশের ঠিকানা ডেটা প্রস্তুত। বিভাগ নির্বাচন করুন।";
      status.style.display = "block";
    }

    console.info(`JORON address ready: ${divisions.length} divisions, ${districts.length} districts, ${upazilas.length} upazilas, ${areas.length} areas, ${villages.length} villages, ${postcodes.length} postal records.`);
  }catch(error){
    console.error("JORON address loader failed:", error);
    const status = $("locationStatus");
    if(status){
      status.textContent = "⚠️ ঠিকানার ডেটা লোড করা যায়নি। Internet connection পরীক্ষা করুন।";
      status.style.display = "block";
    }
  }
}

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
else init();
