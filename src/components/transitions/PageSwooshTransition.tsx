import { AnimatePresence, motion } from 'framer-motion'
import { useOutlet, useLocation } from 'react-router-dom'
import { fadeVariants } from '../../lib/motionVariants'

/**
 * A plain crossfade between routes. (The Wii's own channel launch is a
 * scale + crossfade into the banner, with no wipe or flash — so no
 * circular clip-path reveal here.)
 *
 * The page is taken from useOutlet() rather than rendered with <Outlet />.
 * AnimatePresence keeps the outgoing page's element around while it fades
 * out, and an <Outlet /> inside it would read the new location and render
 * the incoming page there instead. Going home within the first 3s of a
 * reload, the warning screen then started up inside the fading-out layer
 * and the fade stuck at opacity 0: a white screen over a working menu.
 */
export function PageSwooshTransition() {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  )
}
