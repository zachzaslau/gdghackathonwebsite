import { useEffect, useRef } from 'react'
import type { TeamMember } from '../../types/content'

/** Position and plan of one wandering Mii, in 0-1 fractions of the plaza. */
interface Walker {
  x: number
  y: number
  tx: number
  ty: number
  speed: number
  walking: boolean
  wait: number
  facing: 1 | -1
}

/** Where feet may go, as 0-1 fractions of the plaza. */
interface Bounds {
  x0: number
  x1: number
  y0: number
  y1: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const between = (lo: number, hi: number) => lo + Math.random() * (hi - lo)

/** Room kept clear above a Mii's head for its name tag. */
const TAG_ROOM = 40
const EDGE_GAP = 8

/**
 * Keep every Mii wholly on screen: feet stay half a Mii's width in from the
 * sides, a full Mii (plus its name tag) down from the top, and clear of the
 * bottom edge for the shadow.
 */
function boundsFor(w: number, h: number, miiHeight: number): Bounds {
  const sideX = miiHeight * 0.25 + EDGE_GAP
  const top = miiHeight + TAG_ROOM
  const bottom = miiHeight * 0.06 + EDGE_GAP
  return {
    x0: Math.min(0.5, sideX / w),
    x1: Math.max(0.5, 1 - sideX / w),
    y0: Math.min(0.5, top / h),
    y1: Math.max(0.5, 1 - bottom / h),
  }
}

/** Scatter starting spots, keeping Miis from spawning on top of each other. */
function spawn(count: number, b: Bounds): Walker[] {
  const walkers: Walker[] = []
  for (let i = 0; i < count; i++) {
    let x = 0
    let y = 0
    for (let attempt = 0; attempt < 40; attempt++) {
      x = between(b.x0, b.x1)
      y = between(b.y0, b.y1)
      if (walkers.every((w) => Math.hypot(w.x - x, (w.y - y) * 0.8) > 0.13)) break
    }
    walkers.push({
      x,
      y,
      tx: x,
      ty: y,
      speed: between(38, 70),
      walking: false,
      wait: between(0, 3),
      facing: Math.random() < 0.5 ? -1 : 1,
    })
  }
  return walkers
}

/** Head somewhere nearby, the way Miis mill about the plaza. */
function pickTarget(w: Walker, b: Bounds) {
  const angle = Math.random() * Math.PI * 2
  const dist = between(0.1, 0.32)
  w.tx = clamp(w.x + Math.cos(angle) * dist, b.x0, b.x1)
  w.ty = clamp(w.y + Math.sin(angle) * dist * 0.7, b.y0, b.y1)
  w.walking = true
}

interface MiiCrowdProps {
  members: TeamMember[]
  /** The member whose card is open: they stop and wait while it's up. */
  selectedId: string | null
  onSelect: (member: TeamMember) => void
}

/**
 * The team's Miis, wandering the plaza at random. Point at one to stop it and
 * see its name; click it for that person's card. Movement runs on
 * requestAnimationFrame and writes transforms straight to the DOM, so React
 * doesn't re-render every frame.
 */
export function MiiCrowd({ members, selectedId, onSelect }: MiiCrowdProps) {

  const elements = useRef<(HTMLElement | null)[]>([])
  const hoveredId = useRef<string | null>(null)
  const selectedRef = useRef(selectedId)
  useEffect(() => {
    selectedRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    // Measure a Mii's rendered height (it's sized in CSS) for the bounds;
    // re-measured on resize rather than every frame, to avoid forcing layout.
    let miiHeight = 0
    const measure = () => {
      const body = elements.current[0]?.querySelector<HTMLElement>('.mii-body')
      miiHeight = body?.offsetHeight ?? 0
    }
    measure()
    window.addEventListener('resize', measure)

    const walkers = spawn(
      members.length,
      boundsFor(window.innerWidth, window.innerHeight, miiHeight),
    )
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let last = performance.now()
    let frame = 0

    const tick = (now: number) => {
      // Clamp the step so a backgrounded tab doesn't teleport everyone.
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const w = window.innerWidth
      const h = window.innerHeight
      const scale = clamp(h / 900, 0.5, 1.4)
      const bounds = boundsFor(w, h, miiHeight)

      walkers.forEach((walker, i) => {
        const el = elements.current[i]
        if (!el) return
        const id = members[i].id
        // A Mii being pointed at (or whose card is open) stops to be clicked.
        const held = id === hoveredId.current || id === selectedRef.current

        if (!still && !held) {
          if (walker.walking) {
            const dx = (walker.tx - walker.x) * w
            const dy = (walker.ty - walker.y) * h
            const dist = Math.hypot(dx, dy)
            const step = walker.speed * scale * dt
            if (Math.abs(dx) > 1) walker.facing = dx < 0 ? -1 : 1
            if (dist <= step) {
              walker.x = walker.tx
              walker.y = walker.ty
              walker.walking = false
              walker.wait = between(1, 4.5)
            } else {
              walker.x += (dx / dist) * (step / w)
              walker.y += (dy / dist) * (step / h)
            }
          } else {
            walker.wait -= dt
            if (walker.wait <= 0) pickTarget(walker, bounds)
          }
        }

        // Pull back in if the window shrank around it (or its target).
        walker.x = clamp(walker.x, bounds.x0, bounds.x1)
        walker.y = clamp(walker.y, bounds.y0, bounds.y1)
        walker.tx = clamp(walker.tx, bounds.x0, bounds.x1)
        walker.ty = clamp(walker.ty, bounds.y0, bounds.y1)

        const walking = walker.walking && !held && !still
        el.style.transform = `translate3d(${walker.x * w}px, ${walker.y * h}px, 0)`
        el.style.zIndex = String(Math.round(walker.y * 1000))
        el.style.setProperty('--facing', String(walker.facing))
        if (el.classList.contains('is-walking') !== walking) {
          el.classList.toggle('is-walking', walking)
        }
      })
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
    }
  }, [members])

  return (
    <div className="plaza-crowd">
      {members.map((member, i) => {
        const hold = () => {
          hoveredId.current = member.id
        }
        const release = () => {
          if (hoveredId.current === member.id) hoveredId.current = null
        }
        return (
          <button
            key={member.id}
            ref={(el) => {
              elements.current[i] = el
            }}
            type="button"
            aria-haspopup="dialog"
            aria-label={`${member.name}, ${member.role}`}
            onMouseEnter={hold}
            onMouseLeave={release}
            onFocus={hold}
            onBlur={release}
            onClick={() => onSelect(member)}
            className="mii mii--member"
          >
            <span className="mii-shadow" />
            <span className="mii-body">
              <img src={member.mii} alt="" draggable={false} />
            </span>
            <span className="mii-tag">{member.name}</span>
          </button>
        )
      })}
    </div>
  )
}
