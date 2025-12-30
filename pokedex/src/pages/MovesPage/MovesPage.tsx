// src/pages/MovesPage/MovesPage.tsx
import { useMemo, useState } from 'react'
import SearchInput from '../../components/SearchInput/SearchInput'
import MoveTable from '../../components/MoveTable/MoveTable'
import type { JPMoveRow, MoveRow } from '../../domain/types'
import { useJson } from '../../lib/useData'
import { mergeMoves } from '../../lib/transforms'

const MovesPage = () => {
  const [query, setQuery] = useState('')

  const jp = useJson<JPMoveRow[]>('/data/jp_moves.json')
  const moves = useJson<MoveRow[]>('/data/moves.json')

  const merged = useMemo(() => {
    if (!jp.data || !moves.data) return []
    return mergeMoves(jp.data, moves.data)
  }, [jp.data, moves.data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return merged
    return merged.filter(m => m.move.toLowerCase().includes(q))
  }, [merged, query])

  if (jp.loading || moves.loading) return <div className="p-6 text-zinc-200">Loading…</div>
  if (jp.error || moves.error) return <div className="p-6 text-red-300">Error loading data</div>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Moves Database</h1>
          <p className="text-sm text-zinc-400">Search and browse moves</p>
        </div>

        <SearchInput value={query} onChange={setQuery} placeholder="🔎 Search moves by name" />
      </div>

      <MoveTable moves={filtered} />
    </div>
  )
}

export default MovesPage

