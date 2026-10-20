import { createBrowserRouter } from 'react-router-dom'
import { PageSwooshTransition } from '../components/transitions/PageSwooshTransition'
import { AboutPage } from '../pages/AboutPage'
import { FaqPage } from '../pages/FaqPage'
import { HomeMenuPage } from '../pages/HomeMenuPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { SpeakerPage } from '../pages/SpeakerPage'
import { SponsorsPage } from '../pages/SponsorsPage'
import { TeamPage } from '../pages/TeamPage'
import { TracksPage } from '../pages/TracksPage'

export const router = createBrowserRouter([
  {
    element: <PageSwooshTransition />,
    children: [
      { path: '/', element: <HomeMenuPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/sponsors', element: <SponsorsPage /> },
      { path: '/tracks', element: <TracksPage /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/speaker', element: <SpeakerPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
