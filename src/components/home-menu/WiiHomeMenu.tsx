import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useSound } from '../../hooks/useSound'
import { fadeVariants } from '../../lib/motionVariants'
import { BottomBar } from './BottomBar'
import { ChannelGrid } from './ChannelGrid'

/**
 * Geometry is transcribed from Wii-References/wii-home.png by pixel sampling.
 * All offsets are percentages of the 637x347 Wii screen area (the reference's
 * bottom 11px is an OS taskbar, excluded). The menu fills exactly one viewport
 * and never scrolls, the way a console UI occupies a TV picture.
 */
export function WiiHomeMenu() {
  const { startAmbient, stopAmbient } = useSound()

  useEffect(() => {
    startAmbient()
    return () => stopAmbient()
  }, [startAmbient, stopAmbient])

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      className="wii-menu-texture relative h-dvh w-full overflow-hidden"
    >
      <div
        className="absolute inset-x-0 flex items-center justify-center"
        style={{ top: '8.65%', height: '63.9%' }}
      >
        <ChannelGrid />
      </div>

      <BottomBar />
    </motion.div>
  )
}
