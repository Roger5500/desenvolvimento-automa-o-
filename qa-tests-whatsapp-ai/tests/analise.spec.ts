import { test, expect } from '@playwright/test';
import fs from 'fs';

const arquivoConversa = fs.readdirSync('data')
  .find(f => f.endsWith('.txt'));

const caminhoArquivo = `data/${arquivoConversa}`;

test('deve executar análise do chat', async ({ page }) => {

  // Mock da API
  await page.route('https://api.z.ai/api/paas/v4/chat/completions', async route => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              resumo: "Resumo da conversa mock",
              indicadores: {
                envolvidos: 2,
                tarefas: 3,
                prazos: 2,
                riscos: 1,
                conflitos: 1,
                sentimento: 0.7
              },
              sentimentoDescricao: "Conversa produtiva",
              participantes: ["Alice", "Bruno"],
              tarefas: [
                { descricao: "Tarefa 1", envolvido: "Alice", prioridade: "alta" },
                { descricao: "Tarefa 2", envolvido: "Bruno", prioridade: "média" }
              ],
              prazos: [
                { descricao: "Prazo 1", data: "2026-04-01", envolvido: "Alice" }
              ],
              riscos: [],
              conflitos: []
            })
          }
        }
      ]
    };

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse)
    });
  });

  await page.goto('http://localhost:4200');

  await page.locator('input[type="file"]').setInputFiles(caminhoArquivo);
  await page.click('button:has-text("Enviar para Análise")');

  await expect(page.locator('.kpis')).toBeVisible({ timeout: 90000 });
  await expect(page.locator('.dashboard')).toBeVisible();
});