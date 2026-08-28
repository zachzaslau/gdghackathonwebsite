import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { soundManager, type SoundKey } from '../lib/soundManager'
import { SoundContext } from './soundContext'

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false)

  // Start fetching + decoding audio immediately, so the menu music is ready
  // the moment the boot sequence ends rather than loading only once it's
  // first needed. (Fetching is not gated on a user gesture; only playback is.)
  useEffect(() => {
    soundManager.preload()
  }, [])

  const playSound = useCallback(
    (key: SoundKey) => {
      if (!muted) soundManager.play(key)
    },
    [muted],
  )

  const startAmbient = useCallback(() => {
    if (!muted) soundManager.startAmbient()
  }, [muted])

  const stopAmbient = useCallback(() => {
    soundManager.stopAmbient()
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      soundManager.setMuted(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ muted, toggleMute, playSound, startAmbient, stopAmbient }),
    [muted, toggleMute, playSound, startAmbient, stopAmbient],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
