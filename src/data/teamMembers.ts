import type { TeamMember } from '../types/content'

const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8E7CC3', '#46BDC6']

export const teamMembers: TeamMember[] = [
  { id: 'organizer-1', name: 'Alex Rivera', role: 'Hackathon Director', department: 'Organizers', miiColor: colors[0] },
  { id: 'organizer-2', name: 'Jordan Lee', role: 'Co-Director', department: 'Organizers', miiColor: colors[1] },

  { id: 'logistics-1', name: 'Sam Patel', role: 'Logistics Lead', department: 'Logistics & Operations', miiColor: colors[2] },
  { id: 'logistics-2', name: 'Morgan Diaz', role: 'Volunteer Coordinator', department: 'Logistics & Operations', miiColor: colors[3] },

  { id: 'finance-1', name: 'Taylor Kim', role: 'Finance Lead', department: 'Finance', miiColor: colors[4] },

  { id: 'tech-1', name: 'Casey Nguyen', role: 'Technology Lead', department: 'Technology', miiColor: colors[5] },
  { id: 'tech-2', name: 'Riley Chen', role: 'Website & Infra', department: 'Technology', miiColor: colors[0] },
  { id: 'tech-3', name: 'Devon Brooks', role: 'Judging Platform', department: 'Technology', miiColor: colors[1] },

  { id: 'marketing-1', name: 'Quinn Alvarez', role: 'Marketing Lead', department: 'Marketing & Design', miiColor: colors[2] },
  { id: 'marketing-2', name: 'Harper Wong', role: 'Design & Brand', department: 'Marketing & Design', miiColor: colors[3] },
]
