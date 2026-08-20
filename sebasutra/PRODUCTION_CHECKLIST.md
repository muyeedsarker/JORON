# সেবাসূত্র — Production Launch Checklist

**Brand:** সেবাসূত্র  
**Tagline:** আপনার প্রয়োজন, এক সূত্রে।  
**Creator By:** Muyeed Sarker

## Ready in prototype
- Responsive home UI
- Service discovery and search UI
- SOS UI and emergency-call entry points
- Blood, first-aid, snake-bite and animal-bite guidance screens
- Community/profile UI
- PWA shell and offline fallback
- Privacy/safety notices

## Required before public launch
- Secure backend and database
- Authentication and account recovery
- Donor verification, consent, availability and privacy controls
- Admin dashboard, moderation queue, audit logs and report/block workflow
- Verified emergency directory maintained from authoritative sources
- Maps/location provider and permission handling
- Weather/disaster provider with freshness timestamps
- Official/verified train and transport data feeds
- Hotel/tourism data source and booking links
- Prayer/Ramadan calculation/source validation by location
- Push notifications with opt-in controls
- Server-side rate limiting, abuse prevention and encrypted secrets
- Backup, monitoring, error logging and incident response
- Accessibility, Bengali/English localization and offline critical emergency content
- Android/iOS packaging, signing and store compliance
- Real-device QA and security/privacy review

## Data policy
Every dynamic item should expose one of: `Verified`, `Auto Updated`, or `Last Updated`. User-submitted community data must remain clearly separated from authoritative emergency information.

## Safety policy
The app must never present community posts as medical, emergency, transport or government authority. Critical flows should direct users to professional/official services when appropriate.
