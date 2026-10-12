import type { Track } from '../types/content'

export const tracks: Track[] = [
  {
    id: 'entertainment',
    title: 'Entertainment',
    tagline: 'Make something people want to play with',
    description:
      'Games, music, video, social, and interactive experiences — anything built to delight, surprise, or bring people together. Show us something we can\'t stop playing.',
    accent: 'yellow',
  },
  {
    id: 'education',
    title: 'Education',
    tagline: 'Help someone learn something new',
    description:
      'Tools that make learning more accessible, engaging, or effective — for students, teachers, or lifelong learners. Study aids, tutoring, accessibility, and new ways to explore ideas all fit here.',
    accent: 'blue',
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    tagline: 'Build for a healthier planet',
    description:
      'Projects that tackle climate, energy, waste, transportation, food, or conservation. Whether it nudges everyday habits or crunches environmental data, show us how it makes a real difference.',
    accent: 'green',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    tagline: 'Hack for better health',
    description:
      'Projects that improve physical or mental health, patient care, or access to medical resources — from wellness apps to tools for clinicians and caregivers.',
    accent: 'red',
  },
]
