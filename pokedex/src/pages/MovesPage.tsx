import { useMemo, useState } from 'react'
import SearchInput from '../components/SearchInput'
import MoveTable from '../components/MoveTable'
import type { JPMoveRow, MoveRow, Move } from '../domain/types'
import { useJson } from '../lib/useData'

const normalize = (v: string) => v.normalize('NFKC').toLowerCase().trim()

const parseTypes = (v: string | string[]): string[] => {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean)
  return []
}

const MovesPage = () => {
  const [query, setQuery] = useState('')

  const jp = useJson<JPMoveRow[]>('/data/jp_moves.json')
  const moves = useJson<MoveRow[]>('/data/moves.json')

  const merged = useMemo((): Move[] => {
    if (!jp.data || !moves.data) return []

    const jpMap = new Map(jp.data.map(r => [r.eng_name, r]))

    return moves.data.map(m => {
      const jpData = jpMap.get(m.name)
      return {
        move: m.name,
        kanji: jpData?.kanji ?? '',
        hepburn: jpData?.hepburn ?? '',
        types: parseTypes(m.type),
        damageType: m.damage_type ?? 'Status',
        power: String(m.power ?? '—'),
        accuracy: String(m.accuracy ?? '—'),
        pp: String(m.pp ?? '—'),
        description: m.description ?? ''
      }
    })
  }, [jp.data, moves.data])

  const filtered = useMemo(() => {
    const q = normalize(query)
    if (!q) return merged

    return merged.filter(m => {
      const move = normalize(m.move ?? '')
      const kanji = normalize(m.kanji ?? '')
      const hepburn = normalize(m.hepburn ?? '')
      return move.includes(q) || kanji.includes(q) || hepburn.includes(q)
    })
  }, [merged, query])

  if (jp.loading || moves.loading) {
    return <div className="p-10 font-black uppercase text-[#306090]">Syncing Database...</div>
  }
  
  if (jp.error || moves.error) {
    return <div className="p-10 text-[#e04030] font-black uppercase">Error Loading Move Data</div>
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-[var(--pkmn-border)] pb-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--pkmn-blue)]">
            Moves Database
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
            Gen 3 Combat Skill Index
          </p>
        </div>

        <div className="w-full md:w-80">
          <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Quick Search</label>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="NAME / 漢字 / HEPBURN"
          />
        </div>
      </header>

      <div className="card-container overflow-hidden p-0 bg-white">
        <MoveTable moves={filtered} />
      </div>
      
      <footer className="flex items-center justify-between px-2">
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Showing {filtered.length} Combat techniques
        </p>
        <div className="h-1 w-20 bg-[var(--pkmn-red)]" />
      </footer>
    </div>
  )
}

export default MovesPage
