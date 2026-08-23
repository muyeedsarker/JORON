# JORON | জোড়ন

**আমরা সম্পর্ক জুড়ে দিই।** ❤️

JORON is a Bangladesh-first, privacy-conscious Smart Matrimonial Matching Platform concept focused on meaningful compatibility—not just biodata.

## Current build
- 🏠 Premium mobile-first Home + Master Logo
- 👤 Registration / Login pages
- 📝 Smart Biodata foundation
- ❤️ Partner Preference flow
- 🤖 Member Dashboard + Match-readiness score foundation
- 🔎 Profiles / Matching pages
- 💎 Membership / Payment page foundation
- 🔐 Privacy & Safety information
- 🚨 Report flow prototype
- 🤖 Help Center
- 💬 Secure Interest / Chat prototype

## Current engineering update — August 2026
- 🔐 Private Biodata is separated from the privacy-safe public profile projection.
- ☁️ Smart Biodata persists in Firebase/Firestore instead of keeping the full private record in browser localStorage.
- 👥 Profiles/Matching are being prepared to read only the public profile projection.
- 🔐 Firestore uses default-deny rules with owner-only private biodata, participant-only interests/chats, and user-owned account data.
- 🗂️ Firebase Storage now has default-deny, owner-only upload/read/delete rules with a 5 MB image limit.
- 🔑 Shared Firebase client/session persistence and a reusable protected-route/logout guard have been added as the next Authentication hardening layer.
- 🧪 Production hardening is being applied before public launch; Firebase Auth enforcement, chat privacy, payment verification, moderation, App Check, rate limiting, backups and end-to-end tests remain release gates.

## Important production note
The frontend is being built in GitHub Pages/Firebase-compatible static pages. Real production features such as Firebase Authentication enforcement, Firestore data access, real-time chat, payment-gateway verification, admin moderation, identity verification, App Check, rate limiting, backups and server-side security must be configured and tested in the Firebase/backend environment before a public production launch.

## Master direction
**শুধু বায়োডাটা নয়—আপনার জন্য উপযুক্ত মানুষ খুঁজুন।**

The product roadmap prioritizes: Foundation → Registration → Smart Biodata → Previous Marriage & Child Privacy → Health & Privacy → Partner Preference → Search → Smart Match → Verification → Communication → Membership/Payment → Help Center → Admin → Ads/Marketplace → Security/Testing/Launch.
