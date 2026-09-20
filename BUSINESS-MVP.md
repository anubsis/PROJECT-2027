# Wemo Business MVP

Open **Profile → Wemo Business / ბიზნესისთვის**. Choose **Add your business**, **Claim an existing business**, or **Explore demo business**.

The business workspace reuses the existing Wemo shell, icons, fonts, and light/dark theme tokens. It does not require a build step or additional runtime dependencies.

## Try the complete workflow

1. Create or claim a business, or explore the sample courtyard restaurant.
2. Save the separate profile cards. Use **Preview on Wemo** to inspect your edits.
3. Open **Wemo AI → Talk to Wemo AI**. Answers update the editable AI information and completeness score.
4. Publish the business locally and create an offer, event, or experience in **Add to Wemo**.
5. Open the public preview and request a booking. Choose **View in Atlas** to follow its Pending, Confirmed, Completed, or Cancelled status. Owner changes appear in Atlas automatically in the same browser; the same request is managed in business **Bookings**. Existing Atlas examples are labelled Demo.
6. Inspect **Performance**, then switch plans in **Subscription** and download a simulated invoice from **Payments & billing**.

Published businesses join existing consumer search. Active, unexpired events appear on Events; offers and experiences appear on Deals. These links open the owner's public preview. Unpublishing removes the local content on the next consumer page load.

## Local preview

From the repository root:

```sh
node tests/business-server.cjs
```

Open http://127.0.0.1:4173/profile.html. All pages should be served from the same origin so browser storage is shared.

## Implementation boundaries

- `assets/js/business-store.js`: versioned local repository, sample fixtures, plan definitions, completeness calculation, and asynchronous AI provider contract.
- `assets/js/business-i18n.js`: Georgian interface translations and locale helpers using the existing Wemo language preference.
- `assets/js/business-workspace.js`: business routes, reusable cards/forms, event handling, validation, uploads, and owner/customer preview flows.
- `assets/css/pages/business-workspace.css`: scoped styling using shared Wemo design tokens.
- `assets/js/storage.js`: additive consumer discovery adapter for locally published owner content.
- `assets/js/app.js`: existing business renderer hook, Profile entry label, and owner listing links.

Data is saved under `wemo-business-v1` in localStorage. Image uploads support PNG, JPEG, and WebP up to 1 MB each; gallery images use URLs. Storage failures show a message instead of claiming the save succeeded.

This is a single-business, browser-local MVP. It does not verify ownership, authenticate owners, sync across devices, send customer messages, process payments, or issue tax invoices. Publishing means visible within the same browser/origin. Plan prices, renewals, payment methods, invoices, and AI conversation responses are simulated. Discovery analytics are illustrative sample data in the demo and zero for new businesses; booking counts and completed value are derived from local requests. Availability is a per-booking guest limit, not a shared inventory calendar. All business routes follow the shared English/Georgian language and light/dark settings. Georgian uses the existing Noto Sans Georgian font. Language and appearance controls are available in the business header; switching language preserves unsaved form drafts. User-entered business content stays in its original language.

For production, replace the repository with an authenticated API, verify claims, store media in object storage, and connect analytics, notifications, and billing. Replace `WemoBusinessAI.respond({ field, answer, information })` with an AI service returning `{ field, value, reply }`; never put provider secrets in client code.

## Browser checks

Tests use Playwright and Microsoft Edge in isolated browser contexts; they do not modify the user's browser data.

```sh
node tests/business-workflow.cjs
node tests/business-edge-cases.cjs
node tests/business-settings.cjs
node tests/atlas-booking-status.cjs
```

Playwright must be available through normal Node resolution or `NODE_PATH`. On this workspace it is available in the bundled Codex runtime. Tests cover the full workflow, consumer integration, state persistence, plan limits, claims, publish validation, booking transitions, uploads, expired dates, and layouts down to 320 px. Screenshots are written to `tests/business-*.png` for visual inspection.
