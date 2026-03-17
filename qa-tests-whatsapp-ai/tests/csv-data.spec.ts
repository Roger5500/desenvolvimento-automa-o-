import { test, expect } from '@playwright/test'
import fs from 'fs'

const csv = fs.readFileSync('data/mensagens.csv','utf8')
  .split('\n')
  .slice(1)
  .map(l => l.trim())
  .filter(Boolean)

for (const row of csv){

  test(`teste com arquivo ${row}`, async ({ page }) => {

    await page.route('https://api.z.ai/api/paas/v4/chat/completions', async route => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                resumo: "Resumo mock CSV",
                indicadores: { envolvidos: 2, tarefas: 2, prazos: 1, riscos:0, conflitos:0, sentimento:0.5 },
                sentimentoDescricao: "Conversa equilibrada",
                participantes:["João","Maria"],
                tarefas:[
                  {descricao:"Tarefa A",envolvido:"João",prioridade:"alta"},
                  {descricao:"Tarefa B",envolvido:"Maria",prioridade:"média"}
                ],
                prazos:[{descricao:"Prazo A",data:"2026-04-10",envolvido:"João"}],
                riscos:[],
                conflitos:[]
              })
            }
          }
        ]
      };
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(mockResponse)});
    });

    await page.goto('http://localhost:4200');
    await page.locator('#file').setInputFiles(`data/${row}`);
    await expect(page.locator('button:has-text("Enviar para Análise")')).toBeEnabled();
    await page.click('button:has-text("Enviar para Análise")');
    await expect(page.locator('.kpis')).toBeVisible({ timeout: 90000 });
    await expect(page.locator('.dashboard')).toBeVisible();
  });

}