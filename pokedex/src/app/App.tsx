import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import PokemonPage from '../pages/PokemonPage/PokemonPage.tsx'
import MovesPage from '../pages/MovesPage/MovesPage.tsx'
import LookupPage from '../pages/LookupPage/LookupPage.tsx'

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <nav className="mx-auto flex max-w-6xl gap-4 p-4">
          <Link to="/" className="text-sm hover:text-white">Moves</Link>
          <Link to="/pokemon" className="text-sm hover:text-white">Pokémon</Link>
          <Link to="/lookup" className="text-sm hover:text-white">Lookup</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <Routes>
          <Route path="/" element={<MovesPage />} />
          <Route path="/pokemon" element={<PokemonPage />} />
          <Route path="/lookup" element={<LookupPage />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
)

export default App

