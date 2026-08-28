import { useSound } from '../../hooks/useSound'

/**
 * The Wii Menu's bottom-left round button. Measured at 17.6% of screen height,
 * centred at x=8.9%; ring #5AA2B8 over an #E2E2E2 -> #CDCEC9 fill. Here it
 * toggles global sound, dimming its label while muted.
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
        fontSize: 'min(5dvh, 3.7vw)',
      }}
      className={`font-heading absolute -translate-x-1/2 -translate-y-1/2 rounded-full
        bg-[radial-gradient(circle_at_50%_35%,#EFEFEF_0%,#E2E2E2_55%,#CDCEC9_100%)]
        font-medium shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_0_0_2px_#FFFFFF]
        ring-2 ring-[#5AA2B8] transition-transform hover:scale-105 active:scale-95
        focus-visible:outline-none focus-visible:ring-4
        ${muted ? 'text-[#BFD9E8]' : 'text-wii-label'}`}
    >
      Wii
    </button>
  )
}
