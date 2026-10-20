import { ComingSoon } from '../components/content/ComingSoon'
import { usePageMusic } from '../hooks/usePageMusic'

// The questions live in data/faq.ts (rendered with FaqAccordion), ready for
// when this page goes live again.
export function FaqPage() {
  usePageMusic('faq')

  return <ComingSoon title="FAQ" />
}
