import { useMemo, useState } from 'react'
import SearchInput from '../components/SearchInput'
import MoveTable from '../components/MoveTable'
import type { JPMoveRow, MoveRow, Move } from '../domain/types'
import { useJson } from '../lib/useData'

const normalize = (v: string) => v.normalize('NFKC').toLowerCase().trim()

/**
 * Utility to parse types from string or array (Safe guard)
 */
const parseTypes = (v: string | string[]): string[] => {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') return v.split(',').map(s => s.trim())
  return []
}

const MovesPage = () => {
  const [query, setQuery] = useState('')

  const jp = useJson<JPMoveRow[]>('/data/jp_moves.json')
  const moves = useJson<MoveRow[]>('/data/moves.json')

  // Explicitly merging and translating names to match Move type in types.ts
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
        // Translation Bridge: damage_type (JSON) -> damageType (Domain Type)
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
    return <div className="p-10 font-black uppercase text-[#306090]">Loading Moves...</div>
  }
  
  if (jp.error || moves.error) {
    return <div className="p-10 text-[#e04030] font-bold uppercase">Error loading Move Data</div>
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#306090]">
            Moves Database
          </h1>
          <div className="mt-2 h-1.5 w-20 bg-[#e04030]" />
          <p className="mt-3 text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Search by English, Kanji, or Hepburn
          </p>
        </div>

        <div className="w-full md:w-80">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search (Eng / 漢字 / Hepburn)…"
          />
        </div>
      </div>

      {/* Table Container with Gen 3 Card Style */}
      <div className="card-container overflow-hidden p-0 bg-white">
        <MoveTable moves={filtered} />
      </div>
      
      <footer className="text-center text-[10px] font-black uppercase text-gray-400 pb-8">
        Showing {filtered.length} unique moves
      </footer>
    </div>
  )
}

export default MovesPage
