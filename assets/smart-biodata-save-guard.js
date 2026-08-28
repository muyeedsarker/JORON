// JORON Smart Biodata — required-address save guard
// Prevents the Firebase submit handler from running until required address fields are complete.
(() => {
  'use strict';
  const requiredAddress = [
    ['pdivision', 'স্থায়ী ঠিকানার বিভাগ'],
    ['pdistrict', 'স্থায়ী ঠিকানার জেলা'],
    ['pupazila', 'স্থায়ী ঠিকানার উপজেলা / থানা'],
    ['ppostOffice', 'স্থায়ী ঠিকানার Post Office'],
    ['ppostalCode', 'স্থায়ী ঠিকানার Postal Code'],
    ['division', 'বর্তমান ঠিকানার বিভাগ'],
    ['district', 'বর্তমান ঠিকানার জেলা'],
    ['upazila', 'বর্তমান ঠিকানার উপজেলা / থানা'],
    ['postOffice', 'বর্তমান ঠিকানার Post Office'],
    ['postalCode', 'বর্তমান ঠিকানার Postal Code']
  ];

  function show(message, id) {
    const el = document.getElementById(id);
    if (el) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const notice = document.getElementById('notice');
    if (notice) {
      notice.textContent = '⚠️ ' + message;
      notice.style.display = 'block';
      notice.style.background = '#fff4e8';
      notice.style.borderColor = '#ffd3a8';
      notice.style.color = '#9a4b00';
    }
    alert(message);
  }

  function validateAddress() {
    for (const [id, label] of requiredAddress) {
      const el = document.getElementById(id);
      if (!el || !String(el.value || '').trim()) {
        show(`${label} সম্পূর্ণ নির্বাচন করুন।`, id);
        return false;
      }
    }
    return true;
  }

  function install() {
    const form = document.getElementById('form');
    if (!form || form.__joronSaveGuardInstalled) return;
    form.__joronSaveGuardInstalled = true;

    // Stop the submit before the legacy Firebase submit handler can execute.
    form.addEventListener('submit', event => {
      if (!validateAddress()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
