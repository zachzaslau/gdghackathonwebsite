export type GdgAccent = 'blue' | 'red' | 'yellow' | 'green'

export interface Channel {
  id: string
  label: string
  /** In-app path, or a full URL when `external` is set. */
  route: string
  /** Opens `route` in a new tab instead of navigating within the site. */
  external?: boolean
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
  /** Preview art for the Tracks menu screen, as a path under /public. */
  image?: string
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
  /** Their custom Mii: a transparent PNG under /public, e.g. '/team/alex.png'. */
  mii: string
  /** Profile photo for their card (square works best); the Mii is shown if absent. */
  photo?: string
  bio?: string
  links?: { label: string; url: string }[]
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
