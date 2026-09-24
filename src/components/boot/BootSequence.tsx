import { useCallback, useEffect } from 'react'
import { bootWindowRemaining } from '../../hooks/useBootState'
import { useSound } from '../../hooks/useSound'
import { BootWarningScreen } from './BootWarningScreen'

interface BootSequenceProps {
  onBootComplete: () => void
}

export function BootSequence({ onBootComplete }: BootSequenceProps) {
  const { playSound, playSoundIfUnlocked } = useSound()

  // Fired synchronously from the user's "press A" gesture — this is the
  // guaranteed browser autoplay-unlock moment, so the startup chime is
  // triggered right here rather than later inside an effect.
  const handleAdvance = useCallback(() => {
    playSound('startup')
    onBootComplete()
  }, [playSound, onBootComplete])

  // Enter on our own 3s after page load if "press A" hasn't happened. With no
  // gesture behind it, the chime plays only where the browser already allows
  // audio (e.g. Chrome once the visitor has already interacted with the site);
  // a fresh first visit in most browsers stays silent here. The menu
  // music still starts — startAmbient() retries once the audio context
  // unlocks on the user's first click or keypress in the menu.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      playSoundIfUnlocked('startup')
      onBootComplete()
    }, bootWindowRemaining())
    return () => window.clearTimeout(timer)
  }, [playSoundIfUnlocked, onBootComplete])

  return <BootWarningScreen onAdvance={handleAdvance} />
}
