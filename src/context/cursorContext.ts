import { createContext } from 'react'
import type { MotionValue } from 'framer-motion'

export interface CursorContextValue {
  x: MotionValue<number>
  y: MotionValue<number>
  pressed: boolean
  isTouch: boolean
  hoverLabel: string
  setHoverLabel: (label: string) => void
  resetHoverLabel: () => void
}

export const CursorContext = createContext<CursorContextValue | null>(null)
