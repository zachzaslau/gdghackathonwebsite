import { motion } from 'framer-motion'
import { gdgAccentBgClass } from '../../styles/theme'
import type { Track } from '../../types/content'

interface TrackCardProps {
  track: Track
  onSelect: (track: Track) => void
}

export function TrackCard({ track, onSelect }: TrackCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(track)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-start gap-2 overflow-hidden rounded-xl
        border border-tile-border bg-white p-5 text-left shadow-sm focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-wii-blue-600"
    >
      <span className={`absolute inset-x-0 top-0 h-1.5 ${gdgAccentBgClass[track.accent]}`} />
      <h3 className="font-heading text-lg font-bold text-wii-blue-800">{track.title}</h3>
      <p className="text-sm text-slate-600">{track.tagline}</p>
      <span className="mt-2 text-xs font-semibold text-wii-blue-600">
        Click to learn more →
      </span>
    </motion.button>
  )
}
