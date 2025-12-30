// s// src/components/SearchInput.tsx
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
    className="w-full max-w-md rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500"
  />
)

export default SearchInput

