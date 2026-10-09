# Design System

A macOS desktop as the landing page, modelled on elenagonci.com, then a scrolling page of
sections styled like Finder folders, notes and windows.

## Type and colour
- **Bricolage Grotesque** (Google Fonts, default optical size) for everything.
  Headline: extrabold, `tracking-tight`, 48px (60px on 2xl).
- White page, desktop `#fafafa`, ink black with opacity steps (`/85`, `/55`, `/35`).
- Accent `#ff3700` for text selection; macOS blue `#0069d9` for folder labels;
  pill buttons `#57A4F0`.
- Glass surface (widgets, dock, app grid): `bg-white/30`, `border-white/45`,
  `backdrop-blur-2xl backdrop-saturate-150`, `0 8px 32px rgba(0,0,0,.12)`.

## Desktop (`src/components/desktop`)
- Menu bar, live clock, calendar, music (opens Spotify), 7-day weather (Open-Meteo),
  photo, app grid and project folders. Everything is draggable (framer-motion,
  elastic 0.12, no momentum, scale 1.04 while dragging). Items fade up 8px, 50ms apart.
- Folders open a draggable macOS window with the project (`ProjectWindow.jsx`).

## Dock (`Dock.jsx`)
Sticky at the top once you scroll. Magnifies 40 → 60px within 100px of the cursor
(spring: mass 0.1, stiffness 180, damping 13) with a label tooltip.

## Sections (`Sections.jsx`)
Achievements, stacked sticky project folders with yellow notes, other projects list,
the Playground folder (opens Instagram), `about-me.txt` window, footer.
Blocks reveal with a 700ms fade-up the first time they enter the viewport.

## Content
All copy, links and the song live in `src/data/site.js`.
