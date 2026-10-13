import { useCallback, useState } from 'react'

/**
 * The warning screen auto-advances this long after the page starts loading.
 * Measured against performance.now() — milliseconds since navigation start,
 * so a refresh resets it — rather than from when the screen mounts, which
 * would add however long the bundle took to download and run.
 */
export const BOOT_WINDOW_MS = 3000

export const bootWindowRemaining = () => Math.max(0, BOOT_WINDOW_MS - performance.now())

// Module-scoped, not sessionStorage: this is re-evaluated on every load or
// refresh (the whole module graph re-executes) but stays put across
// client-side route navigation for the lifetime of the loaded page —
// including when HomeMenuPage itself unmounts/remounts while navigating away
// and back. The warning screen is only for a load or refresh on the home
// page: arriving on any other page counts as already booted, so going Home
// from there lands straight on the menu.
let hasBootedGlobal = window.location.pathname !== '/'

export function useBootState() {
  // Also treat the boot as done once the window has passed, so landing on
  // another page first and reaching the home menu later doesn't flash the
  // warning screen for a single frame before it auto-advances.
  const [hasBooted, setHasBooted] = useState(
    () => hasBootedGlobal || bootWindowRemaining() === 0,
  )

  const completeBoot = useCallback(() => {
    hasBootedGlobal = true
    setHasBooted(true)
  }, [])

  return { hasBooted, completeBoot }
}
