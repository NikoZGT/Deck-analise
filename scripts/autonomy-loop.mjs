import { execSync } from 'node:child_process';
import fs from 'node:fs';

const run = (cmd) => {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

function writeStatus(message) {
  fs.mkdirSync('data/evals', { recursive: true });
  fs.writeFileSync('data/evals/autonomy-status.json', JSON.stringify({ message, at: new Date().toISOString() }, null, 2));
}

try {
  run('npm test');
  run('python3 training/scripts/prepare_dataset.py');

  // Hook futuro: treino LoRA/QLoRA separado
  // run('python3 training/scripts/train_lora.py');

  writeStatus('Loop concluído com sucesso. Treino automático permanece opcional e separado por segurança.');
} catch (err) {
  writeStatus('Falha no loop. Verifique logs e não promova mudanças/modelo.');
  process.exit(1);
}
