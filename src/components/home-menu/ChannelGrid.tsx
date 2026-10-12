import { channels } from '../../data/channels'
import { ChannelTile } from './ChannelTile'

/**
 * 4 columns x 3 rows, transcribed from the reference: the grid box is
 * 534x221.7 of a 637x347 screen (aspect 2.409) with ~5.3px column gaps and
 * ~5.5px row gaps, which lands each tile at 129x70 — the banner proportion as
 * it appears in the reference. Sizing by height and capping by width keeps
 * those proportions at any viewport shape.
 *
 * Sizing lives in `.channel-grid` (index.css), which also switches portrait
 * screens to 2 columns of just the six real channels.
 */
export function ChannelGrid() {
  return (
    <div className="channel-grid grid">
      {channels.map((channel) => (
        <ChannelTile key={channel.id} channel={channel} />
      ))}
    </div>
  )
}
