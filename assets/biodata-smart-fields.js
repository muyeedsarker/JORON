// JORON Smart Biodata fields + Bangladesh address cascading dropdowns.
// Address reference data: ifahimreza/bangladesh-geojson.
(function(){
  'use strict';
  const professionOptions=['চাকরিজীবী (সরকারি)','চাকরিজীবী (বেসরকারি)','ব্যবসায়ী','ডাক্তার','ইঞ্জিনিয়ার','শিক্ষক','আইনজীবী','প্রবাসী','ফ্রিল্যান্সার','ছাত্র/ছাত্রী'];
  const languageOptions=['বাংলা','ইংরেজি','আরবি','উর্দু','হিন্দি','বাংলা ও ইংরেজি','অন্যান্য'];
  const religionOptions=['ইসলাম','হিন্দু','খ্রিস্টান','বৌদ্ধ','অন্যান্য'];
  const educationOptions=['এসএসসি','এইচএসসি','স্নাতক','স্নাতকোত্তর','দাওরায়ে হাদিস','পিএইচডি','অন্যান্য'];
  const heightOptions=['৪′ ৬″','৪′ ৭″','৪′ ৮″','৪′ ৯″','৪′ ১০″','৪′ ১১″','৫′ ০″','৫′ ১″','৫′ ২″','৫′ ৩″','৫′ ৪″','৫′ ৫″','৫′ ৬″','৫′ ৭″','৫′ ৮″','৫′ ৯″','৫′ ১০″','৫′ ১১″','৬′ ০″','৬′ ১″','৬′ ২″','৬′ ৩″','৬′ ৪″','৬′ ৫″','৬′ ৬″'];
  const bloodOptions=['A+','A−','B+','B−','AB+','AB−','O+','O−'];
  const GEO='https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/';
  const IDS={current:{division:'division',district:'district',upazila:'upazila',post:'postOffice',code:'postalCode'},permanent:{division:'pdivision',district:'pdistrict',upazila:'pupazila',post:'ppostOffice',code:'ppostalCode'}};

  function datalist(id,items){let dl=document.getElementById(id);if(!dl){dl=document.createElement('datalist');dl.id=id;document.body.appendChild(dl)}dl.innerHTML=items.map(v=>`<option value="${String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}">`).join('');return dl.id}
  function makeSelect(el,items,placeholder){if(!el)return;const current=el.value;el.innerHTML=`<option value="">${placeholder}</option>`+items.map(v=>`<option value="${v}">${v}</option>`).join('');if(items.includes(current))el.value=current}
  function enhance(){
    const profession=document.getElementById('profession');if(profession){profession.setAttribute('list','profession-list');datalist('profession-list',professionOptions);profession.placeholder='পেশা লিখুন'}
    const language=document.getElementById('language');if(language){language.setAttribute('list','language-list');datalist('language-list',languageOptions);language.placeholder='ভাষা লিখুন'}
    makeSelect(document.getElementById('religion'),religionOptions,'ধর্ম নির্বাচন করুন');
    const education=document.getElementById('education');if(education){education.setAttribute('list','education-list');datalist('education-list',educationOptions);education.placeholder='সর্বোচ্চ যোগ্যতা লিখুন'}
    makeSelect(document.getElementById('height'),heightOptions,'উচ্চতা নির্বাচন করুন');
    makeSelect(document.getElementById('bloodGroup'),bloodOptions,'রক্তের গ্রুপ নির্বাচন করুন');
  }
  function setOptions(el,items,placeholder,label,value){if(!el)return;el.innerHTML=`<option value="">${placeholder}</option>`;items.forEach(x=>{const o=document.createElement('option');o.value=value(x);o.textContent=label(x);el.appendChild(o)})}
  async function loadGeo(){
    const urls=['bd-divisions.json','bd-districts.json','bd-upazilas.json','bd-postcodes.json'];
    const r=await Promise.all(urls.map(x=>fetch(GEO+x,{cache:'no-cache'}).then(v=>{if(!v.ok)throw new Error(x+' '+v.status);return v.json()})));
    return {divisions:r[0].divisions||[],districts:r[1].districts||[],upazilas:r[2].upazilas||[],postcodes:r[3].postcodes||[]};
  }
  function initAddress(block,data){
    const d=document.getElementById(block.division),dist=document.getElementById(block.district),up=document.getElementById(block.upazila),post=document.getElementById(block.post),code=document.getElementById(block.code);if(!d||!dist||!up||!post||!code)return;
    const districtsFor=id=>data.districts.filter(x=>String(x.division_id)===String(id));
    const upazilasFor=id=>data.upazilas.filter(x=>String(x.district_id)===String(id));
    const postsFor=(districtId,upName)=>data.postcodes.filter(x=>String(x.district_id)===String(districtId)&&(!upName||String(x.upazila).trim()===String(upName).trim()));
    setOptions(d,data.divisions,'বিভাগ নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.id);
    setOptions(dist,[],'জেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.id);setOptions(up,[],'থানা / উপজেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.bn_name||x.name);setOptions(post,[],'পোস্ট অফিস নির্বাচন করুন',x=>x.postOffice,x=>x.postOffice);dist.disabled=true;up.disabled=true;post.disabled=true;
    d.addEventListener('change',()=>{const rows=districtsFor(d.value);setOptions(dist,rows,'জেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.id);dist.disabled=!rows.length;setOptions(up,[],'থানা / উপজেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.bn_name||x.name);setOptions(post,[],'পোস্ট অফিস নির্বাচন করুন',x=>x.postOffice,x=>x.postOffice);up.disabled=true;post.disabled=true;code.value=''});
    dist.addEventListener('change',()=>{const rows=upazilasFor(dist.value);setOptions(up,rows,'থানা / উপজেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.bn_name||x.name);up.disabled=!rows.length;setOptions(post,[],'পোস্ট অফিস নির্বাচন করুন',x=>x.postOffice,x=>x.postOffice);post.disabled=true;code.value=''});
    up.addEventListener('change',()=>{const rows=postsFor(dist.value,up.value);setOptions(post,rows,'পোস্ট অফিস নির্বাচন করুন',x=>x.postOffice,x=>x.postOffice);post.disabled=!rows.length;code.value='';code.placeholder=rows.length?'Postal Code অটো পূরণ হবে':'Postal Code লিখুন'});
    post.addEventListener('change',()=>{const row=data.postcodes.find(x=>String(x.district_id)===String(dist.value)&&String(x.postOffice).trim()===String(post.value).trim()&&String(x.upazila).trim()===String(up.value).trim())||data.postcodes.find(x=>String(x.district_id)===String(dist.value)&&String(x.postOffice).trim()===String(post.value).trim());if(row)code.value=row.postCode||''});
  }

  function ensureHidden(id,value){
    if(value===undefined||value===null||value==='')return;
    const form=document.getElementById('form');if(!form)return;
    let e=document.getElementById(id);if(!e){e=document.createElement('input');e.type='hidden';e.id=id;e.name=id;form.appendChild(e)}
    e.value=String(value);
  }

  function syncOnboarding(data){
    try{
      const raw=localStorage.getItem('joronOnboarding');if(!raw)return;
      const o=JSON.parse(raw)||{};
      const names={bn:'বাংলা',en:'ইংরেজি',hi:'হিন্দি',ur:'উর্দু',ar:'আরবি',ms:'মালয়',it:'ইতালীয়',de:'জার্মান',fr:'ফরাসি',ja:'জাপানি',ko:'কোরিয়ান'};
      const countryNames={BD:'বাংলাদেশি',IN:'ভারতীয়',PK:'পাকিস্তানি',SA:'সৌদি আরবের',AE:'সংযুক্ত আরব আমিরাতের',MY:'মালয়েশীয়',SG:'সিঙ্গাপুরের',GB:'ব্রিটিশ',US:'আমেরিকান',CA:'কানাডিয়ান',AU:'অস্ট্রেলিয়ান',IT:'ইতালীয়',DE:'জার্মান',FR:'ফরাসি',JP:'জাপানি',KR:'দক্ষিণ কোরীয়',QA:'কাতারি',KW:'কুয়েতি',OM:'ওমানি'};
      const setIfBlank=(id,value)=>{const e=document.getElementById(id);if(e&&value!==undefined&&value!==null&&value!==''&&!e.value)e.value=String(value)};
      setIfBlank('gender',o.gender);
      setIfBlank('marital',o.marital);
      setIfBlank('religion',o.religion);
      setIfBlank('language',names[o.language]||o.language);
      setIfBlank('nationality',countryNames[o.country]);
      ensureHidden('country',o.country);ensureHidden('profileFor',o.profileFor);ensureHidden('community',o.community);ensureHidden('partnerGender',o.partnerGender||(o.gender==='পুরুষ'?'নারী':o.gender==='নারী'?'পুরুষ':''));
      ensureHidden('motherTongue',names[o.motherTongue]||o.motherTongue);
      const d=document.getElementById('division'),dist=document.getElementById('district');
      if(d&&!d.value&&o.division){const match=data.divisions.find(x=>(x.bn_name||x.name)===o.division);if(match){d.value=match.id;d.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(()=>{if(dist&&!dist.value&&o.district){const row=data.districts.find(x=>String(x.division_id)===String(match.id)&&(x.bn_name||x.name)===o.district);if(row){dist.value=row.id;dist.dispatchEvent(new Event('change',{bubbles:true}))}}},50)}}
    }catch(e){console.warn('JORON onboarding sync',e)}
  }

  async function start(){
    enhance();
    try{
      const data=await loadGeo();
      initAddress(IDS.current,data);initAddress(IDS.permanent,data);window.JORON_GEO_DATA=data;
      syncOnboarding(data);
      document.dispatchEvent(new CustomEvent('joron-address-ready'));
    }catch(e){console.error('JORON address data failed',e)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
