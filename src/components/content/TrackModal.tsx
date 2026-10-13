import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useSound } from '../../hooks/useSound'
import type { Track } from '../../types/content'

interface TrackModalProps {
  track: Track | null
  onClose: () => void
}

/**
 * A track's full description, as a Wii Sports dialog: the text on a light
 * screen inside the same grey bezel as the menu's preview frame, with a Wii
 * "Back" button under it. Styles live in wiiSportsMenu.css (the `ws-dialog`
 * classes) alongside the menu it opens from.
 */
export function TrackModal({ track, onClose }: TrackModalProps) {
  const { playSound } = useSound()
  const backRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    playSound('click')
    onClose()
  }

  // Focus Back on open, so Enter/Space dismisses it, and close on Escape.
  useEffect(() => {
    if (!track) return
    backRef.current?.focus({ preventScroll: true })
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [track, onClose])

  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
          className="ws-dialog-backdrop"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ws-dialog-title"
            aria-describedby="ws-dialog-description"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
            className="ws-dialog"
          >
            <div className="ws-dialog-bezel">
              <div className="ws-dialog-screen">
                <h2 id="ws-dialog-title" className="ws-dialog-title">
                  {track.title}
                </h2>
                <p className="ws-dialog-tagline">{track.tagline}</p>
                <p id="ws-dialog-description" className="ws-dialog-description">
                  {track.description}
                </p>
              </div>
            </div>

            <button ref={backRef} type="button" onClick={close} className="ws-button ws-dialog-back">
              <span>Back</span>
              <span aria-hidden="true" className="ws-brackets">
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
