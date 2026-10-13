import { aboutMission, aboutStats } from '../data/aboutContent'
import { PageShell } from '../components/layout/PageShell'
import { StatCallout } from '../components/content/StatCallout'
import { usePageMusic } from '../hooks/usePageMusic'

export function AboutPage() {
  usePageMusic('about')

  return (
    <PageShell title={aboutMission.heading}>
      <div className="space-y-4 text-base leading-relaxed text-slate-600">
        {aboutMission.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {aboutStats.map((stat) => (
          <StatCallout key={stat.id} stat={stat} />
        ))}
      </div>
    </PageShell>
  )
}
