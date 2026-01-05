import { useEffect, useMemo, useState } from 'react'
import PokemonFilterPanel from '../components/PokemonFilterPanel'
import type { PokemonRow, JPPokemonRow, Pokemon } from '../domain/types'

const dexToNum = (dex: string) => dex.replace('#', '').replace(/^0+/, '') || '1'

const spriteUrl = (dex: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${dexToNum(dex)}.png`

const parseMaybeList = (v: string[] | string | undefined): string[] => {
  if (!v) return []
  if (Array.isArray(v)) return v.map(String)
  if (typeof v !== 'string') return []
  const s = v.trim()
  if (!s) return []
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const parsed = JSON.parse(s)
      return Array.isArray(parsed) ? parsed.map(String) : [s]
    } catch {
      return [s]
    }
  }
  if (s.includes(',')) return s.split(',').map(x => x.trim()).filter(Boolean)
  return [s]
}

const PokemonPage = () => {
  const [pokemon, setPokemon] = useState<PokemonRow[]>([])
  const [jpNames, setJpNames] = useState<JPPokemonRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const merged = useMemo((): Pokemon[] => {
    const jpMap = new Map(jpNames.map(j => [j.eng_name, j]))
    return pokemon.map(p => {
      const jp = jpMap.get(p.name)
      return {
        dexEntry: jp?.dex_entry ?? '',
        pokemon: p.name,
        kanji: jp?.kanji ?? '',
        hepburn: jp?.hepburn ?? '',
        types: parseMaybeList(p.type),
        abilities: parseMaybeList(p.ability),
        stats: {
          hp: Number(p.hp),
          attack: Number(p.attack),
          defense: Number(p.defense),
          specialAttack: Number(p.special_attack),
          specialDefense: Number(p.special_defense),
          speed: Number(p.speed)
        }
      }
    })
  }, [pokemon, jpNames])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return merged.filter(p => {
      if (q) {
        const dexNum = p.dexEntry.replace('#', '')
        if (!p.pokemon.toLowerCase().includes(q) && !p.kanji.toLowerCase().includes(q) && !p.hepburn.toLowerCase().includes(q) && !dexNum.includes(q)) return false
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

// ... keep imports and logic exactly as they are ...

  return (
    <div className="w-full space-y-6">
      {/* 1. Header is now outside the flex container to ensure cards align below it */}
      <header className="flex items-end justify-between border-b-4 border-[var(--pkmn-border)] pb-3">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--pkmn-blue)] leading-none">
            Pokemon List
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
            Showing {filtered.length} Indexed Species
          </p>
        </div>
        <div className="h-1.5 w-24 bg-[var(--pkmn-red)] mb-1" />
      </header>

      {/* 2. Flex container now starts with both cards at the same Y-coordinate */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <aside className="w-full lg:w-72 shrink-0">
          <div className="card-container lg:sticky lg:top-4">
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

        <main className="flex-1 w-full">
          <div className="card-container overflow-hidden p-0 bg-white">
            <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-gray-50 border-b-4 border-[#404040]">
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
                <tbody className="divide-y-2 divide-gray-100">
                  {filtered.map(p => (
                    <tr key={`${p.dexEntry}-${p.pokemon}`} className="hover:bg-[#38a060]/5 transition-colors group">
                      <td className="px-4 py-2">
                        <img
                          src={spriteUrl(p.dexEntry)}
                          alt={p.pokemon}
                          className="h-10 w-10"
                          loading="lazy"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-black uppercase text-[#404040] leading-tight group-hover:text-[#306090]">
                          {p.pokemon}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          {p.dexEntry} • {p.kanji}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center font-bold text-gray-600 tabular-nums">{p.stats.hp}</td>
                      <td className="px-2 py-2 text-center font-bold text-gray-600 tabular-nums">{p.stats.attack}</td>
                      <td className="px-2 py-2 text-center font-bold text-gray-600 tabular-nums">{p.stats.defense}</td>
                      <td className="px-2 py-2 text-center font-bold text-gray-600 tabular-nums">{p.stats.specialAttack}</td>
                      <td className="px-2 py-2 text-center font-bold text-gray-600 tabular-nums">{p.stats.specialDefense}</td>
                      <td className="px-2 py-2 text-center font-bold text-gray-600 tabular-nums">{p.stats.speed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PokemonPage
