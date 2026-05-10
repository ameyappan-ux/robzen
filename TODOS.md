# ROBZEN — Deferred Items

This file tracks deliberate deferrals from the Phase 1 (Credible Demo Core) scope.
Do not implement these before Phase 1 ships. Revisit after the first 5 SME pilot conversations.

---

## Before going live with a real domain (blocking)

- [ ] **Rate limiting on `/api/chat`** — Add `@upstash/ratelimit` (Redis) or Vercel's built-in rate limiting before the domain is shared publicly. Target: 20 requests / IP / hour. Without this, a single curious engineer can generate significant Anthropic API costs overnight.
- [ ] **Impressum — real legal address** — Replace placeholder text in `/impressum` with actual legal name, address, and contact. Required under § 5 TMG before any public traffic.
- [ ] **Datenschutzerklärung — real policy** — Replace placeholder in `/datenschutz` with a real GDPR-compliant policy covering contact form data processing. Recommend a German startup lawyer or a tool like e-recht24.de for generation.
- [ ] **Resend sender domain** — Verify `robzen.de` (or `robzen.com`) as a sending domain in Resend. The demo can use the shared `onboarding@resend.dev` sender, but real SME emails need a verified domain to avoid spam filters.

## Phase 2 features (deferred by design)

- [ ] **Provider portal** (`/anbieter-portal`) — Real integrator partner onboarding. Currently demo data only.
- [ ] **Admin/concierge dashboard** (`/admin`) — Internal view for the founder to review submitted profiles and manage conversations.
- [ ] **Offer comparison** (`/projekt/:id/angebote`) — Side-by-side comparison of provider proposals. Requires real provider network.
- [ ] **Provider matching cards** — Full matching algorithm. Phase 1 shows stub cards with "Demo-Daten" badge.
- [ ] **Use-case detail pages** — `/use-cases/[slug]` detail pages. Phase 1 has cards only.
- [ ] **Full i18n** — English toggle. Phase 1 is German only; EN stub in the nav is acceptable.
- [ ] **User accounts / auth** — No login in Phase 1. Project profiles are URL-encoded state only.

## Technical debt to address before Series A

- [ ] **E2E tests** — Playwright full user journey (homepage → Check → chatbot → Steckbrief).
- [ ] **Error monitoring** — Sentry or Vercel's built-in error tracking. Currently, API errors surface only in Vercel logs.
- [ ] **Analytics** — Simple event tracking (Check started, Check completed, Chatbot opened, Contact submitted). Plausible.io is GDPR-compliant and easy to configure.
- [ ] **OpenGraph images** — Dynamic OG images for `/projekt/[id]` shareable links (Vercel OG library).

---

*Last updated: 2026-05-10 — plan-eng-review*
