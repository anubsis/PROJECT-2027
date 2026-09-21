# Running Wemo locally

## Start

Node.js 22.13 or newer is required (Node 24 recommended). No database service, npm packages, domain, cloud account, or deployment is needed.

```sh
npm start
```

Open http://localhost:4173. Keep that terminal running. Stop with Ctrl+C. Restarting preserves your accounts and data.

On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd start` or `node server/index.cjs`.

## Try a real customer and owner

1. In one browser, open **Profile → Sign in or create an account** and create an owner account.
2. Open **Wemo Business → Add your business**. Complete the profile, publish it, then add an active offer, event, or experience.
3. Open a different browser or an incognito window. Create a separate customer account.
4. Search for the business by name, open it, and request a booking. The date must fall within the listing dates and meet its minimum notice. Booking times use Georgia time (UTC+04:00).
5. The owner opens **Wemo Business → Bookings → New** and confirms the request.
6. The customer opens **Atlas → Bookings**. Status updates arrive automatically, usually within three seconds while the page is visible. Keep both windows open to watch the update.
7. Save a place as the customer, then sign into the same account in another browser. Atlas shows the same saved places. Reload an already-open Atlas page to refresh its saved-place list.

Published businesses are searchable and their listings appear under Events or Deals. Sample places remain examples; real booking requests are available through account-published businesses. Guests can browse published profiles but must sign in to save places or book. Each account can own one business and can also book other businesses.

## Phones on the same Wi-Fi

```sh
npm run start:lan
```

The terminal prints a local IP address, such as `http://192.168.1.20:4173`. Open that address on a phone on the same network. If Windows asks, allow Node on your **private network**. The computer must stay awake and keep the server running. A custom domain is not needed.

Use test credentials on a trusted network: this local server uses HTTP, not production HTTPS. `localhost` and the LAN IP have separate browser cookies; sign in at the address you use. No firewall or router settings are changed by Wemo.

## Data and access

- SQLite data is stored in `.local/wemo.sqlite`, with SQLite journal files alongside it. `.local/` is ignored by Git and is never served by the web server.
- Passwords use salted scrypt hashes. Sessions use random, revocable HttpOnly/SameSite cookies; the database stores token hashes. Sessions last seven days.
- Business editing and booking status changes require the owning account. Customer booking lists and saved places are private to the signed-in account.
- Booking prices, status transitions, listing activity, dates and per-booking guest limits are checked on the server. Duplicate submissions with the same request key return the same booking.
- Profile edits have a revision check. If another session changed the business, reopen that section before saving again; an old edit cannot overwrite newer changes.
- Keep `.local/` private. To back up, stop the server and copy the entire `.local/` directory. There is no automatic reset or import of browser demo data.
- Uploaded images remain in the business record for this small local MVP. An API request is limited to 3.5 MB total. Prefer image URLs or small uploads when adding several photos.

## What is still a prototype

Email verification, password recovery emails, business claim verification, payment processing, notifications, real AI recommendations and discovery analytics are not connected. Subscription changes and invoices remain simulations. AI conversations and sample trips remain local demos; their browser storage is separated by account, but those conversations/trips do not sync across devices yet. Theme/language preferences remain device-local.

Availability is a **per-booking guest limit**, not shared inventory across bookings. There is no automatic migration of the previous browser-only businesses or saved lists into accounts.

The original static demo remains available with `node tests/business-server.cjs` (stop the account server first because both default to port 4173). It uses separate browser-local demo data and does not expose real accounts. GitHub Pages cannot run the Node backend; use the local server for account tests.

Before public deployment, add HTTPS, email recovery/verification, deployment-specific security and backups, and confirm commercial font rights. No public deployment is performed here.

## Verification

```sh
npm test
node tests/local-workflow.cjs
```

The API test uses an isolated temporary SQLite database and checks account privacy, session logout, ownership, server-side pricing and booking validation, duplicate prevention, public-data filtering and server restart persistence. The browser test uses an in-memory database and separate owner/customer browser contexts; it does not change your real browser data or `.local/` database. Browser tests need Playwright and Microsoft Edge; this workspace already has them in its bundled runtime.

Run the existing `business-workflow`, `business-edge-cases`, `business-settings`, `atlas-booking-status` and `visual-polish` browser scripts for the static demo regression checks.
