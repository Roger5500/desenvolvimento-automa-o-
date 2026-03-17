Mapeamento de Cenários:

Para validar o funcionamento da aplicação, foi feito um mapeamento de cenários de testes considerando casos positivos, negativos e de borda. A ideia foi garantir que os principais fluxos da aplicação funcionassem corretamente e também verificar como o sistema reage em situações inesperadas.

Nos cenários positivos, foram testadas as funcionalidades principais da aplicação, como:
•	upload de um arquivo .txt exportado do WhatsApp;
•	envio do arquivo para análise pela IA;
•	geração do dashboard com KPIs;
•	visualização do resumo da conversa;
•	exibição das listas de tarefas, prazos, riscos e conflitos;
•	filtragem de tarefas por participante.

Nos cenários negativos, foram considerados casos como:
•	tentativa de análise sem informar o token da API;
•	arquivo inválido ou vazio;
•	resposta inesperada da API;
•	erro na conversão do JSON retornado pela IA.

Nesses casos, o sistema deve exibir mensagens de erro apropriadas para o usuário.
Também foram considerados casos de borda, como:
•	conversa com apenas um participante;
•	conversa sem tarefas ou prazos identificados;
•	respostas da IA incompletas (por exemplo, ausência do campo sentimentoDescricao);
•	arquivos muito pequenos ou com poucos dados.

Esse mapeamento ajudou a identificar possíveis falhas no fluxo da aplicação e orientar a criação dos testes automatizados. E para não demorar tanto nos testes, resolvi mocar para não depender tanto dos resultados lentos da API, que demoravam mais de 30 segundos e fechava a janela e retornava erro nos testes.
