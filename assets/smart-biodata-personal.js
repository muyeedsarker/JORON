// JORON Smart Biodata — personal field helpers
// Fixes automatic age calculation and converts height/blood/practice to easy-select fields.
(()=>{
  'use strict';
  const ready=()=>{
    const dob=document.getElementById('dob');
    const age=document.getElementById('age');

    function calcAge(){
      if(!dob || !age || !dob.value){ if(age) age.value=''; return; }
      const birth=new Date(`${dob.value}T00:00:00`);
      if(Number.isNaN(birth.getTime())){ age.value=''; return; }
      const today=new Date();
      let years=today.getFullYear()-birth.getFullYear();
      const birthdayPassed=(today.getMonth()>birth.getMonth()) ||
        (today.getMonth()===birth.getMonth() && today.getDate()>=birth.getDate());
      if(!birthdayPassed) years--;
      age.value=(years>=0 && years<=120)?String(years):'';
    }
    if(dob){ dob.addEventListener('input',calcAge); dob.addEventListener('change',calcAge); calcAge(); }

    const replaceWithSelect=(id, options, placeholder)=>{
      const old=document.getElementById(id);
      if(!old || old.tagName==='SELECT') return old;
      const select=document.createElement('select');
      select.id=id; select.name=old.name||id; select.required=old.required; select.disabled=old.disabled;
      const current=old.value||'';
      const first=document.createElement('option'); first.value=''; first.textContent=placeholder;
      select.appendChild(first);
      options.forEach(value=>{ const o=document.createElement('option'); o.value=value; o.textContent=value; select.appendChild(o); });
      if(current && !options.includes(current)){ const o=document.createElement('option'); o.value=current; o.textContent=current; select.appendChild(o); }
      select.value=current;
      old.replaceWith(select);
      return select;
    };

    replaceWithSelect('height',[
      '৪ ফুট ৬ ইঞ্চি','৪ ফুট ৭ ইঞ্চি','৪ ফুট ৮ ইঞ্চি','৪ ফুট ৯ ইঞ্চি','৪ ফুট ১০ ইঞ্চি','৪ ফুট ১১ ইঞ্চি',
      '৫ ফুট ০ ইঞ্চি','৫ ফুট ১ ইঞ্চি','৫ ফুট ২ ইঞ্চি','৫ ফুট ৩ ইঞ্চি','৫ ফুট ৪ ইঞ্চি','৫ ফুট ৫ ইঞ্চি','৫ ফুট ৬ ইঞ্চি','৫ ফুট ৭ ইঞ্চি','৫ ফুট ৮ ইঞ্চি','৫ ফুট ৯ ইঞ্চি','৫ ফুট ১০ ইঞ্চি','৫ ফুট ১১ ইঞ্চি',
      '৬ ফুট ০ ইঞ্চি','৬ ফুট ১ ইঞ্চি','৬ ফুট ২ ইঞ্চি','৬ ফুট ৩ ইঞ্চি','৬ ফুট ৪ ইঞ্চি','৬ ফুট ৫ ইঞ্চি','৬ ফুট ৬ ইঞ্চি'
    ],'উচ্চতা নির্বাচন করুন');

    replaceWithSelect('blood',['A+','A−','B+','B−','AB+','AB−','O+','O−'],'রক্তের গ্রুপ নির্বাচন করুন');
    replaceWithSelect('practice',['নিয়মিত নামাজ পড়ি','পাঁচ ওয়াক্ত নামাজ পড়ি','মাঝে মাঝে নামাজ পড়ি','রোজা পালন করি','নামাজ ও রোজা নিয়মিত পালন করি','হিজাব/পর্দা মেনে চলি','ধর্মীয় অনুশীলন ব্যক্তিগত রাখতে চাই','অন্যান্য'],'ধর্মীয় অনুশীলন নির্বাচন করুন');
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready,{once:true}); else ready();
})();
