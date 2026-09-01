# JORON — MASTER INFORMATION & RECOVERY RECORD

**Project:** JORON (জোড়ন)  
**Tagline:** জোড়ন — গয়না হোক আপনার গল্পের অংশ  
**Repository:** `muyeedsarker/JORON`  
**Branch:** `main`  
**Firebase Project ID:** `joron-d7742`  
**Live Site:** https://muyeedsarker.github.io/JORON/

> এই নথি JORON-এর স্থায়ী রেফারেন্স। ভবিষ্যতে Gmail, মোবাইল বা ChatGPT account পরিবর্তন হলেও এই নথি এবং GitHub repository দেখে কাজ পুনরায় শুরু করা যাবে।

## 1. SOURCE OF TRUTH

- GitHub repository: https://github.com/muyeedsarker/JORON
- Main branch: `main`
- Live website: https://muyeedsarker.github.io/JORON/
- Firebase project ID: `joron-d7742`
- Existing working code/design inspect করে পরিবর্তন করতে হবে; নতুন করে project শুরু করা যাবে না।

## 2. IMPORTANT RECOVERY RULE

Gmail/phone হারালেই JORON-এর code নিজে থেকে মুছে যাবে না। GitHub repository-তে থাকা code এবং Firebase/Firestore-এর data আলাদা বিষয়।

Recovery-এর সময়:
1. GitHub account/recovery access ফিরিয়ে আনুন।
2. `muyeedsarker/JORON` repository খুলুন।
3. `main` branch ব্যবহার করুন।
4. Live Pages URL যাচাই করুন।
5. Firebase project ID `joron-d7742`-এর access ফিরিয়ে আনুন।
6. নতুন Gmail দিয়ে কাজ শুরু হলেও existing Firebase project বদলে নতুন project তৈরি করবেন না।
7. আগে backup/বর্তমান code সংরক্ষণ, তারপর edit।

**কখনো এই নথিতে password, OTP, API secret বা private key লিখবেন না।**

## 3. MAIN PAGES / LINKS

1. Homepage — https://muyeedsarker.github.io/JORON/
2. Login — https://muyeedsarker.github.io/JORON/login.html
3. Signup / Registration — https://muyeedsarker.github.io/JORON/signup.html
4. Smart Biodata — https://muyeedsarker.github.io/JORON/smart-biodata.html
5. Biodata redirect — https://muyeedsarker.github.io/JORON/biodata.html
6. Profile — https://muyeedsarker.github.io/JORON/profile.html
7. Profiles / Search — https://muyeedsarker.github.io/JORON/profiles.html
8. Matching — https://muyeedsarker.github.io/JORON/matching.html
9. Interest — https://muyeedsarker.github.io/JORON/interest.html
10. Interests — https://muyeedsarker.github.io/JORON/interests.html
11. Love — https://muyeedsarker.github.io/JORON/love.html
12. Chat — https://muyeedsarker.github.io/JORON/chat.html
13. Safe Chat — https://muyeedsarker.github.io/JORON/safe-chat.html
14. Free Chat — https://muyeedsarker.github.io/JORON/free-chat.html
15. Meeting — https://muyeedsarker.github.io/JORON/meeting.html
16. Story — https://muyeedsarker.github.io/JORON/story.html
17. Magic Features — https://muyeedsarker.github.io/JORON/magic-features.html
18. Magic Filter — https://muyeedsarker.github.io/JORON/magic-filter.html
19. Features — https://muyeedsarker.github.io/JORON/features.html
20. Membership — https://muyeedsarker.github.io/JORON/membership.html
21. Payment — https://muyeedsarker.github.io/JORON/payment.html
22. Dashboard — https://muyeedsarker.github.io/JORON/dashboard.html
23. Settings — https://muyeedsarker.github.io/JORON/settings.html
24. Help / Support — https://muyeedsarker.github.io/JORON/help.html
25. Privacy Policy — https://muyeedsarker.github.io/JORON/privacy.html
26. Terms & Conditions — https://muyeedsarker.github.io/JORON/terms.html
27. Report — https://muyeedsarker.github.io/JORON/report.html
28. Admin — https://muyeedsarker.github.io/JORON/admin.html

**Note:** সব listed URL-কে একই সময়ে production-complete ধরে নেওয়া যাবে না। কোনো পেজ prototype, redirect, foundation বা incomplete থাকতে পারে। Code/status যাচাই করে তারপর feature complete বলা হবে।

## 4. MAGIC FEATURES

বর্তমান inspected `magic-features.html`-এ দেখা ফিচারগুলো:

1. Meeting
2. New
3. Voice
4. Online
5. For You
6. Nearby
7. Random
8. Premium
9. Education
10. Profession
11. Status
12. Free
13. Religion
14. Astrology
15. Birthday
16. Photoless
17. Relocation
18. ঘরজামাই
19. Story
20. প্রবাসী

**Important:** পুরোনো আলোচনায় ২১টি Magic Feature-এর কথা ছিল, কিন্তু inspected current code-এ ২০টি button পাওয়া গেছে। ২১তমটি অনুমান করে যোগ করা যাবে না; পুরোনো code/history থেকে শনাক্ত করতে হবে।

Target visual layout: **desktop-এ 4 buttons per row; 5 rows = 20 buttons**. যদি ২১তম feature নিশ্চিতভাবে পাওয়া যায়, layout সেই অনুযায়ী সামঞ্জস্য করতে হবে।

## 5. CORE USER FLOW

`Signup → OTP → Login → Smart Biodata → Firestore → Profile → Search/Filter → Interest → Match → Chat → Meeting`

পরবর্তী production roadmap:

`Foundation → Registration → Smart Biodata → Privacy → Partner Preference → Search → Smart Match → Verification → Communication → Membership/Payment → Help/Admin → Security/Testing → Launch`

## 6. SMART BIODATA

Required direction:
- Personal information
- Present address
- Permanent address
- Education
- Profession
- Financial information
- Family information
- Family environment
- Religion/lifestyle
- Personality/hobbies/about me
- Previous marriage
- Child privacy
- Health/privacy controls
- Partner preference
- Top-3 priorities
- Photo/verification
- Per-field visibility

Address hierarchy:
**Division → District → Upazila/Thana → Post Office → Area/Village**

Education should support:
- General
- Madrasah

Privacy defaults:
- Public
- Logged-in users
- Approved persons
- Only me

Sensitive information such as phone, email, exact address, income, health and child information must be protected by default.

## 7. FIREBASE / DATA

Firebase project ID: `joron-d7742`

Current architecture direction:
- Firebase Authentication for authentication/passwords.
- Firestore for biodata and application data.
- Private biodata separated from privacy-safe public profile projection.
- Public profile projection is intended for Profiles/Matching.
- Firestore should remain default-deny with owner/participant-specific access.
- Firebase Storage should remain default-deny and owner-controlled.

**Never store passwords in Firestore. Never weaken security rules just to make a page load.**

## 8. CURRENT ENGINEERING STATUS

The existing project handoff records approximately:
- UI/Design: ~85%
- Mobile responsiveness: ~85%
- Home: ~90%
- Login/Signup: ~80%
- Smart Biodata: ~65%
- Profiles/Search: ~70%
- Smart Matching: ~45%
- Interest/Chat: ~40%
- Membership/Payment: ~35%
- Security/Privacy hardening: ~45%
- Admin/Moderation: ~40%
- Testing: ~30%
- Production launch readiness: ~25%

These are approximate project estimates, not automated test results.

## 9. SAFE DEVELOPMENT RULE

Every change must follow:

**inspect → implement → test → backup/preserve → verify → next stage**

Rules:
- Do not restart the project.
- Do not unnecessarily replace working pages.
- Do not delete existing features without explicit approval.
- Do not change Firebase project ID without explicit reason.
- Do not expose private credentials in code or documentation.
- Before changing a page, inspect its current code and related JS/CSS.
- After changes, verify links and authentication/data flow.

## 10. CURRENT NEXT PRIORITY

1. Complete Smart Biodata + Firestore save verification.
2. Verify General/Madrasah education branching.
3. Verify Division → District → Upazila/Thana → Post Office → Area/Village address flow.
4. Verify privacy/visibility fields and sensitive-data defaults.
5. Verify save, edit/update, validation errors and reload persistence.
6. Then complete Profile View with privacy-aware display.
7. Then Advanced Search.
8. Then explainable Smart Match Score.
9. Then Photo + Verification.
10. Then Interest + Secure Chat + Block/Report.
11. Then Membership + real Payment verification.
12. Then Admin/Moderation/Audit.
13. Then security hardening and full regression testing.
14. Then production launch.

## 11. EXISTING PROJECT DOCUMENTS

- `README.md`
- `FEATURES_CHECKLIST.md`
- `JORON_MASTER_BLUEPRINT.md`
- `JORON_FULL_SITE_REDESIGN_BRIEF_2026.md`
- `JORON_PROJECT_HANDOFF_2026-08-22.md`
- `PROJECT_ROADMAP.md`
- `SECURITY_RELEASE_CHECKLIST.md`
- `_backup_before_religion_profile_2026-08-26.txt`
- `_joron_safety_marker_2026-08-26.txt`

These should be treated as project history/reference, not as permission to overwrite current working code.

## 12. RECOVERY FROM A NEW GMAIL / PHONE

If the original phone is lost:
- Use a trusted device and GitHub account recovery options.
- Open the repository and inspect `main`.
- Restore local project files from the repository or an external ZIP backup.
- Reconnect to the existing Firebase project `joron-d7742`.
- Verify Firebase Authentication, Firestore and Storage configuration.
- Verify GitHub Pages deployment.
- Continue from the current project handoff instead of rebuilding.

If the original Gmail is unavailable:
- Recover the GitHub/Firebase account through their official account-recovery process.
- Do not create a replacement Firebase project merely because the Gmail changed.
- Keep this Master Record and the GitHub repository as the project map.

## 13. BACKUP PLAN

Maintain at least:
1. GitHub repository (`main` branch)
2. Full ZIP backup of the project
3. A second independent copy of the ZIP
4. This Master Information & Recovery Record
5. Firebase/Firestore backup/export strategy before production

**Recommended:** before any major redesign, make a dated backup/commit first.

## 14. SECURITY REMINDER

Do not put the following into this file or GitHub:
- Gmail password
- GitHub password
- Firebase service-account private key
- OTP
- API secret
- Payment gateway secret
- Any user's private personal data

## 15. RESUME COMMAND

When returning to this project in a new ChatGPT/Gmail session, use this instruction:

**“JORON-এর কাজ চালিয়ে যান। প্রথমে `JORON_MASTER_INFORMATION_RECOVERY_2026.md` এবং `JORON_PROJECT_HANDOFF_2026-08-22.md` পড়ুন, তারপর `main` branch-এর বর্তমান code inspect করে যেখানে কাজ থেমেছে সেখান থেকে শুরু করুন। Existing working code নষ্ট করবেন না।”**

---

**Last master-record update:** 2026-09-02  
**Repository branch:** `main`
