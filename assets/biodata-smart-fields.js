// JORON Smart Biodata fields + Bangladesh address cascading dropdowns.
// Address data source: ifahimreza/bangladesh-geojson (division/district/upazila/postcode reference data).
(function(){
  'use strict';

  const professionOptions=['চাকরিজীবী (সরকারি)','চাকরিজীবী (বেসরকারি)','ব্যবসায়ী','ডাক্তার','ইঞ্জিনিয়ার','শিক্ষক','আইনজীবী','প্রবাসী','ফ্রিল্যান্সার','ছাত্র/ছাত্রী'];
  const languageOptions=['বাংলা','ইংরেজি','আরবি','উর্দু','হিন্দি','বাংলা ও ইংরেজি','অন্যান্য'];
  const religionOptions=['ইসলাম','হিন্দু','খ্রিস্টান','বৌদ্ধ','অন্যান্য'];
  const educationOptions=['এসএসসি','এইচএসসি','স্নাতক','স্নাতকোত্তর','দাওরায়ে হাদিস','পিএইচডি','অন্যান্য'];

  const GEO='https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/';
  const IDS={
    current:{division:'division',district:'district',upazila:'upazila',post:'postOffice',code:'postalCode',ward:'ward',area:'area'},
    permanent:{division:'pdivision',district:'pdistrict',upazila:'pupazila',post:'ppostOffice',code:'ppostalCode',ward:'pward',area:'parea'}
  };

  function datalist(id,items){
    let dl=document.getElementById(id);
    if(!dl){dl=document.createElement('datalist');dl.id=id;document.body.appendChild(dl)}
    dl.innerHTML=items.map(v=>`<option value="${String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}">`).join('');
    return dl.id;
  }

  function makeSelect(el,items,placeholder){
    if(!el)return;
    const current=el.value;
    el.innerHTML=`<option value="">${placeholder}</option>`+items.map(v=>`<option value="${v}">${v}</option>`).join('');
    if(items.includes(current))el.value=current;
  }

  function enhance(){
    const profession=document.getElementById('profession');
    if(profession){profession.setAttribute('list','profession-list');datalist('profession-list',professionOptions);profession.placeholder='পেশা লিখুন';}
    const language=document.getElementById('language');
    if(language){language.setAttribute('list','language-list');datalist('language-list',languageOptions);language.placeholder='ভাষা লিখুন';}
    makeSelect(document.getElementById('religion'),religionOptions,'ধর্ম নির্বাচন করুন');
    const education=document.getElementById('education');
    if(education){education.setAttribute('list','education-list');datalist('education-list',educationOptions);education.placeholder='সর্বোচ্চ যোগ্যতা লিখুন';}
  }

  function setOptions(el,items,placeholder,getLabel,getValue){
    if(!el)return;
    const old=el.value;
    el.innerHTML=`<option value="">${placeholder}</option>`;
    items.forEach(item=>{
      const o=document.createElement('option');
      o.value=getValue(item); o.textContent=getLabel(item); el.appendChild(o);
    });
    if(items.some(x=>String(getValue(x))===String(old)))el.value=old;
  }

  async function loadGeo(){
    const [dv,ds,up,pc]=await Promise.all([
      fetch(GEO+'bd-divisions.json').then(r=>r.json()),
      fetch(GEO+'bd-districts.json').then(r=>r.json()),
      fetch(GEO+'bd-upazilas.json').then(r=>r.json()),
      fetch(GEO+'bd-postcodes.json').then(r=>r.json())
    ]);
    return {
      divisions:dv.divisions||[], districts:ds.districts||[], upazilas:up.upazilas||[], postcodes:pc.postcodes||[]
    };
  }

  function initAddress(block,data){
    const d=document.getElementById(block.division), dist=document.getElementById(block.district), up=document.getElementById(block.upazila), post=document.getElementById(block.post), code=document.getElementById(block.code);
    if(!d||!dist||!up||!post||!code)return;

    const districtsFor=divisionId=>data.districts.filter(x=>String(x.division_id)===String(divisionId));
    const upazilasFor=districtId=>data.upazilas.filter(x=>String(x.district_id)===String(districtId));
    const postsFor=(districtId,upazilaName)=>data.postcodes.filter(x=>String(x.district_id)===String(districtId) && (!upazilaName || String(x.upazila).trim()===String(upazilaName).trim()));

    setOptions(d,data.divisions,'বিভাগ নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.id);
    setOptions(dist,[], 'জেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.id); dist.disabled=true;
    setOptions(up,[], 'থানা / উপজেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.bn_name||x.name); up.disabled=true;
    setOptions(post,[], 'পোস্ট অফিস নির্বাচন করুন',x=>x.postOffice,x=>x.postOffice); post.disabled=true;

    d.addEventListener('change',()=>{
      const rows=districtsFor(d.value); setOptions(dist,rows,'জেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.id);
      dist.disabled=!rows.length; up.disabled=true; post.disabled=true;
      setOptions(up,[],'থানা / উপজেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.bn_name||x.name);
      setOptions(post,[],'পোস্ট অফিস নির্বাচন করুন',x=>x.postOffice,x=>x.postOffice); code.value='';
    });

    dist.addEventListener('change',()=>{
      const rows=upazilasFor(dist.value); setOptions(up,rows,'থানা / উপজেলা নির্বাচন করুন',x=>x.bn_name||x.name,x=>x.bn_name||x.name);
      up.disabled=!rows.length; post.disabled=true;
      setOptions(post,[],'পোস্ট অফিস নির্বাচন করুন',x=>x.postOffice,x=>x.postOffice); code.value='';
    });

    up.addEventListener('change',()=>{
      const rows=postsFor(dist.value,up.value);
      setOptions(post,rows,'পোস্ট অফিস নির্বাচন করুন',x=>x.postOffice,x=>x.postOffice);
      post.disabled=!rows.length; code.value='';
      if(!rows.length){
        // Keep postcode editable even if the upstream dataset has no exact upazila match.
        code.placeholder='Postal Code লিখুন';
      }
    });

    post.addEventListener('change',()=>{
      const row=data.postcodes.find(x=>String(x.district_id)===String(dist.value) && String(x.postOffice).trim()===String(post.value).trim() && String(x.upazila).trim()===String(up.value).trim())
        || data.postcodes.find(x=>String(x.district_id)===String(dist.value) && String(x.postOffice).trim()===String(post.value).trim());
      code.value=row ? (row.postCode||'') : '';
    });
  }

  async function enhanceAddresses(){
    try{
      const data=await loadGeo();
      initAddress(IDS.current,data);
      initAddress(IDS.permanent,data);
      window.JORON_GEO_DATA=data;
      document.dispatchEvent(new CustomEvent('joron-address-ready'));
    }catch(err){
      console.error('JORON address data failed to load:',err);
      // Do not break the rest of the biodata form if the remote data source is unavailable.
      [IDS.current,IDS.permanent].forEach(block=>{
        const d=document.getElementById(block.division),dist=document.getElementById(block.district),up=document.getElementById(block.upazila),post=document.getElementById(block.post),code=document.getElementById(block.code);
        if(d&&dist&&up&&post&&code){[dist,up,post].forEach(x=>x.disabled=false);code.placeholder='Postal Code লিখুন';}
      });
    }
  }

  document.addEventListener('DOMContentLoaded',()=>{enhance();enhanceAddresses();});
})();
