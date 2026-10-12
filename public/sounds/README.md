# Sound stubs

The four `.wav` files in this folder are **silent placeholders** — they exist only so the
app's audio imports resolve and play without 404s or decode errors while there's no real
audio yet. Swap each one out **in place, keeping the exact filename**, and the site will
pick up the new sound with zero code changes.

| File | Trigger point | Status |
|---|---|---|
| `wii-click.mp3` | "Press A" on the warning screen, **and** opening a channel tile | real |
| `wii-menu-music.mp3` | Plays once from the top each time the home menu is entered (~3 min, fades out over its last 5s, does not loop) | real |

Cue-to-file mapping lives in `src/lib/soundManager.ts`. Two cues may share one
file (as `startup` and `click` both do); the browser caches it either way.

Guidelines when replacing:
- **`.mp3` and `.wav` both play fine**, but the filename in
  `src/lib/soundManager.ts` must match exactly — Howler picks a source by codec
  support, not by trying the next URL when one 404s. So if you swap a `.wav` for
  an `.mp3`, update that one line too. Prefer `.mp3`: ~10x smaller over the wire.
- Keep files small (aim for well under 200KB each) so the boot sequence stays snappy.
- Normalize loudness so `ambient-loop` doesn't drown out the SFX layered on top of it.
- Do not use ripped Nintendo/Wii audio on a public club site — write original sounds or
  use properly licensed ones.
