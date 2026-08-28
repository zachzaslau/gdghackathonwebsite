import type { Sponsor } from '../../types/content'

export function SponsorLogoPlaceholder({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <div
      className="flex h-24 w-full items-center justify-center rounded-lg border
        border-tile-border bg-white px-4 text-center font-semibold text-slate-500
        shadow-sm transition-transform hover:scale-[1.02]"
    >
      {sponsor.name}
    </div>
  )

  if (sponsor.website) {
    return (
      <a href={sponsor.website} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  return content
}
