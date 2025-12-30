type Role = 'all' | 'physical' | 'special' | 'fast' | 'wall'

type Props = {
  search: string
  setSearch: (v: string) => void

  minSpeed: number
  setMinSpeed: (v: number) => void

  minAtk: number
  setMinAtk: (v: number) => void

  minDef: number
  setMinDef: (v: number) => void

  minSpDef: number
  setMinSpDef: (v: number) => void

  role: Role
  setRole: (v: Role) => void
}

const Input = ({
  label,
  value,
  onChange
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) => (
  <div>
    <label className="block text-xs text-zinc-400 mb-1">{label}</label>
    <input
      type="number"
      value={value}
      onChange={e => onChange(+e.target.value || 0)}
      className="w-full rounded bg-zinc-900 px-2 py-1 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
)

const PokemonFilterPanel = ({
  search,
  setSearch,
  minSpeed,
  setMinSpeed,
  minAtk,
  setMinAtk,
  minDef,
  setMinDef,
  minSpDef,
  setMinSpDef,
  role,
  setRole
}: Props) => {
  return (
    <aside className="sticky top-0 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-zinc-800 bg-zinc-950 p-4 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-200">Search</h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Name / 漢字 / Romaji / Dex"
          className="mt-2 w-full rounded bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-200">Stats</h2>
        <Input label="Min Speed" value={minSpeed} onChange={setMinSpeed} />
        <Input label="Min Attack" value={minAtk} onChange={setMinAtk} />
        <Input label="Min Defense" value={minDef} onChange={setMinDef} />
        <Input label="Min Sp. Def" value={minSpDef} onChange={setMinSpDef} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-zinc-200 mb-1">Role</h2>
        <select
          value={role}
          onChange={e => setRole(e.target.value as Role)}
          className="w-full rounded bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
        >
          <option value="all">All</option>
          <option value="physical">Physical Attacker</option>
          <option value="special">Special Attacker</option>
          <option value="fast">Fast</option>
          <option value="wall">Wall</option>
        </select>
      </div>
    </aside>
  )
}

export default PokemonFilterPanel

