import type { Track } from '../types/content'

export const tracks: Track[] = [
  {
    id: 'web-cloud',
    title: 'Web & Cloud',
    tagline: 'Build and ship on the open web',
    description:
      'Projects that live on the web or in the cloud — full-stack apps, browser extensions, APIs, and anything deployed with modern cloud tooling. Bonus points for creative use of Google Cloud or Firebase.',
    accent: 'blue',
  },
  {
    id: 'ai-ml',
    title: 'AI / ML',
    tagline: 'Teach a machine something new',
    description:
      'Projects that use machine learning or generative AI in a meaningful way — not just an API call bolted on. Show us a real problem an ML model helps solve.',
    accent: 'red',
  },
  {
    id: 'mobile-cross-platform',
    title: 'Mobile & Cross-Platform',
    tagline: 'Pocket-sized, powerful',
    description:
      'Native or cross-platform apps built for iOS, Android, or both at once — Flutter, React Native, Kotlin, Swift, whatever gets it into someone\'s pocket.',
    accent: 'yellow',
  },
  {
    id: 'open-innovation',
    title: 'Open Innovation',
    tagline: 'Anything goes',
    description:
      'Got an idea that doesn\'t fit neatly into the other tracks? This one is for hardware hacks, games, tools for good, and everything in between.',
    accent: 'green',
  },
]
