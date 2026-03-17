import { test, expect } from '@playwright/test';
import fs from 'fs';

const arquivoConversa = fs.readdirSync('data')
  .find(f => f.endsWith('.txt'));
const caminhoArquivo = `data/${arquivoConversa}`;

test('deve filtrar tarefas por participante analisando conversa real', async ({ page }) => {

  await page.route('https://api.z.ai/api/paas/v4/chat/completions', async route => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              resumo: "Discussão sobre tarefas do projeto",
              indicadores: { envolvidos: 2, tarefas: 1, prazos: 1, riscos: 0, conflitos: 0, sentimento: 0.7 },
              sentimentoDescricao: "Conversa produtiva",
              participantes: ["João", "Maria"],
              tarefas: [{ descricao: "Preparar relatório", envolvido: "João", prioridade: "alta" }],
              prazos: [{ descricao: "Entrega do relatório", data: "2026-04-01", envolvido: "João" }],
              riscos: [],
              conflitos: []
            })
          }
        }
      ]
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResponse) });
  });

  await page.goto('http://localhost:4200');
  await page.locator('input[type="file"]').setInputFiles(caminhoArquivo);
  await page.fill('#token', 'fake-token');
  await page.click('button:has-text("Enviar para Análise")');

  await expect(page.locator('.kpis')).toBeVisible();

  const filtroSelect = page.locator('select').nth(1);
  const participante = await filtroSelect.locator('option').nth(1).textContent();
  await filtroSelect.selectOption({ label: participante!.trim() });

  const tarefas = page.locator('ul li');
  await expect(tarefas.first()).toBeVisible();
});