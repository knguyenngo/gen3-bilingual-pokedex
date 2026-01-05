// src/components/SearchInput.tsx
type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

const SearchInput = ({ value, onChange, placeholder }: Props) => (
  <input
    value={value}
    placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    className="pkmn-input w-full max-w-md"
  />
)

export default SearchInput
