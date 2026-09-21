# Wemo project conventions

## Typography

- English UI uses Plus Jakarta Sans for all text, headings, buttons, forms, navigation and business pages.
- Georgian UI uses BPG Nino Mtavruli. Preserve language-aware font selection.
- Font families and language selection live in `assets/fonts.css`. New components should inherit the font; use `var(--font-ui)` whenever a `font` shorthand or explicit `font-family` is necessary.
- Do not add different page-specific English fonts or restore Inter/Syne overrides. Choose weights and sizes within the shared family instead.
- Keep the bundled font license with the font files. Update stylesheet cache versions when changing typography.
