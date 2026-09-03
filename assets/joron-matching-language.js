/* JORON Matching dynamic language support */
(function(){
  const M={
    'লিঙ্গ: ': {en:'Gender: ',hi:'लिंग: '}, 'বয়স: ': {en:'Age: ',hi:'उम्र: '}, 'ধর্ম: ': {en:'Religion: ',hi:'धर्म: '}, 'জেলা: ': {en:'District: ',hi:'जिला: '}, 'শিক্ষা: ': {en:'Education: ',hi:'शिक्षा: '},
    'Secure matching চালু হচ্ছে…':{en:'Secure matching is starting…',hi:'सुरक्षित Matching शुरू हो रही है…'},
    'আপনার জন্য Smart Match':{en:'Smart Match for You',hi:'आपके लिए Smart Match'},
    'সম্ভাব্য Match':{en:'Potential Matches',hi:'संभावित Matches'},
    'Match পাওয়া যায়নি।':{en:'No matches found.',hi:'कोई Match नहीं मिला।'},
    'Smart Preference: আপনার Biodata অনুযায়ী':{en:'Smart Preference: Based on your Biodata',hi:'Smart Preference: आपके Biodata के अनुसार'},
    'আবার চেষ্টা করুন':{en:'Try Again',hi:'फिर कोशिश करें'},
    'Smart Biodata সম্পূর্ণ করুন।':{en:'Complete your Smart Biodata.',hi:'अपना Smart Biodata पूरा करें।'},
    'Match load করা যাচ্ছে না। Firebase Rules/configuration পরীক্ষা করুন।':{en:'Matches could not be loaded. Check Firebase Rules/configuration.',hi:'Matches लोड नहीं हो सके। Firebase Rules/configuration जांचें।'},
    'Preference/filter-এ কোনো Match পাওয়া যায়নি।':{en:'No Match found for this preference/filter.',hi:'इस preference/filter के लिए कोई Match नहीं मिला।'}
  };
  function apply(){
    const l=localStorage.getItem('joronLanguage')||'bn';
    document.querySelectorAll('body *').forEach(e=>{
      if(e.children.length)return;
      const t=(e.textContent||'').trim();
      if(/^✓ \d+টি preference-compatible profile পাওয়া গেছে$/.test(t)){
        const n=t.match(/\d+/)[0]; e.textContent=l==='bn'?t:(l==='en'?`✓ ${n} preference-compatible profiles found`:`✓ ${n} preference-compatible profiles मिले`); return;
      }
      const score=t.match(/^([0-9]+)% (Strong Match|Good Match|Potential Match)$/);
      if(score){const map={"Strong Match":{en:'Strong Match',hi:'Strong Match'},"Good Match":{en:'Good Match',hi:'Good Match'},"Potential Match":{en:'Potential Match',hi:'Potential Match'}};e.textContent=`${score[1]}% ${l==='bn'?score[2]:map[score[2]][l]}`;return;}
      const age=t.match(/^(.+) বছর · (.+) · Status: (.+)$/); if(age&&l!=='bn'){e.textContent=`${age[1]} ${l==='en'?'years':'वर्ष'} · ${age[2]} · ${l==='en'?'Status':'स्थिति'}: ${age[3]}`;return;}
      for(const [k,v] of Object.entries(M)){if(t===k){e.textContent=l==='bn'?k:v[l]||k;break}}
      if(t==='Strong Match'||t==='Good Match'||t==='Potential Match') return;
      if(/^লিঙ্গ: /.test(t)&&l!=='bn')e.textContent=(l==='en'?'Gender: ':'लिंग: ')+t.slice(7);
      else if(/^বয়স: /.test(t)&&l!=='bn')e.textContent=(l==='en'?'Age: ':'उम्र: ')+t.slice(6);
      else if(/^ধর্ম: /.test(t)&&l!=='bn')e.textContent=(l==='en'?'Religion: ':'धर्म: ')+t.slice(6);
      else if(/^জেলা: /.test(t)&&l!=='bn')e.textContent=(l==='en'?'District: ':'जिला: ')+t.slice(6);
      else if(/^শিক্ষা: /.test(t)&&l!=='bn')e.textContent=(l==='en'?'Education: ':'शिक्षा: ')+t.slice(7);
    });
  }
  window.addEventListener('joron-language-change',apply); new MutationObserver(apply).observe(document.body,{subtree:true,childList:true,characterData:true}); apply();
})();