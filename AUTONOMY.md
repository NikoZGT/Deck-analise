# Operação Autônoma (com segurança) — Deck Análise

> Objetivo: rodar localmente em ciclo contínuo para analisar decks, coletar feedback, gerar dataset, treinar LoRA e validar antes de promover.

## 1) Princípios inegociáveis
- **RAG não é treino**: ler livros/PDFs/anotações só alimenta base local.
- **Treino só com dataset validado**: fine-tuning ocorre em job separado.
- **Sem auto-merge cego**: qualquer mudança de código/modelo precisa passar em testes automáticos e gate de aprovação.
- **Sem invenção de dados**: preço ausente = `null`; dado ausente = “não encontrado”.

## 2) Loop autônomo (seguro)
1. Ingerir deck(s) novos de `data/decks/`.
2. Analisar com engine determinística + dados Scryfall.
3. Consultar RAG local e (opcional) web-research controlado.
4. Atualizar cache de preços (somente fontes válidas, com timestamp).
5. Gerar relatório técnico JSON validado por Zod.
6. Coletar feedback humano em `data/corrections/*.json`.
7. Montar dataset JSONL.
8. Rodar treino LoRA/QLoRA (job offline separado).
9. Rodar avaliação antes/depois.
10. **Promover** novo adapter apenas se métricas mínimas passarem.

## 3) O que “IA se reescrever” significa na prática
- O agente pode **propor** patch de código e abrir PR local.
- O PR só é aceito se:
  - testes unitários passarem,
  - avaliação de regressão passar,
  - regras de negócio obrigatórias seguirem intactas.
- Isso evita drift e quebra silenciosa.

## 4) Execução contínua
Use `npm run autonomy:loop` para:
- processar decks,
- executar testes,
- preparar dataset,
- (quando habilitado) disparar treino,
- gerar relatório de estado.

## 5) Limites importantes
- Não existe “aprendizado permanente espontâneo” só por leitura.
- Melhora permanente só acontece quando:
  1) você coleta correções, 2) gera dataset, 3) treina adapter, 4) valida, 5) promove.
