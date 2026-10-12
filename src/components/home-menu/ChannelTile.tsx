import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCursor } from '../../hooks/useCursor'
import { useSound } from '../../hooks/useSound'
import { tilePopVariants } from '../../lib/motionVariants'
import { gdgAccentGradient } from '../../styles/theme'
import type { Channel } from '../../types/content'

const MotionLink = motion.create(Link)

const REGISTER_GRADIENT =
  'linear-gradient(135deg, #4285F4 0%, #EA4335 33%, #FBBC05 66%, #34A853 100%)'

/** Corner radius measured at ~7.7% of tile width on the reference. */
const RADIUS = 'clamp(5px, 1.5vw, 18px)'

interface ChannelTileProps {
  channel: Channel
}

export function ChannelTile({ channel }: ChannelTileProps) {
  const { playSound } = useSound()
  const { setHoverLabel, resetHoverLabel } = useCursor()
  // Until the art actually loads (or if it 404s), fall back to the coloured
  // gradient + text label rather than showing an empty tile. On error the
  // <img> is dropped entirely so no broken-image glyph shows.
  const [artState, setArtState] = useState<'pending' | 'loaded' | 'failed'>('pending')
  const artLoaded = artState === 'loaded'

  if (!channel.filled) {
    return (
      <div
        aria-hidden="true"
        onMouseEnter={resetHoverLabel}
        style={{ borderRadius: RADIUS }}
        className="bg-[#c9ccd0] shadow-[inset_0_1px_3px_rgba(0,0,0,0.13)] portrait:hidden"
      />
    )
  }

  const handleEnter = () => {
    setHoverLabel(channel.label)
  }

  const handleActivate = () => {
    playSound('click')
    setHoverLabel(channel.label)
  }

  const tileFill =
    channel.id === 'register'
      ? REGISTER_GRADIENT
      : channel.accent
        ? `linear-gradient(135deg, ${gdgAccentGradient[channel.accent][0]} 0%, ${gdgAccentGradient[channel.accent][1]} 100%)`
        : undefined

  // External channels (e.g. the Register Google Form) open in a new tab so
  // the Wii menu stays put behind them.
  const TileLink = channel.external ? motion.a : MotionLink
  const linkProps = channel.external
    ? { href: channel.route, target: '_blank', rel: 'noopener noreferrer' }
    : { to: channel.route }

  return (
    <TileLink
      {...linkProps}
      variants={tilePopVariants}
      initial="rest"
      whileTap="tap"
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      onMouseLeave={resetHoverLabel}
      onBlur={resetHoverLabel}
      onClick={handleActivate}
      aria-label={channel.label}
      // inline-size container so the label can size itself off the tile (cqw)
      style={{ backgroundImage: tileFill, borderRadius: RADIUS, containerType: 'inline-size' }}
      className="wii-channel-highlight group relative flex items-center justify-center
        overflow-hidden text-center ring-1 ring-white/70 ring-inset focus-visible:outline-none"
    >
      {channel.image && artState !== 'failed' && (
        <img
          src={channel.image}
          alt=""
          draggable={false}
          onLoad={() => setArtState('loaded')}
          onError={() => setArtState('failed')}
          className="absolute inset-0 h-full w-full max-w-none object-cover"
        />
      )}

      {/* Glossy sweep across the upper half, as on real channel banners */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent"
      />

      {/* Reference channel labels ("Forecast Channel") measure ~4% of screen
          height (~11.5% of tile width) at a light weight — not heavy or
          shadowed. Sized off the tile so it holds in the 2-column phone
          grid. Art-backed tiles carry their own wordmark, so the text label
          is omitted there. */}
      {!artLoaded && (
        <span
          className="font-heading relative px-2 font-medium text-white
            [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]"
          style={{ fontSize: '11.5cqw' }}
        >
          {channel.label}
        </span>
      )}
    </TileLink>
  )
}
