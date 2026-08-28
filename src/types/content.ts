export type GdgAccent = 'blue' | 'red' | 'yellow' | 'green'

export interface Channel {
  id: string
  label: string
  route: string
  filled: boolean
  accent?: GdgAccent
  /**
   * Full-bleed banner art for the tile, as a path under /public. When set, the
   * art fills the whole tile and the text label is hidden (the label is still
   * used for the hover readout and for screen readers).
   */
  image?: string
}

export interface Track {
  id: string
  title: string
  tagline: string
  description: string
  accent: GdgAccent
}

export interface Sponsor {
  id: string
  name: string
  website?: string
}

export interface SponsorTier {
  id: string
  name: string
  sponsors: Sponsor[]
}

export type TeamDepartment =
  | 'Organizers'
  | 'Logistics & Operations'
  | 'Finance'
  | 'Technology'
  | 'Marketing & Design'

export interface TeamMember {
  id: string
  name: string
  role: string
  department: TeamDepartment
  miiColor: string
}

export type FaqCategory =
  | 'General'
  | 'Logistics'
  | 'Team Formation'
  | 'Judging & Prizes'

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: FaqCategory
}

export interface StatCallout {
  id: string
  value: string
  label: string
}
