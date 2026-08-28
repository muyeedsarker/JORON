// JORON Smart Biodata — stable dependent Bangladesh address selector.
// Present + Permanent: Division → District → Upazila/Thana → Post Office → Union/Paurashava → Village.

import { getDivisions, getDistricts, getUpazilas, getAreas, getVillages } from "https://esm.sh/@olism/bd-geo@0.1.6";

const POSTCODE_URL = "https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";
const $ = id => document.getElementById(id);

let divisions = [], districts = [], upazilas = [], areas = [], villages = [], postcodes = [];
const uniq = values => [...new Set(values.filter(Boolean))];
const norm = value => String(value ?? "").toLowerCase().replace(/[().,\-_/]/g, " ").replace(/\b(upazila|upo|sadar|thana|municipality)\b/g, "").replace(/\s+/g, " ").trim();
const label = item => item?.nameBn ?? item?.bn_name ?? item?.name ?? item?.name_en ?? "";

function setOptions(select, items, placeholder){
  if(!select) return;
  select.replaceChildren(new Option(placeholder, ""));
  items.forEach(item => {
    const value = item?.id ?? item?.value ?? item?.name ?? "";
    const text = label(item);
    if(value !== "" && text) select.add(new Option(text, String(value)));
  });
  select.disabled = items.length === 0;
}

function setStringOptions(select, values, placeholder){
  if(!select) return;
  select.replaceChildren(new Option(placeholder, ""));
  uniq(values).forEach(value => select.add(new Option(value, value)));
  select.disabled = values.length === 0;
}

function reset(select, placeholder){
  if(!select) return;
  select.replaceChildren(new Option(placeholder, ""));
  select.value = "";
  select.disabled = true;
}

// The old inline/API address code and this module both used these selects.
// Clone them once so the old listeners cannot overwrite the working selector.
function isolateSelects(prefix){
  ["division","district","upazila","postOffice","area"].forEach(key => {
    const old = $(`${prefix}${key}`);
    if(old && old.parentNode){
      const fresh = old.cloneNode(true);
      old.replaceWith(fresh);
    }
  });
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
    const response = await fetch(POSTCODE_URL, {cache:"no-store"});
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
  const wanted = uniq([norm(upazila.name), norm(upazila.nameBn)]);
  return postcodes
    .filter(x => Number(x.district_id) === Number(district.id))
    .filter(x => wanted.includes(norm(x.upazila)))
    .map(x => `${x.postOffice}${x.postCode ? ` (${x.postCode})` : ""}`);
}

function setup(prefix){
  const d = $(`${prefix}division`), di = $(`${prefix}district`), u = $(`${prefix}upazila`), p = $(`${prefix}postOffice`), a = $(`${prefix}area`), v = $(`${prefix}village`);
  if(!d || !di || !u || !p || !a || !v) return;
  const name = prefix ? "Permanent" : "Present";

  setOptions(d, divisions, `${name} বিভাগ নির্বাচন করুন`);

  d.addEventListener("change", () => {
    setOptions(di, districts.filter(x => Number(x.divisionId) === Number(d.value)), `${name} জেলা নির্বাচন করুন`);
    reset(u, `${name} উপজেলা / থানা নির্বাচন করুন`);
    reset(p, `${name} পোস্ট অফিস নির্বাচন করুন`);
    reset(a, `${name} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);
    reset(v, `${name} গ্রাম নির্বাচন করুন`);
  });

  di.addEventListener("change", () => {
    setOptions(u, upazilas.filter(x => Number(x.districtId) === Number(di.value)), `${name} উপজেলা / থানা নির্বাচন করুন`);
    reset(p, `${name} পোস্ট অফিস নির্বাচন করুন`);
    reset(a, `${name} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);
    reset(v, `${name} গ্রাম নির্বাচন করুন`);
  });

  u.addEventListener("change", () => {
    const id = Number(u.value);
    setOptions(a, areas.filter(x => Number(x.upazilaId) === id && x.type === "union"), `${name} ইউনিয়ন / পৌরসভা নির্বাচন করুন`);
    reset(v, `${name} গ্রাম নির্বাচন করুন`);
    setStringOptions(p, postOfficesFor(Number(di.value), id), `${name} পোস্ট অফিস নির্বাচন করুন`);
  });

  a.addEventListener("change", () => {
    const id = Number(a.value);
    setOptions(v, villages.filter(x => Number(x.areaId) === id), `${name} গ্রাম নির্বাচন করুন`);
  });
}

async function init(){
  try{
    // Isolate both address groups before attaching the final listeners.
    ["", "p"].forEach(isolateSelects);

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
      status.textContent = postcodes.length ? "✅ বর্তমান ও স্থায়ী ঠিকানার ডেটা প্রস্তুত।" : "⚠️ পোস্ট অফিসের ডেটা লোড হয়নি—ইন্টারনেট সংযোগ পরীক্ষা করুন।";
      status.style.display = "block";
    }
    console.info("JORON address selector ready", {divisions: divisions.length, districts: districts.length, upazilas: upazilas.length, areas: areas.length, villages: villages.length, postcodes: postcodes.length});
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