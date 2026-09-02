# JORON Matrimony — Master Handoff & Recovery Document

**Last updated:** 2026-09-03

## 1. Project Identity
- Project: JORON Matrimony (জোড়ন)
- GitHub repository: `muyeedsarker/JORON-Matrimony`
- Firebase project: `joron-d7742`
- Firebase Web App: JORON Web
- Firebase Hosting: `https://joron-d7742.web.app`
- GitHub Pages: `https://muyeedsarker.github.io/JORON/`

## 2. Working Rule
**এক ধাপ → Test → Confirm → Next step**

Do not change existing code/config unless a real issue requires it.

## 3. Main User Flow
Signup → Login → Biodata/Onboarding → Firestore → Profile → Profiles/Search → Matching → Interest → Mutual Interest → Chat → Membership/Payment → Admin Verification

## 4. Completed Audit / Work
### STEP 1 — Authentication foundation
- `auth.js` and `auth-guard.js` integrated.
- Login/signup flow reviewed.

### STEP 2 — Core pages
Reviewed:
- `login.html`
- `signup.html`
- `profile.html`
- `biodata.html`
- `profiles.html`

### STEP 3 — Onboarding
- `onboarding-v4.html` uses `localStorage` key `joronOnboarding`.
- Eight onboarding steps reviewed.
- Smart Biodata handles later Firestore persistence.

### STEP 4 — Smart Biodata save
- `assets/smart-biodata-firebase.js` saves private biodata, public biodata projection and `publicProfiles` projection.
- Success message improved and redirect delay increased so the success message is visible.
- Commit: `bf6663689e7d51fb1dd7ed3509c0c00b36e9b831`

### STEP 5 — Visibility/Profile/Search
- Public visibility field is supported.
- `profile.html` reads `publicProfiles/{id}`.
- `profiles.html` searches only public profiles and supports basic filters.

### STEP 6 — Interest/Matching/Chat
- Interest service implemented.
- Mutual accepted interests required for chat.
- Smart Matching reviewed and Premium membership gate added.

### STEP 7 — Membership/Payment
Membership plans currently shown in `payment.html`:
- Basic — ৳99
- Standard — ৳199
- Premium — ৳399
- Premium Plus — ৳599

Membership request flow:
Plan selection → `users/{uid}` pending status → `payments/{uid}` pending record.

Membership access helper:
- `assets/membership-access.js`
- Commit: `e450087294f209944a23ff30905e84f5a687f7a1`

Smart Matching Premium gate:
- Commit: `a6fb042850379f0475c1c763c610efdcf6ae21cf`

Dashboard membership status card:
- Commit: `003fb2693a7660931adb46578c1de4687ffb1da0`

## 5. Admin Payment System
### Backend
Admin functions were merged into the deployed Functions source:
- `exports.adminListPendingPayments`
- `exports.adminReviewPayment`

Important: Firebase deploy source is `functions/`, as configured in `firebase.json`.

Functions commit:
`7de04f20241f6695aa6058f986c29c4ae87e4c8f`

### Admin UI
Created:
- `admin-payments.html`

Admin panel features:
- Pending payment list
- Approve
- Reject
- Refresh
- Firebase ID token authorization

Commit:
`e620b0ed19e93c2f113164ffb46d0f4cdfa7e20d`

## 6. Current Firebase Configuration
`firebase.json` contains:
```json
"functions": {
  "source": "functions",
  "runtime": "nodejs22"
}
```
It also configures Hosting, Firestore rules and Storage rules.

## 7. Current Blocker — Firebase Functions Deployment
Cloud Shell is now using the correct cloned project folder:
`~/joron-deploy`

Firebase CLI version tested:
`15.27.0`

Deploy command used:
`firebase deploy --only functions`

Result: Firebase correctly began deploying to `joron-d7742`, but deployment stopped because the project is on the **Spark** plan and required APIs such as Cloud Build and Artifact Registry require **Blaze** billing.

Google requested creation/linking of a Cloud Billing Account.

Current situation:
- No payment card available.
- Do NOT use someone else's card or share card/OTP/PIN information.
- Functions deployment is therefore postponed.

## 8. What To Do When Billing Is Available
From the correct folder:
```bash
cd ~/joron-deploy
firebase deploy --only functions
```

After successful deployment:
1. Open `admin-payments.html`.
2. Create/submit a controlled pending payment from `payment.html`.
3. Confirm the pending payment appears in Admin Payment Panel.
4. Approve it.
5. Confirm user dashboard shows Membership Active and Payment Paid.
6. Confirm Premium Smart Matching gate is removed for Premium-or-higher users.

Do not claim live deployment or end-to-end payment testing is passed until it is actually tested.

## 9. Current Important Files
- `firebase.json`
- `functions/index.js`
- `firestore.rules`
- `storage.rules`
- `payment.html`
- `admin-payments.html`
- `dashboard.html`
- `matching.html`
- `profiles.html`
- `profile.html`
- `smart-biodata.html`
- `assets/smart-biodata-firebase.js`
- `assets/membership-access.js`
- `membership-service.js`
- `assets/interest-service.js`
- `assets/chat-service.js`

## 10. Design Rules
- JORON should look premium, attractive and professional.
- Preserve the established gold/brown professional master theme where already used.
- Keep consistent bordered pill-style buttons.
- Avoid plain, unfinished-looking white pages.
- Preserve existing design unless a concrete issue requires change.
- Important brand text used in the established design:
  `❤️ J❤️R❤️N • নিরাপদ • সম্মানজনক • Smart Search`

## 11. Important Safety / Privacy Notes
- Never store or publish payment card details, CVV, OTP or PIN in project files.
- Never put sensitive payment credentials in GitHub.
- Client-side admin checks are UX only; Firebase Functions backend authorization is authoritative.

## 12. Next Step When Work Resumes
**STEP 8 — Live Deployment & End-to-End Verification**

Start by checking whether a valid Cloud Billing Account/Blaze upgrade is available. If yes, deploy Functions from `~/joron-deploy`. If not, continue finishing non-Functions work without changing the existing architecture.

## 13. Recovery Phrase
If starting in a new ChatGPT/Gmail session, say:

> **“JORON Master Handoff অনুযায়ী কাজ চালিয়ে যাও। বর্তমান blocker হলো Firebase Functions deploy-এর জন্য Blaze Billing/payment method প্রয়োজন।”**

This document is the project continuity reference; verify the live GitHub/Firebase state before making future changes.
