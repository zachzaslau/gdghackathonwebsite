import { useState } from 'react'
import { guestSpeaker, speakerTalk } from '../data/speakerContent'
import { PageShell } from '../components/layout/PageShell'

export function SpeakerPage() {
  // Hide the photo slot rather than show a broken image if the file is missing.
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <PageShell title="Guest Speaker">
      <div className="rounded-xl border border-tile-border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-gdg-green">
          Featured talk
        </p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold text-wii-blue-800 sm:text-3xl">
          {speakerTalk.title}
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
          {speakerTalk.abstract.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
        {!photoFailed && (
          <img
            src={guestSpeaker.photo}
            alt={guestSpeaker.name}
            onError={() => setPhotoFailed(true)}
            className="aspect-square w-48 shrink-0 self-center rounded-xl border border-tile-border bg-white
              object-cover shadow-sm sm:w-56 sm:self-start"
          />
        )}
        <div>
          <h3 className="font-heading text-xl font-extrabold text-wii-blue-800">
            {guestSpeaker.name}
          </h3>
          <p className="text-sm text-slate-500">{guestSpeaker.role}</p>
          <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-600">
            {guestSpeaker.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
