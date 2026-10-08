# Design System

Modelled on the layout, scroll and motion of perappelgren.de: a white page, small
type, big photographs, and motion that is driven by scroll position rather than
triggered once.

## Type
- **General Sans** (Fontshare) for everything on the page: 10px semibold caps in the
  nav, 29px body (`line-height 1.24`), 20.5vw uppercase gallery titles (`leading .78`).
- **Inter Tight** (Google Fonts) for the footer's 12px / 10px caps (`tracking .72px`).

## Colour
Tokens live in `src/index.css` (`:root` and `:root.dark`).
- Light: `--bg #fff`, `--ink #070912`, `--body #33333d`, ring backdrop `#e5e5e5`.
- Dark: `--bg #0b0b10`, `--ink #f1f1f4`, `--body #c4c4cf`, ring backdrop `#15151c`.
- Footer stays dark in both themes (`#0f0f15` / `#050508`).
- Nav uses `mix-blend-difference` so it reads over white, photos and the footer.

## Motion
- One Lenis instance and one rAF loop (`src/lib/scroll.js`). Sections subscribe with
  `useScrollFrame` (`src/lib/progress.js`) and write `transform` / `opacity` directly.
- Every scrubbed element enters and leaves: easeOutQuart in, easeInOutCubic out.
- UI transitions use `cubic-bezier(0.16, 1, 0.3, 1)` (cursor) and
  `cubic-bezier(0.22, 1, 0.36, 1)` (nav, footer reveals).
- `prefers-reduced-motion`: the gallery and ring swap to static layouts, nav and
  footer reveals become instant, Lenis smoothing is off.

## Sections
1. Preloader: the name fills left to right with image load progress.
2. Hero: 15 portrait tiles on an 8-column grid, each drifting at its own depth past
   the fixed name. Above-the-fold tiles gather into a stack, then scatter.
3. About: portrait plus two paragraphs, words rise in and drift out with scroll.
4. Work: one card per project, giant title track slides to the next name; passed
   cards settle into tilted side poses.
5. Ring: eight cards fan out of a stack into a rotating ring while three
   paragraphs swap letter by letter in the centre.
6. Contact: dark footer with details, social pills and a mailto form.

## Images
Drop photographs into `src/assets/photos/`; they fill the hero tiles and ring
before project screenshots are used.
