/* JORON Onboarding language completion: Bengali / English / Hindi */
(function(){
  const T={
    'কার জন্য':'For whom','দেশ':'Country','ভাষা':'Language','আপনি':'You','ধর্ম':'Religion','ঠিকানা':'Address','পছন্দ':'Preference','শেষ':'Finish',
    '👤 কার জন্য Profile তৈরি করছেন?':{en:'👤 Who are you creating a Profile for?',hi:'👤 किसके लिए Profile बना रहे हैं?'},
    'একটি নির্বাচন করুন। Next চাপলে পরের প্রশ্ন আসবে।':{en:'Select one. Press Next to continue.',hi:'एक विकल्प चुनें। आगे बढ़ने के लिए Next दबाएँ।'},
    '✓ এই তথ্য Smart Biodata-তে দ্বিতীয়বার লিখতে হবে না।':{en:'✓ You will not need to enter this information again in Smart Biodata.',hi:'✓ यह जानकारी Smart Biodata में दोबारा दर्ज नहीं करनी होगी।'},
    '🌍 কোন দেশে?':{en:'🌍 Which country?',hi:'🌍 कौन सा देश?'},
    'ফোনের ভাষা ও সময় অঞ্চল দেখে দেশ অটো-সিলেক্ট করা হবে।':{en:'The country will be auto-selected using your phone language and time zone.',hi:'आपके फोन की भाषा और समय क्षेत्र के आधार पर देश अपने आप चुना जाएगा।'},
    '⚡ Smart Auto Detect':{en:'⚡ Smart Auto Detect',hi:'⚡ स्मार्ट ऑटो डिटेक्ट'},
    '🗣️ ভাষা ও Mother Tongue':{en:'🗣️ Language & Mother Tongue',hi:'🗣️ भाषा और मातृभाषा'},
    '✓ দেশ বদলালে ভাষা ও Mother Tongue-এর প্রাথমিক মান অটো বদলাবে।':{en:'✓ Changing country will automatically update the initial language and Mother Tongue.',hi:'✓ देश बदलने पर भाषा और मातृभाषा की प्रारंभिक सेटिंग अपने आप बदल जाएगी।'},
    '👫 আপনার Gender':{en:'👫 Your Gender',hi:'👫 आपका लिंग'},
    '👨 পুরুষ':{en:'👨 Male',hi:'👨 पुरुष'},'👩 নারী':{en:'👩 Female',hi:'👩 महिला'},
    '⚙️ Partner Gender অটো হবে':{en:'⚙️ Partner Gender will be automatic',hi:'⚙️ Partner Gender अपने आप चुना जाएगा'},
    '🕌 ধর্ম ও Community':{en:'🕌 Religion & Community',hi:'🕌 धर्म और Community'},
    'ধর্ম নির্বাচন করুন':{en:'Select religion',hi:'धर्म चुनें'},'Community / মত':{en:'Community / School of thought',hi:'Community / मत'},'আগে ধর্ম নির্বাচন করুন':{en:'Select religion first',hi:'पहले धर्म चुनें'},
    '✓ ধর্ম বদলালে Community তালিকা অটো বদলাবে।':{en:'✓ The Community list will update automatically when religion changes.',hi:'✓ धर्म बदलने पर Community सूची अपने आप बदल जाएगी।'},
    '📍 আপনার ঠিকানা':{en:'📍 Your Address',hi:'📍 आपका पता'},'বিভাগ নির্বাচন করুন':{en:'Select division',hi:'डिवीजन चुनें'},'জেলা নির্বাচন করুন':{en:'Select district',hi:'जिला चुनें'},
    'আগে বিভাগ নির্বাচন করুন':{en:'Select division first',hi:'पहले डिवीजन चुनें'},
    '❤️ জীবনসঙ্গীর পছন্দ':{en:'❤️ Life Partner Preferences',hi:'❤️ जीवनसाथी की पसंद'},
    'এগুলো Smart Biodata-এর একই preference field-এ যাবে। পরে এখানে বা Smart Biodata-তে পরিবর্তন করলে একই তথ্য রাখা হবে।':{en:'These will use the same preference fields as Smart Biodata. Changes here or in Smart Biodata will stay synchronized.',hi:'ये Smart Biodata के उन्हीं preference fields में सेव होंगे। यहाँ या Smart Biodata में बदलाव करने पर जानकारी समान रहेगी।'},
    'অটো নির্বাচন':{en:'Auto select',hi:'ऑटो चयन'},'বয়স — সর্বনিম্ন':{en:'Age — Minimum',hi:'उम्र — न्यूनतम'},'বয়স — সর্বোচ্চ':{en:'Age — Maximum',hi:'उम्र — अधिकतम'},
    'যেকোনো ধর্ম':{en:'Any religion',hi:'कोई भी धर्म'},'যেকোনো Community':{en:'Any Community',hi:'कोई भी Community'},'যেকোনো জেলা':{en:'Any district',hi:'कोई भी जिला'},'যেকোনো শিক্ষা':{en:'Any education',hi:'कोई भी शिक्षा'},
    'SSC+':{en:'SSC+',hi:'SSC+'},'এইচএসসি':{en:'HSC',hi:'HSC'},'স্নাতক':{en:'Bachelor’s',hi:'स्नातक'},'স্নাতকোত্তর':{en:'Master’s',hi:'स्नातकोत्तर'},'দাওরায়ে হাদিস':{en:'Dawra-e-Hadith',hi:'दौराए हदीस'},'পিএইচডি':{en:'PhD',hi:'पीएचडी'},'অন্যান্য':{en:'Other',hi:'अन्य'},
    '🎉 JORON Matrimony প্রস্তুত!':{en:'🎉 JORON Matrimony is ready!',hi:'🎉 JORON Matrimony तैयार है!'},
    'আপনার Onboarding তথ্য সংরক্ষিত। এখন Smart Biodata-তে বাকি তথ্য এক ধাপ করে পূরণ করুন।':{en:'Your onboarding information is saved. Now complete the remaining details step by step in Smart Biodata.',hi:'आपकी Onboarding जानकारी सेव हो गई है। अब Smart Biodata में बाकी जानकारी चरण-दर-चरण भरें।'},
    '📝 Smart Biodata শুরু করুন':{en:'📝 Start Smart Biodata',hi:'📝 Smart Biodata शुरू करें'},'❤️ Matching দেখুন':{en:'❤️ View Matching',hi:'❤️ Matching देखें'},
    '← পিছনে':{en:'← Back',hi:'← पीछे'},'পরের ধাপ →':{en:'Next →',hi:'अगला →'},'শেষ করুন →':{en:'Finish →',hi:'पूरा करें →'},
    'নিজের জন্য':{en:'For myself',hi:'अपने लिए'},'ছেলের জন্য':{en:'For son',hi:'बेटे के लिए'},'মেয়ের জন্য':{en:'For daughter',hi:'बेटी के लिए'},'ভাইয়ের জন্য':{en:'For brother',hi:'भाई के लिए'},'বোনের জন্য':{en:'For sister',hi:'बहन के लिए'},'বন্ধুর জন্য':{en:'For friend',hi:'दोस्त के लिए'},'আত্মীয়ের জন্য':{en:'For relative',hi:'रिश्तेदार के लिए'},
    'Profile কার জন্য তৈরি করছেন নির্বাচন করুন।':{en:'Please select who the Profile is for.',hi:'कृपया चुनें कि Profile किसके लिए है।'},'Gender নির্বাচন করুন।':{en:'Please select Gender.',hi:'कृपया Gender चुनें।'},'ধর্ম নির্বাচন করুন।':{en:'Please select religion.',hi:'कृपया धर्म चुनें।'},'বিভাগ ও জেলা নির্বাচন করুন।':{en:'Please select division and district.',hi:'कृपया डिवीजन और जिला चुनें।'}
  };
  const keyMap={bn:'bn',en:'en',hi:'hi'};
  function lang(){return localStorage.getItem('joronLanguage')||'bn'}
  function tr(s){const v=T[s]; if(!v)return s; if(typeof v==='string')return v; return v[lang()]||s}
  function apply(){const l=lang(); if(l==='bn')return; const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(!n.nodeValue.trim())continue;const raw=n.nodeValue.trim(),out=tr(raw);if(out!==raw){n.nodeValue=n.nodeValue.replace(raw,out)}}}
  document.addEventListener('joron-language-change',apply); document.addEventListener('DOMContentLoaded',apply); new MutationObserver(()=>apply()).observe(document.documentElement,{subtree:true,childList:true});
})();