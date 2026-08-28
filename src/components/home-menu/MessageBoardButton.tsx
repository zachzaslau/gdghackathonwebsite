import { Mail } from 'lucide-react'
import { siteConfig } from '../../data/siteConfig'

/**
 * The Wii Menu's bottom-right Message Board envelope, measured at 17.6% of
 * screen height and centred at x=90.8%. Repurposed as a link to the club's
 * Discord.
 */
export function MessageBoardButton() {
  return (
    <a
      href={siteConfig.socials.discord}
      target="_blank"
      rel="noreferrer"
      aria-label="Join the GDG Discord"
      style={{
        left: '90.8%',
        top: '48.8%',
        width: 'min(17.6dvh, 13vw)',
        height: 'min(17.6dvh, 13vw)',
      }}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center
        rounded-full bg-[radial-gradient(circle_at_50%_35%,#EFEFEF_0%,#E2E2E2_55%,#CDCEC9_100%)]
        text-wii-label shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_0_0_2px_#FFFFFF]
        ring-2 ring-[#5AA2B8] transition-transform hover:scale-105 active:scale-95
        focus-visible:outline-none focus-visible:ring-4"
    >
      <Mail style={{ width: '45%', height: '45%' }} strokeWidth={2} />
    </a>
  )
}
