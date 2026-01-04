import { useEffect, useMemo, useState } from 'react'
import PokemonFilterPanel from '../components/PokemonFilterPanel'
// Import the types to stay consistent with your domain
import type { PokemonRow, JPPokemonRow, Pokemon } from '../domain/types'

const dexToNum = (dex: string) => dex.replace('#', '').replace(/^0+/, '') || '1'

const spriteUrl = (dex: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${dexToNum(dex)}.png`

const PokemonPage = () => {
  const [pokemon, setPokemon] = useState<PokemonRow[]>([])
  const [jpNames, setJpNames] = useState<JPPokemonRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters state
  const [search, setSearch] = useState('')
  const [minSpeed, setMinSpeed] = useState(0)
  const [minAtk, setMinAtk] = useState(0)
  const [minDef, setMinDef] = useState(0)
  const [minSpDef, setMinSpDef] = useState(0)
  const [role, setRole] = useState<'all' | 'physical' | 'special' | 'fast' | 'wall'>('all')

  useEffect(() => {
    Promise.all([
      fetch('/data/pokemon.json').then(r => r.ok ? r.json() : Promise.reject(`pokemon.json HTTP ${r.status}`)),
      fetch('/data/jp_names.json').then(r => r.ok ? r.json() : Promise.reject(`jp_names.json HTTP ${r.status}`))
    ])
      .then(([p, j]) => {
        setPokemon(p)
        setJpNames(j)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  // The Naming Bridge: Mapping underscores to camelCase
  const merged = useMemo((): Pokemon[] => {
    const jpMap = new Map(jpNames.map(j => [j.eng_name, j]))

    return pokemon.map(p => {
      const jp = jpMap.get(p.name)
      return {
        dexEntry: jp?.dex_entry ?? '',
        pokemon: p.name,
        kanji: jp?.kanji ?? '',
        hepburn: jp?.hepburn ?? '',
        types: [], // Add logic if types are needed here
        abilities: [], // Add logic if abilities are needed here
        stats: {
          hp: p.hp,
          attack: p.attack,
          defense: p.defense,
          specialAttack: p.special_attack, // Bridge here
          specialDefense: p.special_defense, // Bridge here
          speed: p.speed
        }
      }
    })
  }, [pokemon, jpNames])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return merged.filter(p => {
      if (q) {
        const dexNum = p.dexEntry.replace('#', '')
        if (
          !p.pokemon.toLowerCase().includes(q) &&
          !p.kanji.toLowerCase().includes(q) &&
          !p.hepburn.toLowerCase().includes(q) &&
          !dexNum.includes(q)
        ) return false
      }

      if (p.stats.speed < minSpeed) return false
      if (p.stats.attack < minAtk) return false
      if (p.stats.defense < minDef) return false
      if (p.stats.specialDefense < minSpDef) return false

      if (role === 'physical' && p.stats.attack <= p.stats.specialAttack) return false
      if (role === 'special' && p.stats.specialAttack <= p.stats.attack) return false
      if (role === 'fast' && p.stats.speed < 100) return false
      if (role === 'wall' && !(p.stats.hp >= 90 && (p.stats.defense >= 100 || p.stats.specialDefense >= 100))) return false

      return true
    })
  }, [merged, search, minSpeed, minAtk, minDef, minSpDef, role])

  if (loading) return <div className="p-10 font-black uppercase text-[#306090]">Syncing Database...</div>
  if (error) return <div className="p-10 text-[#e04030] font-bold uppercase">Error: {error}</div>

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Side Filter Panel */}
      <aside className="w-full lg:w-72">
        <div className="card-container sticky top-4">
          <PokemonFilterPanel
            search={search} setSearch={setSearch}
            minSpeed={minSpeed} setMinSpeed={setMinSpeed}
            minAtk={minAtk} setMinAtk={setMinAtk}
            minDef={minDef} setMinDef={setMinDef}
            minSpDef={minSpDef} setMinSpDef={setMinSpDef}
            role={role} setRole={setRole}
          />
        </div>
      </aside>

      {/* Main Table Content */}
      <main className="flex-1 space-y-4">
        <div className="flex items-end justify-between px-2">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-[#306090]">Pokemon List</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Showing {filtered.length} Results
                </p>
            </div>
            <div className="h-1 w-20 bg-[#e04030] mb-2" />
        </div>

        <div className="card-container overflow-hidden p-0 bg-white">
          <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50 border-b-2 border-[#404040]">
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <th className="px-4 py-3 w-16">Icon</th>
                  <th className="px-4 py-3">Pokemon</th>
                  <th className="px-2 py-3 text-center">HP</th>
                  <th className="px-2 py-3 text-center">Atk</th>
                  <th className="px-2 py-3 text-center">Def</th>
                  <th className="px-2 py-3 text-center">SpA</th>
                  <th className="px-2 py-3 text-center">SpD</th>
                  <th className="px-2 py-3 text-center">Spe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={`${p.dexEntry}-${p.pokemon}`} className="hover:bg-[#38a060]/5 transition-colors">
                    <td className="px-4 py-2">
                      <img
                        src={spriteUrl(p.dexEntry)}
                        alt={p.pokemon}
                        className="h-10 w-10 pixelated"
                        loading="lazy"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-black uppercase text-[#404040] leading-tight">{p.pokemon}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {p.dexEntry} • {p.kanji}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center font-mono font-bold text-gray-600">{p.stats.hp}</td>
                    <td className="px-2 py-2 text-center font-mono font-bold text-gray-600">{p.stats.attack}</td>
                    <td className="px-2 py-2 text-center font-mono font-bold text-gray-600">{p.stats.defense}</td>
                    <td className="px-2 py-2 text-center font-mono font-bold text-gray-600">{p.stats.specialAttack}</td>
                    <td className="px-2 py-2 text-center font-mono font-bold text-gray-600">{p.stats.specialDefense}</td>
                    <td className="px-2 py-2 text-center font-mono font-bold text-gray-600">{p.stats.speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PokemonPage
