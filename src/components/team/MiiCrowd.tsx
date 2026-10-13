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
  /** Seconds left in a dance with `partner`; 0 when not dancing. */
  dance: number
  partner: number
  /** Seconds before it can start another dance. */
  cooldown: number
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

/**
 * Two Miis that bump into each other stop and dance together. Close enough
 * to bump: feet this many Mii-heights apart across, and this close in depth.
 */
const BUMP_X = 0.36
const BUMP_Y = 0.12
/** One dance: two cycles of the 1.6s routine in miiPlaza.css. */
const DANCE_SECONDS = 3.2
/** After a dance, how long before that Mii will dance again. */
const DANCE_COOLDOWN = 10

/** Room kept clear above a Mii's head for its name tag. */
const TAG_ROOM = 40
const EDGE_GAP = 8
/** How far above the Home button's top edge feet (and shadow) must stay. */
const BUTTON_GAP = 6

/**
 * Keep every Mii wholly on screen: feet stay half a Mii's width in from the
 * sides, a full Mii (plus its name tag) down from the top, and, shadow
 * included, a few pixels above the Home and sound buttons along the bottom
 * (`buttonsTop`: how far up from the bottom edge those buttons reach).
 */
function boundsFor(w: number, h: number, miiHeight: number, buttonsTop: number): Bounds {
  const sideX = miiHeight * 0.25 + EDGE_GAP
  const top = miiHeight + TAG_ROOM
  const bottom = Math.max(miiHeight * 0.06 + EDGE_GAP, buttonsTop + miiHeight * 0.045 + BUTTON_GAP)
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
      dance: 0,
      partner: -1,
      cooldown: 0,
    })
  }
  return walkers
}

/**
 * Head somewhere nearby, the way Miis mill about the plaza. Given `away`
 * (radians), it sets off roughly in that direction.
 */
function pickTarget(w: Walker, b: Bounds, away?: number) {
  const angle = away === undefined ? Math.random() * Math.PI * 2 : away + between(-0.7, 0.7)
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
 * see its name; click it for that person's card. Two that bump into each
 * other stop for a short dance together, then go their separate ways. Movement runs on
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
    // Measure a Mii's rendered height (it's sized in CSS) and where the Home
    // button's top edge sits, for the bounds; re-measured on resize rather
    // than every frame, to avoid forcing layout.
    let miiHeight = 0
    let buttonsTop = 0
    const measure = () => {
      const body = elements.current[0]?.querySelector<HTMLElement>('.mii-body')
      miiHeight = body?.offsetHeight ?? 0
      const home = document.querySelector<HTMLElement>('.plaza-home')
      buttonsTop = home ? window.innerHeight - home.getBoundingClientRect().top : 0
    }
    measure()
    window.addEventListener('resize', measure)

    const walkers = spawn(
      members.length,
      boundsFor(window.innerWidth, window.innerHeight, miiHeight, buttonsTop),
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
      const bounds = boundsFor(w, h, miiHeight, buttonsTop)

      if (!still) {
        const free = (i: number) =>
          walkers[i].dance === 0 &&
          walkers[i].cooldown === 0 &&
          members[i].id !== hoveredId.current &&
          members[i].id !== selectedRef.current
        for (let i = 0; i < walkers.length; i++) {
          for (let j = i + 1; j < walkers.length; j++) {
            const a = walkers[i]
            const b = walkers[j]
            if (!free(i) || !free(j) || !(a.walking || b.walking)) continue
            if (
              Math.abs((a.x - b.x) * w) < BUMP_X * miiHeight &&
              Math.abs((a.y - b.y) * h) < BUMP_Y * miiHeight
            ) {
              for (const [d, partner] of [[a, j], [b, i]] as const) {
                d.walking = false
                d.dance = DANCE_SECONDS
                d.partner = partner
              }
            }
          }
        }
      }

      walkers.forEach((walker, i) => {
        const el = elements.current[i]
        if (!el) return
        const id = members[i].id
        // A Mii being pointed at (or whose card is open) stops to be clicked.
        const held = id === hoveredId.current || id === selectedRef.current

        walker.cooldown = Math.max(0, walker.cooldown - dt)
        if (walker.dance > 0) {
          walker.dance -= dt
          const partner = walkers[walker.partner]
          // Face each other, easing apart if they bumped in overlapping.
          const gap = (partner.x - walker.x) * w
          walker.facing = gap < 0 ? -1 : 1
          const short = BUMP_X * miiHeight - Math.abs(gap)
          if (short > 0) walker.x -= (walker.facing * Math.min(short / 2, 60 * scale * dt)) / w
          if (walker.dance <= 0) {
            // Done: part ways, each heading off away from the other.
            walker.dance = 0
            walker.cooldown = DANCE_COOLDOWN
            pickTarget(walker, bounds, gap < 0 ? 0 : Math.PI)
          }
        } else if (!still && !held) {
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
        const dancing = walker.dance > 0
        if (el.classList.contains('is-dancing') !== dancing) {
          el.classList.toggle('is-dancing', dancing)
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
            <span className="mii-notes" aria-hidden="true">
              <span>♪</span>
              <span>♫</span>
            </span>
            <span className="mii-tag">{member.name}</span>
          </button>
        )
      })}
    </div>
  )
}
