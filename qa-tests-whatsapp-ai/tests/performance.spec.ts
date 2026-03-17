import { test, expect } from '@playwright/test';
import fs from 'fs';

const arquivoConversa = fs.readdirSync('data')
  .find(f => f.endsWith('.txt'));
const caminhoArquivo = `data/${arquivoConversa}`;

test('tempo de resposta da análise', async ({ page }) => {

  await page.route('https://api.z.ai/api/paas/v4/chat/completions', async route => {
    const mockResponse = {
      choices: [
        { message: { content: JSON.stringify({ resumo:"mock", indicadores:{envolvidos:1,tarefas:1,prazos:1,riscos:0,conflitos:0,sentimento:0.5}, sentimentoDescricao:"Neutro", participantes:["A"], tarefas:[], prazos:[], riscos:[], conflitos:[] }) } }
      ]
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResponse) });
  });

  const start = Date.now();
  await page.goto('http://localhost:4200');
  await page.locator('input[type="file"]').setInputFiles(caminhoArquivo);
  await page.click('button:has-text("Enviar para Análise")');
  await expect(page.locator('.kpis')).toBeVisible({ timeout: 90000 });
  const end = Date.now();
  console.log(`Tempo de análise: ${end - start} ms`);
});