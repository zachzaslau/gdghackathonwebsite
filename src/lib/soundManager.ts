import { Howl, Howler } from 'howler'

export type SoundKey = 'startup' | 'hover' | 'click' | 'ambient'

/**
 * Exact file per cue, extension included. Howler's multi-source `src` array
 * selects by codec support rather than falling back on a 404, so each cue must
 * name a file that actually exists. Prefer .mp3 — roughly 10x smaller than .wav.
 *
 * `startup` and `click` deliberately share one file: it's the Wii click, used
 * both for "press A" on the warning screen and for opening a channel. The
 * browser caches it, so it's only fetched once.
 */
const files: Record<SoundKey, string> = {
  startup: 'wii-click.mp3',
  hover: 'hover-bloop.wav', // silent placeholder
  click: 'wii-click.mp3',
  ambient: 'wii-menu-music.mp3',
}

const srcFor = (key: SoundKey) => [`/sounds/${files[key]}`]

const AMBIENT_VOLUME = 0.5

let howls: Record<SoundKey, Howl> | null = null

function getHowls(): Record<SoundKey, Howl> {
  if (!howls) {
    howls = {
      startup: new Howl({ src: srcFor('startup') }),
      hover: new Howl({ src: srcFor('hover') }),
      click: new Howl({ src: srcFor('click') }),
      // Web Audio (html5 left off) on purpose. An <audio>-element stream is
      // lighter on memory, but it is also subject to a separate autoplay gate
      // and to seek/volume calls racing the element's load — which kept the
      // menu music silent. At ~5.5MB / 3min the decode cost is small enough
      // that the reliable path wins.
      ambient: new Howl({
        src: srcFor('ambient'),
        // Deliberately not looping: the track plays once from the top each
        // time the home menu is entered, then stays silent until the user
        // comes back to it.
        loop: false,
        volume: AMBIENT_VOLUME,
        onloaderror: (_id, err) =>
          console.warn(`[sound] menu music failed to load (${files.ambient}):`, err),
        onplayerror: (_id, err) =>
          console.warn(`[sound] menu music failed to play (${files.ambient}):`, err),
      }),
    }
  }
  return howls
}

/**
 * Pending stop timer, tracked so a restart can cancel it. Without this, a
 * mount -> unmount -> mount cycle (React StrictMode does exactly this in dev)
 * leaves the previous fade-out's stop() queued: the restart sees the track
 * still "playing", skips play(), and then the stale timer stops it for good.
 */
let ambientStopTimer: number | null = null

function cancelPendingAmbientStop() {
  if (ambientStopTimer !== null) {
    window.clearTimeout(ambientStopTimer)
    ambientStopTimer = null
  }
}

export const soundManager = {
  /**
   * Construct the Howls (and so begin fetching + decoding) ahead of first use.
   * Called as soon as the app mounts, so the menu music finishes loading while
   * the user is still reading the warning screen — otherwise loading wouldn't
   * begin until "press A", and the track would arrive seconds after the menu.
   */
  preload() {
    getHowls()
  },
  play(key: SoundKey) {
    getHowls()[key].play()
  },
  /** True once the menu music is decoded and ready to play instantly. */
  isAmbientReady() {
    return getHowls().ambient.state() === 'loaded'
  },
  startAmbient() {
    const ambient = getHowls().ambient
    cancelPendingAmbientStop()
    // Volume is always set outright rather than faded up. A fade-in is driven
    // by a timer that can stall (background tab, throttling) or be cut short
    // by a pending fade-out, and the failure mode is the worst one available:
    // the track plays at volume 0 and seems not to work at all.
    ambient.volume(AMBIENT_VOLUME)
    if (ambient.playing()) return
    // stop() rewinds to 0, so entering the menu always begins the track
    // rather than resuming part-way through from a previous visit.
    ambient.stop()
    ambient.play()

    // If the browser's autoplay lock hasn't lifted yet, the play() above is a
    // silent no-op and nothing would ever retry — the music would simply never
    // start. Resume the context and play again as soon as it unlocks.
    const ctx = Howler.ctx
    if (ctx && ctx.state !== 'running') {
      const onRunning = () => {
        if (ctx.state !== 'running') return
        ctx.removeEventListener('statechange', onRunning)
        if (!ambient.playing()) {
          ambient.volume(AMBIENT_VOLUME)
          ambient.play()
        }
      }
      ctx.addEventListener('statechange', onRunning)
      void ctx.resume()
    }
  },
  stopAmbient(fadeMs = 400) {
    const ambient = getHowls().ambient
    if (!ambient.playing()) return
    cancelPendingAmbientStop()
    ambient.fade(ambient.volume(), 0, fadeMs)
    ambientStopTimer = window.setTimeout(() => {
      ambient.stop()
      ambientStopTimer = null
    }, fadeMs)
  },
  setMuted(muted: boolean) {
    Object.values(getHowls()).forEach((howl) => howl.mute(muted))
  },
}
