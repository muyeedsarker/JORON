// JORON Smart Biodata field enhancements. Address fields are intentionally untouched.
(function(){
  const professionOptions=['চাকরিজীবী (সরকারি)','চাকরিজীবী (বেসরকারি)','ব্যবসায়ী','ডাক্তার','ইঞ্জিনিয়ার','শিক্ষক','আইনজীবী','প্রবাসী','ফ্রিল্যান্সার','ছাত্র/ছাত্রী'];
  const languageOptions=['বাংলা','ইংরেজি','আরবি','উর্দু','হিন্দি','বাংলা ও ইংরেজি','অন্যান্য'];
  const religionOptions=['ইসলাম','হিন্দু','খ্রিস্টান','বৌদ্ধ','অন্যান্য'];
  const educationOptions=['এসএসসি','এইচএসসি','স্নাতক','স্নাতকোত্তর','দাওরায়ে হাদিস','পিএইচডি','অন্যান্য'];
  function datalist(id,items){
    let dl=document.getElementById(id); if(!dl){dl=document.createElement('datalist');dl.id=id;document.body.appendChild(dl)}
    dl.innerHTML=items.map(v=>`<option value="${v.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}">`).join(''); return dl.id;
  }
  function makeSelect(el,items,placeholder){
    if(!el)return; const current=el.value;
    el.innerHTML=`<option value="">${placeholder}</option>`+items.map(v=>`<option value="${v}">${v}</option>`).join('');
    if(items.includes(current))el.value=current;
  }
  function enhance(){
    const profession=document.getElementById('profession');
    if(profession){profession.setAttribute('list','profession-list'); datalist('profession-list',professionOptions); profession.placeholder='পেশা লিখুন';}
    const language=document.getElementById('language');
    if(language){language.setAttribute('list','language-list'); datalist('language-list',languageOptions); language.placeholder='ভাষা লিখুন';}
    makeSelect(document.getElementById('religion'),religionOptions,'ধর্ম নির্বাচন করুন');
    const education=document.getElementById('education');
    if(education){education.setAttribute('list','education-list'); datalist('education-list',educationOptions); education.placeholder='সর্বোচ্চ যোগ্যতা লিখুন';}
    const nationality=document.getElementById('nationality');
    if(nationality && nationality.tagName==='SELECT'){
      const old=nationality.value||'বাংলাদেশী';
      makeSelect(nationality,['বাংলাদেশী','প্রবাসী বাংলাদেশী','অন্যান্য'],'জাতীয়তা নির্বাচন করুন'); nationality.value=old;
    }
  }
  document.addEventListener('DOMContentLoaded',enhance);
})();
