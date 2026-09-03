/* JORON Home language bridge — keeps existing Home markup intact. */
(function(){
  const KEY='joronLanguage';
  const extra={
    'নিরাপদ • সম্মানজনক • Smart Search':{en:'Safe • Respectful • Smart Search',hi:'सुरक्षित • सम्मानजनक • स्मार्ट खोज'},
    '🏠 হোম':{en:'🏠 Home',hi:'🏠 होम'},
    '👤 প্রোফাইল':{en:'👤 Profile',hi:'👤 प्रोफ़ाइल'},
    '❤️ ম্যাচিং':{en:'❤️ Matching',hi:'❤️ मैचिंग'},
    '❓ সহায়তা':{en:'❓ Help',hi:'❓ सहायता'},
    '🔐 লগইন':{en:'🔐 Login',hi:'🔐 लॉगिन'},
    '💍 রেজিস্টার':{en:'💍 Register',hi:'💍 रजिस्टर'},
    'লাভ ❤️':{en:'Benefits ❤️',hi:'लाभ ❤️'},
    'বিশ্বাস • সম্মান • সুন্দর সম্পর্ক':{en:'Trust • Respect • Beautiful Relationships',hi:'विश्वास • सम्मान • सुंदर रिश्ते'},
    'একটি সুন্দর সম্পর্কের':{en:'A beautiful relationship’s',hi:'एक सुंदर रिश्ते की'},
    'শুরু':{en:'beginning',hi:'शुरुआत'},
    'আপনার গল্পের সঠিক মানুষটি হয়তো এখানেই':{en:'The right person for your story may be here',hi:'आपकी कहानी का सही इंसान शायद यहीं है'},
    'JORON আপনাকে বিশ্বাস, পছন্দ ও পারস্পরিক সম্মানের ভিত্তিতে সঠিক মানুষের সঙ্গে পরিচিত হতে সাহায্য করে।':{en:'JORON helps you meet the right person based on trust, preferences and mutual respect.',hi:'JORON आपको विश्वास, पसंद और आपसी सम्मान के आधार पर सही व्यक्ति से मिलने में मदद करता है।'},
    '💍 আজই শুরু করুন':{en:'💍 Get Started Today',hi:'💍 आज ही शुरुआत करें'},
    '👤 প্রোফাইল দেখুন':{en:'👤 View Profiles',hi:'👤 प्रोफ़ाइल देखें'},
    '✓ যাচাইকৃত প্রোফাইল':{en:'✓ Verified Profiles',hi:'✓ सत्यापित प्रोफ़ाइल'},
    '🔒 গোপনীয়তা সুরক্ষিত':{en:'🔒 Privacy Protected',hi:'🔒 गोपनीयता सुरक्षित'},
    '🤝 সম্মানজনক পরিবেশ':{en:'🤝 Respectful Environment',hi:'🤝 सम्मानजनक वातावरण'},
    'কেন JORON':{en:'Why JORON',hi:'JORON क्यों'},
    'সম্পর্ক হোক সহজ, নিরাপদ ও অর্থপূর্ণ':{en:'Make relationships simple, safe and meaningful',hi:'रिश्तों को सरल, सुरक्षित और सार्थक बनाएं'},
    'একটি পরিষ্কার ও সম্মানজনক matrimonial experience—শুরু থেকে পরিচয় পর্যন্ত।':{en:'A clear and respectful matrimonial experience—from beginning to introduction.',hi:'शुरुआत से परिचय तक एक स्पष्ट और सम्मानजनक वैवाहिक अनुभव।'},
    'স্মার্ট ম্যাচিং':{en:'Smart Matching',hi:'स्मार्ट मैचिंग'},
    'আপনার পছন্দ ও তথ্যের ভিত্তিতে সম্ভাব্য উপযুক্ত প্রোফাইল খুঁজে নিন।':{en:'Find potentially suitable profiles based on your preferences and information.',hi:'अपनी पसंद और जानकारी के आधार पर संभावित उपयुक्त प्रोफ़ाइल खोजें।'},
    '❤️ ম্যাচিং দেখুন →':{en:'❤️ View Matching →',hi:'❤️ मैचिंग देखें →'},
    'নিরাপত্তা ও গোপনীয়তা':{en:'Security & Privacy',hi:'सुरक्षा और गोपनीयता'}
  };
  function walk(root,lang){
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n=>{
      const p=n.parentElement; if(!p||['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName)) return;
      if(!n.__joronBn) n.__joronBn=n.nodeValue;
      const bn=n.__joronBn.trim(); if(!bn) return;
      const t=extra[bn]||(window.JORONLanguage&&window.JORONLanguage.translations[bn]);
      if(!t) return;
      const value=lang==='bn'?bn:(t[lang]||bn);
      n.nodeValue=n.nodeValue.replace(bn,value);
    });
  }
  function apply(){
    const lang=(window.JORONLanguage&&window.JORONLanguage.getLanguage())||localStorage.getItem(KEY)||'bn';
    walk(document.body,lang);
  }
  function start(){
    apply();
    window.addEventListener('joron-language-change',apply);
    const mo=new MutationObserver(()=>apply()); mo.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
