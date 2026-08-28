import { BootSequence } from '../components/boot/BootSequence'
import { WiiHomeMenu } from '../components/home-menu/WiiHomeMenu'
import { useBootState } from '../hooks/useBootState'

export function HomeMenuPage() {
  const { hasBooted, completeBoot } = useBootState()

  if (!hasBooted) {
    return <BootSequence onBootComplete={completeBoot} />
  }

  return <WiiHomeMenu />
}
