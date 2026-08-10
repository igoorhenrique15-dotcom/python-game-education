# Python Game Education

Protótipo de uma plataforma web responsiva para estudar Python em sessões curtas e interativas.

A mesma aplicação foi pensada para abrir bem no PC, notebook, tablet e celular.

## Objetivo

Ensinar Python com o menor atrito possível:

1. explicação curta;
2. pergunta clicável;
3. feedback imediato;
4. próxima etapa;
5. progresso salvo automaticamente.

O projeto **não usa XP, ranking, moedas, conquistas ou vidas**. O indicador principal é o progresso real da trilha.

## Executar localmente

Não há build nem dependências.

- abra `index.html` diretamente no navegador; ou
- rode `python -m http.server 8000` na pasta do projeto e acesse `http://localhost:8000`.

## GitHub Pages

O projeto está preparado para publicação direta como site estático a partir da branch `main`.

Configure uma única vez no GitHub:

1. `Settings`;
2. `Pages`;
3. em `Build and deployment`, escolha `Deploy from a branch`;
4. selecione a branch `main`;
5. selecione a pasta `/ (root)`;
6. salve.

Depois disso, alterações enviadas para `main` atualizam o site.

Endereço esperado:

`https://igoorhenrique15-dotcom.github.io/python-game-education/`

O arquivo `.nojekyll` está incluído para servir os arquivos estáticos diretamente.

> Observação: a disponibilidade do GitHub Pages para repositório privado depende do plano da conta. O repositório não foi tornado público automaticamente.

## Arquivos principais

- `index.html` — estrutura da aplicação;
- `style.css` — layout web responsivo para desktop e celular;
- `data/course.js` — conteúdo da trilha;
- `script.js` — motor de navegação, exercícios e progresso;
- `ROADMAP_AI.md` — especificação para uma IA continuar o projeto;
- `.nojekyll` — compatibilidade com publicação estática no Pages.

## Estado atual

O protótipo inclui:

- tela inicial responsiva;
- trilha sequencial de Python;
- 5 módulos iniciais;
- 10 lições;
- explicações curtas;
- respostas predominantemente por clique/toque;
- previsão de saída e completar código por alternativas;
- feedback imediato;
- bloqueio sequencial das lições;
- área de revisão baseada apenas em conteúdos concluídos;
- progresso persistido no `localStorage`;
- opção de zerar o progresso.

Consulte `ROADMAP_AI.md` antes de alterar a arquitetura ou adicionar conteúdo.
