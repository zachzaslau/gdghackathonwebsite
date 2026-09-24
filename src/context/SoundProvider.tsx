import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { soundManager, type SoundKey } from '../lib/soundManager'
import { SoundContext } from './soundContext'

/**
 * The visitor's sound choice survives reloads and return visits. Only an
 * explicit "off" is stored as muted — anything else, including no saved
 * choice or storage being unavailable (private windows, blocked site data),
 * means sound on.
 */
const MUTED_STORAGE_KEY = 'gdg-sound-muted'

function readSavedMuted() {
  try {
    return localStorage.getItem(MUTED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function saveMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTED_STORAGE_KEY, String(muted))
  } catch {
    // Not persisting is fine; the choice still holds for this visit.
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(readSavedMuted)
  // The callbacks below read mute state through this ref so their identities
  // never change. If they depended on `muted`, toggling it would hand the home
  // menu a "new" startAmbient/stopAmbient, re-running its effect: the music
  // would be stopped on mute and restarted from the top on unmute, with a
  // visible hitch while all of that ran on the click.
  const mutedRef = useRef(muted)

  // Start fetching + decoding audio immediately, so the menu music is ready
  // the moment the boot sequence ends rather than loading only once it's
  // first needed. (Fetching is not gated on a user gesture; only playback is.)
  useEffect(() => {
    soundManager.preload()
    // Apply a saved "off" before anything can play.
    soundManager.setMuted(mutedRef.current)
  }, [])

  // Pause the menu music while the user is tabbed out (another tab, a
  // minimized window, or the Register form opening in a new tab), and resume
  // it from the same spot when they come back.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) soundManager.pauseAmbientForHidden()
      else soundManager.resumeAmbientAfterHidden()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const playSound = useCallback((key: SoundKey) => {
    if (!mutedRef.current) soundManager.play(key)
  }, [])

  const playSoundIfUnlocked = useCallback((key: SoundKey) => {
    if (!mutedRef.current) soundManager.playIfUnlocked(key)
  }, [])

  // Started even while muted: the Howls themselves are muted, so it plays
  // silently and unmuting simply brings it in at the right spot.
  const startAmbient = useCallback(() => {
    soundManager.startAmbient()
  }, [])

  const stopAmbient = useCallback(() => {
    soundManager.stopAmbient()
  }, [])

  const toggleMute = useCallback(() => {
    // Side effect kept out of the state updater, which StrictMode runs twice.
    const next = !mutedRef.current
    mutedRef.current = next
    soundManager.setMuted(next)
    saveMuted(next)
    setMuted(next)
  }, [])

  const value = useMemo(
    () => ({ muted, toggleMute, playSound, playSoundIfUnlocked, startAmbient, stopAmbient }),
    [muted, toggleMute, playSound, playSoundIfUnlocked, startAmbient, stopAmbient],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
