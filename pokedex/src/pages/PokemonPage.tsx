// src/pages/PokemonPage.tsx
import { useEffect, useMemo, useState } from 'react'
import PokemonFilterPanel from '../components/PokemonFilterPanel'
import '../styles/PokemonPage.css'

type PokemonRow = {
  name: string
  hp: number
  attack: number
  defense: number
  special_attack: number
  special_defense: number
  speed: number
}

type JpNameRow = {
  dex_entry: string
  eng_name: string
  kanji: string
  hepburn: string
}

type PokemonMerged = {
  dex: string
  name: string
  kanji: string
  hepburn: string
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

const dexToNum = (dex: string) => dex.replace('#', '').replace(/^0+/, '') || '1'

const spriteUrl = (dex: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${dexToNum(dex)}.png`

const PokemonPage = () => {
  const [pokemon, setPokemon] = useState<PokemonRow[]>([])
  const [jpNames, setJpNames] = useState<JpNameRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // filters
  const [search, setSearch] = useState('')
  const [minSpeed, setMinSpeed] = useState(0)
  const [minAtk, setMinAtk] = useState(0)
  const [minDef, setMinDef] = useState(0)
  const [minSpDef, setMinSpDef] = useState(0)
  const [role, setRole] = useState<'all' | 'physical' | 'special' | 'fast' | 'wall'>('all')

  useEffect(() => {
    Promise.all([
      fetch('/data/pokemon.json').then(r => r.json()),
      fetch('/data/jp_names.json').then(r => r.json())
    ])
      .then(([p, j]) => {
        setPokemon(p)
        setJpNames(j)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const merged = useMemo<PokemonMerged[]>(() => {
    const jpMap = new Map(jpNames.map(j => [j.eng_name, j]))

    return pokemon.map(p => {
      const jp = jpMap.get(p.name)
      return {
        dex: jp?.dex_entry ?? '',
        name: p.name,
        kanji: jp?.kanji ?? '',
        hepburn: jp?.hepburn ?? '',
        hp: p.hp,
        attack: p.attack,
        defense: p.defense,
        specialAttack: p.special_attack,
        specialDefense: p.special_defense,
        speed: p.speed
      }
    })
  }, [pokemon, jpNames])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return merged.filter(p => {
      if (q) {
        const dexNum = p.dex.replace('#', '')
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.kanji.toLowerCase().includes(q) &&
          !p.hepburn.toLowerCase().includes(q) &&
          !dexNum.includes(q)
        ) {
          return false
        }
      }

      if (p.speed < minSpeed) return false
      if (p.attack < minAtk) return false
      if (p.defense < minDef) return false
      if (p.specialDefense < minSpDef) return false

      if (role === 'physical' && p.attack <= p.specialAttack) return false
      if (role === 'special' && p.specialAttack <= p.attack) return false
      if (role === 'fast' && p.speed < 100) return false

      if (role === 'wall' && !(p.hp >= 90 && (p.defense >= 100 || p.specialDefense >= 100)))
        return false

      return true
    })
  }, [merged, search, minSpeed, minAtk, minDef, minSpDef, role])

  if (loading) return <div className="p-4 text-zinc-300">Loading…</div>
  if (error) return <div className="p-4 text-red-300">Error: {error}</div>

  return (
    <div className="flex pokemonPage">
      <PokemonFilterPanel
        search={search}
        setSearch={setSearch}
        minSpeed={minSpeed}
        setMinSpeed={setMinSpeed}
        minAtk={minAtk}
        setMinAtk={setMinAtk}
        minDef={minDef}
        setMinDef={setMinDef}
        minSpDef={minSpDef}
        setMinSpDef={setMinSpDef}
        role={role}
        setRole={setRole}
      />

      <div className="flex-1 p-4 space-y-2">
        <div className="text-sm text-zinc-400">Showing {filtered.length} Pokémon</div>

        <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-zinc-800 pokemonScroll pokemonTableShell">
          <table className="w-full table-fixed text-sm text-zinc-200 pokemonTable">
            <colgroup>
              <col className="w-[48px]" />
              <col className="w-[240px]" />
              <col className="w-[60px]" />
              <col className="w-[60px]" />
              <col className="w-[60px]" />
              <col className="w-[70px]" />
              <col className="w-[70px]" />
              <col className="w-[60px]" />
            </colgroup>

            <thead className="sticky top-0 z-10 bg-zinc-900">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left [&>th]:border-b [&>th]:border-zinc-700">
                <th />
                <th>Name</th>
                <th>HP</th>
                <th>Atk</th>
                <th>Def</th>
                <th>Sp.Atk</th>
                <th>Sp.Def</th>
                <th>Speed</th>
              </tr>
            </thead>

            <tbody className="[&>tr:hover]:bg-zinc-900/60">
              {filtered.map(p => (
                <tr key={`${p.dex}-${p.name}`} className="border-b border-zinc-800">
                  <td className="px-2 py-1">
                    {p.dex && (
                      <img
                        src={spriteUrl(p.dex)}
                        alt={p.name}
                        className="h-8 w-8"
                        style={{ imageRendering: 'pixelated' }}
                        loading="lazy"
                      />
                    )}
                  </td>

                  <td className="px-3 py-2">
                    <div className="font-medium text-zinc-100">{p.name}</div>
                    <div className="text-xs text-zinc-400">
                      {p.kanji} · {p.hepburn}
                    </div>
                  </td>

                  <td className="px-3 py-2 tabular-nums">{p.hp}</td>
                  <td className="px-3 py-2 tabular-nums">{p.attack}</td>
                  <td className="px-3 py-2 tabular-nums">{p.defense}</td>
                  <td className="px-3 py-2 tabular-nums">{p.specialAttack}</td>
                  <td className="px-3 py-2 tabular-nums">{p.specialDefense}</td>
                  <td className="px-3 py-2 tabular-nums">{p.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PokemonPage

