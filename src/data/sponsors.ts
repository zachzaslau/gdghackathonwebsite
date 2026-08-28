import type { SponsorTier } from '../types/content'

/**
 * Sponsors are still being confirmed — tiers render a "coming soon" empty
 * state until real sponsors are added to the arrays below.
 */
export const sponsorTiers: SponsorTier[] = [
  { id: 'platinum', name: 'Platinum', sponsors: [] },
  { id: 'gold', name: 'Gold', sponsors: [] },
  { id: 'silver', name: 'Silver', sponsors: [] },
  { id: 'bronze', name: 'Bronze', sponsors: [] },
  { id: 'community', name: 'Community Partner', sponsors: [] },
]
