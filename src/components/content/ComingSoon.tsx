import { PageShell } from '../layout/PageShell'

/** Placeholder body for a channel whose content isn't ready to publish yet. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <PageShell title={title}>
      <div className="rounded-xl border border-tile-border bg-white px-6 py-16 text-center shadow-sm">
        <p className="font-heading text-3xl font-extrabold text-wii-blue-800 sm:text-4xl">
          Coming soon
        </p>
      </div>
    </PageShell>
  )
}
