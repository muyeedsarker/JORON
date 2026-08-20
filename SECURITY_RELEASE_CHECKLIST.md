# JORON Production Release Checklist

## Implemented
- Firebase Auth foundation and protected pages
- Authenticated Profile/Interest/Report flows
- Firestore default-deny rules
- Owner-scoped biodata/users/interests
- Write-only safety reports for clients
- Firebase-backed Smart Match
- Participant-scoped Chat rules

## Required before production launch
- Deploy and validate Firestore rules in the real Firebase project
- Verify Auth providers, email verification, password reset and account recovery
- Add and test real-time chat client against the participant-scoped rules
- Add server-side/admin moderation path; never expose report reads to normal clients
- Implement payment gateway webhook/server verification; never trust client payment status
- Connect Android app to the same Firebase project and validate Auth/Firestore/Storage
- Add App Check, abuse/rate-limit controls and monitoring
- Run emulator/security tests for cross-user reads/writes
- Run end-to-end tests on login, registration, profile, interest, report, match and chat
- Review privacy policy, consent, account deletion and data-retention requirements
- Create a production backup/rollback plan

## Release gate
Do not mark JORON production-ready until every required item above is verified in the deployed environment.
