import { readFileSync, readdirSync } from 'node:fs';

const html = readFileSync('smart-biodata.html', 'utf8');

// Validate the fields that are part of the current Smart Biodata form.
// This is a static test only; it does not change the application or data model.
const requiredIds = [
  'name','nickname','dob','age','gender','height','blood','marital','nationality','language','religion','practice',
  'division','district','upazila','city',
  'educationSystem','education','institution','subject','profession','workplace',
  'about','partner'
];

const hasField = id => new RegExp(`(?:id|name)=["']${id}["']`).test(html);
const missingIds = requiredIds.filter(id => !hasField(id));

const scriptFiles = readdirSync('assets').filter(name => /^smart-biodata-.*\\.js$/.test(name));
const referencedScripts = [...html.matchAll(/(?:src|import)=["']([^"']*smart-biodata-[^"']+\\.js)["']/g)].map(m => m[1]);

console.log(`Smart Biodata: ${html.length} bytes`);
console.log(`STEP scripts found in assets/: ${scriptFiles.join(', ') || 'none'}`);
console.log(`STEP scripts referenced directly by HTML: ${referencedScripts.join(', ') || 'none'}`);

if (missingIds.length) {
  console.error(`Missing current form field IDs: ${missingIds.join(', ')}`);
  process.exit(1);
}

if (!html.includes('id="form"')) {
  console.error('Missing main Smart Biodata form (#form).');
  process.exit(1);
}

if (!html.includes('id="notice"')) {
  console.error('Missing save/status notice (#notice).');
  process.exit(1);
}

if (!html.includes("setDoc(doc(db,'biodata',user.uid)")) {
  console.error('Missing existing Biodata save call.');
  process.exit(1);
}

console.log('Static Smart Biodata structure check: PASS');
