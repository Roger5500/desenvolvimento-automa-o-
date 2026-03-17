import { test, expect } from '@playwright/test';
import fs from 'fs';

const arquivoConversa = fs.readdirSync('data')
  .find(f => f.endsWith('.txt'));
const caminhoArquivo = `data/${arquivoConversa}`;

test('deve permitir upload de arquivo txt', async ({ page }) => {

  await page.route('https://api.z.ai/api/paas/v4/chat/completions', async route => {
    const mockResponse = {
      choices: [
        { message: { content: JSON.stringify({ resumo:"mock", indicadores:{envolvidos:1,tarefas:1,prazos:1,riscos:0,conflitos:0,sentimento:0.5}, sentimentoDescricao:"Neutro", participantes:["A"], tarefas:[], prazos:[], riscos:[], conflitos:[] }) } }
      ]
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResponse) });
  });

  await page.goto('http://localhost:4200');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(caminhoArquivo);
  await expect(fileInput).toBeVisible();
});