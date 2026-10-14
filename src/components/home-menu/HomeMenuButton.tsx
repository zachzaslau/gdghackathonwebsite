import { useSound } from '../../hooks/useSound'

/**
 * The Wii Menu's bottom-left round button. Measured at 17.6% of screen height,
 * centred at x=8.9%; ring #5AA2B8 over an #E2E2E2 -> #CDCEC9 fill. Where the
 * Wii prints "Wii", this carries the GDG <> mark. It toggles global sound,
 * dimming the mark while muted.
 */
export function HomeMenuButton() {
  const { muted, toggleMute } = useSound()

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={muted}
      style={{
        left: '8.9%',
        top: '48.8%',
        width: 'min(17.6dvh, 13vw)',
        height: 'min(17.6dvh, 13vw)',
      }}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full
        bg-[radial-gradient(circle_at_50%_35%,#EFEFEF_0%,#E2E2E2_55%,#CDCEC9_100%)]
        font-medium shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_0_0_2px_#FFFFFF]
        ring-2 ring-[#5AA2B8] transition-transform hover:scale-105 active:scale-95
        focus-visible:outline-none focus-visible:ring-4"
    >
      {/* ~58% of the button's width: the same visual weight the "Wii"
          wordmark has on the reference, clear of the ring on both sides. */}
      <img
        src="/devfest/gdg-mark.png"
        alt=""
        draggable={false}
        className={`pointer-events-none w-[58%] select-none transition-[opacity,filter] ${
          muted ? 'opacity-40 grayscale' : ''
        }`}
      />
    </button>
  )
}
