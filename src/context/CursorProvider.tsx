import { useMotionValue, useSpring } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useIsTouchDevice } from '../hooks/useIsTouchDevice'
import { CursorContext } from './cursorContext'

const DEFAULT_LABEL = 'Home'

export function CursorProvider({ children }: { children: ReactNode }) {
  const isTouch = useIsTouchDevice()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 500, damping: 40, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 500, damping: 40, mass: 0.6 })
  const [pressed, setPressed] = useState(false)
  const [hoverLabel, setHoverLabelState] = useState(DEFAULT_LABEL)

  useEffect(() => {
    if (isTouch) return

    const handleMove = (event: PointerEvent) => {
      rawX.set(event.clientX)
      rawY.set(event.clientY)
    }
    const handleDown = () => setPressed(true)
    const handleUp = () => setPressed(false)

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerdown', handleDown)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [isTouch, rawX, rawY])

  useEffect(() => {
    document.documentElement.classList.toggle('wii-cursor-active', !isTouch)
    return () => document.documentElement.classList.remove('wii-cursor-active')
  }, [isTouch])

  const setHoverLabel = useCallback((label: string) => setHoverLabelState(label), [])
  const resetHoverLabel = useCallback(() => setHoverLabelState(DEFAULT_LABEL), [])

  const value = useMemo(
    () => ({ x, y, pressed, isTouch, hoverLabel, setHoverLabel, resetHoverLabel }),
    [x, y, pressed, isTouch, hoverLabel, setHoverLabel, resetHoverLabel],
  )

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}
