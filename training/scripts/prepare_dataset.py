"""Build JSONL dataset from human corrections.
RAG ingestion is not training. Fine-tuning is a separate explicit step.
"""
import json
from pathlib import Path

CORRECTIONS_DIR = Path('data/corrections')
OUTPUT = Path('training/datasets/corrections.jsonl')


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open('w', encoding='utf-8') as out:
        for path in sorted(CORRECTIONS_DIR.glob('*.json')):
            payload = json.loads(path.read_text(encoding='utf-8'))
            out.write(json.dumps(payload, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
