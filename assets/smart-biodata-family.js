// JORON Smart Biodata — STEP 5: Family Information
// Marriage-biodata focused family information.
(()=>{
  'use strict';
  if(window.__JORON_STEP5_READY) return;
  const form=document.getElementById('form');
  if(!form) return;
  if(form.querySelector('[data-joron-step5]')){window.__JORON_STEP5_READY=true;return;}

  const card=document.createElement('section');
  card.className='card';
  card.dataset.joronStep5='true';
  card.innerHTML=`
    <h2>👨‍👩‍👧‍👦 ৫. পারিবারিক তথ্য</h2>
    <div class="sub">বিয়ের বায়োডাটার জন্য প্রয়োজনীয় পারিবারিক তথ্য দিন। সংবেদনশীল তথ্য Public Profile-এ প্রকাশ করা হবে না।</div>
    <div class="grid">
      <div class="field">
        <label for="fatherName">পিতার নাম</label>
        <input id="fatherName" placeholder="পিতার নাম">
      </div>
      <div class="field">
        <label for="fatherProfession">পিতার পেশা</label>
        <input id="fatherProfession" placeholder="পিতার পেশা">
      </div>
      <div class="field">
        <label for="motherName">মাতার নাম</label>
        <input id="motherName" placeholder="মাতার নাম">
      </div>
      <div class="field">
        <label for="motherProfession">মাতার পেশা</label>
        <input id="motherProfession" placeholder="মাতার পেশা">
      </div>
      <div class="field">
        <label for="siblingsBrothers">ভাই সংখ্যা</label>
        <input id="siblingsBrothers" type="number" min="0" inputmode="numeric" placeholder="যেমন: ২">
      </div>
      <div class="field">
        <label for="siblingsSisters">বোন সংখ্যা</label>
        <input id="siblingsSisters" type="number" min="0" inputmode="numeric" placeholder="যেমন: ১">
      </div>
      <div class="field">
        <label for="familyType">পরিবারের ধরন *</label>
        <select id="familyType" required>
          <option value="">নির্বাচন করুন</option>
          <option>ছোট পরিবার</option>
          <option>যৌথ পরিবার</option>
          <option>বর্ধিত পরিবার</option>
          <option>উল্লেখ করতে চাই না</option>
        </select>
      </div>
      <div class="field">
        <label for="childCount">সন্তান সংখ্যা</label>
        <input id="childCount" type="number" min="0" inputmode="numeric" placeholder="প্রযোজ্য হলে">
      </div>
      <div class="field full">
        <label for="familyValues">পারিবারিক মূল্যবোধ</label>
        <textarea id="familyValues" placeholder="পরিবারের মূল্যবোধ, পারস্পরিক সম্মান, শিক্ষা বা অন্যান্য গুরুত্বপূর্ণ বিষয়"></textarea>
      </div>
      <div class="field full">
        <label for="familyDescription">পরিবারের সংক্ষিপ্ত বিবরণ</label>
        <textarea id="familyDescription" placeholder="পরিবার সম্পর্কে সংক্ষিপ্ত ও প্রয়োজনীয় তথ্য"></textarea>
      </div>
    </div>
  `;

  const cards=[...form.querySelectorAll('.card')];
  const step4=cards.find(x=>x.textContent.includes('💼 ৪. পেশাগত তথ্য')) || cards.find(x=>x.dataset.joronStep4);
  const step3=cards.find(x=>x.textContent.includes('🎓 ৩. শিক্ষা')) || cards.find(x=>x.dataset.joronStep3);
  const target=step4 || step3 || cards[0];
  if(target) target.insertAdjacentElement('afterend',card); else form.appendChild(card);

  window.__JORON_STEP5_READY=true;
})();
