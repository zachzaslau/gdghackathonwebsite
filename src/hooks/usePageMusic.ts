import { useEffect } from 'react'
import type { MusicKey } from '../lib/soundManager'
import { useSound } from './useSound'

/** Play a page's background music while it's mounted, fading it out on leave. */
export function usePageMusic(key: MusicKey) {
  const { startMusic, stopMusic } = useSound()

  useEffect(() => {
    startMusic(key)
    return () => stopMusic(key)
  }, [key, startMusic, stopMusic])
}
