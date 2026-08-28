import type { GdgAccent } from '../types/content'

export const gdgAccentHex: Record<GdgAccent, string> = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
}

export const gdgAccentBgClass: Record<GdgAccent, string> = {
  blue: 'bg-gdg-blue',
  red: 'bg-gdg-red',
  yellow: 'bg-gdg-yellow',
  green: 'bg-gdg-green',
}

export const gdgAccentTextClass: Record<GdgAccent, string> = {
  blue: 'text-gdg-blue',
  red: 'text-gdg-red',
  yellow: 'text-gdg-yellow',
  green: 'text-gdg-green',
}

/** [light, dark] pair per accent, for full-tile channel-art-style gradients. */
export const gdgAccentGradient: Record<GdgAccent, [string, string]> = {
  blue: ['#5B9DF5', '#1967D2'],
  red: ['#F16B5D', '#C5221F'],
  yellow: ['#FDD663', '#EA8600'],
  green: ['#57BB8A', '#188038'],
}

export const wiiBlueScale = {
  50: '#EAF6FF',
  200: '#BEE3FA',
  400: '#6EC1EF',
  600: '#2E8BC9',
  800: '#175A8C',
}
