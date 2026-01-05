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
    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 leading-none">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={e => onChange(+e.target.value || 0)}
      className="pkmn-input py-1"
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
    <div className="space-y-6">
      <section>
        <h2 className="text-xs font-black uppercase text-[var(--pkmn-blue)] border-b-2 border-[var(--pkmn-border)] mb-3">
          Search
        </h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="NAME / 漢字 / DEX"
          className="pkmn-input"
        />
      </section>

      <section>
        <h2 className="text-xs font-black uppercase text-[var(--pkmn-blue)] border-b-2 border-[var(--pkmn-border)] mb-3">
          Min Stats
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Speed" value={minSpeed} onChange={setMinSpeed} />
          <Input label="Attack" value={minAtk} onChange={setMinAtk} />
          <Input label="Defense" value={minDef} onChange={setMinDef} />
          <Input label="Sp. Def" value={minSpDef} onChange={setMinSpDef} />
        </div>
      </section>

      <section>
        <h2 className="text-xs font-black uppercase text-[var(--pkmn-blue)] border-b-2 border-[var(--pkmn-border)] mb-3">
          Role Filter
        </h2>
        <select
          value={role}
          onChange={e => setRole(e.target.value as Role)}
          className="pkmn-input cursor-pointer"
        >
          <option value="all">ALL POKEMON</option>
          <option value="physical">PHYSICAL ATTACKER</option>
          <option value="special">SPECIAL ATTACKER</option>
          <option value="fast">FAST (100+ SPE)</option>
          <option value="wall">TANK/WALL</option>
        </select>
      </section>

      <button 
        onClick={() => {
          setSearch('');
          setMinSpeed(0);
          setMinAtk(0);
          setMinDef(0);
          setMinSpDef(0);
          setRole('all');
        }}
        className="pkmn-button w-full bg-[var(--pkmn-red)] text-white border-none mt-4 hover:opacity-90"
      >
        Reset Filters
      </button>
    </div>
  )
}

export default PokemonFilterPanel
