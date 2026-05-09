import { z } from 'zod';

export const DeckCardSchema = z.object({
  quantity: z.number().int().positive(),
  name: z.string().min(1),
  section: z.enum(['mainboard', 'commander']).default('mainboard')
});

export const DeckSchema = z.object({
  format: z.string().default('commander'),
  cards: z.array(DeckCardSchema).min(1)
});

export type DeckCard = z.infer<typeof DeckCardSchema>;
export type Deck = z.infer<typeof DeckSchema>;

export type CardProfile = {
  name: string;
  typeLine: string;
  oracleText: string;
  manaValue: number;
  colors: string[];
};
