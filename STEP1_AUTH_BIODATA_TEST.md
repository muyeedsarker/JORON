# JORON — Step 1 Verification Checklist

## Authentication → Smart Biodata → Profile

1. Login with email/password and confirm Firebase session is established.
2. Confirm protected pages redirect unauthenticated users to login.
3. Complete Smart Biodata and save it to Firestore.
4. Reload the page and confirm saved biodata is restored from Firestore.
5. Edit one or more fields and confirm the same user's record updates.
6. Confirm public profile pages only expose the intended public projection.
7. Confirm logout clears the session and protected routes are inaccessible.

## Security checks

- Private biodata must remain owner-only.
- Public profile data must not expose private fields.
- No full private biodata should be stored as the source of truth in localStorage.
- Firestore rules must remain default-deny for unspecified collections.

This checklist is intentionally documentation-only; existing application logic is not replaced by this file.
