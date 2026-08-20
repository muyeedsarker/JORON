# Moderation E2E checklist

1. Non-admin opens `moderation.html` → access denied.
2. Admin opens dashboard → reports/users/logs load.
3. New report with `status: open` appears in Report review.
4. Resolve report updates status and writes a moderation log.
5. Action report updates status and writes a moderation log.
6. Admin enters valid UID and suspends user → `accountStatus=suspended`.
7. Admin bans user → `accountStatus=banned`.
8. Suspended/banned counters update.
9. Moderation log contains admin UID, action, target UID and server timestamp.
10. Verify Firestore rules/deployment in the real Firebase project before production release.

## Important
The dashboard is code-complete at the UI/data-flow level, but the final E2E pass must be run against the deployed Firebase project with a real admin account. Do not mark production verification green until that test passes.