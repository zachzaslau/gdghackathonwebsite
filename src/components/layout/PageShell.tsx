import { Home } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useSound } from '../../hooks/useSound'
import { MuteButton } from './MuteButton'

interface PageShellProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  const { playSound } = useSound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-wii-blue-50 to-white">
      <span
        aria-hidden="true"
        className="block h-1.5 w-full"
        style={{
          background:
            'linear-gradient(90deg, #4285F4 0%, #EA4335 33%, #FBBC05 66%, #34A853 100%)',
        }}
      />

      <div className="mx-auto max-w-4xl px-6 pt-10 pb-24 sm:pt-14">
        <Link
          to="/"
          onClick={() => playSound('click')}
          className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full
            border border-tile-border bg-white text-wii-blue-800 shadow-md
            transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-wii-blue-600"
          aria-label="Back to home menu"
        >
          <Home size={18} />
        </Link>

        <h1 className="font-heading text-3xl font-extrabold text-wii-blue-800 sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-base text-slate-600">{subtitle}</p>
        )}

        <div className="mt-8 sm:mt-10">{children}</div>
      </div>

      <MuteButton />
    </div>
  )
}
