import type { FaqCategory, FaqItem } from '../../types/content'
import { SectionHeading } from '../layout/SectionHeading'

export function FaqAccordion({
  category,
  items,
}: {
  category: FaqCategory
  items: FaqItem[]
}) {
  return (
    <section className="mb-10">
      <SectionHeading>{category}</SectionHeading>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.id}
            className="group rounded-lg border border-tile-border bg-white p-4 shadow-sm"
          >
            <summary className="font-heading cursor-pointer list-none font-semibold text-wii-blue-800 marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="shrink-0 text-wii-blue-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
