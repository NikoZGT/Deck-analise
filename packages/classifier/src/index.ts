import { CardProfile } from '../../deck-engine/src/types';

const RAMP_HINTS = ['add ', 'search your library for a basic land', 'treasure token', 'cost less to cast'];
const INTERACTION_HINTS = ['destroy target', 'exile target', 'counter target', 'each opponent sacrifices'];
const PROTECTION_HINTS = ['hexproof', 'indestructible', 'protection from', 'phases out', "can't change"];

export type CardRole = 'ramp' | 'interaction' | 'protection' | 'anthem' | 'other';

export function classifyCard(card: CardProfile): CardRole {
  const text = card.oracleText.toLowerCase();
  const type = card.typeLine.toLowerCase();

  if (text.includes('creatures you control') && text.includes('get +')) return 'anthem';
  if (type.includes('equipment') && !RAMP_HINTS.some((h) => text.includes(h))) return 'other';
  if (RAMP_HINTS.some((h) => text.includes(h)) && !type.includes('land')) return 'ramp';
  if (INTERACTION_HINTS.some((h) => text.includes(h))) return 'interaction';
  if (PROTECTION_HINTS.some((h) => text.includes(h))) return 'protection';
  return 'other';
}
