# JORON (জোড়ন) — Full-Site Redesign Brief 2026

## 0. Context — existing repository

The repository already contains multiple legacy/override CSS files, duplicate HTML backups, preview pages and old splash-login variants. The redesign must **reduce** this complexity, not add another layer of overrides.

### Production rule
- One production theme only: `assets/joron-theme-2026.css`.
- Legacy CSS stays available under `assets/_archive/css/` for rollback.
- Backup/preview/obsolete HTML stays under `assets/_archive/html-backups/`.
- Do not rename or remove functional form IDs.
- Do not rewrite Firebase/Auth/Firestore module logic unless a separate functional bug is explicitly approved.
- Do not create additional theme CSS files.

## 1. Design system

### 1.1 Color tokens

```css
--ivory: #FBF7EF;
--paper: #FFFDF8;
--gold: #C79A45;
--gold-deep: #8D682D;
--gold-soft: #EAD9B5;
--gold-line: #DFCDA8;
--rose: #A85D68;
--rose-soft: #F3E4E5;
--sage: #667A67;
--ink: #2C2925;
--muted: #746E65;
--white: #FFFFFF;
--shadow: 0 10px 26px rgba(150,110,50,.08);
```

### 1.2 Typography
- Bengali headings: `Noto Serif Bengali`.
- English JORON wordmark: `Playfair Display`.
- Body/UI: `Hind Siliguri`, fallback `Noto Sans Bengali`.
- Heading color: `--gold-deep`.
- Body: `--ink`; secondary text: `--muted`.

### 1.3 Shapes
- Cards/sections: 18–22px radius.
- Buttons: 12–14px radius.
- Inputs: 14px radius.
- Border: `1px solid var(--gold-line)`.
- Shadow: warm and subtle only; avoid heavy SaaS shadows.

## 2. Signature components

### Logo
Use the existing JORON identity where available. Visual treatment: thin gold hollow heart/ribbon motif, `JORON` in Playfair Display, small Bengali tagline below. Do not invent a replacement brand identity.

### Header
- Ivory background.
- Full-width thin gold bottom border.
- Simple text navigation, no pill backgrounds for ordinary links.
- Active Login: gold outline.
- Register: solid gold.
- Mobile: compact menu and clear touch targets.

### Hero
- Desktop: two columns.
- Left: eyebrow, H1, subheading, two CTAs, three inline stats.
- Right: warm/soft visual using an existing approved JORON image asset when available; decorative rose motif may be CSS-only.
- Floating ivory micro-card: heart icon + `একটি সুন্দর সম্পর্কের শুরু হোক এখানেই`.
- Mobile: image stacks below text.

### Stats
Three inline stat pills: icon + number + label. No large background boxes.

### Profile cards
- 4:3 image.
- Name, age, location.
- Heart action floating over image.
- Thin gold border and large radius.
- Avoid excessive gradients.

### Biodata stepper
Four numbered circles connected by a line.
- Current step: solid gold.
- Other steps: ivory + gold outline.
- Label under each number.
- Must remain readable at <=650px.

### Footer
Cream background, four columns:
1. brand/tagline
2. site links
3. help/legal
4. social + app download CTA

Use a subtle rose decorative motif, not a large image that harms performance.

### Auth/contact cards
Ivory card, underlined tab treatment, comfortable inputs, full-width gold submit button. Social login buttons sit below the primary form action.

## 3. Page-by-page scope

### Priority A — benchmark pages
1. `index.html` — complete homepage redesign.
2. `profiles.html` — profile grid + search/filter.
3. `profile.html`, `profile-view.html` — single profile details.
4. `smart-biodata.html`, `biodata.html` — four-step form experience.
5. `login.html`, `signup.html` — authentication UI.

### Priority B — supporting user pages
6. `help.html`, `report.html`, contact-style pages.
7. `dashboard.html`, `matching.html`, `smart-matching.html`.
8. `interests.html`, `following.html`.
9. `chat.html`, `free-chat.html`, `safe-chat.html`.

These retain their existing functional layouts while receiving the same theme tokens/components.

### Priority C — informational/payment pages
10. `terms.html`, `privacy.html`, `privacy-policy.html`.
11. `verification.html`, `membership.html`, `payment.html`.
12. Other user-facing pages: only global visual system first; content structure remains intact.

### Priority D — internal/admin
- `admin.html`
- `admin-dashboard.html`
- `revenue-center.html`

Do these last unless a security/operational bug requires earlier attention.

## 4. Functional safety rules

### Never change
- `id="..."` values used by JavaScript.
- `input[id]`, `select[id]`, `textarea[id]` identifiers.
- Firebase `type="module"` logic.
- Firestore collection names.
- Auth event handlers.
- Existing service-module imports.
- Existing navigation destinations unless a broken link is explicitly fixed.

### May change
- CSS classes.
- Non-functional wrapper elements.
- Visual hierarchy.
- Button labels only when the existing action remains identical.
- Decorative markup.
- Responsive presentation.

## 5. Component library

The single theme should provide reusable classes including:

- `.btn-gold`
- `.btn-rose`
- `.btn-sage`
- `.card-ivory`
- `.profile-card`
- `.stat-pill`
- `.stepper`
- `.search-bar`
- `.filter-bar`
- `.form-card`
- `.auth-card`
- `.auth-tabs`
- `.panel`
- `.surface`
- `.badge`
- `.cta`

Components must be accessible, keyboard-friendly and visually consistent.

## 6. Responsive rules

### Desktop
- Main content max width: 1180px.
- Hero: two columns.
- Profiles: 4-column grid where width permits.
- Footer: four columns.

### Tablet
- 2-column profile/feature grids.
- Hero may remain two-column if comfortable.

### Mobile <=650px
- Single-column hero.
- CTAs become full width where necessary.
- Stats wrap without horizontal overflow.
- Profile cards may become 1–2 columns depending on viewport.
- Stepper remains four-step horizontal with compact labels; never overflow the viewport.
- Touch targets should be at least approximately 44px.
- No horizontal scrolling caused by navigation or cards.

## 7. Accessibility

- Maintain semantic headings in order.
- Every meaningful image gets useful `alt` text.
- Decorative images use empty alt text.
- Visible keyboard focus states.
- Sufficient contrast for body text and buttons.
- Buttons must have action-oriented labels.
- Do not rely on color alone to indicate active/error state.
- Form errors must be understandable in Bengali/English context.

## 8. Performance

- Prefer existing local image assets.
- Do not embed huge base64 images into HTML.
- Use responsive image sizing and `loading="lazy"` for below-the-fold images.
- Avoid unnecessary animation; decorative animation must respect `prefers-reduced-motion`.
- Keep the theme CSS consolidated.
- Do not load multiple competing Google font families unnecessarily.

## 9. SEO and metadata

Every public user-facing page should have:
- unique `<title>`;
- concise meta description;
- viewport metadata;
- appropriate language declaration (`lang="bn"` where Bengali is primary);
- canonical URL where practical;
- Open Graph title/description/image for shareable pages.

Do not expose private profile data in metadata.

## 10. Security/privacy

- Do not expose private Firestore data in public markup.
- Do not weaken Firestore/Auth rules as part of visual redesign.
- Preserve authentication guards.
- Avoid putting secrets, tokens or private IDs in HTML.
- Payment UI must not claim payment verification unless backend verification exists.
- Keep user profile visibility semantics intact.

## 11. Testing matrix

For every redesigned batch:

### Visual
- Chrome Android.
- Desktop Chrome.
- Widths around 390px, 430px, 768px, 1024px and 1440px.
- No horizontal overflow.
- No duplicate headers, badges or CTAs.

### Functional
- Login submit.
- Signup submit.
- Logout.
- Biodata load/save/edit.
- Matching/profile navigation.
- Interest send/receive where available.
- Chat navigation.
- Payment CTA/navigation.

### Firebase
- Confirm auth state still resolves.
- Confirm Firestore writes use the same IDs/paths.
- Confirm protected pages still redirect correctly.

## 12. Execution order

### Phase 1
1. Create `assets/joron-theme-2026.css`.
2. Archive legacy CSS/duplicate HTML.
3. Wire the new theme into production pages.
4. Redesign `index.html` as the visual benchmark.

### Phase 2
After homepage verification:
- profiles + profile + profile-view;
- smart-biodata + biodata;
- login + signup.

### Phase 3
- help/report/contact;
- dashboard/matching/smart-matching;
- interests/following/chat variants.

### Phase 4
- legal/payment/membership/verification;
- admin/internal pages.

## 13. Git/rollback strategy

- Work in small batches of approximately 5–6 pages.
- Each batch gets a clear commit message.
- Keep legacy files under `assets/_archive/` until the redesigned site passes QA.
- Never use automated workflows that continuously rewrite the same production pages.
- If a batch breaks a functional page, revert that batch only.

## 14. Definition of Done

The redesign is complete when:

- All user-facing pages share the 2026 theme.
- There are no competing production theme CSS links.
- Backup/legacy CSS and duplicate HTML are archived.
- No functional IDs were renamed.
- Firebase/Auth/Firestore behavior remains intact.
- Mobile layout works without horizontal overflow.
- Login, signup and biodata save flows pass functional checks.
- Public profile privacy behavior remains intact.
- No duplicate visual components remain.
- GitHub Pages deploys successfully.
- The final production ZIP contains the clean production tree plus clearly separated archive files.

## 15. Master instruction

> Redesign the JORON GitHub repository according to this brief. Use `assets/joron-theme-2026.css` as the single production theme. Start with `index.html` as the visual benchmark, then proceed in small reviewed batches. Preserve every functional Firebase/Auth/Firestore script and every JavaScript-used form ID. Do not create another CSS override layer. Archive legacy CSS and backup HTML instead of deleting them. Test every batch on mobile and desktop before moving to the next batch.
