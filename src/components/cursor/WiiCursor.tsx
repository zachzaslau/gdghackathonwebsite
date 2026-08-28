import { motion } from 'framer-motion'
import { useCursor } from '../../hooks/useCursor'

/**
 * The Wii pointer, rendered from the reference artwork itself
 * (Wii-References/wii-cursor.png, cropped to its opaque bounds -> 91x127).
 * The fingertip — the actual hotspot — sits at 28.6% across and 0% down of
 * that crop, so the image is offset by exactly that much to put the fingertip
 * on the real pointer position. Hidden on touch devices.
 */
const WIDTH = 32
const HEIGHT = 44.7 // 32 * (127 / 91), preserving the crop's aspect ratio
const TIP_X = 0.286

export function WiiCursor() {
  const { x, y, pressed, isTouch } = useCursor()

  if (isTouch) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ x, y }}
    >
      <motion.img
        src="/wii-cursor.png"
        alt=""
        draggable={false}
        animate={{ scale: pressed ? 0.9 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        // max-w-none: Tailwind preflight's `img { max-width: 100% }` would
        // otherwise collapse this against its zero-width fixed parent.
        className="max-w-none"
        style={{
          width: WIDTH,
          height: HEIGHT,
          marginLeft: -WIDTH * TIP_X,
          transformOrigin: `${TIP_X * 100}% 0%`,
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
        }}
      />
    </motion.div>
  )
}
