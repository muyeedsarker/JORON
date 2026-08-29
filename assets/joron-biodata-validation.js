/* JORON Smart Biodata — validation UX only; Firebase save logic remains in page. */
(() => {
  const form = document.getElementById('form');
  if (!form) return;
  const notice = document.getElementById('notice');
  const submit = form.querySelector('button[type="submit"]');
  const dob = document.getElementById('dob');
  const age = document.getElementById('age');
  const required = [...form.querySelectorAll('[required]')];

  const mark = (el) => {
    if (!el) return;
    const field = el.closest('.field');
    if (!field) return;
    field.classList.toggle('has-error', !el.checkValidity());
    field.classList.toggle('has-value', !!String(el.value || '').trim());
  };

  required.forEach(el => {
    el.addEventListener('input', () => mark(el));
    el.addEventListener('change', () => mark(el));
    mark(el);
  });

  if (dob && age) {
    const updateAgeLimit = () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dob.max = `${yyyy}-${mm}-${dd}`;
      if (dob.value && dob.value > dob.max) {
        dob.setCustomValidity('ভবিষ্যতের জন্মতারিখ দেওয়া যাবে না।');
      } else {
        dob.setCustomValidity('');
      }
    };
    dob.addEventListener('change', updateAgeLimit);
    updateAgeLimit();
  }

  form.addEventListener('submit', e => {
    required.forEach(mark);
    if (!form.checkValidity()) {
      e.preventDefault();
      const first = required.find(el => !el.checkValidity());
      if (first) {
        first.focus();
        first.scrollIntoView({behavior:'smooth', block:'center'});
      }
      if (notice) notice.textContent = '⚠️ অনুগ্রহ করে লাল চিহ্নিত প্রয়োজনীয় তথ্যগুলো ঠিক করুন।';
      return;
    }
    if (submit) {
      submit.disabled = true;
      submit.dataset.originalText = submit.textContent;
      submit.textContent = '⏳ সংরক্ষণ হচ্ছে...';
    }
    if (notice) notice.textContent = '⏳ আপনার Biodata নিরাপদে সংরক্ষণ করা হচ্ছে...';
  }, true);
})();
