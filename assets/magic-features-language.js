/* JORON Magic Features — complete 3-language page layer */
(function(){
const KEY='joronLanguage';
const M={
top:{bn:'✨ JORON Magic Feature Center • মোট ৩২টি Smart Discovery/Utility Button',en:'✨ JORON Magic Feature Center • 32 Smart Discovery/Utility Buttons',hi:'✨ JORON Magic Feature Center • 32 स्मार्ट खोज/उपयोगिता बटन'},
title:{bn:'JORON Magic Features',en:'JORON Magic Features',hi:'JORON Magic Features'},
intro:{bn:'এক বাটনে নির্দিষ্ট ধরনের Profile, Match, Trust ও Personal Discovery। নতুন ১২টি গুরুত্বপূর্ণ feature যুক্ত করা হয়েছে।',en:'Discover specific Profile, Match, Trust and Personal Discovery options with one button. 12 important new features have been added.',hi:'एक बटन से विशेष प्रोफ़ाइल, मिलान, भरोसा और व्यक्तिगत खोज विकल्प खोजें। 12 महत्वपूर्ण नई सुविधाएँ जोड़ी गई हैं।'},
existing:{bn:'⭐ Existing Magic',en:'⭐ Existing Magic',hi:'⭐ मौजूदा Magic'},
newer:{bn:'🚀 New Important Features',en:'🚀 New Important Features',hi:'🚀 नई महत्वपूर्ण सुविधाएँ'},
back:{bn:'✨ মূল Features Center',en:'✨ Main Features Center',hi:'✨ मुख्य Features Center'},
noteTitle:{bn:'🔐 নিরাপত্তা:',en:'🔐 Security:',hi:'🔐 सुरक्षा:'},
note:{bn:'Verified/Privacy/Family ধরনের feature-এর বাস্তব ফলাফল নির্ভর করবে biodata-তে সংশ্লিষ্ট verification/privacy/family fields এবং future backend support-এর উপর। কোনো badge বা verification শুধু UI দেখে সত্য ধরে নেওয়া হবে না।',en:'The actual result of Verified/Privacy/Family features depends on the related verification, privacy and family fields in the biodata and future backend support. No badge or verification should be treated as genuine based on the UI alone.',hi:'Verified/Privacy/Family जैसी सुविधाओं का वास्तविक परिणाम biodata में संबंधित सत्यापन, गोपनीयता और परिवार संबंधी फ़ील्ड तथा भविष्य के backend support पर निर्भर करेगा। केवल UI देखकर किसी badge या verification को वास्तविक न मानें।'},
buttons:{
voice:{bn:['ভয়েস','Voice intro দেওয়া সদস্য'],en:['Voice','Members with a voice introduction'],hi:['वॉइस','वॉइस परिचय वाले सदस्य']},
new:{bn:['নতুন','নতুন Profile'],en:['New','New Profiles'],hi:['नया','नई प्रोफ़ाइल']},
online:{bn:['অনলাইন','Online সদস্য'],en:['Online','Online members'],hi:['ऑनलाइन','ऑनलाइन सदस्य']},
foryou:{bn:['আপনার জন্য','আপনার জন্য Match'],en:['For You','Matches for you'],hi:['आपके लिए','आपके लिए मिलान']},
nearby:{bn:['কাছাকাছি','কাছাকাছি Profile'],en:['Nearby','Nearby Profiles'],hi:['पास के','पास की प्रोफ़ाइल']},
random:{bn:['র‍্যান্ডম','Random Match'],en:['Random','Random Matches'],hi:['रैंडम','रैंडम मिलान']},
premium:{bn:['প্রিমিয়াম','Premium সদস্য'],en:['Premium','Premium members'],hi:['प्रीमियम','प्रीमियम सदस्य']},
education:{bn:['শিক্ষা','শিক্ষা অনুযায়ী'],en:['Education','By education'],hi:['शिक्षा','शिक्षा के अनुसार']},
profession:{bn:['পেশা','পেশা অনুযায়ী'],en:['Profession','By profession'],hi:['पेशा','पेशे के अनुसार']},
status:{bn:['স্ট্যাটাস','নতুন Status'],en:['Status','New statuses'],hi:['स्टेटस','नए स्टेटस']},
free:{bn:['ফ্রি','Free সদস্য'],en:['Free','Free members'],hi:['फ्री','फ्री सदस्य']},
religion:{bn:['ধর্ম','ধর্ম অনুযায়ী'],en:['Religion','By religion'],hi:['धर्म','धर्म के अनुसार']},
astrology:{bn:['জ্যোতিষ','রাশি/জন্মতথ্য'],en:['Astrology','Zodiac / birth details'],hi:['ज्योतिष','राशि / जन्म विवरण']},
birthday:{bn:['জন্মদিন','জন্মদিনের Profile'],en:['Birthday','Birthday Profiles'],hi:['जन्मदिन','जन्मदिन की प्रोफ़ाइल']},
photoless:{bn:['ছবি ছাড়া','ছবি ছাড়া Profile'],en:['Without Photo','Profiles without photos'],hi:['बिना फोटो','बिना फोटो की प्रोफ़ाइल']},
relocation:{bn:['স্থান পরিবর্তন','স্থান পরিবর্তনে আগ্রহী'],en:['Relocation','Interested in relocation'],hi:['स्थान परिवर्तन','स्थान परिवर्तन में रुचि']},
expat:{bn:['প্রবাসী','বিদেশে বসবাসকারী'],en:['Expat','People living abroad'],hi:['प्रवासी','विदेश में रहने वाले']},
ghorjamai:{bn:['ঘরজামাই','বিশেষ পছন্দ'],en:['Ghar Jamai','Special preference'],hi:['घर जमाई','विशेष पसंद']},
story:{bn:['গল্প','সদস্যদের Story'],en:['Stories',"Members' Stories"],hi:['कहानियाँ','सदस्यों की कहानियाँ']},
meeting:{bn:['পরিচয়','পরিচয়ের জন্য আগ্রহী'],en:['Meet & Connect','Interested in meeting'],hi:['परिचय','मुलाकात में रुचि']},
smartmatch:{bn:['স্মার্ট ম্যাচ','Preference অনুযায়ী বুদ্ধিমান Match'],en:['Smart Match','Intelligent matches based on preferences'],hi:['स्मार्ट मिलान','पसंद के आधार पर बुद्धिमान मिलान']},
verified:{bn:['যাচাইকৃত','যাচাইকৃত Profile'],en:['Verified','Verified Profiles'],hi:['सत्यापित','सत्यापित प्रोफ़ाइल']},
shortlist:{bn:['পছন্দের তালিকা','নিজের পছন্দের তালিকা'],en:['Shortlist','Your preferred list'],hi:['पसंद की सूची','आपकी पसंद की सूची']},
mymatches:{bn:['আমার ম্যাচ','আপনার Match-যোগ্য Profile'],en:['My Matches','Profiles that match you'],hi:['मेरे मिलान','आपसे मेल खाने वाली प्रोफ़ाइल']},
active:{bn:['সাম্প্রতিক সক্রিয়','সাম্প্রতিক active সদস্য'],en:['Recently Active','Recently active members'],hi:['हाल ही में सक्रिय','हाल ही में सक्रिय सदस्य']},
complete:{bn:['সম্পূর্ণ প্রোফাইল','পূর্ণাঙ্গ Profile'],en:['Complete Profile','Complete Profiles'],hi:['पूर्ण प्रोफ़ाइल','पूर्ण प्रोफ़ाइल वाले सदस्य']},
privacy:{bn:['গোপনীয়তা মোড','Privacy-controlled Profile'],en:['Privacy Mode','Privacy-controlled Profiles'],hi:['गोपनीयता मोड','गोपनीयता-नियंत्रित प्रोफ़ाइल']},
family:{bn:['পরিবারের পছন্দ','Family-friendly Profile'],en:['Family Choice','Family-friendly Profiles'],hi:['परिवार की पसंद','परिवार के अनुकूल प्रोफ़ाइल']},
viewed:{bn:['দেখা প্রোফাইল','আপনি আগে দেখেছেন এমন Profile'],en:['Profile Viewed','Profiles you have viewed'],hi:['देखी गई प्रोफ़ाइल','आपके द्वारा पहले देखी गई प्रोफ़ाइल']},
savedsearch:{bn:['সংরক্ষিত অনুসন্ধান','Saved criteria অনুযায়ী'],en:['Saved Search','Profiles matching your saved criteria'],hi:['सहेजी गई खोज','आपके सहेजे मानदंड के अनुसार प्रोफ़ाइल']},
serious:{bn:['গম্ভীর সদস্য','বিয়েতে আগ্রহী Profile'],en:['Serious Members','Profiles with marriage intent'],hi:['गंभीर सदस्य','विवाह के इच्छुक प्रोफ़ाइल']},
daily:{bn:['আজকের ১০ Match','প্রতিদিনের বাছাই করা পরামর্শ'],en:["Today's 10 Matches",'10 curated suggestions for today'],hi:['आज के 10 मिलान','आज के लिए चुने गए 10 सुझाव']}
}
};
function lang(){const v=localStorage.getItem(KEY);return v==='en'||v==='hi'?v:'bn';}
function apply(){
const l=lang();
const top=document.querySelector('.top');if(top)top.textContent=M.top[l];
const h=document.querySelector('.hero h1');if(h)h.textContent=M.title[l];
const p=document.querySelector('.hero p');if(p)p.textContent=M.intro[l];
const sections=document.querySelectorAll('.section');if(sections[0])sections[0].textContent=M.existing[l];if(sections[1])sections[1].textContent=M.newer[l];
document.querySelectorAll('.magic').forEach(a=>{const s=a.querySelector('strong'),d=a.querySelector('span');if(!s||!d)return;const href=a.getAttribute('href')||'';const m=href.match(/[?&]mode=([^&#]+)/);const item=m&&M.buttons[decodeURIComponent(m[1])];if(item){s.textContent=item[l][0];d.textContent=item[l][1];}});
const note=document.querySelector('.note');if(note){const st=note.querySelector('strong');if(st)st.textContent=M.noteTitle[l];Array.from(note.childNodes).forEach(n=>{if(n.nodeType===3&&n.textContent.trim())n.textContent=' '+M.note[l];});}
const back=document.querySelector('.back a');if(back)back.textContent=M.back[l];
document.documentElement.lang=l==='bn'?'bn':(l==='hi'?'hi':'en');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
window.addEventListener('joron-language-change',apply);
window.addEventListener('storage',e=>{if(e.key===KEY)apply();});
})();
