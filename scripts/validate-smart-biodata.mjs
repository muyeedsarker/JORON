import { readFileSync, readdirSync } from 'node:fs';

const html = readFileSync('smart-biodata.html', 'utf8');
const requiredIds = [
  'name','nickname','dob','age','gender','height','blood','marital','nationality','language','religion','practice',
  'division','district','upazila','postOffice','postalCode','area','addressPrivacy','pdistrict','ppostalCode',
  'eduSystem','education','profession','workplace','designation','workAddress','monthlyIncome','incomePrivacy',
  'experience','currentlyEmployed','workDetails','fatherName','fatherProfession','motherName','motherProfession',
  'siblingsBrothers','siblingsSisters','familyType','childCount','familyValues','familyDescription',
  'smoking','personality','about','prefAge','prefDistrict','top3','photoUrl','visibility'
];

const missingIds = requiredIds.filter(id => !new RegExp(`(?:id|name)=["']${id}["']`).test(html));

const scriptFiles = readdirSync('assets').filter(name => /^smart-biodata-.*\.js$/.test(name));
const referencedScripts = [...html.matchAll(/(?:src|import)=["']([^"']*smart-biodata-[^"']+\.js)["']/g)].map(m => m[1]);

console.log(`Smart Biodata: ${html.length} bytes`);
console.log(`STEP scripts found in assets/: ${scriptFiles.join(', ') || 'none'}`);
console.log(`STEP scripts referenced directly by HTML: ${referencedScripts.join(', ') || 'none'}`);

if (missingIds.length) {
  console.error(`Missing required field IDs: ${missingIds.join(', ')}`);
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

console.log('Static Smart Biodata structure check: PASS');
