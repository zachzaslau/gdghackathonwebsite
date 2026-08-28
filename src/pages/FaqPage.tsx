import { faqItems } from '../data/faq'
import type { FaqCategory } from '../types/content'
import { PageShell } from '../components/layout/PageShell'
import { FaqAccordion } from '../components/content/FaqAccordion'

const categoryOrder: FaqCategory[] = [
  'General',
  'Logistics',
  'Team Formation',
  'Judging & Prizes',
]

export function FaqPage() {
  return (
    <PageShell title="FAQ" subtitle="Everything you need to know before the event.">
      {categoryOrder.map((category) => {
        const items = faqItems.filter((item) => item.category === category)
        if (items.length === 0) return null
        return <FaqAccordion key={category} category={category} items={items} />
      })}
    </PageShell>
  )
}
