import { PageShell } from '../components/layout/PageShell'

export function NotFoundPage() {
  return (
    <PageShell title="Page not found">
      <p className="text-slate-600">
        That channel doesn't exist. Head back to the home menu to find your way.
      </p>
    </PageShell>
  )
}
