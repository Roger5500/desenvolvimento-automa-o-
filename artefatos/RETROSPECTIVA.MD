Relatório Retrospectivo:

Durante o desenvolvimento e os testes, alguns desafios técnicos se destacaram.
O maior deles foi lidar com a análise de sentimento da conversa. Como a resposta da IA nem sempre vinha com o formato esperado, foi necessário implementar validações adicionais para evitar erros na interface. Em alguns casos, a aplicação precisava mostrar uma mensagem padrão quando a descrição do sentimento não estava presente. Outro desafio foi configurar corretamente os testes automatizados com Playwright, especialmente a parte de interceptação da API para simular respostas da IA. Isso foi importante para tornar os testes reproduzíveis e independentes da API real.

A Inteligência Artificial também foi utilizada durante o processo de desenvolvimento para:

•	auxiliar na resolução de erros;
•	sugerir melhorias no código;
•	ajudar na criação de testes automatizados;
•	apoiar na interpretação de alguns requisitos do projeto.

A escolha do Playwright possui boa integração com aplicações web e permite simular interações reais do usuário com facilidade.

Com mais tempo, algumas melhorias seriam implementadas, como:
•	maior cobertura de testes automatizados;
•	melhor organização da arquitetura da aplicação;
•	testes mais robustos para cenários de erro da API;
•	refinamento da análise de sentimento.

Essas melhorias ajudariam a tornar o sistema mais confiável e facilitar a manutenção do código.
