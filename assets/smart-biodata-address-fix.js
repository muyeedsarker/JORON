// JORON Smart Biodata — stable dependent address system
// Permanent + Present: Division -> District -> Upazila/Thana -> Post Office -> Union/Paurashava
// Uses a single nested Bangladesh geography dataset so parent/child IDs cannot drift.

const JORON_GEO_URL = "https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json";
const JORON_POST_URL = "https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json";

const $ = id => document.getElementById(id);
let geo = [];
let posts = [];
let ready = false;

function status(text, error = false) {
  const box = $("locationStatus");
  if (!box) return;
  box.textContent = text;
  box.style.display = "block";
  box.style.color = error ? "#a80000" : "#087b59";
}

function reset(el, placeholder) {
  if (!el) return;
  el.replaceChildren(new Option(placeholder, ""));
  el.value = "";
  el.disabled = true;
}

function fill(el, rows, placeholder, labelFn = r => r.bn_name || r.name || r.title) {
  if (!el) return;
  el.replaceChildren(new Option(placeholder, ""));
  const seen = new Set();
  (rows || []).forEach(row => {
    const label = String(labelFn(row) || "").trim();
    if (!label || seen.has(label)) return;
    seen.add(label);
    const value = row.id ?? row.value ?? row.name ?? label;
    el.add(new Option(label, String(value)));
  });
  el.disabled = seen.size === 0;
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[().,\-_/]/g, " ")
    .replace(/\b(upazila|upo|sadar|thana)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function postLabel(row) {
  const office = row.postOffice || row.postoffice || row.suboffice || "";
  const code = row.postCode || row.postcode || "";
  return code ? `${office} — ${code}` : office;
}

function postsForUpazila(upazilaName, districtId) {
  const target = normalize(upazilaName);
  return posts.filter(p => {
    if (districtId && p.district_id && String(p.district_id) !== String(districtId)) return false;
    const names = [p.upazila, p.thana, p.upazila_name].filter(Boolean).map(normalize);
    return names.some(n => n === target || n.includes(target) || target.includes(n));
  });
}

function setup(prefix) {
  const p = prefix ? "p" : "";
  const division = $(p + "division");
  const district = $(p + "district");
  const upazila = $(p + "upazila");
  const post = $(p + "postOffice");
  const area = $(p + "area");
  if (!division || !district || !upazila || !area) return;

  const label = prefix ? "Permanent" : "Present";
  const divPlaceholder = `${label} বিভাগ নির্বাচন করুন`;
  const districtPlaceholder = `${label} জেলা নির্বাচন করুন`;
  const upPlaceholder = `${label} উপজেলা / থানা নির্বাচন করুন`;
  const postPlaceholder = `${label} পোস্ট অফিস নির্বাচন করুন`;
  const areaPlaceholder = `${label} ইউনিয়ন / পৌরসভা / ওয়ার্ড নির্বাচন করুন`;

  division.addEventListener("change", () => {
    reset(district, districtPlaceholder);
    reset(upazila, upPlaceholder);
    reset(post, postPlaceholder);
    reset(area, areaPlaceholder);
    const d = geo.find(x => String(x.name) === String(division.value) || String(x.bn_name) === String(division.value));
    fill(district, d?.districts || [], districtPlaceholder);
  });

  district.addEventListener("change", () => {
    reset(upazila, upPlaceholder);
    reset(post, postPlaceholder);
    reset(area, areaPlaceholder);
    const d = geo.flatMap(x => x.districts || []).find(x => String(x.name) === String(district.value) || String(x.bn_name) === String(district.value));
    fill(upazila, d?.upazilas || [], upPlaceholder);
  });

  upazila.addEventListener("change", () => {
    reset(post, postPlaceholder);
    reset(area, areaPlaceholder);
    const d = geo.flatMap(x => x.districts || []).find(x => String(x.name) === String(district.value) || String(x.bn_name) === String(district.value));
    const u = (d?.upazilas || []).find(x => String(x.name) === String(upazila.value) || String(x.bn_name) === String(upazila.value));
    if (!u) return;

    // Area selector contains both rural unions and municipal areas so city addresses are not lost.
    const areas = [
      ...(u.unions || []).map(x => ({ ...x, _type: "ইউনিয়ন" })),
      ...(u.pourashavas || []).map(x => ({ ...x, _type: "পৌরসভা" }))
    ];
    fill(area, areas, areaPlaceholder, x => `${x.bn_name || x.name} — ${x._type}`);

    const districtId = d?.id;
    const matches = postsForUpazila(u.name, districtId);
    fill(post, matches, postPlaceholder, postLabel);
    if (!matches.length) post.firstChild.textContent = `${label} পোস্ট অফিস পাওয়া যায়নি`;
  });
}

async function init() {
  try {
    status("📍 Bangladesh address data লোড হচ্ছে...");

    const [geoRes, postRes] = await Promise.all([
      fetch(JORON_GEO_URL, { cache: "no-store" }),
      fetch(JORON_POST_URL, { cache: "no-store" })
    ]);

    if (!geoRes.ok) throw new Error(`Geo data HTTP ${geoRes.status}`);
    geo = await geoRes.json();

    if (postRes.ok) {
      const postJson = await postRes.json();
      posts = Array.isArray(postJson) ? postJson : (postJson.postcodes || []);
    } else {
      posts = [];
      console.warn("Postcode dataset unavailable:", postRes.status);
    }

    fill($("pdivision"), geo, "Permanent বিভাগ নির্বাচন করুন");
    fill($("division"), geo, "Present বিভাগ নির্বাচন করুন");

    ["pdistrict","pupazila","ppostOffice","parea","district","upazila","postOffice","area"].forEach(id => {
      const el = $(id);
      if (el) el.disabled = true;
    });

    setup(true);
    setup(false);
    ready = true;
    status(`✅ সম্পূর্ণ dependent Address ready — ${geo.length} বিভাগ`);
  } catch (error) {
    console.error("JORON Address error:", error);
    status("⚠️ Address data লোড হয়নি। Internet connection পরীক্ষা করে Refresh করুন।", true);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
