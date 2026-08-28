import type { Variants } from 'framer-motion'

// The Wii "inflates" a channel on hover: a single springy overshoot, roughly
// 1.06-1.10 scale settling in ~200ms, and a faster ~140ms release.
export const tilePopVariants: Variants = {
  rest: { scale: 1, transition: { duration: 0.14, ease: 'easeOut' } },
  hover: { scale: 1.08, transition: { type: 'spring', stiffness: 420, damping: 14, mass: 0.7 } },
  tap: { scale: 0.96, transition: { type: 'spring', stiffness: 600, damping: 22 } },
}

export const orbContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
}

export const orbVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.4 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 14 },
  },
}

export const wordmarkVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 16, delay: 0.7 },
  },
}

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
}
