import type { TeamMember } from '../types/content'

/**
 * The organizing team. Each person wanders the Team page's Mii plaza as their
 * own Mii (a transparent PNG in /public/team), and clicking it opens their
 * profile card. Optional: `photo` (shown on the card in place of the Mii),
 * `bio`, and `links` as [{ label, url }].
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'jack-harris',
    name: 'Jack Harris',
    role: 'President',
    department: 'Organizers',
    mii: '/devfest/team/jack-harris.png',
    photo: '/devfest/team/jack-harris-photo.jpg',
  },
  {
    id: 'andrew-chuang-saladin',
    name: 'Andrew Chuang Saladin',
    role: 'Vice President',
    department: 'Organizers',
    mii: '/devfest/team/andrew-chuang-saladin.png',
    photo: '/devfest/team/andrew-chuang-saladin-photo.jpg',
  },
  {
    id: 'zachary-zaslau',
    name: 'Zachary Zaslau',
    role: 'Hackathon Lead',
    department: 'Organizers',
    mii: '/devfest/team/zachary-zaslau.png',
    photo: '/devfest/team/zachary-zaslau-photo.jpg',
  },
  {
    id: 'felix-chang',
    name: 'Felix Chang',
    role: 'Hackathon Lead',
    department: 'Organizers',
    mii: '/devfest/team/felix-chang.png',
    photo: '/devfest/team/felix-chang-photo.jpg',
  },
  {
    id: 'carlos-mendez',
    name: 'Carlos Mendez',
    role: 'Hackathon Lead',
    department: 'Organizers',
    mii: '/devfest/team/carlos-mendez.png',
    photo: '/devfest/team/carlos-mendez-photo.jpg',
  },
]
