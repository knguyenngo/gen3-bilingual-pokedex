import { useEffect, useMemo, useState } from 'react'
import { typeColors } from '../domain/typeColors'

const parseMaybeList = (v: string[] | string): string[] => {
  if (Array.isArray(v)) return v.map(String)
  if (typeof v !== 'string') return []
  const s = v.trim()
  if (!s) return []
  // If your converter made arrays, this won’t hit often, but it’s safe
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
  // "#001" -> "1"
  const n = dexEntry.replace('#', '').replace(/^0+/, '')
  return n || '1'
}

const spriteUrl = (dexEntry: string) => {
  const dexNum = dexToSpriteNumber(dexEntry)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${dexNum}.png`
}

const TypeBadge = ({ type }: { type: string }) => (
  <span
    className="inline-block rounded px-2 py-0.5 text-xs font-medium text-white mr-1"
    style={{ backgroundColor: typeColors[type] ?? '#777' }}
  >
    {type}
  </span>
)

const StatBar = ({ label, value, max = 255 }: { label: string; value: number; max?: number }) => {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  const color =
    pct > 70 ? 'bg-emerald-500' : pct > 40 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="w-32 font-medium text-zinc-200">{label}</div>
        <div className="text-zinc-300 tabular-nums">{value}</div>
      </div>
      <div className="h-3 w-full rounded bg-zinc-800">
        <div className={`h-3 rounded ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const LookupPage = () => {
  const [pokemonRows, setPokemonRows] = useState<PokemonCsvRow[]>([])
  const [jpRows, setJpRows] = useState<JpNameRow[]>([])
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

    const list: PokemonMerged[] = pokemonRows.map(p => {
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

    // Sort by dex if available, otherwise by name
    return list.sort((a, b) => (a.dexEntry || '').localeCompare(b.dexEntry || '') || a.name.localeCompare(b.name))
  }, [pokemonRows, jpRows])

  // Set default selections once data is ready
  useEffect(() => {
    if (!merged.length) return
    if (!selectedName) setSelectedName(merged[0].name)
    if (!selectedDex) setSelectedDex(merged[0].dexEntry)
  }, [merged, selectedName, selectedDex])

  const current = useMemo(() => {
    if (!merged.length) return null
    if (searchBy === 'name') return merged.find(p => p.name === selectedName) ?? null
    return merged.find(p => p.dexEntry === selectedDex) ?? null
  }, [merged, searchBy, selectedName, selectedDex])

  if (loading) return <div className="p-6 text-zinc-300">Loading…</div>
  if (error) return <div className="p-6 text-red-300">Error: {error}</div>
  if (!current) return <div className="p-6 text-zinc-300">No Pokémon found</div>

  const total =
    current.stats.hp +
    current.stats.attack +
    current.stats.defense +
    current.stats.specialAttack +
    current.stats.specialDefense +
    current.stats.speed

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">Pokémon Details</h1>
        <p className="text-sm text-zinc-400">Lookup by name or Pokédex number</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex gap-2">
          <button
            className={`rounded-md px-3 py-2 text-sm border ${
              searchBy === 'name'
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200'
                : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
            }`}
            onClick={() => setSearchBy('name')}
            type="button"
          >
            Name
          </button>
          <button
            className={`rounded-md px-3 py-2 text-sm border ${
              searchBy === 'dex'
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200'
                : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
            }`}
            onClick={() => setSearchBy('dex')}
            type="button"
          >
            Pokédex #
          </button>
        </div>

        {searchBy === 'name' ? (
          <select
            className="w-full sm:w-80 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={selectedName}
            onChange={e => setSelectedName(e.target.value)}
          >
            {merged
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(p => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
          </select>
        ) : (
          <select
            className="w-full sm:w-80 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={selectedDex}
            onChange={e => setSelectedDex(e.target.value)}
          >
            {merged
              .filter(p => p.dexEntry)
              .map(p => (
                <option key={p.dexEntry} value={p.dexEntry}>
                  {p.dexEntry} — {p.name}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex justify-center">
            <img
              src={spriteUrl(current.dexEntry)}
              alt={current.name}
              className="h-48 w-48"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <div className="mt-4 space-y-1">
            <div className="text-xl font-semibold text-zinc-50">{current.dexEntry || '—'}</div>
            <div className="text-lg text-zinc-100">
              {current.name}
              <span className="ml-2 text-sm font-normal text-zinc-400">
                • {current.kanji || ''} • {current.hepburn || ''}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-5">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-zinc-200">Types</div>
            <div>{current.types.map(t => <TypeBadge key={t} type={t} />)}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-zinc-200">Abilities</div>
            <div className="text-zinc-300">{current.abilities.join(', ')}</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-200">Base Stats</div>
              <div className="text-sm text-zinc-300">
                Total: <span className="font-semibold text-zinc-100 tabular-nums">{total}</span>
              </div>
            </div>

            <div className="space-y-3">
              <StatBar label="HP" value={current.stats.hp} />
              <StatBar label="Attack" value={current.stats.attack} />
              <StatBar label="Defense" value={current.stats.defense} />
              <StatBar label="Special Attack" value={current.stats.specialAttack} />
              <StatBar label="Special Defense" value={current.stats.specialDefense} />
              <StatBar label="Speed" value={current.stats.speed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LookupPage

