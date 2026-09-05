/* JORON Magic Features — complete 3-language page layer */
(function(){
  const KEY='joronLanguage';
  const M={
    top:{bn:'✨ JORON Magic Feature Center • মোট ৩২টি Smart Discovery/Utility Button',en:'✨ JORON Magic Feature Center • 32 Smart Discovery/Utility Buttons',hi:'✨ JORON Magic Feature Center • 32 स्मार्ट Discovery/Utility बटन'},
    title:{bn:'JORON Magic Features',en:'JORON Magic Features',hi:'JORON Magic Features'},
    intro:{bn:'এক বাটনে নির্দিষ্ট ধরনের Profile, Match, Trust ও Personal Discovery। নতুন ১২টি গুরুত্বপূর্ণ feature যুক্ত করা হয়েছে।',en:'Discover specific Profile, Match, Trust and Personal Discovery options with one button. 12 important new features have been added.',hi:'एक बटन से विशेष Profile, Match, Trust और Personal Discovery विकल्प खोजें। 12 महत्वपूर्ण नई सुविधाएँ जोड़ी गई हैं।'},
    existing:{bn:'⭐ Existing Magic',en:'⭐ Existing Magic',hi:'⭐ मौजूदा Magic'},
    newer:{bn:'🚀 New Important Features',en:'🚀 New Important Features',hi:'🚀 नई महत्वपूर्ण सुविधाएँ'},
    back:{bn:'✨ মূল Features Center',en:'✨ Main Features Center',hi:'✨ मुख्य Features Center'},
    noteTitle:{bn:'🔐 নিরাপত্তা:',en:'🔐 Security:',hi:'🔐 सुरक्षा:'},
    note:{bn:'Verified/Privacy/Family ধরনের feature-এর বাস্তব ফলাফল নির্ভর করবে biodata-তে সংশ্লিষ্ট verification/privacy/family fields এবং future backend support-এর উপর। কোনো badge বা verification শুধু UI দেখে সত্য ধরে নেওয়া হবে না।',en:'The actual result of Verified/Privacy/Family features depends on the related verification, privacy and family fields in the biodata and future backend support. No badge or verification should be treated as genuine based on the UI alone.',hi:'Verified/Privacy/Family जैसी सुविधाओं का वास्तविक परिणाम biodata में संबंधित verification/privacy/family fields और भविष्य के backend support पर निर्भर करेगा। केवल UI देखकर किसी badge या verification को वास्तविक न मानें।'},
    buttons:[
      ['Voice','Voice intro দেওয়া সদস্য','Voice intro member','Voice intro वाले सदस्य'],
      ['New','নতুন Profile','New Profile','नई Profile'],
      ['Online','Online সদস্য','Online members','Online सदस्य'],
      ['For You','আপনার জন্য Match','Matches for you','आपके लिए Match'],
      ['Nearby','কাছাকাছি Profile','Nearby Profiles','पास की Profiles'],
      ['Random','Random Match','Random Match','Random Match'],
      ['Premium','Premium সদস্য','Premium members','Premium सदस्य'],
      ['Education','শিক্ষা অনুযায়ী','By education','शिक्षा के अनुसार'],
      ['Profession','পেশা অনুযায়ী','By profession','पेशा के अनुसार'],
      ['Status','নতুন Status','New Status','नया Status'],
      ['Free','Free সদস্য','Free members','Free सदस्य'],
      ['Religion','ধর্ম অনুযায়ী','By religion','धर्म के अनुसार'],
      ['Astrology','রাশি/জন্মতথ্য','Zodiac/Birth details','राशि/जन्म विवरण'],
      ['Birthday','জন্মদিনের Profile','Birthday Profiles','जन्मदिन की Profiles'],
      ['Photoless','ছবি ছাড়া Profile','Profiles without photos','बिना फोटो की Profiles'],
      ['Relocation','স্থান পরিবর্তনে আগ্রহী','Interested in relocation','स्थान परिवर्तन में रुचि'],
      ['প্রবাসী','বিদেশে বসবাসকারী','Living abroad','विदेश में रहने वाले'],
      ['ঘরজামাই','বিশেষ পছন্দ','Special preference','विशेष पसंद'],
      ['Story','সদস্যদের Story','Members’ Stories','सदस्यों की Stories'],
      ['Meeting','পরিচয়ের জন্য আগ্রহী','Interested in meeting','मुलाकात में रुचि'],
      ['Smart Match','Preference অনুযায়ী intelligent match','Intelligent match by preference','Preference के अनुसार intelligent match'],
      ['Verified','যাচাইকৃত Profile','Verified Profile','सत्यापित Profile'],
      ['Shortlist','নিজের পছন্দের তালিকা','Your preferred list','अपनी पसंद की सूची'],
      ['My Matches','আপনার Match-যোগ্য Profile','Profiles matching you','आपसे Match होने वाली Profiles'],
      ['Recently Active','সাম্প্রতিক active সদস্য','Recently active members','हाल ही में active सदस्य'],
      ['Complete Profile','পূর্ণাঙ্গ Profile','Complete Profile','पूर्ण Profile'],
      ['Privacy Mode','Privacy-controlled Profile','Privacy-controlled Profile','Privacy-controlled Profile'],
      ['Family Choice','Family-friendly Profile','Family-friendly Profile','Family-friendly Profile'],
      ['Profile Viewed','আপনি আগে দেখেছেন এমন Profile','Profiles you viewed before','आपके द्वारा पहले देखी गई Profiles'],
      ['Saved Search','Saved criteria অনুযায়ী','By saved criteria','Saved criteria के अनुसार'],
      ['Serious Members','Marriage-intent Profile','Marriage-intent Profiles','Marriage-intent Profiles'],
      ['আজকের ১০ Match','প্রতিদিনের curated suggestions','Daily curated suggestions','हर दिन की curated suggestions']
    ]
  };
  const map={};
  M.buttons.forEach(x=>map[x[0]]={bn:x[0],en:x[2],hi:x[3],desc:{bn:x[1],en:x[2],hi:x[3]}});
  function lang(){const v=localStorage.getItem(KEY);return v==='en'||v==='hi'?v:'bn';}
  function text(key){return (M[key]&&M[key][lang()])||key;}
  function apply(){
    const l=lang();
    const top=document.querySelector('.top'); if(top) top.textContent=M.top[l];
    const h=document.querySelector('.hero h1'); if(h) h.textContent=M.title[l];
    const p=document.querySelector('.hero p'); if(p) p.textContent=M.intro[l];
    const sections=document.querySelectorAll('.section'); if(sections[0]) sections[0].textContent=M.existing[l]; if(sections[1]) sections[1].textContent=M.newer[l];
    document.querySelectorAll('.magic').forEach(a=>{
      const s=a.querySelector('strong'), d=a.querySelector('span'); if(!s||!d)return;
      const k=s.textContent.trim(); const item=map[k];
      if(item){s.textContent=item[l];d.textContent=item.desc[l];}
      else {
        const found=M.buttons.find(x=>x.includes(k));
        if(found){s.textContent=l==='bn'?found[0]:(l==='en'?found[2]:found[3]);d.textContent=l==='bn'?found[1]:(l==='en'?found[2]:found[3]);}
      }
    });
    const note=document.querySelector('.note'); if(note){const st=note.querySelector('strong');if(st)st.textContent=M.noteTitle[l];Array.from(note.childNodes).forEach(n=>{if(n.nodeType===3&&n.textContent.trim())n.textContent=' '+M.note[l];});}
    const back=document.querySelector('.back a');if(back)back.textContent=M.back[l];
    document.documentElement.lang=l==='bn'?'bn':(l==='hi'?'hi':'en');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  window.addEventListener('joron-language-change',apply);
  window.addEventListener('storage',e=>{if(e.key===KEY)apply();});
})();
