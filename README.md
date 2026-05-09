# Deck Análise (MVP)

Projeto local para análise determinística de decks de **Magic: The Gathering** com suporte futuro a modelo local Qwen (8B/9B) via Ollama/llama.cpp.

## Princípios
- **RAG != treino**: ingestão de livros/artigos/notas autorizadas só entra em base de conhecimento local.
- **Treino separado**: fine-tuning LoRA/QLoRA ocorre apenas via dataset validado.
- **Sem invenção de dados**: métricas numéricas vêm da engine; preços ausentes retornam `null`.

## Estrutura
- `apps/`: API e Web (skeleton)
- `packages/deck-engine`: parser `.txt` e engine determinística
- `packages/card-database`: integração Scryfall
- `packages/classifier`: classificador inicial por regras
- `packages/knowledge-base`: ingestão simples TXT/MD em chunks
- `packages/price-provider`: interface + cache SQLite + skeleton LigaMagic
- `packages/evaluation`: sumarização de avaliação
- `training/scripts`: preparação de dataset JSONL

## MVP entregue
1. Parser de deck `.txt`
2. Integração inicial com Scryfall
3. Classificador básico com regras anti-falso-ramp
4. Engine com warning obrigatório de baixa land em commander
5. Interface `PriceProvider` + cache SQLite + `LigamagicPriceProvider`
6. Knowledge base simples (TXT/MD)
7. Testes Vitest cobrindo regras críticas

## Rodar
```bash
npm install
npm test
```

## Operação autônoma (segura)
```bash
npm run autonomy:loop
```
Esse comando roda testes + montagem de dataset e grava status em `data/evals/autonomy-status.json`.

Veja `AUTONOMY.md` para o fluxo completo de melhoria contínua com gates (RAG separado de fine-tuning, avaliação antes/depois e promoção controlada).
