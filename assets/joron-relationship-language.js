/* JORON Relationship dynamic language support */
(function(){
  function apply(){
    const l=localStorage.getItem('joronLanguage')||'bn';
    document.querySelectorAll('body *').forEach(e=>{
      if(e.children.length)return;
      const t=(e.textContent||'').trim();
      const m=t.match(/^(\d+)টি (পাওয়া|পাঠানো) Interest$/);
      if(m){
        const n=m[1],type=m[2];
        e.textContent=l==='bn'?t:(l==='en'?`${n} ${type==='পাওয়া'?'received':'sent'} Interest`:`${n} ${type==='পাওয়া'?'प्राप्त':'भेजे गए'} Interest`);
      }
      const s=t.match(/^(.*) বছর · (.*) · Status: (.*)$/);
      if(s && l!=='bn'){
        e.textContent=`${s[1]} ${l==='en'?'years':'वर्ष'} · ${s[2]} · ${l==='en'?'Status':'स्थिति'}: ${s[3]}`;
      }
    });
  }
  window.addEventListener('joron-language-change',apply);
  new MutationObserver(apply).observe(document.body,{subtree:true,childList:true,characterData:true});
  apply();
})();