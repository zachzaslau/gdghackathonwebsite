import type { Channel } from '../types/content'

/**
 * The home menu is a 4x3 grid of 12 channel slots, matching the real Wii Menu
 * page layout. Six are our real channels; the rest stay empty gray slots.
 */
export const channels: Channel[] = [
  {
    id: 'apply',
    label: 'Apply',
    route: '/apply',
    filled: true,
    accent: 'blue',
    image: '/channels/apply.png',
  },
  { id: 'tracks', label: 'Tracks', route: '/tracks', filled: true, accent: 'green' },
  { id: 'sponsors', label: 'Sponsors', route: '/sponsors', filled: true, accent: 'yellow' },
  { id: 'team', label: 'Team', route: '/team', filled: true, accent: 'red' },
  { id: 'about', label: 'About', route: '/about', filled: true, accent: 'blue' },
  { id: 'faq', label: 'FAQ', route: '/faq', filled: true, accent: 'green' },
  { id: 'blank-1', label: '', route: '', filled: false },
  { id: 'blank-2', label: '', route: '', filled: false },
  { id: 'blank-3', label: '', route: '', filled: false },
  { id: 'blank-4', label: '', route: '', filled: false },
  { id: 'blank-5', label: '', route: '', filled: false },
  { id: 'blank-6', label: '', route: '', filled: false },
]
