import { readFileSync } from 'node:fs';

const html = readFileSync('smart-biodata.html', 'utf8');

// Static validation for the current Smart Biodata form.
const requiredIds = [
  'name','nickname','dob','age','gender','height','blood','marital','nationality','language','religion','practice',
  'division','district','upazila','postOffice','postalCode','ward','area','birthPlace',
  'pdivision','pdistrict','pupazila','ppostOffice','ppostalCode','pward','parea','pvillage',
  'eduSystem','education','eduDegree','eduInstitution','eduSubject','eduYear','profession','workplace',
  'designation','experience','about','prefAge','prefDistrict','top3','currentlyEmployed','visibility','addressPrivacy'
];

const hasField = id => new RegExp(`(?:id|name)=["']${id}["']`).test(html);
const missingIds = requiredIds.filter(id => !hasField(id));

console.log(`Smart Biodata: ${html.length} bytes`);

if (missingIds.length) {
  console.error(`Missing Smart Biodata field IDs: ${missingIds.join(', ')}`);
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

if (!html.includes('smart-biodata-firebase-legacy.js')) {
  console.error('Missing Smart Biodata Firebase integration script.');
  process.exit(1);
}

if (!html.includes('বর্তমান ঠিকানা') || !html.includes('স্থায়ী ঠিকানা')) {
  console.error('Current and permanent address sections are required.');
  process.exit(1);
}

console.log('Static Smart Biodata structure check: PASS');
