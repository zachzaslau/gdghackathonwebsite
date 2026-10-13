import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { MuteButton } from '../components/layout/MuteButton'
import { TrackModal } from '../components/content/TrackModal'
import { DumbbellIcon, FitnessChartIcon } from '../components/content/WiiSportsIcons'
import { tracks } from '../data/tracks'
import { usePageMusic } from '../hooks/usePageMusic'
import { useSound } from '../hooks/useSound'
import '../styles/wiiSportsMenu.css'
import type { Track } from '../types/content'

/**
 * The Tracks channel, dressed as the Wii Sports main menu: our four tracks
 * stand in for the sports. Hovering (or focusing) a track selects it, as the
 * Wii pointer does, and shows its art in the preview screen; clicking it opens
 * the full description. Nothing is selected while the pointer is off the
 * tracks.
 */
export function TracksPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [openTrack, setOpenTrack] = useState<Track | null>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { playSound } = useSound()
  const selected = selectedIndex === null ? null : tracks[selectedIndex]

  // Wii Sports theme for as long as the visitor is on this page. Opening the
  // Tracks channel is the click that lets it start straight away.
  usePageMusic('tracks')

  const openOption = (track: Track) => {
    playSound('click')
    setOpenTrack(track)
  }

  // Up/down move through the list like a d-pad; focus drives the selection.
  const handleListKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const step = event.key === 'ArrowDown' ? 1 : -1
    // Step from the focused track; from outside the list, enter at either end.
    const focused = optionRefs.current.indexOf(document.activeElement as HTMLButtonElement)
    const from = focused === -1 ? (step === 1 ? -1 : 0) : focused
    optionRefs.current[(from + step + tracks.length) % tracks.length]?.focus()
  }

  return (
    <div className="ws-page">
      <div className="ws-stage">
        <header className="ws-header">
          <Link to="/" onClick={() => playSound('click')} className="ws-tab">
            Main Menu
          </Link>
          <h1 className="ws-logo">Tracks</h1>
        </header>

        <main className="ws-band">
          <div aria-hidden="true" className="ws-band-art" />

          <div className="ws-list" onKeyDown={handleListKey}>
            {tracks.map((track, index) => (
              <button
                key={track.id}
                ref={(el) => {
                  optionRefs.current[index] = el
                }}
                type="button"
                aria-current={index === selectedIndex}
                aria-haspopup="dialog"
                onMouseEnter={() => setSelectedIndex(index)}
                onMouseLeave={() => setSelectedIndex(null)}
                onFocus={() => setSelectedIndex(index)}
                onBlur={() => setSelectedIndex(null)}
                onClick={() => openOption(track)}
                className="ws-button ws-option"
              >
                <span>{track.title}</span>
                <span aria-hidden="true" className="ws-brackets">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </button>
            ))}
          </div>

          <div className="ws-preview">
            <div className="ws-screen">
              {selected?.image && <img src={selected.image} alt={selected.title} />}
            </div>
          </div>

          {/* The two square buttons under the preview, with the Wii Sports
              Training and Fitness icons. Decorative for now: they don't do
              anything yet. */}
          <div aria-hidden="true" className="ws-extras">
            <div className="ws-button">
              <DumbbellIcon className="ws-icon" />
            </div>
            <div className="ws-button">
              <FitnessChartIcon className="ws-icon" />
            </div>
          </div>
        </main>

        <MuteButton className="ws-mute" />
      </div>

      <TrackModal track={openTrack} onClose={() => setOpenTrack(null)} />
    </div>
  )
}
