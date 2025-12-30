import { useEffect, useState } from 'react'

type PokemonRow = {
  name: string
  hp: number
  attack: number
  defense: number
}

const PokemonPage = () => {
  const [rows, setRows] = useState<PokemonRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/pokemon.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((json: any[]) => {
        console.log('pokemon.json length:', json.length)
        console.log('pokemon.json first row:', json[0])
        setRows(json)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-zinc-300">Loading…</div>
  if (error) return <div className="text-red-300">Error: {error}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pokémon</h1>
      <div className="text-zinc-400">Loaded {rows.length} rows</div>

      <div className="overflow-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-100">
            <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
              <th>Name</th>
              <th>HP</th>
              <th>Atk</th>
              <th>Def</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.slice(0, 30).map(p => (
              <tr key={p.name} className="[&>td]:px-3 [&>td]:py-2">
                <td className="font-medium text-zinc-100">{p.name}</td>
                <td>{p.hp}</td>
                <td>{p.attack}</td>
                <td>{p.defense}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PokemonPage

