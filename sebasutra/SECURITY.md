# সেবাসূত্র Security Baseline

সেবাসূত্রে রক্তদাতা, লোকেশন, জরুরি যোগাযোগ ও কমিউনিটি তথ্য সংবেদনশীল হতে পারে। Production release-এর আগে অবশ্যই:

- Authentication ও role-based access control
- Database encryption at rest/in transit
- Donor phone/location visibility controls
- Consent before location sharing
- Report/block and moderation workflow
- Admin audit logs
- Rate limiting and abuse protection
- Verified source labels and last-updated timestamps
- Secure secrets management; কোনো API key frontend-এ নয়
- Backup, deletion/export এবং privacy policy

Emergency features must respect Android/iOS permission and platform restrictions. The prototype must not claim to replace emergency professionals.
