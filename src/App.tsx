import { RouterProvider } from 'react-router-dom'
import { WiiCursor } from './components/cursor/WiiCursor'
import { CursorProvider } from './context/CursorProvider'
import { SoundProvider } from './context/SoundProvider'
import { router } from './routes/router'

function App() {
  return (
    <SoundProvider>
      <CursorProvider>
        <WiiCursor />
        <RouterProvider router={router} />
      </CursorProvider>
    </SoundProvider>
  )
}

export default App
