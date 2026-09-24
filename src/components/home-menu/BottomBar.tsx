import { useCursor } from '../../hooks/useCursor'
import { siteConfig } from '../../data/siteConfig'
import { HomeMenuButton } from './HomeMenuButton'
import { MessageBoardButton } from './MessageBoardButton'

/**
 * Traced from the reference: the bar's top edge is one broad central valley
 * with flat shoulders — high at the edges (under the two round buttons) and
 * dipping in the middle, where the status readout sits ABOVE the line on the
 * striped background while the date sits below it, inside the bar.
 *
 * Local SVG space is 637x88, matching the reference's bar region (y 259-347):
 * shoulders at y=0, valley floor at y=38.
 */
const WAVE_PATH =
  'M0,0 H122 C163,0 163,38 205,38 H435 C477,38 477,0 518,0 H637 V88 H0 Z'
const WAVE_LINE = 'M0,0 H122 C163,0 163,38 205,38 H435 C477,38 477,0 518,0 H637'

export function BottomBar() {
  const { hoverLabel } = useCursor()

  return (
    <div className="absolute inset-x-0 bottom-0" style={{ height: '25.4%' }}>
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 637 88"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wiiBarFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBCCD1" />
            <stop offset="45%" stopColor="#D8D9DE" />
            <stop offset="100%" stopColor="#CED1D8" />
          </linearGradient>
        </defs>
        <path d={WAVE_PATH} fill="url(#wiiBarFill)" />
        <path d={WAVE_LINE} fill="none" stroke="#BAE1F0" strokeWidth="5" vectorEffect="non-scaling-stroke" />
        <path d={WAVE_LINE} fill="none" stroke="#41A0BB" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Status readout — sits in the valley, above the wave line.
          Reference clock is ~11.5% of screen height; a word needs less. */}
      <p
        className="font-heading text-wii-label absolute w-full text-center leading-none font-medium"
        style={{ top: '11%', fontSize: 'min(6.5dvh, 5vw)' }}
      >
        {hoverLabel}
      </p>

      {/* Event date — below the wave line, where the Wii shows today's date.
          Larger and bolder than the reference's date line, in a deeper blue,
          so it reads as the headline fact, with the Wii's pressed-in white
          highlight under the lettering. */}
      <p
        className="font-heading text-wii-blue-600 absolute w-full text-center leading-none font-extrabold
          top-[60%] text-[min(5dvh,3.3vw)] [text-shadow:0_1px_0_rgba(255,255,255,0.85)]
          max-sm:top-[70%] max-sm:text-[5.2vw]"
      >
        {siteConfig.hackathonDate}
      </p>

      <HomeMenuButton />
      <MessageBoardButton />
    </div>
  )
}
