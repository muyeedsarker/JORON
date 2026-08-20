# JORON Chat E2E Test Plan

## Two authenticated test users
Use User A and User B with a chat room containing exactly those two UIDs.

1. A opens the room; B can open it; a third user is denied.
2. A sends a <=1000 character message; B receives it in real time.
3. B opens the room; A's message becomes read; A sees `✓✓ Read`.
4. B replies; A receives a browser notification when notifications are permitted.
5. A blocks B; A can no longer reopen the room and Firestore denies room reads.
6. A reports B; the report is write-only for the client and cannot be read by A or B.
7. Attempt to edit message text/createdAt/senderId from a client; Firestore must deny the write.
8. Attempt to delete a message; Firestore must deny the write.
9. Sign out and revisit the room URL; user must be redirected to login.
10. Try a message over 1000 characters; client truncates and rules reject oversized writes.

## Automated/live gate
This document defines the required cases. A production release must run these cases against the deployed Firebase project; repository code alone cannot prove live Firebase behavior.
