import { Link, Outlet, useLocation } from 'react-router-dom'

const Layout = () => {
  const { pathname } = useLocation();

  return (
    /* Removed bg-zinc-950 and text-zinc-100 to let index.css variables take over */
    <div className="min-h-screen flex flex-col">
      <header className="border-b-4 border-[var(--pkmn-border)] bg-white shadow-sm">
        <nav className="mx-auto flex max-w-6xl gap-8 p-4">
          {[
            { to: '/', label: 'Moves' },
            { to: '/pokemon', label: 'Pokémon' },
            { to: '/lookup', label: 'Lookup' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs font-black uppercase tracking-widest transition-colors ${
                pathname === link.to 
                  ? 'text-[var(--pkmn-red)] border-b-2 border-[var(--pkmn-red)]' 
                  : 'text-[var(--pkmn-blue)] hover:text-[var(--pkmn-green)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl p-6 flex-grow">
        <Outlet />
      </main>

      <footer className="p-4 text-center text-[10px] font-bold uppercase opacity-50">
        Bilingual Pokédex — Gen 3 Edition
      </footer>
    </div>
  )
}

export default Layout
