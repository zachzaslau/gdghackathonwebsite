import type { StatCallout as StatCalloutType } from '../../types/content'

export function StatCallout({ stat }: { stat: StatCalloutType }) {
  return (
    <div className="rounded-xl border border-tile-border bg-white px-4 py-5 text-center shadow-sm">
      <p className="font-heading text-2xl font-extrabold text-wii-blue-800 sm:text-3xl">
        {stat.value}
      </p>
      <p className="mt-1 text-xs text-slate-500 sm:text-sm">{stat.label}</p>
    </div>
  )
}
