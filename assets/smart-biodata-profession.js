// JORON Smart Biodata — STEP 4: Profession
// Marriage-biodata focused professional information.
(()=>{
  'use strict';
  if(window.__JORON_STEP4_READY) return;
  const form=document.getElementById('form');
  if(!form) return;
  if(form.querySelector('[data-joron-step4]')){window.__JORON_STEP4_READY=true;return;}

  const card=document.createElement('section');
  card.className='card';
  card.dataset.joronStep4='true';
  card.innerHTML=`
    <h2>💼 ৪. পেশাগত তথ্য</h2>
    <div class="sub">আপনার পেশা ও কর্মজীবন সম্পর্কে প্রয়োজনীয় তথ্য দিন।</div>
    <div class="grid">
      <div class="field">
        <label for="profession">পেশা *</label>
        <input id="profession" placeholder="যেমন: শিক্ষক, ব্যবসায়ী, চাকরি" required>
      </div>
      <div class="field">
        <label for="professionType">পেশার ধরন *</label>
        <select id="professionType" required>
          <option value="">নির্বাচন করুন</option>
          <option>চাকরি</option><option>ব্যবসা</option><option>সরকারি চাকরি</option>
          <option>বেসরকারি চাকরি</option><option>পেশাজীবী</option><option>স্বনিযুক্ত</option>
          <option>ফ্রিল্যান্স</option><option>শিক্ষকতা</option><option>অন্যান্য</option>
        </select>
      </div>
      <div class="field">
        <label for="workplace">প্রতিষ্ঠান / কর্মস্থলের নাম</label>
        <input id="workplace" placeholder="প্রতিষ্ঠান বা কর্মস্থলের নাম">
      </div>
      <div class="field">
        <label for="designation">পদবি</label>
        <input id="designation" placeholder="যেমন: Manager / Teacher">
      </div>
      <div class="field full">
        <label for="workAddress">কর্মস্থলের ঠিকানা</label>
        <input id="workAddress" placeholder="কর্মস্থলের ঠিকানা">
      </div>
      <div class="field">
        <label for="monthlyIncome">মাসিক আয়</label>
        <input id="monthlyIncome" inputmode="numeric" placeholder="যেমন: ৩০,০০০ টাকা">
      </div>
      <div class="field">
        <label for="incomePrivacy">আয়ের গোপনীয়তা</label>
        <select id="incomePrivacy">
          <option value="private">মাসিক আয় গোপন রাখুন</option>
          <option value="public">Profile-এ মাসিক আয় দেখান</option>
        </select>
      </div>
      <div class="field">
        <label for="experience">কর্মজীবনের অভিজ্ঞতা</label>
        <input id="experience" placeholder="যেমন: ৫ বছর">
      </div>
      <div class="field">
        <label for="currentlyEmployed">বর্তমানে কর্মরত কি না *</label>
        <select id="currentlyEmployed" required>
          <option value="">নির্বাচন করুন</option>
          <option value="হ্যাঁ">হ্যাঁ</option>
          <option value="না">না</option>
        </select>
      </div>
      <div class="field full">
        <label for="workDetails">কাজের বিস্তারিত</label>
        <textarea id="workDetails" placeholder="আপনার কাজের দায়িত্ব বা পেশাগত কাজের সংক্ষিপ্ত বিবরণ"></textarea>
      </div>
    </div>
  `;

  const style=document.createElement('style');
  style.textContent=`[data-joron-step4] .income-private-note{color:#087b59;font-size:12px;font-weight:800}`;
  document.head.appendChild(style);

  const cards=[...form.querySelectorAll('.card')];
  const step3=cards.find(x=>x.textContent.includes('🎓 ৩. শিক্ষা')) || cards.find(x=>x.dataset.joronStep3);
  const address=cards.find(x=>x.textContent.includes('📍 ২. ঠিকানা'));
  const target=step3 || address;
  if(target) target.insertAdjacentElement('afterend',card); else form.appendChild(card);

  window.__JORON_STEP4_READY=true;
})();
