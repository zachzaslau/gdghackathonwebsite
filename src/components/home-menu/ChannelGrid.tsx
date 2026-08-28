import { channels } from '../../data/channels'
import { ChannelTile } from './ChannelTile'

/**
 * 4 columns x 3 rows, transcribed from the reference: the grid box is
 * 534x221.7 of a 637x347 screen (aspect 2.409) with ~5.3px column gaps and
 * ~5.5px row gaps, which lands each tile at 129x70 — the banner proportion as
 * it appears in the reference. Sizing by height and capping by width keeps
 * those proportions at any viewport shape.
 */
export function ChannelGrid() {
  return (
    <div
      className="grid h-full grid-cols-4 grid-rows-3"
      style={{ aspectRatio: '2.409', maxWidth: '83.83%', gap: '2.5% 1%' }}
    >
      {channels.map((channel) => (
        <ChannelTile key={channel.id} channel={channel} />
      ))}
    </div>
  )
}
