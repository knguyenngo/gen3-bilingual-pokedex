import { useEffect, useMemo, useState } from 'react'
import TypeBadge from '../components/TypeBadge'
import StatBar from '../components/StatBar'

const parseMaybeList = (v: string[] | string): string[] => {
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

const dexToSpriteNumber = (dexEntry: string) => {
  const n = dexEntry.replace('#', '').replace(/^0+/, '')
  return n || '1'
}

const spriteUrl = (dexEntry: string) => {
  const dexNum = dexToSpriteNumber(dexEntry)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${dexNum}.png`
}

const LookupPage = () => {
  const [pokemonRows, setPokemonRows] = useState<any[]>([])
  const [jpRows, setJpRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchBy, setSearchBy] = useState<'name' | 'dex'>('name')
  const [selectedName, setSelectedName] = useState<string>('')
  const [selectedDex, setSelectedDex] = useState<string>('')

  useEffect(() => {
    Promise.all([
      fetch('/data/pokemon.json').then(r => {
        if (!r.ok) throw new Error(`pokemon.json HTTP ${r.status}`)
        return r.json()
      }),
      fetch('/data/jp_names.json').then(r => {
        if (!r.ok) throw new Error(`jp_names.json HTTP ${r.status}`)
        return r.json()
      })
    ])
      .then(([pokemonJson, jpJson]) => {
        setPokemonRows(pokemonJson)
        setJpRows(jpJson)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const merged = useMemo(() => {
    const jpByEng = new Map(jpRows.map(r => [r.eng_name, r]))
    const list = pokemonRows.map(p => {
      const jp = jpByEng.get(p.name)
      return {
        dexEntry: jp?.dex_entry ?? '',
        name: p.name,
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
    return list.sort((a, b) => (a.dexEntry || '').localeCompare(b.dexEntry || '') || a.name.localeCompare(b.name))
  }, [pokemonRows, jpRows])

  useEffect(() => {
    if (!merged.length) return
    if (!selectedName) setSelectedName(merged[0].name)
    if (!selectedDex) setSelectedDex(merged[0].dexEntry)
  }, [merged])

  const current = useMemo(() => {
    if (!merged.length) return null
    if (searchBy === 'name') return merged.find(p => p.name === selectedName) ?? null
    return merged.find(p => p.dexEntry === selectedDex) ?? null
  }, [merged, searchBy, selectedName, selectedDex])

  if (loading) return <div className="p-6 font-black uppercase text-[var(--pkmn-blue)]">Syncing Data...</div>
  if (error) return <div className="p-6 text-[var(--pkmn-red)] font-black uppercase">Error: {error}</div>
  if (!current) return <div className="p-6 font-black uppercase">No Pokémon found</div>

  const total = Object.values(current.stats).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <header className="border-b-4 border-[var(--pkmn-border)] pb-2">
        <h1 className="text-3xl font-black uppercase text-[var(--pkmn-blue)]">Pokémon Details</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest">Gen 3 Pokédex Data System</p>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex gap-1">
          <button
            className={`pkmn-button ${searchBy === 'name' ? 'bg-[var(--pkmn-blue)] text-white' : 'bg-white'}`}
            onClick={() => setSearchBy('name')}
          >
            Name
          </button>
          <button
            className={`pkmn-button ${searchBy === 'dex' ? 'bg-[var(--pkmn-blue)] text-white' : 'bg-white'}`}
            onClick={() => setSearchBy('dex')}
          >
            Dex #
          </button>
        </div>

        <select
          className="pkmn-input w-full sm:w-80 cursor-pointer"
          value={searchBy === 'name' ? selectedName : selectedDex}
          onChange={e => searchBy === 'name' ? setSelectedName(e.target.value) : setSelectedDex(e.target.value)}
        >
          {searchBy === 'name' 
            ? merged.map(p => <option key={p.name} value={p.name}>{p.name.toUpperCase()}</option>)
            : merged.filter(p => p.dexEntry).map(p => (
                <option key={p.dexEntry} value={p.dexEntry}>
                  {p.dexEntry} — {p.name.toUpperCase()}
                </option>
              ))
          }
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="card-container flex flex-col items-center">
          <div className="bg-[#f8f8f8] border-2 border-[var(--pkmn-border)] p-4 mb-4 shadow-inner">
            <img
              src={spriteUrl(current.dexEntry)}
              alt={current.name}
              className="h-48 w-48"
            />
          </div>

          <div className="text-center space-y-1">
            <div className="text-2xl font-black text-[var(--pkmn-red)]">{current.dexEntry || '???' }</div>
            <div className="text-xl font-black uppercase tracking-widest">{current.name}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase">
              {current.kanji} • {current.hepburn}
            </div>
          </div>
        </div>

        <div className="card-container space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-[var(--pkmn-blue)] border-b-2 border-[var(--pkmn-border)] inline-block">Types</h3>
              <div className="pt-1 flex flex-wrap gap-1">
                {current.types.map(t => (
                  <TypeBadge key={t} type={t} />
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase text-[var(--pkmn-blue)] border-b-2 border-[var(--pkmn-border)] inline-block">Abilities</h3>
              <div className="text-[10px] font-black uppercase pt-1">{current.abilities.join(', ')}</div>
            </section>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[var(--pkmn-border)]">
              <h3 className="text-xs font-black uppercase text-[var(--pkmn-blue)]">Base Stats</h3>
              <div className="text-[10px] font-black uppercase">
                Total: <span className="text-[var(--pkmn-red)]">{total}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <StatBar label="HP" value={current.stats.hp} />
              <StatBar label="Attack" value={current.stats.attack} />
              <StatBar label="Defense" value={current.stats.defense} />
              <StatBar label="Sp. Atk" value={current.stats.specialAttack} />
              <StatBar label="Sp. Def" value={current.stats.specialDefense} />
              <StatBar label="Speed" value={current.stats.speed} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LookupPage
