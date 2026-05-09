import Database from 'better-sqlite3';

export type PriceRecord = {
  cardName: string;
  edition?: string;
  condition?: string;
  minPrice?: number;
  avgPrice?: number;
  marketPrice?: number;
  currency: 'BRL';
  source: 'LigaMagic';
  sourceUrl?: string;
  fetchedAt: string;
  confidence: 'high' | 'medium' | 'low';
};

export interface PriceProvider {
  getCardPrice(cardName: string, edition?: string): Promise<PriceRecord | null>;
  getDeckPrice(decklist: { name: string; quantity: number }[]): Promise<number | null>;
  updatePrices(decklist: { name: string; quantity: number }[]): Promise<void>;
  getCachedPrice(cardName: string): PriceRecord | null;
  getPriceSource(cardName: string): string | null;
}

export class PriceCache {
  db: Database.Database;
  constructor(path = 'data/prices/prices.sqlite') {
    this.db = new Database(path);
    this.db.exec(`CREATE TABLE IF NOT EXISTS prices (
      card_name TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      source_url TEXT
    )`);
  }
  upsert(price: PriceRecord) {
    this.db.prepare('INSERT OR REPLACE INTO prices(card_name,payload,source_url) VALUES (?,?,?)').run(
      price.cardName,
      JSON.stringify(price),
      price.sourceUrl ?? null
    );
  }
  get(cardName: string): PriceRecord | null {
    const row = this.db.prepare('SELECT payload FROM prices WHERE card_name=?').get(cardName) as { payload: string } | undefined;
    return row ? (JSON.parse(row.payload) as PriceRecord) : null;
  }
  source(cardName: string): string | null {
    const row = this.db.prepare('SELECT source_url FROM prices WHERE card_name=?').get(cardName) as { source_url: string | null } | undefined;
    return row?.source_url ?? null;
  }
}

export class LigamagicPriceProvider implements PriceProvider {
  constructor(private cache = new PriceCache()) {}
  async getCardPrice(cardName: string): Promise<PriceRecord | null> {
    return this.getCachedPrice(cardName);
  }
  async getDeckPrice(decklist: { name: string; quantity: number }[]): Promise<number | null> {
    let total = 0;
    for (const c of decklist) {
      const price = await this.getCardPrice(c.name);
      if (!price?.avgPrice) return null;
      total += price.avgPrice * c.quantity;
    }
    return total;
  }
  async updatePrices(): Promise<void> {
    // intentionally unimplemented while no official API contract is defined
  }
  getCachedPrice(cardName: string): PriceRecord | null {
    return this.cache.get(cardName);
  }
  getPriceSource(cardName: string): string | null {
    return this.cache.source(cardName);
  }
}
