import { createContext } from 'react'
import type { SoundKey } from '../lib/soundManager'

export interface SoundContextValue {
  muted: boolean
  toggleMute: () => void
  playSound: (key: SoundKey) => void
  startAmbient: () => void
  stopAmbient: () => void
}

export const SoundContext = createContext<SoundContextValue | null>(null)
