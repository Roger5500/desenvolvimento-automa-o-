import { test, expect } from '@playwright/test';
import fs from 'fs';

const arquivoConversa = fs.readdirSync('data')
  .find(f => f.endsWith('.txt'));
const caminhoArquivo = `data/${arquivoConversa}`;

test('deve mostrar algum erro', async ({ page }) => {

  // Mock que força erro 401
  await page.route('https://api.z.ai/api/paas/v4/chat/completions', async route => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: { code: 1302, message: "Token inválido" } })
    });
  });

  await page.goto('http://localhost:4200');
  await page.fill('#token', 'fake-token');
  await page.locator('input[type="file"]').setInputFiles(caminhoArquivo);
  await page.click('button:has-text("Enviar para Análise")');

  const errorBanner = page.locator('.error-banner');
  await expect(errorBanner).toBeVisible();
  const texto = await errorBanner.textContent();
  const mensagensValidas = [
    'Informe o token da API para continuar.',
    'A IA retornou uma resposta inesperada.',
    'A análise demorou muito para responder. Tente novamente.',
    'Não foi possível analisar a conversa no momento.'
  ];
  const encontrouMensagemValida = mensagensValidas.some(m => texto?.includes(m));
  expect(encontrouMensagemValida).toBeTruthy();
});