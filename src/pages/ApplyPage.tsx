import { PageShell } from '../components/layout/PageShell'
import { ApplyForm } from '../components/content/ApplyForm'

export function ApplyPage() {
  return (
    <PageShell title="Apply" subtitle="Save your spot at GDG @ UF's hackathon.">
      <ApplyForm />
    </PageShell>
  )
}
