import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { gdgAccentBgClass } from '../../styles/theme'
import type { Track } from '../../types/content'

interface TrackModalProps {
  track: Track | null
  onClose: () => void
}

export function TrackModal({ track, onClose }: TrackModalProps) {
  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <span
              className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl ${gdgAccentBgClass[track.accent]}`}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <h3 className="font-heading mt-2 text-2xl font-bold text-wii-blue-800">
              {track.title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-wii-blue-600">{track.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{track.description}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
