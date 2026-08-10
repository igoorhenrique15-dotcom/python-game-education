# ROADMAP PARA IA — NoirByte Python Quest

Este arquivo é a fonte de verdade para qualquer IA que continuar o projeto.

## Objetivo

Criar um jogo web responsivo de estudo de Python, com estética pixel-art retrô e microlições interativas. Deve funcionar no mesmo endereço em desktop e celular e continuar publicável como site estático no GitHub Pages.

O personagem instrutor é **NoirByte**, um robô original preto/grafite com visor ciano. Não copiar sprites, nomes, logotipos, armaduras, poses ou elementos identificáveis de Mega Man ou de qualquer outra franquia.

## Regras obrigatórias

Não adicionar XP, ranking, moedas, vidas, conquistas, login obrigatório ou backend sem necessidade real. O único progresso relevante é: lições concluídas, fase atual, assuntos estudados e revisão.

Aproximadamente 75% a 85% das atividades devem ser resolvidas por clique/toque. Digitação de código entra mais tarde e apenas quando for pedagogicamente útil.

Fluxo padrão de uma microlição:

1. explicação curta;
2. exemplo de código;
3. pergunta clicável;
4. feedback imediato;
5. nova pergunta;
6. conclusão da fase;
7. liberação da próxima fase.

Tipos de exercício prioritários: `choice`, `output`, `fill_choice`, `find_error` e futuramente `order_code` e `write_code`.

## Arquitetura

Manter simples:

- `index.html` — estrutura;
- `style.css` — visual pixel e responsividade;
- `script.js` — motor do jogo;
- `data/course.js` — conteúdo;
- `.nojekyll` — GitHub Pages.

Sem framework no MVP. Progresso em `localStorage`.

## Regras do motor de perguntas

- Validar automaticamente cada questão antes de iniciar o jogo.
- Toda questão precisa ter `options`, `answer` válido e `explanation`.
- Ao clicar em uma alternativa, bloquear imediatamente todas as alternativas para impedir clique duplo.
- Resposta errada não pode avançar a questão.
- Ao errar numa missão, usar `TENTAR DE NOVO` e renderizar a etapa novamente em estado limpo.
- Ao acertar, mostrar explicação e liberar apenas um avanço.
- Na área de Treino, pode destacar a resposta correta após o erro.
- Nunca permitir que um clique rápido avance duas etapas.

## Trilha atual — 30 missões

### Mundo 1 — Boot
1. Seu primeiro comando
2. Comentários e leitura
3. Recebendo dados

### Mundo 2 — Variáveis e tipos
4. Variáveis
5. Tipos básicos
6. Conversão de tipos

### Mundo 3 — Strings
7. Strings e concatenação
8. f-strings
9. Métodos de texto

### Mundo 4 — Lógica
10. Operadores matemáticos
11. Comparações e bool
12. if / elif / else

### Mundo 5 — Loops
13. for
14. range()
15. while

### Mundo 6 — Coleções
16. Listas
17. Dicionários
18. Tuplas e sets

### Mundo 7 — Funções
19. Criando funções
20. Parâmetros
21. return e escopo

### Mundo 8 — Código confiável
22. Erros e exceções
23. Módulos
24. Arquivos

### Mundo 9 — Dados
25. CSV
26. JSON
27. pandas e DataFrame

### Mundo 10 — Automação
28. Automatizando arquivos com pathlib
29. Consumindo APIs
30. Projeto: conferência de planilhas

## Evolução pedagógica

A versão atual prioriza reconhecimento e leitura de código. Depois de estabilizar as 30 missões, evoluir nesta ordem:

### v0.3 — aprofundar fundamentos
Adicionar mais microlições em pontos que exigem repetição, principalmente condicionais, loops, listas, funções e tratamento de erros.

### v0.4 — revisão inteligente
Registrar erros por assunto e priorizar na área Treino os conceitos com mais erros. Mostrar apenas estados úteis como `precisa revisar`, `em aprendizado` e `bom domínio`.

### v0.5 — código real
Adicionar exercícios curtos de digitação usando Pyodide, carregado sob demanda. Não transformar cada lição em editor de código.

### v0.6 — projetos guiados
Projetos devem ser divididos em pequenas etapas. Prioridade:

1. calculadora;
2. controle de despesas;
3. leitor de CSV;
4. organizador de arquivos;
5. consulta de API;
6. comparação de planilhas;
7. analisador de extrato;
8. automação contábil com pandas.

## Regras visuais

- estética pixel-art/8–16 bit moderna;
- fundo tecnológico escuro;
- preto/grafite + ciano como identidade do NoirByte;
- verde apenas para sucesso/progresso;
- vermelho apenas para erro;
- botões com bordas quadradas e sombras em blocos;
- desktop deve aproveitar largura disponível;
- celular deve reorganizar para uma coluna sem versão separada;
- evitar fontes, imagens e assets externos quando não forem necessários.

## Definição de pronto

Uma mudança só está pronta quando:

- abre diretamente no navegador;
- funciona em desktop e celular;
- mantém compatibilidade com GitHub Pages;
- não quebra o progresso salvo sem motivo;
- o fluxo de respostas não permite clique duplo ou avanço indevido;
- novas aulas podem ser adicionadas principalmente em `data/course.js`;
- o console não apresenta erros no fluxo normal;
- conteúdo novo ensina uma ideia por vez e explica a resposta correta.
