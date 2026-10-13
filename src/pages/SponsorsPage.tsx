import { Link } from 'react-router-dom'
import { MuteButton } from '../components/layout/MuteButton'
import { usePageMusic } from '../hooks/usePageMusic'
import { useSound } from '../hooks/useSound'
import '../styles/wiiShop.css'

/** Slots in the sponsor list until real sponsors are confirmed. */
const SLOT_COUNT = 8

/**
 * The Sponsors channel, dressed as a Wii Shop Channel title list: sponsors sit
 * where the games would, each with a 4:3 "cover" and two lines of text. Every
 * slot reads "Coming Soon" until sponsors are announced.
 */
export function SponsorsPage() {
  const { playSound } = useSound()
  // Wii Shop theme while on this page; opening the channel lets it start.
  usePageMusic('shop')

  return (
    <div className="shop-page">
      <main className="shop-stage">
        <h1 className="shop-title">Sponsors</h1>

        <ul className="shop-grid">
          {Array.from({ length: SLOT_COUNT }, (_, index) => (
            <li key={index} className="shop-item">
              <div aria-hidden="true" className="shop-thumb">
                Coming
                <br />
                Soon
              </div>
              <div className="shop-item-text">Coming Soon</div>
            </li>
          ))}
        </ul>

        <Link to="/" onClick={() => playSound('click')} className="shop-home">
          Home
        </Link>
      </main>

      <MuteButton />
    </div>
  )
}
