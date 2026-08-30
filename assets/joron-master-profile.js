// JORON Master Profile shared helpers
// One source of truth: profile/biodata data should be saved under the user's UID.
// Fingerprint/biometric authentication is intentionally not used.
(function(){
  const DRAFT_KEY='joron_master_profile_draft_v1';
  const fields=['name','nickname','dob','age','gender','height','blood','marital','nationality','language','religion','practice','division','district','upazila','city','educationSystem','education','institution','subject','profession','workplace','madrasaType','madrasaQualification','madrasaInstitution','about','partnerAgeMin','partnerAgeMax','partnerHeight','partnerEducation','partnerProfession','partner'];
  function read(form){const d={};fields.forEach(id=>{const e=form.querySelector('#'+id);if(e)d[id]=e.value});return d}
  function write(form,d){fields.forEach(id=>{const e=form.querySelector('#'+id);if(e&&d&&d[id]!==undefined)e.value=d[id]})}
  function save(form){try{localStorage.setItem(DRAFT_KEY,JSON.stringify({...read(form),_savedAt:new Date().toISOString()}));return true}catch(e){return false}}
  function restore(form){try{const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null');if(!d)return false;write(form,d);return true}catch(e){return false}}
  function clear(){try{localStorage.removeItem(DRAFT_KEY)}catch(e){}}
  window.JORONMasterProfile=Object.assign(window.JORONMasterProfile||{},{DRAFT_KEY,read,write,save,restore,clear});
})();
