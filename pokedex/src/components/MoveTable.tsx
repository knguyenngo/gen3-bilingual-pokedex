// src/components/MoveTable.tsx
import TypeBadge from './TypeBadge'
import type { Move } from '../domain/types'

const MoveTable = ({ moves }: { moves: Move[] }) => {
  return (
    <div className="overflow-auto max-h-[70vh] custom-scrollbar">
      <table className="w-full table-fixed border-collapse bg-white text-xs">
        <colgroup>
          <col className="w-[100px]" />
          <col className="w-[120px]" />
          <col className="w-[140px]" />
          <col className="w-[120px]" />
          <col className="w-[100px]" />
          <col className="w-[60px]" />
          <col className="w-[60px]" />
          <col className="w-[60px]" />
          <col className="w-[300px]" />
        </colgroup>

        <thead className="sticky top-0 z-10 bg-gray-50 border-b-4 border-[#404040]">
          <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            <th className="px-3 py-3 text-left">Kanji</th>
            <th className="px-3 py-3 text-left">Hepburn</th>
            <th className="px-3 py-3 text-left">Move</th>
            <th className="px-3 py-3 text-left">Type</th>
            <th className="px-3 py-3 text-left">Cat.</th>
            <th className="px-3 py-3 text-center">Pwr</th>
            <th className="px-3 py-3 text-center">Acc</th>
            <th className="px-3 py-3 text-center">PP</th>
            <th className="px-3 py-3 text-left">Description</th>
          </tr>
        </thead>

        <tbody className="divide-y-2 divide-gray-100">
          {moves.map((m) => (
            <tr key={m.move} className="align-top hover:bg-[#38a060]/5 transition-colors group">
              <td className="px-3 py-3 font-bold text-gray-400">{m.kanji}</td>
              <td className="px-3 py-3 font-bold text-gray-400 italic">{m.hepburn}</td>
              <td className="px-3 py-3 font-black uppercase text-[#404040] group-hover:text-[var(--pkmn-blue)]">
                {m.move}
              </td>
              <td className="px-3 py-3">
                <div className="flex flex-wrap gap-1">
                  {m.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>
              </td>
              <td className="px-3 py-3 font-bold uppercase text-[10px]">{m.damageType}</td>
              <td className="px-3 py-3 text-center font-bold text-gray-600">{m.power}</td>
              <td className="px-3 py-3 text-center font-bold text-gray-600">{m.accuracy}</td>
              <td className="px-3 py-3 text-center font-bold text-gray-600">{m.pp}</td>
              <td className="px-3 py-3 text-[10px] leading-relaxed font-medium text-gray-500">
                {m.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MoveTable
