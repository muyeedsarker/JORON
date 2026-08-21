/* JORON Smart Biodata — Select-only data configuration
   Step 1–3: no free-text typing for selectable profile data. */
window.JORON_BIODATA_SELECTS = {
  height: Array.from({length: 25}, (_, i) => `${4 + Math.floor(i/12)}'${(i%12)*1/2===0 ? '' : ''}`),
  educationSystem: ['সাধারণ শিক্ষা','মাদরাসা শিক্ষা','কারিগরি শিক্ষা','ভোকেশনাল','মেডিকেল','ইঞ্জিনিয়ারিং','কৃষি','অন্যান্য'],
  qualification: ['SSC','HSC','Diploma','Bachelor','Masters','Doctorate','আলিম','ফাজিল','কামিল','অন্যান্য'],
  subject: ['বিজ্ঞান','মানবিক','ব্যবসায় শিক্ষা','আইটি / কম্পিউটার','মেডিকেল','ইঞ্জিনিয়ারিং','আইন','শিক্ষা','কৃষি','অন্যান্য'],
  passYear: Array.from({length: 86}, (_, i) => String(2026 - i)),
  certification: ['নেই','Professional Certification','Diploma','Short Course','অন্যান্য'],
  islamicEducation: ['প্রযোজ্য নয়','মৌলিক','মাঝারি','উচ্চতর']
};
