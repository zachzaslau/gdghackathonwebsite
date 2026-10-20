import { ComingSoon } from '../components/content/ComingSoon'
import { usePageMusic } from '../hooks/usePageMusic'

// The About copy and stats live in data/aboutContent.ts, ready for when this
// page goes live again.
export function AboutPage() {
  usePageMusic('about')

  return <ComingSoon title="About" />
}
