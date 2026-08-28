import { useCallback, useState } from 'react'

// Module-scoped, not sessionStorage: this resets to false on a hard refresh
// (the whole module graph re-executes) but stays true across client-side
// route navigation for the lifetime of the loaded page — including when
// HomeMenuPage itself unmounts/remounts while navigating away and back.
let hasBootedGlobal = false

export function useBootState() {
  const [hasBooted, setHasBooted] = useState(hasBootedGlobal)

  const completeBoot = useCallback(() => {
    hasBootedGlobal = true
    setHasBooted(true)
  }, [])

  return { hasBooted, completeBoot }
}
