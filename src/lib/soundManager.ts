import { Howl, Howler } from 'howler'

export type SoundKey = 'startup' | 'click' | 'ambient'

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
  click: 'wii-click.mp3',
  ambient: 'wii-menu-music.mp3',
}

const srcFor = (key: SoundKey) => [`/sounds/${files[key]}`]

const AMBIENT_VOLUME = 0.5

/** The menu music fades to silence over this last stretch of the track. */
const AMBIENT_END_FADE_MS = 5000

/**
 * Timer that starts the end-of-track fade. Re-armed from the current position
 * every time playback starts or resumes, and dropped on pause/stop/end, so a
 * tab-out pause or leaving the menu can't leave it firing at the wrong moment.
 */
let ambientEndFadeTimer: number | null = null

function cancelAmbientEndFade() {
  if (ambientEndFadeTimer !== null) {
    window.clearTimeout(ambientEndFadeTimer)
    ambientEndFadeTimer = null
  }
}

function remainingMs(howl: Howl) {
  return Math.max(0, (howl.duration() - (howl.seek() as number)) * 1000)
}

function scheduleAmbientEndFade() {
  cancelAmbientEndFade()
  const ambient = getHowls().ambient
  ambientEndFadeTimer = window.setTimeout(() => {
    ambientEndFadeTimer = null
    // Fade over whatever is actually left, which is less than the full window
    // when playback resumed partway through it.
    ambient.fade(ambient.volume(), 0, Math.min(AMBIENT_END_FADE_MS, remainingMs(ambient)))
  }, Math.max(0, remainingMs(ambient) - AMBIENT_END_FADE_MS))
}

let howls: Record<SoundKey, Howl> | null = null

function getHowls(): Record<SoundKey, Howl> {
  if (!howls) {
    howls = {
      startup: new Howl({ src: srcFor('startup') }),
      click: new Howl({ src: srcFor('click') }),
      // Web Audio (html5 left off) on purpose. An <audio>-element stream is
      // lighter on memory, but it is also subject to a separate autoplay gate
      // and to seek/volume calls racing the element's load — which kept the
      // menu music silent. At ~5.5MB / 3min the decode cost is small enough
      // that the reliable path wins.
      ambient: new Howl({
        src: srcFor('ambient'),
        // Deliberately not looping: the track plays once from the top each
        // time the home menu is entered, fades out over its last few seconds,
        // then stays silent until the user comes back to it.
        loop: false,
        volume: AMBIENT_VOLUME,
        onplay: scheduleAmbientEndFade,
        onpause: cancelAmbientEndFade,
        onstop: cancelAmbientEndFade,
        onend: cancelAmbientEndFade,
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

/**
 * Set only when the music was paused because the tab went hidden, so coming
 * back resumes it — and only it. Music that had already ended, been stopped
 * by leaving the menu, or never started stays silent on return.
 */
let ambientPausedForHidden = false

/**
 * Listener waiting for the audio context to unlock so the menu music can
 * start, kept so a stop (or a StrictMode remount) can cancel it.
 */
let pendingAmbientStart: (() => void) | null = null

function cancelPendingAmbientStart() {
  if (pendingAmbientStart) {
    Howler.ctx?.removeEventListener('statechange', pendingAmbientStart)
    pendingAmbientStart = null
  }
}

function beginAmbient() {
  const ambient = getHowls().ambient
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
}

export const soundManager = {
  /**
   * Construct the Howls (and so begin fetching + decoding) ahead of first use.
   * Called as soon as the app mounts, so the menu music finishes loading while
   * the user is still reading the warning screen — otherwise loading wouldn't
   * begin until "press A", and the track would arrive seconds after the menu.
   */
  preload() {
    // iOS plays Web Audio through the ringer channel by default, so a phone on
    // silent hears nothing. Declaring this a media-playback session (Safari
    // 16.4+) routes it like a video instead. Not in the DOM typings yet.
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession
    if (session) session.type = 'playback'
    getHowls()
  },
  play(key: SoundKey) {
    getHowls()[key].play()
  },
  /**
   * Play only if the browser allows audio right now. A plain play() while
   * autoplay is locked isn't dropped: Howler queues it until the context
   * unlocks, so it would fire late, on the user's next click. For a sound
   * that isn't tied to a gesture, playing late is worse than not playing.
   */
  playIfUnlocked(key: SoundKey) {
    const howl = getHowls()[key]
    if (Howler.ctx?.state === 'running') howl.play()
  },
  /** True once the menu music is decoded and ready to play instantly. */
  isAmbientReady() {
    return getHowls().ambient.state() === 'loaded'
  },
  startAmbient() {
    getHowls()
    cancelPendingAmbientStop()
    cancelPendingAmbientStart()
    ambientPausedForHidden = false

    const ctx = Howler.ctx
    if (!ctx || ctx.state === 'running') {
      beginAmbient()
      return
    }

    // The context is still locked. No Howler call may be made in this state:
    // Howler queues calls made while locked and replays them after unlocking,
    // so a stop() from a StrictMode remount (or the rewind in beginAmbient)
    // would run right after the track starts and silence it for good.
    //
    // Only wait for the unlock when the visitor has already interacted — i.e.
    // they pressed A, whose unlock is still resolving. After the no-click
    // auto-advance the menu stays silent rather than springing into music on
    // some later click.
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return

    const onRunning = () => {
      if (ctx.state !== 'running') return
      cancelPendingAmbientStart()
      beginAmbient()
    }
    pendingAmbientStart = onRunning
    ctx.addEventListener('statechange', onRunning)
    // Also covers Howler's own 30s idle auto-suspend, which nothing else
    // would undo before the next play.
    void ctx.resume()
  },
  stopAmbient(fadeMs = 400) {
    const ambient = getHowls().ambient
    cancelPendingAmbientStart()
    ambientPausedForHidden = false
    if (!ambient.playing()) return
    cancelPendingAmbientStop()
    ambient.fade(ambient.volume(), 0, fadeMs)
    ambientStopTimer = window.setTimeout(() => {
      ambient.stop()
      ambientStopTimer = null
    }, fadeMs)
  },
  /** Pause the menu music while the tab is hidden, keeping its position. */
  pauseAmbientForHidden() {
    const ambient = getHowls().ambient
    // Mid fade-out means the user has already left the menu: let the stop
    // finish rather than pausing, or returning would resume it on another page.
    if (!ambient.playing() || ambientStopTimer !== null) return
    ambient.pause()
    ambientPausedForHidden = true
  },
  /** Pick the menu music back up where it was, if the tab hiding paused it. */
  resumeAmbientAfterHidden() {
    if (!ambientPausedForHidden) return
    ambientPausedForHidden = false
    getHowls().ambient.play()
  },
  setMuted(muted: boolean) {
    Object.values(getHowls()).forEach((howl) => howl.mute(muted))
  },
}
