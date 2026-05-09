import { CardProfile } from '../../deck-engine/src/types';

export async function fetchCardByName(name: string): Promise<CardProfile | null> {
  const res = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`);
  if (!res.ok) return null;
  const json = await res.json();
  return {
    name: json.name,
    typeLine: json.type_line,
    oracleText: json.oracle_text ?? '',
    manaValue: json.cmc ?? 0,
    colors: json.color_identity ?? []
  };
}
