import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { fadeVariants } from '../../lib/motionVariants'

/**
 * A plain crossfade between routes. (The Wii's own channel launch is a
 * scale + crossfade into the banner, with no wipe or flash — so no
 * circular clip-path reveal here.)
 */
export function PageSwooshTransition() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}
