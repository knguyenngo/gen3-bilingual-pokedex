// src/domain/types.ts
export type JPMoveRow = {
  eng_name: string
  kanji: string
  hepburn: string
}

export type MoveRow = {
  name: string
  type: string | string[]
  damage_type: string
  power: number | string
  accuracy: number | string
  pp: number | string
  description: string
}

export type Move = {
  move: string
  kanji: string
  hepburn: string
  types: string[]
  damageType: string
  power: string
  accuracy: string
  pp: string
  description: string
}

export type JPPokemonRow = {
  dex_entry: string
  eng_name: string
  kanji: string
  hepburn: string
}

export type PokemonRow = {
  name: string
  type: string | string[]
  ability: string | string[]
  hp: number
  attack: number
  defense: number
  special_attack: number
  special_defense: number
  speed: number
}

export type Pokemon = {
  dexEntry: string
  pokemon: string
  kanji: string
  hepburn: string
  types: string[]
  abilities: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
}

