// src/components/TypeBadge/TypeBadge.tsx
import { typeColors } from '../../domain/typeColors'

const TypeBadge = ({ type }: { type: string }) => {
  const bg = typeColors[type] ?? '#777'

  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-xs font-medium text-white mr-1"
      style={{ backgroundColor: bg }}
    >
      {type}
    </span>
  )
}

export default TypeBadge

