import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useSound } from '../../hooks/useSound'
import type { TeamMember } from '../../types/content'

interface MiiProfileCardProps {
  member: TeamMember | null
  onClose: () => void
}

/**
 * A team member's profile, opened by clicking their Mii in the plaza: their
 * photo (or, without one, their Mii on a patch of plaza tile), then name,
 * role, team and bio, with a Mii Channel-style "Back" pill. Styles are the
 * `mii-card` classes in miiPlaza.css.
 */
export function MiiProfileCard({ member, onClose }: MiiProfileCardProps) {
  const { playSound } = useSound()
  const backRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    playSound('click')
    onClose()
  }

  // Focus Back on open, so Enter/Space dismisses it, and close on Escape.
  useEffect(() => {
    if (!member) return
    backRef.current?.focus({ preventScroll: true })
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [member, onClose])

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
          className="mii-card-backdrop"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mii-card-name"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
            className="mii-card"
          >
            <div className={`mii-card-portrait${member.photo ? ' has-photo' : ''}`}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} />
              ) : (
                <img src={member.mii} alt={`${member.name}'s Mii`} />
              )}
            </div>

            <div className="mii-card-info">
              <h2 id="mii-card-name" className="mii-card-name">
                {member.name}
              </h2>
              <p className="mii-card-role">{member.role}</p>
              <p className="mii-card-team">{member.department}</p>
              {member.bio && <p className="mii-card-bio">{member.bio}</p>}
              {member.links && member.links.length > 0 && (
                <ul className="mii-card-links">
                  {member.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button ref={backRef} type="button" onClick={close} className="mii-pill mii-card-back">
              Back
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
