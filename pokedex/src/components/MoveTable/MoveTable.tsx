// src/components/MoveTable/MoveTable.tsx
import TypeBadge from '../TypeBadge/TypeBadge'
import type { Move } from '../../domain/types'

const MoveTable = ({ moves }: { moves: Move[] }) => {
  return (
    <div className="overflow-auto rounded-lg border border-zinc-800">
      <table className="w-full table-fixed border-collapse bg-zinc-950 text-sm text-zinc-200">
        <colgroup>
          <col className="w-[80px]" />
          <col className="w-[100px]" />
          <col className="w-[140px]" />
          <col className="w-[160px]" />
          <col className="w-[110px]" />
          <col className="w-[60px]" />
          <col className="w-[60px]" />
          <col className="w-[60px]" />
          <col />
        </colgroup>

        <thead className="bg-zinc-900 text-zinc-50">
          <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left [&>th]:border-b [&>th]:border-zinc-700">
            <th>Kanji</th>
            <th>Hepburn</th>
            <th>Move</th>
            <th>Type</th>
            <th>Category</th>
            <th>Power</th>
            <th>Acc</th>
            <th>PP</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody className="[&>tr:hover]:bg-zinc-900/60">
          {moves.map(m => (
            <tr key={m.move} className="align-top">
              <td className="px-3 py-2 border-b border-zinc-800">{m.kanji}</td>
              <td className="px-3 py-2 border-b border-zinc-800">{m.hepburn}</td>
              <td className="px-3 py-2 border-b border-zinc-800 font-medium">{m.move}</td>
              <td className="px-3 py-2 border-b border-zinc-800">
                {m.types.map(t => <TypeBadge key={t} type={t} />)}
              </td>
              <td className="px-3 py-2 border-b border-zinc-800">{m.damageType}</td>
              <td className="px-3 py-2 border-b border-zinc-800">{m.power}</td>
              <td className="px-3 py-2 border-b border-zinc-800">{m.accuracy}</td>
              <td className="px-3 py-2 border-b border-zinc-800">{m.pp}</td>
              <td className="px-3 py-2 border-b border-zinc-800">{m.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MoveTable

