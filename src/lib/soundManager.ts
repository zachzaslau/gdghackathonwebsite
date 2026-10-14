import { Howl, Howler } from 'howler'

export type SoundKey = 'startup' | 'click' | 'ambient' | 'tracks' | 'shop' | 'team' | 'about' | 'faq'

/** Background music: one track per page that has its own. */
export type MusicKey = 'ambient' | 'tracks' | 'shop' | 'team' | 'about' | 'faq'

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
  tracks: 'wii-sports-title.mp3',
  shop: 'wii-shop-theme.mp3',
  team: 'mii-channel-theme.mp3',
  about: 'coconut-mall.mp3',
  faq: 'nsmb-overworld.mp3',
}

const srcFor = (key: SoundKey) => [`/devfest/sounds/${files[key]}`]

/**
 * Page music levels, set so each plays at ~-28.9 LUFS — the level the Wii
 * Sports theme sounds right at. Wii Sports is mastered at -14 LUFS (plays at
 * 0.18), the Wii Shop theme at -16.9 LUFS (0.25), the Mii Channel theme at
 * -19.4 LUFS (0.33), Coconut Mall at -10.6 LUFS (0.12), the New Super Mario Bros. Wii
 * overworld theme at -12.3 LUFS (0.15). The menu music file was
 * raised to -28.9 LUFS in the file itself (Howler can't go above 1), and the
 * menu then plays well under that (0.8 x 0.8), as a quieter backdrop.
 * Re-measure with ffmpeg's ebur128 filter if a file is swapped.
 */
const AMBIENT_VOLUME = 0.64
const TRACKS_VOLUME = 0.18
const SHOP_VOLUME = 0.25
const TEAM_VOLUME = 0.33
const ABOUT_VOLUME = 0.12
const FAQ_VOLUME = 0.15

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

function remainingMs(howl: Howl, id: number) {
  return Math.max(0, (howl.duration(id) - (howl.seek(id) as number)) * 1000)
}

function scheduleAmbientEndFade(id: number) {
  cancelAmbientEndFade()
  const ambient = getHowls().ambient
  ambientEndFadeTimer = window.setTimeout(() => {
    ambientEndFadeTimer = null
    // Fade over whatever is actually left, which is less than the full window
    // when playback resumed partway through it.
    const left = Math.min(AMBIENT_END_FADE_MS, remainingMs(ambient, id))
    ambient.fade(ambient.volume(id) as number, 0, left, id)
  }, Math.max(0, remainingMs(ambient, id) - AMBIENT_END_FADE_MS))
}

let howls: Record<SoundKey, Howl> | null = null

function getHowls(): Record<SoundKey, Howl> {
  if (!howls) {
    // Keep the audio context awake once it's running. By default Howler
    // suspends it after 30s of silence — which muting causes — and the next
    // play() then has to wait for it to wake: during that wait the track
    // reports "not playing", so a mute or page change in that window was
    // missed and the music surfaced later, mid-song or on the wrong page.
    Howler.autoSuspend = false
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
        onplay: (id) => scheduleAmbientEndFade(id),
        onpause: cancelAmbientEndFade,
        onstop: cancelAmbientEndFade,
        onend: cancelAmbientEndFade,
        onloaderror: (_id, err) =>
          console.warn(`[sound] menu music failed to load (${files.ambient}):`, err),
        onplayerror: (_id, err) =>
          console.warn(`[sound] menu music failed to play (${files.ambient}):`, err),
      }),
      // Tracks page music. Loaded in the background once the menu music is in
      // (see loadPageMusicInTurn), so it's ready the instant the Tracks
      // channel is opened. Loops for as long as the visitor stays on the page.
      tracks: new Howl({
        src: srcFor('tracks'),
        preload: false,
        loop: true,
        volume: TRACKS_VOLUME,
        onloaderror: (_id, err) =>
          console.warn(`[sound] tracks music failed to load (${files.tracks}):`, err),
        onplayerror: (_id, err) =>
          console.warn(`[sound] tracks music failed to play (${files.tracks}):`, err),
      }),
      // Sponsors page music, loaded in the background the same way.
      shop: new Howl({
        src: srcFor('shop'),
        preload: false,
        loop: true,
        volume: SHOP_VOLUME,
        onloaderror: (_id, err) =>
          console.warn(`[sound] shop music failed to load (${files.shop}):`, err),
        onplayerror: (_id, err) =>
          console.warn(`[sound] shop music failed to play (${files.shop}):`, err),
      }),
      // Team page music (Mii Channel theme).
      team: new Howl({
        src: srcFor('team'),
        preload: false,
        loop: true,
        volume: TEAM_VOLUME,
        onloaderror: (_id, err) =>
          console.warn(`[sound] team music failed to load (${files.team}):`, err),
        onplayerror: (_id, err) =>
          console.warn(`[sound] team music failed to play (${files.team}):`, err),
      }),
      // About page music (Coconut Mall, from Mario Kart Wii).
      about: new Howl({
        src: srcFor('about'),
        preload: false,
        loop: true,
        volume: ABOUT_VOLUME,
        onloaderror: (_id, err) =>
          console.warn(`[sound] about music failed to load (${files.about}):`, err),
        onplayerror: (_id, err) =>
          console.warn(`[sound] about music failed to play (${files.about}):`, err),
      }),
      // FAQ page music (the New Super Mario Bros. Wii overworld theme).
      faq: new Howl({
        src: srcFor('faq'),
        preload: false,
        loop: true,
        volume: FAQ_VOLUME,
        onloaderror: (_id, err) =>
          console.warn(`[sound] faq music failed to load (${files.faq}):`, err),
        onplayerror: (_id, err) =>
          console.warn(`[sound] faq music failed to play (${files.faq}):`, err),
      }),
    }
    howls.ambient.once('load', loadPageMusicInTurn)
    howls.ambient.once('loaderror', loadPageMusicInTurn)
  }
  return howls
}

/**
 * Load the other pages' music one track at a time, starting once the menu
 * music is in. Decoding every track at once kept the browser busy for the
 * first second or so, and a visitor who pressed A straight away could hear
 * the chime and menu music stutter while it did.
 */
const PAGE_MUSIC: MusicKey[] = ['tracks', 'shop', 'team', 'about', 'faq']
const failedToLoad = new Set<Howl>()

function loadPageMusicInTurn() {
  const next = PAGE_MUSIC.map((key) => getHowls()[key]).find(
    (howl) => howl.state() !== 'loaded' && !failedToLoad.has(howl),
  )
  if (!next) return
  const done = () => {
    next.off('load', done)
    next.off('loaderror', failed)
    loadPageMusicInTurn()
  }
  // Skip a track that won't load rather than stalling the rest behind it.
  const failed = () => {
    failedToLoad.add(next)
    done()
  }
  next.once('load', done)
  next.once('loaderror', failed)
  // Already loading if its page was opened early: just wait for it.
  if (next.state() === 'unloaded') next.load()
}

/**
 * Waiting for the audio context to run again before music resumes. Browsers
 * can suspend it on their own while the tab is in the background (Safari, and
 * phones when switching apps), and Howler doesn't notice: it still believes
 * the context is running, so a play() lands on a stopped clock and stays
 * silent. Nudge it awake now, and again on the visitor's next tap or key in
 * case the browser wants a gesture first, and only resume once it's running.
 */
let pendingWake: (() => void) | null = null
const WAKE_GESTURES = ['pointerdown', 'keydown', 'touchend'] as const

function cancelPendingWake() {
  if (!pendingWake) return
  const wake = pendingWake
  Howler.ctx?.removeEventListener('statechange', wake)
  WAKE_GESTURES.forEach((type) => window.removeEventListener(type, wake, true))
  pendingWake = null
}

function whenAudioRunning(then: () => void) {
  cancelPendingWake()
  const ctx = Howler.ctx
  if (!ctx || ctx.state === 'running') {
    then()
    return
  }
  const wake = () => {
    if (ctx.state === 'running') {
      cancelPendingWake()
      then()
    } else {
      // Re-check once resume() settles too: not every browser fires
      // statechange on the way back from an interruption.
      ctx.resume().then(
        () => {
          if (pendingWake === wake && ctx.state === 'running') wake()
        },
        () => {},
      )
    }
  }
  pendingWake = wake
  ctx.addEventListener('statechange', wake)
  WAKE_GESTURES.forEach((type) => window.addEventListener(type, wake, true))
  wake()
}

/**
 * Whether sound is switched off. Page music is paused (not just silenced)
 * while muted, so switching sound back on picks it up where it was.
 */
let muted = false

/**
 * Start/stop control for one page's background music.
 *
 * The rules: while its page is open, muting pauses the track and unmuting
 * resumes it from the same spot. Leaving the page stops and rewinds it, so
 * the next visit — or unmuting on a page that was opened while muted —
 * starts it from the top.
 *
 * State is tracked here rather than asked of Howler: `playing()` is false
 * while a play() is still waiting on the audio context, and decisions made on
 * that answer went wrong. Howler queues pause/stop/fade calls made during that
 * wait and runs them in order, so acting on our own state is always safe.
 */
function createMusicPlayer(key: MusicKey, volume: number) {
  /** Howler id of this track's current playback, if any. */
  let soundId: number | null = null
  let status: 'idle' | 'playing' | 'paused' = 'idle'
  /** Why it's paused: decides what brings it back. */
  let pausedFor: 'mute' | 'hidden' | null = null
  /** Its page opened while muted: start from the top once sound is back on. */
  let beginOnUnmute = false
  /** Between start() and stop(): its page is open. */
  let active = false

  /**
   * Pending stop at the end of a leave fade-out, tracked so a restart can
   * cancel it. Without this, a mount -> unmount -> mount cycle (React
   * StrictMode does exactly this in dev) would have the stale timer stop the
   * track for good.
   */
  let stopTimer: number | null = null

  /**
   * Listener waiting for the audio context to unlock so the music can start,
   * kept so a stop (or a StrictMode remount) can cancel it.
   */
  let pendingStart: (() => void) | null = null

  let watchingEnd = false
  const howl = () => getHowls()[key]

  function cancelPendingStop() {
    if (stopTimer !== null) {
      window.clearTimeout(stopTimer)
      stopTimer = null
    }
  }

  function cancelPendingStart() {
    if (pendingStart) {
      Howler.ctx?.removeEventListener('statechange', pendingStart)
      pendingStart = null
    }
  }

  /** Play from the top — or, while muted, wait until sound is back on. */
  function begin() {
    if (muted) {
      beginOnUnmute = true
      return
    }
    const music = howl()
    if (!watchingEnd) {
      watchingEnd = true
      // A track that doesn't loop (the menu music) is done once it ends.
      music.on('end', (id) => {
        if (id === soundId && !music.loop()) status = 'idle'
      })
    }
    if (soundId !== null) music.stop(soundId)
    // Its page was opened before its turn to load in the background.
    if (music.state() === 'unloaded') music.load()
    soundId = music.play()
    // Volume is always set outright rather than faded up: a fade-in can stall
    // (background tab, throttling) and leave the track playing at volume 0.
    music.volume(volume, soundId)
    status = 'playing'
    pausedFor = null
  }

  function pauseFor(reason: 'mute' | 'hidden') {
    // Mid fade-out means its page is being left: let that stop finish.
    if (!active || status !== 'playing' || soundId === null || stopTimer !== null) return
    howl().pause(soundId)
    status = 'paused'
    pausedFor = reason
  }

  function resume() {
    if (soundId === null) return
    howl().play(soundId)
    status = 'playing'
    pausedFor = null
  }

  return {
    start() {
      active = true
      cancelPendingStart()
      beginOnUnmute = false

      // Still fading out from a moment ago (a StrictMode remount, or a quick
      // return): keep that playback going rather than restarting it.
      if (stopTimer !== null) {
        cancelPendingStop()
        if (soundId !== null) {
          // Twice on purpose. The first call cancels the fade, but Howler
          // does that by setting the volume to the fade's target (0): the
          // speaker level comes back, yet Howler remembers 0, so the next
          // pause/resume (tabbing away and back) restores silence. The
          // second call, with no fade left to cancel, sets it for real.
          howl().volume(volume, soundId)
          howl().volume(volume, soundId)
        }
        return
      }

      getHowls()
      const ctx = Howler.ctx
      if (!ctx || ctx.state === 'running') {
        begin()
        return
      }

      // The context is still locked. No Howler call may be made in this
      // state: Howler queues calls made while locked and replays them after
      // unlocking, out of step with whatever has happened since.
      //
      // Only wait for the unlock when the visitor has already interacted —
      // i.e. they pressed A or opened a channel, whose unlock is still
      // resolving. With no gesture at all (the no-click auto-advance, or
      // landing straight on a page) it stays silent rather than springing
      // into music on some later click.
      if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return

      const onRunning = () => {
        if (ctx.state !== 'running') return
        cancelPendingStart()
        if (active) begin()
      }
      pendingStart = onRunning
      ctx.addEventListener('statechange', onRunning)
      void ctx.resume()
    },
    /** Leave the page: fade out and rewind, ready to start over next time. */
    stop(fadeMs = 400) {
      active = false
      cancelPendingStart()
      beginOnUnmute = false
      if (soundId === null || status === 'idle') {
        status = 'idle'
        return
      }
      const music = howl()
      const id = soundId
      // Paused, or not even loaded yet (its page was left before its track
      // arrived): nothing is audible, so stop outright. A fade on an unloaded
      // track is queued by Howler and replayed after it loads, leaving the
      // next playback stuck at volume 0.
      if (status === 'paused' || music.state() !== 'loaded') {
        music.stop(id)
        status = 'idle'
        pausedFor = null
        return
      }
      cancelPendingStop()
      music.fade(music.volume(id) as number, 0, fadeMs, id)
      stopTimer = window.setTimeout(() => {
        stopTimer = null
        music.stop(id)
        status = 'idle'
      }, fadeMs)
    },
    pauseForHidden() {
      pauseFor('hidden')
    },
    isPausedForHidden() {
      return status === 'paused' && pausedFor === 'hidden'
    },
    resumeAfterHidden() {
      if (status !== 'paused' || pausedFor !== 'hidden') return
      if (muted) pausedFor = 'mute'
      else resume()
    },
    pauseForMute() {
      pauseFor('mute')
      // Already paused for a hidden tab: it's sound coming back on that
      // should bring it back now.
      if (status === 'paused' && pausedFor === 'hidden') pausedFor = 'mute'
    },
    /** Whether switching sound back on would start or resume this track. */
    waitsForUnmute() {
      return beginOnUnmute || (active && status === 'paused' && pausedFor === 'mute')
    },
    resumeAfterMute() {
      if (beginOnUnmute) {
        beginOnUnmute = false
        if (active) begin()
      } else if (active && status === 'paused' && pausedFor === 'mute') {
        resume()
      }
    },
  }
}

const musicPlayers: Record<MusicKey, ReturnType<typeof createMusicPlayer>> = {
  ambient: createMusicPlayer('ambient', AMBIENT_VOLUME),
  tracks: createMusicPlayer('tracks', TRACKS_VOLUME),
  shop: createMusicPlayer('shop', SHOP_VOLUME),
  team: createMusicPlayer('team', TEAM_VOLUME),
  about: createMusicPlayer('about', ABOUT_VOLUME),
  faq: createMusicPlayer('faq', FAQ_VOLUME),
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
  startMusic(key: MusicKey) {
    musicPlayers[key].start()
  },
  stopMusic(key: MusicKey) {
    musicPlayers[key].stop()
  },
  /** Pause whichever page music is playing while the tab is hidden. */
  pauseMusicForHidden() {
    cancelPendingWake()
    Object.values(musicPlayers).forEach((player) => player.pauseForHidden())
  },
  /** Resume whatever the tab hiding paused. */
  resumeMusicAfterHidden() {
    const players = Object.values(musicPlayers)
    const resumeAll = () => players.forEach((player) => player.resumeAfterHidden())
    // While muted this only hands the paused track over to the unmute.
    if (muted || !players.some((player) => player.isPausedForHidden())) {
      resumeAll()
      return
    }
    whenAudioRunning(() => {
      if (!document.hidden) resumeAll()
    })
  },
  setMuted(next: boolean) {
    muted = next
    // Sound effects are silenced; page music is paused/resumed so it carries
    // on from the same spot when sound comes back on.
    Object.values(getHowls()).forEach((howl) => howl.mute(next))
    if (next) {
      cancelPendingWake()
      Object.values(musicPlayers).forEach((player) => player.pauseForMute())
    } else if (Object.values(musicPlayers).some((player) => player.waitsForUnmute())) {
      whenAudioRunning(() => {
        if (!muted) Object.values(musicPlayers).forEach((player) => player.resumeAfterMute())
      })
    }
  },
}

// In development, editing this file hot-swaps the module without a page
// reload. Unload the old Howls first, or the previous copy's music keeps
// playing alongside the new one — out of reach of mute and page changes.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cancelAmbientEndFade()
    Howler.unload()
  })
}
