import fs from 'node:fs';

export type KnowledgeChunk = { source: string; content: string; chunkIndex: number };

export function ingestTextFile(path: string, chunkSize = 600): KnowledgeChunk[] {
  const text = fs.readFileSync(path, 'utf-8');
  const chunks: KnowledgeChunk[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push({ source: path, content: text.slice(i, i + chunkSize), chunkIndex: chunks.length });
  }
  return chunks;
}
