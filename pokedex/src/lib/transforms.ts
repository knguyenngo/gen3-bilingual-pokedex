// src/lib/transforms.ts
import type { JPMoveRow, MoveRow, Move, JPPokemonRow, PokemonRow, Pokemon } from '../domain/types'
import { parseMaybeList } from './csv'

export const mergeMoves = (jp: JPMoveRow[], moves: MoveRow[]): Move[] => {
  const jpByName = new Map(jp.map(r => [r.eng_name, r]))

  return moves.map(m => {
    const jpRow = jpByName.get(m.name)
    return {
      move: m.name,
      kanji: jpRow?.kanji ?? '',
      hepburn: jpRow?.hepburn ?? '',
      types: parseMaybeList(m.type),
      damageType: String(m.damage_type ?? ''),
      power: String(m.power ?? ''),
      accuracy: String(m.accuracy ?? ''),
      pp: String(m.pp ?? ''),
      description: String(m.description ?? '')
    }
  })
}

export const mergePokemon = (jp: JPPokemonRow[], pokemon: PokemonRow[]): Pokemon[] => {
  const jpByName = new Map(jp.map(r => [r.eng_name, r]))

  return pokemon.map(p => {
    const jpRow = jpByName.get(p.name)
    return {
      dexEntry: jpRow?.dex_entry ?? '',
      pokemon: p.name,
      kanji: jpRow?.kanji ?? '',
      hepburn: jpRow?.hepburn ?? '',
      types: parseMaybeList(p.type),
      abilities: parseMaybeList(p.ability),
      stats: {
        hp: Number(p.hp),
        attack: Number(p.attack),
        defense: Number(p.defense),
        specialAttack: Number(p.special_attack),
        specialDefense: Number(p.special_defense),
        speed: Number(p.speed)
      }
    }
  })
}

