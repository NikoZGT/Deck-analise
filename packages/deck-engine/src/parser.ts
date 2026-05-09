import { Deck, DeckSchema } from './types';

const LINE_REGEX = /^(\d+)\s+(.+)$/;

export function parseDeckTxt(raw: string): Deck {
  const cards = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(LINE_REGEX);
      if (!m) throw new Error(`Invalid deck line: ${line}`);
      return { quantity: Number(m[1]), name: m[2], section: 'mainboard' as const };
    });

  return DeckSchema.parse({ format: 'commander', cards });
}
