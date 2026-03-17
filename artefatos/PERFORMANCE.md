Teste de Performance:

Para avaliar o desempenho da aplicação, foi realizado um teste simples de performance medindo o tempo de resposta da análise da conversa.

O teste foi implementado utilizando Playwright, registrando o tempo entre:

1.	o envio da conversa para análise;

2.	a exibição dos KPIs no dashboard.

O tempo foi medido utilizando Date.now() no início e no final do fluxo. Esse teste permitiu verificar se a aplicação responde dentro de um tempo aceitável e se o carregamento do dashboard ocorre corretamente após a análise.

TESTE : 66373 ms = 66,373 segundos
