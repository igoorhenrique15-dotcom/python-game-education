# ROADMAP PARA IA — Black Buster / Curso completo de ADS

Este arquivo é a fonte de verdade para qualquer IA que continuar o projeto.
(Substitui a versão anterior, que descrevia um protótipo vanilla-JS chamado
"NoirByte" — esse protótipo não existe mais no código atual.)

## Objetivo

Curso web gratuito, estilo Duolingo, cobrindo tudo que uma trilha de
Análise e Desenvolvimento de Sistemas precisa: lógica de programação,
front-end, back-end, banco de dados, controle de versão, deploy, segurança
e uso de IA no desenvolvimento. Publicado como site estático no GitHub
Pages, sem backend próprio.

O mascote é o **Guia Py** (um pinscher), representado pelo componente
`PinscherMascot` em `src/CompleteApp.jsx`.

## Regras obrigatórias

- **Sem vidas, sem moedas, sem paywall, sem login obrigatório.** O curso é
  inteiramente gratuito e sem penalidade por errar. O único progresso
  relevante é: lições concluídas, XP, ofensiva diária (streak) e domínio
  por questão (`questionStats`/revisão). Isso já foi violado uma vez no
  passado (sistema de vidas/gemas/"vidas infinitas por R$ 25") e removido
  de propósito — não reintroduzir.
- Aproximadamente 75–85% das atividades são resolvidas por clique/toque.
  Não existe exercício de digitar código — tudo é múltipla escolha
  (`type: "mcq"` ou `"code"`, a diferença é só a apresentação visual).
- Fluxo padrão de uma microlição: explicação curta → exemplo → pergunta
  clicável → feedback imediato → nova pergunta → conclusão da fase →
  próxima fase liberada (todas as fases já ficam livres para estudo fora
  de ordem, não há bloqueio sequencial).
- Tipos de questão em uso: `mcq`, `code`. Rótulos de formato
  (`QUESTION_FORMAT_LABELS` em `CompleteApp.jsx`): `CONCEITO`,
  `LEITURA DE CÓDIGO`, `PREVISÃO DE RESULTADO`, `ENCONTRE O ERRO`,
  `CORRIJA O ERRO`, `DECISÃO DE CÓDIGO`, `APLICAÇÃO PRÁTICA`.

## Arquitetura

Stack: React puro (sem TypeScript, sem router, sem UI framework) + Vite.
Tudo client-side, progresso em `localStorage`, sem chamadas de rede.

- `index.html` + `src/main.jsx` — bootstrap do Vite/React;
- `src/CompleteApp.jsx` — único componente-app real (telas, navegação por
  `useState`, persistência, gamificação); `src/App.jsx` foi removido por
  ser uma versão antiga não utilizada;
- `src/data/course.json`, `course-html.json`, `course-java.json`,
  `course-ia.json`, `course-js.json`, `course-sql.json`, `course-git.json`,
  `course-supabase.json`, `course-vercel.json`, `course-security.json`,
  `course-ia-dev.json` — conteúdo de cada trilha;
- `TRACK_CATALOG` (em `CompleteApp.jsx`) registra cada trilha: `id`,
  `title`, `subtitle`, `icon`, `color`, `course` (import do JSON),
  `unitMeta` (títulos/cor por unidade, hardcoded no JSX), `stagesPerUnit`,
  `fileExt` (extensão usada nos blocos de código de exemplo);
- `src/*.css` — três camadas em cascata: `style.css` (base/tokens
  originais) → `rounded-theme.css` (tema atual, dark + Nunito) →
  `minimal-theme.css` (flatten por cima, remove sombra/glow).

## Schema de uma trilha (`src/data/course-*.json`)

```json
{ "title": "...", "version": 1, "stages": [ /* 30 fases (10 unidades × 3) */ ] }
```

Cada fase (`stage`): `id`, `name`, `difficulty`
(`INICIANTE`/`INTERMEDIÁRIO`/`AVANÇADO`), `color` (hex, igual para as 3
fases da mesma unidade), `icon` (glifo unicode), `summary`, `lesson`
(2–3 cards com `title`/`body`/`code` opcional/`tip` opcional), `questions`
(exatamente 4: `type`, `q`, `opts` [4 itens], `a` [índice 0-based],
`hint`, `ex`, `format`).

## Regras do motor de perguntas

- Validar que toda questão tem `opts` com 4 itens, `a` dentro do range e
  `hint`/`ex` preenchidos antes de publicar conteúdo novo.
- Ao clicar numa alternativa errada, ela fica marcada e bloqueada; o aluno
  escolhe outra sem penalidade nenhuma (tentativas ilimitadas).
- Acertar libera a explicação (`ex`) e o avanço; nunca revelar a resposta
  no `hint`.

## Adicionando uma trilha nova

1. Criar `src/data/course-<id>.json` seguindo o schema acima (30 fases).
2. Criar um `<ID>_UNIT_META` em `CompleteApp.jsx` com 10 entradas
   `{ title, goal, color }`.
3. Importar o JSON no topo de `CompleteApp.jsx` e adicionar uma entrada em
   `TRACK_CATALOG`.
4. Rodar `npm run build` para validar.

## Evolução pedagógica (ideias futuras, não implementadas)

- Exercícios curtos de digitação de código via Pyodide carregado sob
  demanda — só se justificar pedagogicamente, sem virar editor completo.
- Projetos guiados divididos em pequenas etapas dentro das unidades
  "Projeto final" de cada trilha.
- Laboratório prático de SQL rodando de fato no navegador (ex.: sql.js)
  em vez de só leitura/reconhecimento de comandos.

## Regras visuais

- Tema escuro, cores por trilha/unidade definidas em `TRACK_CATALOG` e nos
  `*_UNIT_META`;
- verde para sucesso/progresso, vermelho só para erro;
- desktop aproveita a largura disponível, celular reorganiza em uma coluna
  (sem versão separada);
- evitar dependências externas pesadas — o projeto é 100% estático.

## Definição de pronto

- `npm run build` sem erros;
- funciona em desktop e celular;
- progresso salvo não quebra sem motivo;
- nenhuma fase, questão ou tela depende de vidas, moedas ou pagamento;
- conteúdo novo ensina uma ideia por vez e explica a resposta correta.
