# GDG Hackathon @ UF

Website for the Google Developer Group at UF hackathon, built as a tribute to the
Nintendo Wii system menu: a boot warning screen, a startup animation, and a 4x3
grid of "channels" that serve as the site's navigation.

**Event date: October 24th**

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run lint
```

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4, React Router, Framer Motion for
animation, and Howler.js for audio.

## Layout

```
src/
├── components/
│   ├── boot/         warning screen + startup animation
│   ├── home-menu/    the Wii-style channel grid and bottom bar
│   ├── cursor/       the pointer that replaces the OS cursor
│   ├── content/      per-page pieces (track cards, FAQ, team, sponsors…)
│   └── layout/       shared page shell
├── data/             ← edit these to change site content
├── lib/soundManager.ts
└── pages/
```

### Editing content

Everything visitors read lives in `src/data/` — `tracks.ts`, `sponsors.ts`,
`teamMembers.ts`, `faq.ts`, `aboutContent.ts`, and `siteConfig.ts` (event date,
contact, socials). The components render whatever is in those files, so adding a
track or an FAQ entry needs no component changes.

`src/data/channels.ts` defines the 12 home-menu tiles. A tile with
`image: '/channels/whatever.png'` renders that art full-bleed and hides its text
label; without one it falls back to a coloured tile with the label.

### Audio

`public/sounds/` holds the cues, mapped to events in `src/lib/soundManager.ts`.
The filename there must match exactly — Howler picks a source by codec support,
not by retrying when one 404s. See `public/sounds/README.md`.

`hover-bloop.wav` is still a silent placeholder.

## Geometry

The home menu's proportions (grid margins, tile size, the bottom bar's wave, the
button positions) were measured by sampling pixels from a reference screenshot
and are expressed as percentages of a 637x347 screen, so they hold at any window
size. `Wii-References/` keeps those screenshots, and `Wii-Menu-Research.pdf` has
the measurements written up.

## Note on assets

The reference screenshots and the sound effects in this repository are Nintendo's
and are used here only as a non-commercial student-club tribute. Replace them with
original assets before using this anywhere that matters.
