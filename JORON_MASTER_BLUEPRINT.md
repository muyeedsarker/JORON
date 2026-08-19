# JORON — Master Product Blueprint

> ❤️ আমরা সম্পর্ক জুড়ে দিই।

This document is the source of truth for the JORON matrimonial platform. The implementation is incremental: Foundation → Authentication → Smart Biodata → Matching → Communication/Payment → Admin/Security/Launch.

## Privacy rule
Children's names, photos, school names, phone numbers, exact addresses, and other direct identifying child information are never collected for matrimonial profiles. Only necessary aggregate information such as child count, age/age range, and living arrangement may be collected.

## Product principles
- Mobile-first, Bengali-first, accessible UI.
- Privacy controls on sensitive fields.
- No password stored in Firestore; authentication belongs to Firebase Authentication.
- Match scores must reflect compatibility, not payment.
- Sensitive health and financial information is not public by default.
- Verification badges require real verification; never claim 100% security.

## Feature scope
1. Home + Branding + Mobile Design
2. Firebase Registration + Login + Email Verification + Password Reset
3. Complete Smart Biodata
4. Previous Marriage + Child Privacy
5. Health + Privacy Controls
6. Partner Preference
7. Advanced Search
8. Explainable Smart Match Score
9. Photo + Verification
10. Interest + Secure Chat + Block/Report
11. Membership + Payment + Expiry/Grace Period
12. AI Help Center
13. Admin Panel + Audit
14. Advertisement
15. Marketplace
16. Success Stories
17. Security + Testing + Final Launch

## Smart Biodata sections
Personal; Select-based Present/Permanent Address; Education; Profession; Financial; Family; Family Environment; Religion/Lifestyle; Personality/Hobbies/About Me; Previous Marriage; Child Privacy; Health; Partner Preference; Top-3 priorities; Photo/verification; per-field visibility.

## Address hierarchy
Division → District → Upazila/Thana → Post Office → Area/Village.

## Profile visibility
Supported levels: Public, Logged-in users, Approved persons, Only me. Phone, email, exact address, income, health, child information, and sensitive family information are protected by default.

## Match explanation
Every score must show reasons, e.g. age, height, education, profession, district, family, values, lifestyle, and future residence. Paid membership must never directly increase compatibility score.

## Development rule
Each part should be implemented, tested, backed up, and only then promoted to the next stage. Existing working files must be preserved before destructive changes.
