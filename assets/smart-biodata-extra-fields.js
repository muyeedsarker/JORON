// JORON Smart Biodata — additional fields from the approved biodata reference.
// Injected before the existing form controls so the current Save/Edit flow can
// collect and restore these values without replacing the existing page.
(()=>{
  'use strict';
  const form=document.getElementById('form');
  if(!form || document.getElementById('joron-extra-fields')) return;
  const section=document.createElement('section');
  section.id='joron-extra-fields';
  section.className='card';
  section.innerHTML=`
    <h2>✨ অতিরিক্ত তথ্য</h2>
    <p class="hint">আপনার সম্পর্কে আরও কিছু তথ্য দিন। যেগুলো ঐচ্ছিক, না দিলেও Biodata Save হবে।</p>
    <div class="grid">
      <div class="field"><label>গায়ের রং<select id="complexion"><option value="">নির্বাচন করুন</option><option>উজ্জ্বল ফর্সা</option><option>ফর্সা</option><option>শ্যামলা</option><option>উজ্জ্বল শ্যামলা</option><option>মাঝারি</option><option>অন্যান্য</option></select></label></div>
      <div class="field"><label>শখ / আগ্রহ<input id="hobbies" placeholder="যেমন: বই পড়া, ভ্রমণ, সমাজসেবা"></label></div>
      <div class="field"><label>অভিভাবকের অনুমতি আছে কি?<select id="guardianPermission"><option value="">নির্বাচন করুন</option><option value="হ্যাঁ">হ্যাঁ</option><option value="না">না</option></select></label></div>
      <div class="field"><label>অভিভাবকের নম্বর <span class="hint">(ঐচ্ছিক)</span><input id="guardianPhone" type="tel" inputmode="tel" placeholder="+৮৮০... (না দিলেও সমস্যা নেই)"></label></div>
    </div>`;
  const actions=form.querySelector('.actions');
  if(actions) form.insertBefore(section,actions); else form.appendChild(section);
})();
