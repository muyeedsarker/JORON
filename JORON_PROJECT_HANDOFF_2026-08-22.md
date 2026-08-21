# JORON Project Handoff — 2026-08-22

## 1. Source of Truth
- GitHub repository: `muyeedsarker/JORON`
- Main branch: `main`
- GitHub Pages: `https://muyeedsarker.github.io/JORON/`
- Firebase project: `JORON`
- Firebase project ID: `joron-d7742`
- The GitHub repository is the source of truth. Existing working code/design must be inspected before changes; do not restart from scratch.

## 2. Current Overall Status
Estimated project completion: **about 60–65%**.

This is not a claim that 35–40% of the existing code is “wrong”. Most of the remaining percentage represents incomplete production functionality, testing, backend hardening, and roadmap features.

Approximate status:
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

Known bug/error estimate is much lower than the unfinished-work percentage: roughly **5–10% known issues**, while roughly **35–40% is unfinished or not yet production-ready**.

## 3. Work Already Present
- Premium mobile-first Home and master logo.
- Registration/Login pages.
- Smart Biodata foundation.
- Partner Preference flow/foundation.
- Member Dashboard and match-readiness foundation.
- Profiles/Matching pages.
- Membership/Payment page foundation.
- Privacy & Safety information.
- Report flow prototype.
- Help Center.
- Interest/Chat prototype.
- Firebase-compatible static-page structure.
- Profiles page has search/filter work including gender, age, district, education system, and profession, plus profile cards and `profile.html?id=...` navigation.
- Home branding has been visually refined, including JORON tagline positioning and stronger page/button colors. Do not redesign this again unless specifically requested.

## 4. Smart Biodata Direction
The Master Blueprint requires:
- Personal information
- Select-based present/permanent address
- Education
- Profession
- Financial
- Family
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
**Division → District → Upazila/Thana → Post Office → Area/Village**.

Education must support both **General** and **Madrasah** paths.

## 5. Privacy Rules to Preserve
- Never collect children's names/photos/school names/phone numbers/exact addresses for matrimonial profiles.
- Child information should be limited to necessary aggregate information such as count, age/age range, and living arrangement.
- Phone, email, exact address, income, health, child information and sensitive family information are protected by default.
- Visibility levels: Public, Logged-in users, Approved persons, Only me.
- Passwords must not be stored in Firestore; authentication belongs to Firebase Authentication.
- Match score must represent compatibility, never payment status.
- Never claim “100% security”.

## 6. Important Deployment Note
A recent GitHub Actions Pages run showed red/cancelled jobs. The provided run was cancelled because a higher-priority Pages build/deployment request was waiting. This was a deployment cancellation, not evidence of three separate code errors.

Do not treat that cancelled run as a 3-error code failure.

## 7. Exact Next Stage
**STOP POINT: 2026-08-22. No further feature work should be started from this document.**

When work resumes, begin with:

### NEXT STEP #1 — Smart Biodata completion and Firestore save verification
1. Inspect the current `smart-biodata.html`, `biodata.html`, Firebase initialization and Firestore rules from `main`.
2. Do not replace the existing design unnecessarily.
3. Verify that the complete Smart Biodata form saves correctly to Firestore for the authenticated user.
4. Verify General/Madrasah education branching.
5. Verify structured address selection: Division → District → Upazila/Thana → Post Office → Area/Village.
6. Verify privacy/visibility fields and sensitive-data defaults.
7. Test successful save, edit/update, validation errors, and reload persistence.
8. Only after this is working should the next stage begin.

### NEXT STEP #2 after #1 passes
Complete the Profile View (`profile.html`) using the saved biodata, photo/verification support, privacy-aware field visibility, and safe public display.

### Then continue in this order
1. Smart Biodata + Firestore completion/testing
2. Profile View + privacy
3. Advanced Search
4. Explainable Smart Match Score
5. Photo + Verification
6. Interest + Secure Chat + Block/Report
7. Membership + real Payment + expiry/grace period
8. Admin + moderation + audit
9. Security hardening
10. Full testing/regression
11. Final production launch

## 8. Development Rule
Every stage must be:
**inspect → implement → test → backup/preserve → verify → then move to the next stage.**

Do not start over. Do not unnecessarily replace existing working pages. Do not guess Firebase configuration. Verify the current code and rules before modifying them.

## 9. Resume Instruction
If this project is continued in a new ChatGPT/Gmail account, provide this document together with the GitHub repository. The new session should first read this handoff and inspect the current `main` branch before making any code change.

**Resume point:** Smart Biodata completion + Firestore save verification.
