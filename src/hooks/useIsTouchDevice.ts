import { useEffect, useState } from 'react'

/**
 * True for coarse-pointer (touch) devices. Used to skip the custom Wii cursor
 * and native-cursor hiding on devices where a floating pointer makes no sense.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)')
    const handleChange = (event: MediaQueryListEvent) => setIsTouch(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return isTouch
}
