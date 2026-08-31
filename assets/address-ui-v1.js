// JORON Smart Address UI v1
// Division -> District -> Thana -> Post Office -> Ward -> Village
// Birth place is optional. Unknown locations are submitted as suggestions, never auto-published.
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
const label=r=>String(r?.nameBn??r?.bn_name??r?.name??r?.title??'').trim();
const setOptions=(select,rows,placeholder,allLabel)=>{
 if(!select)return;
 select.innerHTML='';
 select.add(new Option(allLabel||placeholder,''));
 for(const r of rows||[]){const n=label(r);if(n)select.add(new Option(n,String(r.id??r.key??r.name??n)));}
 select.disabled=!(rows||[]).length;
};
const reset=(select,placeholder,allLabel)=>setOptions(select,[],placeholder,allLabel);
const makeSelect=(oldId,labelText,allText)=>{
 const old=$(oldId); if(!old)return null;
 if(old.tagName==='SELECT')return old;
 const s=document.createElement('select');s.id=old.id;s.name=old.name||old.id;s.required=old.required;s.className=old.className;
 s.innerHTML=`<option value="">${allText}</option>`;
 old.replaceWith(s);
 const lab=s.parentElement?.querySelector('label');if(lab)lab.firstChild.textContent=labelText+' ';
 return s;
};
const addField=(afterId,id,labelText,optional=true)=>{
 if($(id))return $(id);
 const after=$(afterId);if(!after?.parentElement)return null;
 const wrap=document.createElement('label');wrap.innerHTML=`${labelText}${optional?'':' *'}<input id="${id}" name="${id}" type="text" autocomplete="off" placeholder="${optional?'ঐচ্ছিক':'লিখুন'}"></label>`;
 after.parentElement.insertAdjacentElement('afterend',wrap);return $(id);
};
async function load(){
 const geo=await import('https://cdn.jsdelivr.net/npm/@olism/bd-geo@0.1.6/+esm');
 const divisions=geo.getDivisions(), districts=geo.getDistricts(), upazilas=geo.getUpazilas(), areas=geo.getAreas(), villages=geo.getVillages();
 let posts=[];try{const r=await fetch('https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-postcodes.json',{cache:'no-store'});if(r.ok){const j=await r.json();posts=Array.isArray(j)?j:(j.postcodes||j.data||[]);}}catch(e){console.warn('postal data unavailable',e)}
 const dv=makeSelect('division','বিভাগঃ','সব বিভাগ');
 const di=makeSelect('district','জেলাঃ','সব জেলা');
 const th=makeSelect('upazila','থানাঃ','সব থানা');
 if(!dv||!di||!th)return;
 const city=$( 'city');
 const post=addField('upazila','postOffice','পোঃ');
 const ward=addField('postOffice','ward','ওয়ার্ড নং');
 const village=addField('ward','village','গ্রামঃ');
 const birth=addField('village','birthPlace','জন্মস্থান',true);
 if(post)post.dataset.addressRole='postOffice';if(ward)ward.dataset.addressRole='ward';if(village)village.dataset.addressRole='village';
 // Turn text fields into selects for the known lists while keeping a safe custom-entry field.
 const postWrap=post?.parentElement,wardWrap=ward?.parentElement,villageWrap=village?.parentElement;
 const postSelect=document.createElement('select');postSelect.id='postOffice';postSelect.name='postOffice';postWrap?.replaceWith(postSelect);
 const wardSelect=document.createElement('select');wardSelect.id='ward';wardSelect.name='ward';wardWrap?.replaceWith(wardSelect);
 const villageSelect=document.createElement('select');villageSelect.id='village';villageSelect.name='village';villageWrap?.replaceWith(villageSelect);
 const custom=document.createElement('label');custom.id='customAddressWrap';custom.innerHTML='তালিকায় না থাকলে নতুন ঠিকানা লিখুন<input id="customAddress" name="customAddress" type="text" autocomplete="off" placeholder="গ্রাম / থানা / পোস্ট অফিস লিখুন">';
 birth?.parentElement?.insertAdjacentElement('afterend',custom);
 setOptions(dv,divisions,'বিভাগ','সব বিভাগ');
 reset(di,'জেলা','সব জেলা');reset(th,'থানা','সব থানা');reset(postSelect,'পোঃ','সব পোঃ');reset(wardSelect,'ওয়ার্ড','সব ওয়ার্ড');reset(villageSelect,'গ্রাম','সব গ্রাম');
 const sync=()=>{if(city)city.value=city.value||''};
 dv.addEventListener('change',()=>{const id=Number(dv.value);const rows=id?districts.filter(x=>Number(x.divisionId)===id):districts;setOptions(di,rows,'জেলা','সব জেলা');reset(th,'থানা','সব থানা');reset(postSelect,'পোঃ','সব পোঃ');reset(wardSelect,'ওয়ার্ড','সব ওয়ার্ড');reset(villageSelect,'গ্রাম','সব গ্রাম');});
 di.addEventListener('change',()=>{const id=Number(di.value);const rows=id?upazilas.filter(x=>Number(x.districtId)===id):upazilas;setOptions(th,rows,'থানা','সব থানা');reset(postSelect,'পোঃ','সব পোঃ');reset(wardSelect,'ওয়ার্ড','সব ওয়ার্ড');reset(villageSelect,'গ্রাম','সব গ্রাম');});
 th.addEventListener('change',()=>{const id=Number(th.value);const up=upazilas.find(x=>Number(x.id)===id);const dn=districts.find(x=>Number(x.id)===Number(di.value));const rows=id?posts.filter(x=>norm(x.district||x.district_name)===norm(dn?.name||'')&&norm(x.upazila||x.upazila_name||x.thana)===norm(up?.name||'')):posts;setOptions(postSelect,rows.map(x=>({id:String(x.postCode||x.postcode||x.postalCode||x.postOffice||x.postoffice||x.name||''),nameBn:String(x.postOffice||x.postoffice||x.suboffice||x.name||'')})),'পোঃ','সব পোঃ');const a=id?areas.filter(x=>Number(x.upazilaId)===id):areas;setOptions(wardSelect,a.filter(x=>x.type==='ward'),'ওয়ার্ড','সব ওয়ার্ড');setOptions(villageSelect,a.filter(x=>x.type==='union').length?villages.filter(v=>a.some(x=>x.type==='union'&&Number(x.id)===Number(v.areaId))):villages,'গ্রাম','সব গ্রাম');});
 postSelect.addEventListener('change',()=>{const code=String(postSelect.value||'');const pc=$('postalCode');if(pc&&/^\d{4}$/.test(code))pc.value=code;});
 sync();
 window.JORON_ADDRESS_UI_READY=true;
}
function start(){load().catch(e=>{console.error('JORON Smart Address UI',e);window.JORON_ADDRESS_UI_READY=false;});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
