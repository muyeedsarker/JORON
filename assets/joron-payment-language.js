/* JORON Payment page: Bengali / English / Hindi */
(function(){
  const M={
    "বিশ্বাস • সম্মান • নিরাপত্তা • সম্পর্ক":{en:"Trust • Respect • Security • Relationships",hi:"विश्वास • सम्मान • सुरक्षा • रिश्ते"},
    "আপনার পছন্দের Membership বেছে নিয়ে আরও সুন্দর ও premium experience উপভোগ করুন।":{en:"Choose your preferred Membership and enjoy a better premium experience.",hi:"अपनी पसंद की Membership चुनें और बेहतर premium experience का आनंद लें।"},
    "⭐ জনপ্রিয়":{en:"⭐ Popular",hi:"⭐ लोकप्रिय"},"👑 সর্বোচ্চ":{en:"👑 Highest",hi:"👑 सर्वोच्च"},"✓ নির্বাচিত":{en:"✓ Selected",hi:"✓ चयनित"},
    "💳 bKash দিয়ে সহজে Membership নিন":{en:"💳 Get Membership easily with bKash",hi:"💳 bKash से आसानी से Membership लें"},
    "১️⃣ এই নম্বরে টাকা পাঠান":{en:"1️⃣ Send money to this number",hi:"1️⃣ इस नंबर पर पैसे भेजें"},
    "J❤️R❤️N Membership Payment-এর জন্য নিচের bKash নম্বরটি ব্যবহার করুন:":{en:"Use the bKash number below for J❤️R❤️N Membership Payment:",hi:"J❤️R❤️N Membership Payment के लिए नीचे दिए bKash नंबर का उपयोग करें:"},
    "২️⃣ আপনার নির্বাচিত Membership-এর মূল্য পাঠান":{en:"2️⃣ Send the price of your selected Membership",hi:"2️⃣ अपनी चुनी हुई Membership की कीमत भेजें"},
    "নিচে আপনার নির্বাচিত Plan ও মূল্য দেখানো হবে।":{en:"Your selected Plan and price will be shown below.",hi:"आपकी चुनी हुई Plan और कीमत नीचे दिखाई जाएगी।"},
    "🔐 Payment পাঠানোর পর নিচের Verification Form-এ সঠিক তথ্য দিন। Admin যাচাই করার পরই Membership Active হবে।":{en:"🔐 After sending the Payment, enter the correct information in the Verification Form below. Membership will become Active only after Admin verification.",hi:"🔐 Payment भेजने के बाद नीचे Verification Form में सही जानकारी दें। Admin के सत्यापन के बाद ही Membership Active होगी।"},
    "Payment সম্পন্ন হয়েছে? এখন শুধু নিচের ২টি তথ্য দিন।":{en:"Payment completed? Now provide just the following 2 details.",hi:"Payment पूरा हो गया? अब केवल नीचे दी गई 2 जानकारी दें।"},
    "📱 ১. যে মোবাইল নম্বর থেকে টাকা পাঠিয়েছেন":{en:"📱 1. Mobile number you sent the money from",hi:"📱 1. जिस मोबाइल नंबर से पैसे भेजे"},
    "আপনার bKash Payment-এর Sender Number লিখুন।":{en:"Enter the Sender Number used for your bKash Payment.",hi:"अपने bKash Payment का Sender Number दर्ज करें।"},
    "উদাহরণ: 01XXXXXXXXX":{en:"Example: 01XXXXXXXXX",hi:"उदाहरण: 01XXXXXXXXX"},
    "🧾 ২. bKash Transaction ID":{en:"🧾 2. bKash Transaction ID",hi:"🧾 2. bKash Transaction ID"},
    "Payment সফল হওয়ার পর পাওয়া Transaction ID এখানে লিখুন।":{en:"Enter the Transaction ID received after the Payment succeeds.",hi:"Payment सफल होने के बाद प्राप्त Transaction ID यहां दर्ज करें।"},
    "উদাহরণ: TXN123456789":{en:"Example: TXN123456789",hi:"उदाहरण: TXN123456789"},
    "💗 Payment তথ্য Submit করুন":{en:"💗 Submit Payment Information",hi:"💗 Payment जानकारी Submit करें"},
    "⏳ Payment তথ্য জমা হয়েছে — Admin Verification চলছে।":{en:"⏳ Payment information submitted — Admin Verification is in progress.",hi:"⏳ Payment जानकारी जमा हो गई है — Admin Verification जारी है।"},
    "⏳ Payment তথ্য জমা হচ্ছে...":{en:"Payment information is being submitted...",hi:"Payment जानकारी जमा की जा रही है..."},
    "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।":{en:"Enter a valid 11-digit Bangladesh mobile number.",hi:"11 अंकों का सही बांग्लादेशी मोबाइल नंबर दर्ज करें।"},
    "সঠিক Transaction ID দিন।":{en:"Enter a valid Transaction ID.",hi:"सही Transaction ID दर्ज करें।"},
    "Payment তথ্য সফলভাবে জমা হয়েছে — Admin Verification চলছে।":{en:"Payment information submitted successfully — Admin Verification is in progress.",hi:"Payment जानकारी सफलतापूर्वक जमा हो गई है — Admin Verification जारी है।"},
    "Payment তথ্য সফলভাবে জমা হয়েছে। Admin যাচাই করার পর Membership Active হবে।":{en:"Payment information submitted successfully. Membership will become Active after Admin verification.",hi:"Payment जानकारी सफलतापूर्वक जमा हो गई है। Admin के सत्यापन के बाद Membership Active होगी।"},
    "Payment তথ্য জমা দেওয়া যায়নি। আবার চেষ্টা করুন।":{en:"Payment information could not be submitted. Please try again.",hi:"Payment जानकारी जमा नहीं हो सकी। कृपया फिर कोशिश करें।"},
    "🔒 আপনার Payment তথ্য নিরাপদে সংরক্ষণ করা হবে। Admin যাচাই সম্পন্ন করার পর আপনার নির্বাচিত Membership Active হবে।":{en:"🔒 Your Payment information will be stored securely. Your selected Membership will become Active after Admin verification.",hi:"🔒 आपकी Payment जानकारी सुरक्षित रूप से संग्रहीत की जाएगी। Admin के सत्यापन के बाद आपकी चुनी हुई Membership Active होगी।"},
    "← J❤️R❤️N হোমে ফিরে যান":{en:"← Back to J❤️R❤️N Home",hi:"← J❤️R❤️N होम पर वापस जाएँ"},
    "🏠 হোম":{en:"🏠 Home",hi:"🏠 होम"},"↩️ Back":{en:"↩️ Back",hi:"↩️ Back"},"✅ Membership Active":{en:"✅ Membership Active",hi:"✅ Membership Active"},"Submitted — Verification Pending":{en:"Submitted — Verification Pending",hi:"Submitted — Verification Pending"}
  };
  function apply(){const l=localStorage.getItem('joronLanguage')||'bn';document.querySelectorAll('body *').forEach(e=>{if(e.children.length)return;const original=e.dataset.joronPaymentBn||e.textContent.trim();if(M[original]){e.dataset.joronPaymentBn=original;e.textContent=l==='bn'?original:M[original][l]}});document.querySelectorAll('input[placeholder]').forEach(e=>{const o=e.dataset.joronPaymentPlaceholderBn||e.placeholder;if(M[o]){e.dataset.joronPaymentPlaceholderBn=o;e.placeholder=l==='bn'?o:M[o][l]}})}
  window.addEventListener('joron-language-change',apply);new MutationObserver(apply).observe(document.body,{subtree:true,childList:true});apply();
})();