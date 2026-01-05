// src/components/TypeBadge.tsx
import { typeColors } from '../domain/typeColors'

const TypeBadge = ({ type }: { type: string }) => {
  // Pull the color from your domain logic
  const bg = typeColors[type] ?? '#777'

  return (
    <span
      className="inline-block border-2 border-[var(--pkmn-border)] px-2 py-0.5 text-[10px] font-black uppercase text-white mr-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
      style={{ backgroundColor: bg }}
    >
      {type}
    </span>
  )
}

export default TypeBadge
