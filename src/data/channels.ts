import type { Channel } from '../types/content'
import { siteConfig } from './siteConfig'

/**
 * The home menu is a 4x3 grid of 12 channel slots, matching the real Wii Menu
 * page layout. Six are our real channels; the rest stay empty gray slots.
 */
export const channels: Channel[] = [
  {
    id: 'register',
    label: 'Register',
    route: siteConfig.registerUrl,
    external: true,
    filled: true,
    accent: 'blue',
    image: '/devfest/channels/register.png',
  },
  {
    id: 'tracks',
    label: 'Tracks',
    route: '/tracks',
    filled: true,
    accent: 'green',
    image: '/devfest/channels/tracks.png',
  },
  {
    id: 'sponsors',
    label: 'Sponsors',
    route: '/sponsors',
    filled: true,
    accent: 'yellow',
    image: '/devfest/channels/sponsors.png',
  },
  {
    id: 'team',
    label: 'Team',
    route: '/team',
    filled: true,
    accent: 'red',
    image: '/devfest/channels/team.png',
  },
  {
    id: 'about',
    label: 'About',
    route: '/about',
    filled: true,
    accent: 'blue',
    image: '/devfest/channels/about.png',
  },
  {
    id: 'faq',
    label: 'FAQ',
    route: '/faq',
    filled: true,
    accent: 'green',
    image: '/devfest/channels/faq.png',
  },
  { id: 'blank-1', label: '', route: '', filled: false },
  { id: 'blank-2', label: '', route: '', filled: false },
  { id: 'blank-3', label: '', route: '', filled: false },
  { id: 'blank-4', label: '', route: '', filled: false },
  { id: 'blank-5', label: '', route: '', filled: false },
  { id: 'blank-6', label: '', route: '', filled: false },
]
