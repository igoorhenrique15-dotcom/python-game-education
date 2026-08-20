# ROADMAP PARA IA — Black Buster / Guia Py

Este arquivo é a fonte de verdade para qualquer IA que continuar o projeto. Ele foi atualizado para refletir o estado real do código (o app React em `src/`), substituindo a versão anterior que descrevia apenas o MVP inicial (30 lições, sem gamificação).

## Objetivo

App web responsivo de estudo de programação, com estética pixel-art retrô e microlições interativas, guiado pelo mascote **NoirByte/Guia Py**. Deve funcionar no mesmo endereço em desktop e celular e continuar publicável como site estático no GitHub Pages.

## Estado atual (não é mais um MVP simples)

- App real construído com **React + Vite**, ponto de entrada `src/main.jsx` → `src/CompleteApp.jsx`. Este é o único app "vivo"; os arquivos na raiz (`index.html`, `script.js`, `style.css`, `data/course.js`) são legado da versão vanilla pré-migração e não são usados em produção — não editar esperando efeito no app.
- **4 trilhas**: Python (`src/data/course.json`), HTML & CSS (`course-html.json`), Java (`course-java.json`) e IA (`course-ia.json`, sem exercícios de código).
- A trilha de Python tem **80 fases** (não 30), cobrindo do básico até OOP, testes, asyncio, empacotamento, SQLite e um projeto final.
- O app já tem gamificação: **vidas (hearts), XP, gems, streak diário** e uma UI de premium/paywall controlada pela flag `MONETIZATION_ENABLED` em `src/CompleteApp.jsx` (atualmente `false`, ou seja, desligada/gate ausente).
- Progresso persiste em `localStorage`, por trilha (`trackStorageKey`) e por conta (`ACCOUNT_STORAGE_KEY`), com migração de uma chave legada (`readLegacyRaw`).

Antes de "simplificar de volta" para o modelo antigo (sem XP/vidas/streak, só Python, 30 lições), confirme com o usuário — isso destruiria trabalho substancial já existente. Regra prática: **evoluir e polir o que existe**, não regredir para a versão antiga, a menos que explicitamente solicitado.

## Regras obrigatórias (ainda válidas)

Aproximadamente 75% a 85% das atividades devem ser resolvidas por clique/toque. Digitação de código entra mais tarde e apenas quando for pedagogicamente útil.

Fluxo padrão de uma microlição:

1. explicação curta;
2. exemplo de código;
3. pergunta clicável;
4. feedback imediato;
5. nova pergunta;
6. conclusão da fase;
7. liberação da próxima fase.

Tipos de exercício: `choice`, `output`, `fill_choice`, `find_error` e (futuramente) `order_code` e `write_code`.

## Arquitetura

- `src/main.jsx` — bootstrap React;
- `src/CompleteApp.jsx` — motor do jogo (telas, progresso, engine de perguntas, gamificação);
- `src/App.jsx` — variante/entrada alternativa, checar antes de assumir que não é usada;
- `src/data/course.json`, `course-html.json`, `course-java.json`, `course-ia.json` — conteúdo por trilha;
- `src/minimal-theme.css`, `src/rounded-theme.css`, `style.css` — visual pixel e responsividade;
- `vite.config.js` — `base: '/python-game-education/'` (necessário para GitHub Pages, não remover);
- `.nojekyll` — GitHub Pages.

Progresso em `localStorage`. Build com `npm run build` (Vite) gera `dist/` estático publicável no GitHub Pages.

## Regras do motor de perguntas

- Validar automaticamente cada questão antes de iniciar o jogo (`validateCourse` em `CompleteApp.jsx`, roda por trilha ao carregar e reporta no console).
- Toda questão precisa ter `opts` (options), `a` (answer) válido e `ex` (explanation).
- Ao clicar em uma alternativa, bloquear imediatamente todas as alternativas para impedir clique duplo.
- Resposta errada não pode avançar a questão.
- Ao errar, permitir nova tentativa renderizando a etapa em estado limpo.
- Ao acertar, mostrar explicação e liberar apenas um avanço.
- Nunca permitir que um clique rápido avance duas etapas.

## Evolução pedagógica sugerida (próximos passos)

1. Revisar as 80 fases de Python em busca de lacunas de progressão, erros de português e questões ambíguas.
2. Revisar as trilhas HTML/CSS, Java e IA com o mesmo rigor.
3. Registrar erros por assunto e usar isso para priorizar revisão (parcialmente possível via `progress.unitReviews`).
4. Quando fizer sentido, considerar exercícios curtos de digitação de código via Pyodide, carregado sob demanda — sem transformar cada lição em editor de código.
5. Projetos guiados divididos em pequenas etapas (calculadora, controle de despesas, leitor de CSV, organizador de arquivos, consulta de API, comparação de planilhas, analisador de extrato, automação com pandas) — verificar o que já existe na trilha antes de duplicar.

## Regras visuais

- estética pixel-art/8–16 bit moderna;
- fundo tecnológico escuro;
- preto/grafite + ciano como identidade visual principal;
- verde apenas para sucesso/progresso;
- vermelho apenas para erro;
- botões com bordas quadradas e sombras em blocos;
- desktop deve aproveitar largura disponível;
- celular deve reorganizar para uma coluna sem versão separada;
- evitar fontes, imagens e assets externos quando não forem necessários.

## Definição de pronto

Uma mudança só está pronta quando:

- `npm run build` conclui sem erros;
- funciona em desktop e celular (reflow para uma coluna, sem overflow horizontal);
- mantém compatibilidade com GitHub Pages (`base` do Vite preservado);
- não quebra o progresso salvo em `localStorage` sem motivo;
- o fluxo de respostas não permite clique duplo ou avanço indevido;
- conteúdo novo pode ser adicionado principalmente nos arquivos `src/data/course*.json`;
- o console não apresenta erros no fluxo normal;
- conteúdo novo ensina uma ideia por vez e explica a resposta correta.
