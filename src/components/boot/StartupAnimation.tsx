import { motion } from 'framer-motion'
import { useEffect } from 'react'
import {
  fadeVariants,
  orbContainerVariants,
  orbVariants,
  wordmarkVariants,
} from '../../lib/motionVariants'

interface StartupAnimationProps {
  onComplete: () => void
}

const ORB_COLORS = ['#FFFFFF', '#DCEEFB', '#FFFFFF', '#DCEEFB']

export function StartupAnimation({ onComplete }: StartupAnimationProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1900)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black"
    >
      <motion.div
        variants={orbContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3"
      >
        {ORB_COLORS.map((color, i) => (
          <motion.span
            key={i}
            variants={orbVariants}
            className="block h-6 w-6 rounded-full sm:h-8 sm:w-8"
            style={{ backgroundColor: color, boxShadow: `0 0 24px ${color}aa` }}
          />
        ))}
      </motion.div>

      <motion.p
        variants={wordmarkVariants}
        initial="hidden"
        animate="visible"
        className="font-heading text-6xl font-extrabold tracking-tight text-white sm:text-7xl"
      >
        Wii
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        className="font-heading text-sm font-semibold tracking-wide text-white/70 sm:text-base"
      >
        GDG Hackathon
      </motion.p>
    </motion.div>
  )
}
