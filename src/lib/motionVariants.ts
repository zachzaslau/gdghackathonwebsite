import type { Variants } from 'framer-motion'

// Channels hold their size on hover (the blue highlight outline marks them
// instead); only a brief press-in on tap.
export const tilePopVariants: Variants = {
  rest: { scale: 1, transition: { duration: 0.14, ease: 'easeOut' } },
  tap: { scale: 0.97, transition: { type: 'spring', stiffness: 600, damping: 22 } },
}

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
}
