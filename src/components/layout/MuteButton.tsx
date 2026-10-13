import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '../../hooks/useSound'

interface MuteButtonProps {
  /** Extra classes, e.g. a hook for a page to reposition the button. */
  className?: string
}

/**
 * Sound toggle pinned to the bottom-left of the content pages, styled after
 * the home menu's round Wii buttons. Shares the global mute with the home
 * menu's GDG button, so the choice carries across the whole site.
 */
export function MuteButton({ className = '' }: MuteButtonProps) {
  const { muted, toggleMute } = useSound()
  const Icon = muted ? VolumeX : Volume2

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={muted}
      className={`fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full
        bg-[radial-gradient(circle_at_50%_35%,#EFEFEF_0%,#E2E2E2_55%,#CDCEC9_100%)]
        text-wii-blue-800 shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_0_0_2px_#FFFFFF]
        ring-2 ring-[#5AA2B8] transition-transform hover:scale-105 active:scale-95
        focus-visible:outline-none focus-visible:ring-4 ${className}`}
    >
      {/* Sized off the button (24px at its default 56px) so it scales with it. */}
      <Icon className={`h-[43%] w-[43%] ${muted ? 'opacity-50' : ''}`} />
    </button>
  )
}
