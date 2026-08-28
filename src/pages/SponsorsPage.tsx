import { sponsorTiers } from '../data/sponsors'
import { PageShell } from '../components/layout/PageShell'
import { SponsorTierGrid } from '../components/content/SponsorTierGrid'

export function SponsorsPage() {
  return (
    <PageShell
      title="Sponsors"
      subtitle="GDG @ UF's hackathon runs on the generosity of our sponsors."
    >
      {sponsorTiers.map((tier) => (
        <SponsorTierGrid key={tier.id} tier={tier} />
      ))}
    </PageShell>
  )
}
