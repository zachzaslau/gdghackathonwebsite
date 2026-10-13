import type { TeamMember } from '../types/content'

/**
 * The organizing team. Each person wanders the Team page's Mii plaza as their
 * own Mii (a transparent PNG in /public/team), and clicking it opens their
 * profile card. Optional: `photo` (shown on the card in place of the Mii),
 * `bio`, and `links` as [{ label, url }].
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'zachary-zaslau',
    name: 'Zachary Zaslau',
    role: 'Hackathon Lead',
    department: 'Organizers',
    mii: '/team/zachary-zaslau.png',
    photo: '/team/zachary-zaslau-photo.jpg',
  },
]
