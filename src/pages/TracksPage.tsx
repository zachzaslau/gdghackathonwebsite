import { useState } from 'react'
import { tracks } from '../data/tracks'
import type { Track } from '../types/content'
import { PageShell } from '../components/layout/PageShell'
import { TrackCard } from '../components/content/TrackCard'
import { TrackModal } from '../components/content/TrackModal'

export function TracksPage() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  return (
    <PageShell title="Tracks" subtitle="Pick a track — or build something that spans all of them.">
      <div className="grid gap-4 sm:grid-cols-2">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} onSelect={setSelectedTrack} />
        ))}
      </div>

      <TrackModal track={selectedTrack} onClose={() => setSelectedTrack(null)} />
    </PageShell>
  )
}
