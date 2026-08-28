import { useCallback, useState } from 'react'
import { useSound } from '../../hooks/useSound'
import { BootWarningScreen } from './BootWarningScreen'
import { StartupAnimation } from './StartupAnimation'

type BootPhase = 'warning' | 'startup'

interface BootSequenceProps {
  onBootComplete: () => void
}

// Deliberately not wrapped in AnimatePresence: with framer-motion 13 + React 19
// StrictMode, an AnimatePresence exit transition between these two conditional
// children could get stuck mid-exit (old child never unmounts). Both screens
// are solid black full-viewport panels, so a hard cut between them still reads
// as a seamless "stays black, content changes" transition.
export function BootSequence({ onBootComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<BootPhase>('warning')
  const { playSound } = useSound()

  // Fired synchronously from the user's "press A" gesture — this is the
  // guaranteed browser autoplay-unlock moment, so the startup chime is
  // triggered right here rather than later inside an effect.
  const handleAdvance = useCallback(() => {
    playSound('startup')
    setPhase('startup')
  }, [playSound])

  return (
    <>
      {phase === 'warning' && <BootWarningScreen onAdvance={handleAdvance} />}
      {phase === 'startup' && <StartupAnimation onComplete={onBootComplete} />}
    </>
  )
}
