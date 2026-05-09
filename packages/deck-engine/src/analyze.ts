import { classifyCard } from '../../classifier/src/index';
import { CardProfile, Deck } from './types';

export type AnalysisInput = { deck: Deck; cards: Record<string, CardProfile> };

export function analyzeDeck({ deck, cards }: AnalysisInput) {
  let lands = 0;
  let ramp = 0;
  let interaction = 0;
  let protection = 0;
  const warnings: string[] = [];

  for (const entry of deck.cards) {
    const card = cards[entry.name];
    if (!card) continue;
    const type = card.typeLine.toLowerCase();
    if (type.includes('land')) lands += entry.quantity;
    const role = classifyCard(card);
    if (role === 'ramp') ramp += entry.quantity;
    if (role === 'interaction') interaction += entry.quantity;
    if (role === 'protection') protection += entry.quantity;
  }

  if (deck.format === 'commander' && lands < 30) warnings.push('Low land count is the main warning.');

  return { totalCards: deck.cards.reduce((a, c) => a + c.quantity, 0), lands, ramp, interaction, protection, warnings };
}
