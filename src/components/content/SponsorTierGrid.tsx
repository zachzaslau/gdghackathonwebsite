import { siteConfig } from '../../data/siteConfig'
import type { SponsorTier } from '../../types/content'
import { SectionHeading } from '../layout/SectionHeading'
import { SponsorLogoPlaceholder } from './SponsorLogoPlaceholder'

export function SponsorTierGrid({ tier }: { tier: SponsorTier }) {
  return (
    <section className="mb-10">
      <SectionHeading>{tier.name}</SectionHeading>
      {tier.sponsors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-tile-border bg-white/60 p-6 text-sm text-slate-500">
          Sponsors coming soon — interested in sponsoring GDG @ UF's hackathon?{' '}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="font-semibold text-wii-blue-600 underline"
          >
            Get in touch
          </a>
          .
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tier.sponsors.map((sponsor) => (
            <SponsorLogoPlaceholder key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      )}
    </section>
  )
}
