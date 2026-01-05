import SearchInput from './SearchInput'

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
  <div className="flex items-center justify-between gap-2">
    <label className="text-[10px] font-black uppercase text-gray-500 whitespace-nowrap">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={e => onChange(+e.target.value || 0)}
      /* Added appearance-none to remove arrows and prevent layout break */
      className="pkmn-input py-1 w-16 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="NAME / 漢字 / DEX"
        />
      </section>

      <section>
        <h2 className="text-xs font-black uppercase text-[var(--pkmn-blue)] border-b-2 border-[var(--pkmn-border)] mb-3">
          Min Stats
        </h2>
        <div className="flex flex-col gap-2">
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
        className="pkmn-button w-full bg-[var(--pkmn-red)] text-white border-none mt-4 hover:opacity-90 cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  )
}

export default PokemonFilterPanel
