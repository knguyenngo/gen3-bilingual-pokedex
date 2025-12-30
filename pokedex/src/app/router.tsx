// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import MovesPage from '../pages/MovesPage'
import PokemonPage from '../pages/PokemonPage'
import LookupPage from '../pages/LookupPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <MovesPage /> },
      { path: '/pokemon', element: <PokemonPage /> },
      { path: '/lookup', element: <LookupPage /> }
    ]
  }
])

