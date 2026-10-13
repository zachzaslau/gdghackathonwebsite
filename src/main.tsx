import '@fontsource/m-plus-rounded-1c/latin-400.css'
import '@fontsource/m-plus-rounded-1c/latin-500.css'
import '@fontsource/m-plus-rounded-1c/latin-700.css'
import '@fontsource/m-plus-rounded-1c/latin-800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { soundManager } from './lib/soundManager'

// Set up audio before the first render. Howler unlocks the browser's audio on
// the visitor's first click, but only if it already exists by then: a click
// on the warning screen in the moment between it appearing and React's
// effects running used to create the audio inside that click, too late to
// unlock it, so the music started seconds late and the chime played on a
// later click. Starting here also gets the menu music downloading sooner.
soundManager.preload()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
