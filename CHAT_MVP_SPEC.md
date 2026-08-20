# JORON Secure Chat MVP

## Launch contract
- Only authenticated users can enter chat.
- A chat room must contain exactly two participant UIDs.
- Messages carry `senderId`, `text`, and `createdAt`.
- Clients cannot edit or delete messages.
- Firestore rules enforce participant membership and sender ownership.
- Do not place private phone/email/payment information in messages or URLs.
- User blocking/reporting must be implemented before public launch.

## Release gate
The chat UI/client must use these fields and rules; do not ship a client that relies on localStorage or anonymous identity for chat.
