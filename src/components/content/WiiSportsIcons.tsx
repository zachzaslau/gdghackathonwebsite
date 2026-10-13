/**
 * The two icons from the Wii Sports main menu's square buttons (Training's
 * dumbbell and Fitness's chart), redrawn as SVG in a 100x100 box that includes
 * the square frame. Proportions are traced from a capture of the real menu.
 */

/** Button face colour, used to cut the grooves into the dumbbell weights. */
const FACE = '#d6e7eb'

export function DumbbellIcon({ className }: { className?: string }) {
  const color = '#8580d8'
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="2" y="2" width="96" height="96" fill="none" stroke={color} strokeWidth="4" />
      <defs>
        <clipPath id="ws-dumbbell-weights">
          <rect x="9" y="30" width="25" height="40" rx="12.5" />
          <rect x="66" y="30" width="25" height="40" rx="12.5" />
        </clipPath>
      </defs>
      {/* Drawn level, then tipped up 45deg like the reference. */}
      <g transform="rotate(-45 50 50)">
        <rect x="30" y="44" width="40" height="12" fill={color} />
        <rect x="9" y="30" width="25" height="40" rx="12.5" fill={color} />
        <rect x="66" y="30" width="25" height="40" rx="12.5" fill={color} />
        {/* Grooves, cut only across the weights. */}
        <g stroke={FACE} strokeWidth="3" clipPath="url(#ws-dumbbell-weights)">
          <line x1="18.5" y1="30" x2="18.5" y2="70" />
          <line x1="26" y1="30" x2="26" y2="70" />
          <line x1="74" y1="30" x2="74" y2="70" />
          <line x1="81.5" y1="30" x2="81.5" y2="70" />
        </g>
      </g>
    </svg>
  )
}

const CHART_POINTS: [number, number][] = [
  [8, 69],
  [18.4, 52.8],
  [30.3, 75.7],
  [42.1, 47.5],
  [52.5, 35],
  [65.3, 65.9],
  [77.2, 47.5],
  [91.1, 22.8],
]

export function FitnessChartIcon({ className }: { className?: string }) {
  const color = '#53b693'
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="2" y="2" width="96" height="96" fill="none" stroke={color} strokeWidth="4" />
      <polygon points="50,18 12,84 88,84" fill="none" stroke={color} strokeWidth="7" />
      <polyline
        points={CHART_POINTS.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {CHART_POINTS.map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="3.8" fill={color} />
      ))}
    </svg>
  )
}
