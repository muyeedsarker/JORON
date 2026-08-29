// JORON Smart Biodata — STEP 6: Lifestyle Information
(()=>{
  'use strict';
  if(window.__JORON_STEP6_READY) return;
  const form=document.getElementById('form');
  if(!form) return;
  const card=document.createElement('section');
  card.className='card'; card.dataset.joronStep6='true';
  card.innerHTML=`
    <h2>🌿 ৬. জীবনযাপন</h2>
    <div class="sub">বিয়ের বায়োডাটার জন্য প্রয়োজনীয় জীবনযাপন সম্পর্কিত তথ্য দিন।</div>
    <div class="grid">
      <div class="field"><label for="smoking">ধূমপান</label><select id="smoking"><option value="">নির্বাচন করুন</option><option>করি না</option><option>করি</option><option>মাঝে মাঝে</option><option>উল্লেখ করতে চাই না</option></select></div>
      <div class="field"><label for="personality">ব্যক্তিত্ব</label><select id="personality"><option value="">নির্বাচন করুন</option><option>শান্ত ও সহজ-সরল</option><option>মিশুক</option><option>দায়িত্বশীল</option><option>পরিবারমুখী</option><option>সৃজনশীল</option><option>অন্যান্য</option></select></div>
      <div class="field full"><label for="about">নিজের সম্পর্কে</label><textarea id="about" placeholder="নিজের স্বভাব, জীবনধারা, পছন্দ বা গুরুত্বপূর্ণ তথ্য সংক্ষেপে লিখুন"></textarea></div>
    </div>`;
  const cards=[...form.querySelectorAll('.card')];
  const step5=cards.find(x=>x.textContent.includes('৫. পারিবারিক তথ্য')) || cards.find(x=>x.dataset.joronStep5);
  const step4=cards.find(x=>x.textContent.includes('৪. পেশাগত তথ্য')) || cards.find(x=>x.dataset.joronStep4);
  const target=step5||step4||cards[0];
  if(target) target.insertAdjacentElement('afterend',card); else form.appendChild(card);
  window.__JORON_STEP6_READY=true;
})();
