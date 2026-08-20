# JORON Final Release Checklist

## Android
- [ ] Firebase Auth verified on Android
- [ ] Firestore reads/writes verified with authenticated user
- [ ] Storage upload/download verified with security rules
- [ ] FCM/push notifications verified on physical device
- [ ] Release build generated and signed
- [ ] Release build tested on supported Android versions

## Security
- [ ] Firebase App Check enabled for production apps/services
- [ ] Rate limits/abuse controls verified against authenticated and unauthenticated flows
- [ ] Storage rules tested for owner-only and authorized access
- [ ] Cross-user Firestore/Storage access denied
- [ ] Account deletion removes/retains data according to documented privacy policy
- [ ] No secrets/API credentials committed to client code

## Final QA
- [ ] Login → Profile → Match → Interest → Chat → Report happy path
- [ ] Block/report and read/unread behavior
- [ ] Admin moderation flow
- [ ] Manual bKash payment submission + admin verification
- [ ] Mobile browser testing
- [ ] Desktop browser testing
- [ ] Offline/network failure and retry/recovery testing
- [ ] Duplicate submission/idempotency testing

## Production launch
- [ ] Firebase rules/functions/config deployed
- [ ] Domain and hosting verified
- [ ] Production backup/restore procedure verified
- [ ] Monitoring/error reporting configured
- [ ] Final PR reviewed and merged
- [ ] Production smoke test completed

> Do not mark unchecked items complete without running the corresponding test in the real production/staging environment.