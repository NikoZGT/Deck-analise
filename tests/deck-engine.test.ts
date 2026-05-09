import { describe, expect, it } from 'vitest';
import { parseDeckTxt } from '../packages/deck-engine/src/parser';
import { analyzeDeck } from '../packages/deck-engine/src/analyze';
import { classifyCard } from '../packages/classifier/src/index';
import { LigamagicPriceProvider } from '../packages/price-provider/src/index';

describe('deck analysis rules', () => {
  it('does not count Icon of Ancestry as ramp', () => {
    expect(classifyCard({ name: 'Icon of Ancestry', typeLine: 'Artifact', oracleText: 'As Icon enters choose a creature type. Creatures you control of the chosen type get +1/+1.', manaValue: 3, colors: [] })).toBe('anthem');
  });

  it('does not count equipment as ramp by default', () => {
    expect(classifyCard({ name: 'Swiftfoot Boots', typeLine: 'Artifact — Equipment', oracleText: 'Equipped creature has hexproof and haste.', manaValue: 2, colors: [] })).toBe('other');
  });

  it('separates interaction and protection', () => {
    expect(classifyCard({ name: 'Swords to Plowshares', typeLine: 'Instant', oracleText: 'Exile target creature.', manaValue: 1, colors: ['W'] })).toBe('interaction');
    expect(classifyCard({ name: 'Teferi\'s Protection', typeLine: 'Instant', oracleText: 'Your life total can\'t change and permanents you control phase out.', manaValue: 3, colors: ['W'] })).toBe('protection');
  });

  it('prioritizes low lands warning for commander', () => {
    const deck = parseDeckTxt('1 Sol Ring\n1 Arcane Signet\n1 Swords to Plowshares');
    const result = analyzeDeck({ deck, cards: {
      'Sol Ring': { name: 'Sol Ring', typeLine: 'Artifact', oracleText: '{T}: Add {C}{C}.', manaValue: 1, colors: [] },
      'Arcane Signet': { name: 'Arcane Signet', typeLine: 'Artifact', oracleText: '{T}: Add one mana of any color in your commander\'s color identity.', manaValue: 2, colors: [] },
      'Swords to Plowshares': { name: 'Swords to Plowshares', typeLine: 'Instant', oracleText: 'Exile target creature.', manaValue: 1, colors: ['W'] }
    } });
    expect(result.warnings[0]).toContain('Low land count');
  });

  it('never invents missing price', async () => {
    const provider = new LigamagicPriceProvider();
    await expect(provider.getCardPrice('Carta Inexistente')).resolves.toBeNull();
  });
});
