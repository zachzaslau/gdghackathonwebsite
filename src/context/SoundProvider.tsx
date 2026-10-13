import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { soundManager, type MusicKey, type SoundKey } from '../lib/soundManager'
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
  // never change. If they depended on `muted`, toggling it would hand the
  // pages a "new" startMusic/stopMusic, re-running their effects: the music
  // would be stopped on mute and restarted from the top on unmute, with a
  // visible hitch while all of that ran on the click.
  const mutedRef = useRef(muted)

  // Audio itself is set up in main.tsx, before the first render. Apply a saved
  // "off" before anything can play.
  useEffect(() => {
    soundManager.setMuted(mutedRef.current)
  }, [])

  // Pause page music while the user is tabbed out (another tab, a minimized
  // window, or the Register form opening in a new tab), and resume it from
  // the same spot when they come back.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) soundManager.pauseMusicForHidden()
      else soundManager.resumeMusicAfterHidden()
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

  // Safe to call while muted: the music waits, and starts from the top when
  // sound is switched back on.
  const startMusic = useCallback((key: MusicKey) => {
    soundManager.startMusic(key)
  }, [])

  const stopMusic = useCallback((key: MusicKey) => {
    soundManager.stopMusic(key)
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
    () => ({
      muted,
      toggleMute,
      playSound,
      playSoundIfUnlocked,
      startMusic,
      stopMusic,
    }),
    [
      muted,
      toggleMute,
      playSound,
      playSoundIfUnlocked,
      startMusic,
      stopMusic,
    ],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
