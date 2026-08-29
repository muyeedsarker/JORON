// JORON Smart Biodata — STEP 3: Education + Professional Training
// Adds the marriage-biodata education/training fields without hard-coded personal data.
(()=>{
  'use strict';
  if(window.__JORON_STEP3_READY) return;

  const form=document.getElementById('form');
  if(!form) return;

  const old=form.querySelector('[data-joron-step3]');
  if(old){ window.__JORON_STEP3_READY=true; return; }

  const card=document.createElement('section');
  card.className='card';
  card.dataset.joronStep3='true';
  card.innerHTML=`
    <h2>🎓 ৩. শিক্ষা ও পেশাগত প্রশিক্ষণ</h2>
    <div class="sub">আপনার নিজের শিক্ষাগত যোগ্যতা ও প্রশিক্ষণের তথ্য দিন। কোনো ব্যক্তিগত তথ্য এখানে আগে থেকে দেওয়া নেই।</div>

    <div class="step3-title">🎓 শিক্ষাগত যোগ্যতা</div>
    <div class="grid">
      <div class="field">
        <label for="eduHighest">সর্বোচ্চ শিক্ষাগত যোগ্যতা</label>
        <select id="eduHighest">
          <option value="">নির্বাচন করুন</option>
          <option>মাধ্যমিক (SSC)</option>
          <option>উচ্চ মাধ্যমিক (HSC)</option>
          <option>ডিপ্লোমা</option>
          <option>স্নাতক</option>
          <option>স্নাতকোত্তর</option>
          <option>এমফিল</option>
          <option>পিএইচডি</option>
          <option>অন্যান্য</option>
        </select>
      </div>
      <div class="field">
        <label for="eduDegree">ডিগ্রি / পরীক্ষার নাম</label>
        <input id="eduDegree" placeholder="যেমন: B.A., B.Sc., HSC">
      </div>
      <div class="field">
        <label for="eduInstitution">প্রতিষ্ঠান</label>
        <input id="eduInstitution" placeholder="শিক্ষাপ্রতিষ্ঠানের নাম">
      </div>
      <div class="field">
        <label for="eduSubject">বিষয় / Group</label>
        <input id="eduSubject" placeholder="যেমন: Accounting / Science">
      </div>
      <div class="field">
        <label for="eduYear">পাশের বছর</label>
        <input id="eduYear" inputmode="numeric" maxlength="4" placeholder="যেমন: 2024">
      </div>
      <div class="field">
        <label for="eduResult">ফলাফল / GPA / CGPA</label>
        <input id="eduResult" placeholder="যেমন: GPA 5.00 / CGPA 3.50">
      </div>
    </div>

    <hr class="address-line">

    <div class="step3-title">📜 পেশাগত প্রশিক্ষণ</div>
    <div class="grid">
      <div class="field">
        <label for="trainingName">প্রশিক্ষণের নাম</label>
        <input id="trainingName" placeholder="প্রশিক্ষণের নাম">
      </div>
      <div class="field">
        <label for="trainingInstitution">প্রশিক্ষণ প্রতিষ্ঠান</label>
        <input id="trainingInstitution" placeholder="প্রতিষ্ঠানের নাম">
      </div>
      <div class="field">
        <label for="trainingSubject">বিষয়</label>
        <input id="trainingSubject" placeholder="প্রশিক্ষণের বিষয়">
      </div>
      <div class="field">
        <label for="trainingDuration">মেয়াদ</label>
        <input id="trainingDuration" placeholder="যেমন: ৬ মাস / ১ বছর">
      </div>
      <div class="field">
        <label for="trainingCertificate">সনদ আছে কি না</label>
        <select id="trainingCertificate">
          <option value="">নির্বাচন করুন</option>
          <option value="হ্যাঁ">হ্যাঁ</option>
          <option value="না">না</option>
        </select>
      </div>
    </div>
  `;

  const style=document.createElement('style');
  style.textContent=`
    .step3-title{color:#087b59;font-weight:900;font-size:18px;margin:2px 0 12px}
    [data-joron-step3] .address-line{margin:22px 0}
  `;
  document.head.appendChild(style);

  // Insert after the existing Address section so STEP 3 remains visually ordered.
  const cards=[...form.querySelectorAll('.card')];
  const addressCard=cards.find(x=>x.textContent.includes('📍 ২. ঠিকানা'));
  if(addressCard) addressCard.insertAdjacentElement('afterend',card);
  else form.prepend(card);

  window.__JORON_STEP3_READY=true;
})();
