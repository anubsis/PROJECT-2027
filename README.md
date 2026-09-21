
# PROJECT-2027

Internal product prototype.

This repository contains UI experiments, design concepts, and frontend prototypes for a location-based mobile application.

## Run the working local app

With Node.js 22.13+ installed, run `npm start` and open http://localhost:4173. No package installation or external database is needed. Accounts, saved places, owned businesses and customer bookings persist in a local SQLite database.

See [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md) for the two-browser customer/owner workflow, same-Wi-Fi phone testing, data storage and remaining prototype features.

## Status

🚧 Work in Progress

## Notes

This repository is under active development and does not represent the final product.

Some assets, functionality, and documentation are intentionally omitted.

## Typography

English uses **Plus Jakarta Sans** throughout the app; Georgian uses **BPG Nino Mtavruli**. The shared families are defined in `assets/fonts.css` and selected through `--font-ui` by the page language.

All new text, titles, cards, dialogs and controls should inherit the font. When a CSS `font` shorthand or third-party component requires an explicit family, use `var(--font-ui)`. Do not introduce page-specific font families. Keep weight and size separate: use 700–800 for bold headings and 400–600 for readable body text. The English variable fonts and their license are hosted in `assets/fonts/plus-jakarta-sans/`.

Georgian regular and bold font files live in `assets/fonts/bpg-nino-mtavruli/`. Their source lists CC BY-NC-ND 4.0; commercial deployment requires appropriate font rights. Noto Sans Georgian remains a fallback for characters absent from BPG. Georgian capitals are a visual font treatment; stored text is not rewritten.
