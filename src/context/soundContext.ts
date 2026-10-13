import { createContext } from 'react'
import type { MusicKey, SoundKey } from '../lib/soundManager'

export interface SoundContextValue {
  muted: boolean
  toggleMute: () => void
  playSound: (key: SoundKey) => void
  playSoundIfUnlocked: (key: SoundKey) => void
  startMusic: (key: MusicKey) => void
  stopMusic: (key: MusicKey) => void
}

export const SoundContext = createContext<SoundContextValue | null>(null)
