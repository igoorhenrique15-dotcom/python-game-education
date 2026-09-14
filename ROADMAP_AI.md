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
- `src/data/course*.json` (30 arquivos — uma trilha por arquivo: Python,
  linguagens diversas, fundamentos de ADS, ciclo de vida de sistema, IA) —
  conteúdo de cada trilha; a lista completa de ids está em `TRACK_CATALOG`
  em runtime, não precisa ser mantida manualmente em lugar nenhum;
- `TRACK_CATALOG` (em `CompleteApp.jsx`) é **construído automaticamente em
  runtime** por `buildTrackCatalog`, a partir de
  `import.meta.glob('./data/course*.json', { eager: true })`. Qualquer
  `course-*.json` presente em `src/data/` com um bloco `meta` válido vira
  uma trilha navegável sozinho — não é preciso importar nada nem editar
  `CompleteApp.jsx`. Um JSON sem `meta`, ou com `meta`/`stages` incompletos,
  é ignorado com um `console.warn` (não derruba as outras trilhas). A ordem
  das trilhas é definida por `meta.order` (numérico, menor primeiro); sem
  `order`, a trilha entra depois, ordenada por título;
- `src/*.css` — três camadas em cascata: `style.css` (base/tokens
  originais) → `rounded-theme.css` (tema atual, dark + Nunito) →
  `minimal-theme.css` (flatten por cima, remove sombra/glow).

## Schema de uma trilha (`src/data/course-*.json`)

```json
{
  "meta": {
    "id": "html",
    "title": "HTML & CSS",
    "subtitle": "Estrutura e estilo para a web.",
    "icon": "◇",
    "color": "#ff9600",
    "fileExt": "html",
    "stagesPerUnit": 3,
    "order": 1,
    "units": [
      { "title": "Fundamentos do HTML", "goal": "Estrutura, tags e atributos.", "color": "#ff9600" }
      /* ... 10 no total, um por unidade ... */
    ]
  },
  "title": "...",
  "version": 1,
  "stages": [ /* 30 fases (10 unidades × 3, ou 10 × stagesPerUnit) */ ]
}
```

O bloco `meta` é a única fonte de verdade sobre como a trilha aparece no
app (cartão em "Trilhas", cores por unidade, extensão de arquivo dos
blocos de código). `id` deve ser único e igual ao usado nas chaves de
`localStorage` (`black-buster-track-<id>-v1`).

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

Fluxo simplificado — **não é preciso tocar em `CompleteApp.jsx`**:

1. Criar `src/data/course-<id>.json` seguindo o schema acima, com o bloco
   `meta` completo (`id`, `title`, `subtitle`, `icon`, `color`, `fileExt`,
   `stagesPerUnit`, `order`, `units` com 10 entradas
   `{ title, goal, color }`) e `stages` (30 fases, ou `10 × stagesPerUnit`).
2. Rodar `npm run build` para validar.

A trilha aparece sozinha, em qualquer ordem/momento em que o arquivo for
criado — isso permite que vários agentes gerem trilhas em paralelo sem
disputar edições no mesmo arquivo JSX. Se o `meta` estiver ausente ou
incompleto, a trilha é apenas ignorada (com aviso no console), sem quebrar
as demais.

## Evolução pedagógica (ideias futuras, não implementadas)

- Exercícios curtos de digitação de código via Pyodide carregado sob
  demanda — só se justificar pedagogicamente, sem virar editor completo.
- Projetos guiados divididos em pequenas etapas dentro das unidades
  "Projeto final" de cada trilha.
- Laboratório prático de SQL rodando de fato no navegador (ex.: sql.js)
  em vez de só leitura/reconhecimento de comandos.

## Regras visuais

- Tema escuro, cores por trilha/unidade definidas no bloco `meta` de cada
  `course-*.json` (campo `color` da trilha e `units[].color`);
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
