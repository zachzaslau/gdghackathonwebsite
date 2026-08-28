import { motion } from 'framer-motion'
import type { TeamMember } from '../../types/content'

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex flex-col items-center rounded-xl border border-tile-border
        bg-gradient-to-b from-sky-100 to-white p-4 text-center shadow-sm"
    >
      {/* Abstract Mii-style figure: original silhouette, not traced Nintendo art */}
      <svg width="64" height="76" viewBox="0 0 64 76" aria-hidden="true">
        <ellipse cx="32" cy="70" rx="20" ry="4" fill="#00000014" />
        <path
          d="M14 76 C14 54 20 44 32 44 C44 44 50 54 50 76 Z"
          fill={member.miiColor}
        />
        <circle cx="32" cy="24" r="18" fill={member.miiColor} />
        <circle cx="32" cy="24" r="18" fill="white" fillOpacity="0.15" />
      </svg>

      <div className="font-heading mt-2 rounded-md bg-wii-blue-800 px-3 py-1 text-xs font-bold text-white sm:text-sm">
        {member.name}
      </div>
      <p className="mt-1 text-xs text-slate-500 sm:text-sm">{member.role}</p>
    </motion.div>
  )
}
