// JORON Master Profile — shared draft autosave foundation
// Fingerprint/biometric authentication is intentionally NOT used.
(function(){
  const KEY='joron_master_profile_draft_v1';
  const formState={};
  let timer;
  window.JORONMasterProfile={
    save(form){
      if(!form)return;
      const data={};
      form.querySelectorAll('input,select,textarea').forEach(el=>{
        if(!el.name && !el.id)return;
        const key=el.name||el.id;
        if(el.type==='checkbox'||el.type==='radio') data[key]=el.checked;
        else data[key]=el.value;
      });
      data._savedAt=Date.now();
      try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){console.warn('JORON draft save failed',e)}
    },
    restore(form){
      if(!form)return false;
      try{
        const raw=localStorage.getItem(KEY); if(!raw)return false;
        const data=JSON.parse(raw); let found=false;
        form.querySelectorAll('input,select,textarea').forEach(el=>{
          const key=el.name||el.id; if(!key||!(key in data))return;
          if(el.type==='checkbox'||el.type==='radio') el.checked=!!data[key];
          else el.value=data[key];
          found=true;
        }); return found;
      }catch(e){return false}
    },
    clear(){try{localStorage.removeItem(KEY)}catch(e){}}
  };
  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.querySelector('form'); if(!form)return;
    window.JORONMasterProfile.restore(form);
    form.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>window.JORONMasterProfile.save(form),500)});
    form.addEventListener('change',()=>window.JORONMasterProfile.save(form));
  });
})();
