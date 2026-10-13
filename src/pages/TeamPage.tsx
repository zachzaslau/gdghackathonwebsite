import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { MuteButton } from '../components/layout/MuteButton'
import { MiiCrowd } from '../components/team/MiiCrowd'
import { MiiProfileCard } from '../components/team/MiiProfileCard'
import { PlazaFloor } from '../components/team/PlazaFloor'
import { teamMembers } from '../data/teamMembers'
import { usePageMusic } from '../hooks/usePageMusic'
import { useSound } from '../hooks/useSound'
import '../styles/miiPlaza.css'
import type { TeamMember } from '../types/content'

/**
 * The Team channel, as the Mii Channel plaza: each team member wanders the
 * tiled floor as their own Mii — point at one to stop it and see their name,
 * click it for their profile card.
 */
export function TeamPage() {
  const { playSound } = useSound()
  const [selected, setSelected] = useState<TeamMember | null>(null)
  // Mii Channel theme while on this page; opening the channel lets it start.
  usePageMusic('team')

  const openMember = useCallback(
    (member: TeamMember) => {
      playSound('click')
      setSelected(member)
    },
    [playSound],
  )
  const closeCard = useCallback(() => setSelected(null), [])

  return (
    <div className="plaza-page">
      <h1 className="sr-only">Team</h1>
      <PlazaFloor />
      <MiiCrowd members={teamMembers} selectedId={selected?.id ?? null} onSelect={openMember} />

      <Link to="/" onClick={() => playSound('click')} className="mii-pill plaza-home">
        Home
      </Link>
      <MuteButton />

      <MiiProfileCard member={selected} onClose={closeCard} />
    </div>
  )
}
