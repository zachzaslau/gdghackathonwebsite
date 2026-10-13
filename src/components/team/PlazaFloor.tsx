import { useEffect, useRef } from 'react'

/** Tiles per ring. Rings grow by the same factor, so every tile stays square. */
const SECTORS = 28
const FLOOR = '#fcfcf8'
const TILE = '#ebe7dc'

function drawFloor(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = FLOOR
  ctx.fillRect(0, 0, w, h)

  // A polar checkerboard: each ring is SECTORS tiles round, and each ring is
  // one tile-width wider than the last, so tiles grow outward like the plaza.
  const cx = w / 2
  const cy = h / 2
  const step = (Math.PI * 2) / SECTORS
  const growth = 1 + step
  const maxR = Math.hypot(w, h) / 2 + 200
  ctx.fillStyle = TILE
  let r = Math.min(w, h) * 0.05
  for (let ring = 0; r < maxR; ring++) {
    const outer = r * growth
    const gap = (outer - r) * 0.07 // thin floor-coloured grout between tiles
    const gapAngle = gap / ((r + outer) / 2)
    for (let s = ring % 2; s < SECTORS; s += 2) {
      const a0 = s * step + gapAngle
      const a1 = (s + 1) * step - gapAngle
      ctx.beginPath()
      ctx.arc(cx, cy, outer - gap, a0, a1)
      ctx.arc(cx, cy, r + gap, a1, a0, true)
      ctx.closePath()
      ctx.fill()
    }
    r = outer
  }
}

/** The Mii Channel plaza floor: rings of beige tiles radiating from centre. */
export function PlazaFloor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let frame = 0
    const redraw = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => drawFloor(canvas))
    }
    redraw()
    window.addEventListener('resize', redraw)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', redraw)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="plaza-floor" />
}
