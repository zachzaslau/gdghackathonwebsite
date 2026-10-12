import { motion } from 'framer-motion'
import { TriangleAlert } from 'lucide-react'
import { useEffect } from 'react'
import { fadeVariants } from '../../lib/motionVariants'

interface BootWarningScreenProps {
  onAdvance: () => void
}

/**
 * Reproduces the real Wii Health & Safety warning screen's wording verbatim,
 * per explicit direction from the club — a deliberate choice to prioritize
 * authenticity for this non-commercial fan-tribute site over IP caution.
 */
export function BootWarningScreen({ onAdvance }: BootWarningScreenProps) {
  useEffect(() => {
    const handleKey = () => onAdvance()
    window.addEventListener('keydown', handleKey, { once: true })
    return () => window.removeEventListener('keydown', handleKey)
  }, [onAdvance])

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      // Click only — no onTouchStart. A tap's touchstart is not a user
      // activation, so advancing on it opens the menu before the browser has
      // unlocked audio, and the menu music gives up. The click a tap produces
      // arrives after touchend, which is an activation.
      onClick={onAdvance}
      className="fixed inset-0 z-50 flex cursor-pointer items-center bg-black px-8 text-white select-none sm:px-[15%]"
    >
      <div className="max-w-md">
        <p className="font-heading mb-4 flex items-center gap-3 text-base font-bold tracking-wide sm:text-lg">
          <TriangleAlert className="h-6 w-6 shrink-0 text-yellow-400" strokeWidth={2} />
          WARNING—HEALTH AND SAFETY
        </p>
        <p className="text-sm leading-relaxed text-white/85 sm:text-base">
          BEFORE PLAYING, READ YOUR OPERATIONS MANUAL FOR IMPORTANT
          INFORMATION ABOUT YOUR HEALTH AND SAFETY.
        </p>

        <p className="mt-6 text-sm text-white/50">Also online at</p>
        <p className="text-sm text-white/50">www.nintendo.com/healthsafety/</p>

        <motion.p
          className="font-heading animate-pulse-slow mt-6 flex items-center gap-2 text-sm tracking-wide text-white/90 sm:text-base"
        >
          Press
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
            A
          </span>
          to continue.
        </motion.p>
      </div>
    </motion.div>
  )
}
