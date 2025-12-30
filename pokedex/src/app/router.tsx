// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import MovesPage from '../pages/MovesPage/MovesPage'
import PokemonPage from '../pages/PokemonPage/PokemonPage'
import LookupPage from '../pages/LookupPage/LookupPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MovesPage /> },
      { path: 'pokemon', element: <PokemonPage /> },
      { path: 'lookup', element: <LookupPage /> }
    ]
  }
])

