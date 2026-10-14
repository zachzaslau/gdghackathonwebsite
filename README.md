# GDG Hackathon @ UF

Website for the Google Developer Group at UF hackathon, built as a tribute to the
Nintendo Wii system menu: a boot warning screen and a 4x3
grid of "channels" that serve as the site's navigation.

**Event date: October 24, 2026**

## Running it

```bash
npm install
npm run dev      # http://localhost:5173/devfest/
npm run build    # production build into dist/devfest/
npm run lint
```

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4, React Router, Framer Motion for
animation, and Howler.js for audio.

## Layout

```
src/
├── components/
│   ├── boot/         warning screen
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
`image: '/devfest/channels/whatever.png'` renders that art full-bleed and hides its text
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

## Production deployment

The canonical public URL is `https://ufgdg.com/devfest`. This app builds with
Vite's `/devfest/` base and React Router uses that same basename. Public image
and audio URLs include `/devfest/`; in-app `Link` destinations stay relative to
the router (for example, `/team`). Keep new public asset URLs under `/devfest/`.

The Vercel team is `9ldes-projects`. The `gdg-devfest` project hosts this app,
while `ufgdgoncampus` owns `ufgdg.com` and the main club website. A project-level
rewrite on `ufgdgoncampus` sends only `/devfest` and its descendants to
`https://gdg-devfest-delta.vercel.app/devfest`. The prefix is preserved. The hackathon
project publishes `dist/`, with all generated files inside `dist/devfest/` so
asset locations match their public URLs. Its `vercel.json` serves
`devfest/index.html` for client-side routes; existing static files are served
directly. The hackathon origin is public so the rewrite
can fetch it without deployment protection.

To publish an update, use Node 24, run `npm ci`, `npm run build`, and
`npm run lint`, then deploy this repository to `gdg-devfest` in production.
Verify `/devfest`, `/devfest/team`, a channel image, and a sound file through
`ufgdg.com`, and confirm the main club homepage still loads. Do not deploy this
app over the `ufgdgoncampus` project. If routing fails, inspect that project's
Routing Rules and restore the `/devfest` rewrite to the public production alias;
if a deep link fails, inspect this app's rewrite and router basename. There is
no supported root-path deployment mode.
