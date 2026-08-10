# ROADMAP PARA IA — Python Game Education

Este arquivo é a fonte de verdade para qualquer IA que continuar o projeto.

## 1. Objetivo do produto

Criar uma aplicação web responsiva para estudo pessoal de Python, inspirada apenas na mecânica de microlições interativas de apps educacionais.

O projeto deve funcionar no mesmo endereço em:
- navegador desktop;
- notebook;
- tablet;
- celular.

O projeto deve continuar publicável como site estático no GitHub Pages.

## 2. O que NÃO deve existir

Não adicionar:
- XP;
- ranking;
- moedas;
- conquistas;
- vidas;
- sistema social;
- login obrigatório;
- backend sem necessidade real;
- frameworks apenas por estética.

O foco é exclusivamente aprendizado.

## 3. Método de estudo obrigatório

A maior parte das interações deve exigir apenas clique/toque.

Fluxo padrão de uma lição:
1. explicação curta;
2. exemplo de código;
3. pergunta clicável;
4. feedback imediato;
5. nova pergunta;
6. conclusão;
7. liberar a próxima lição.

Aproximadamente 75% a 85% das atividades devem ser respondidas por clique.

Tipos prioritários:
- escolher a alternativa correta;
- prever a saída do código;
- escolher o trecho que completa o código;
- identificar o erro;
- ordenar trechos de código futuramente por clique/arrastar.

Digitação de código deve existir somente em etapas de prática mais avançada, não em todas as lições.

## 4. Arquitetura atual

Tecnologias:
- HTML sem framework;
- CSS responsivo;
- JavaScript vanilla;
- dados do curso separados em `data/course.js`;
- progresso em `localStorage`.

Arquivos:
- `index.html`: shell da aplicação;
- `style.css`: layout responsivo desktop/celular;
- `script.js`: motor do curso;
- `data/course.js`: conteúdo;
- `.github/workflows/pages.yml`: publicação no GitHub Pages.

Evitar dependências externas no MVP.

## 5. Regras de interface

Desktop:
- aproveitar largura disponível;
- permitir duas colunas na tela inicial;
- conteúdo de lição centralizado com largura confortável;
- botões grandes, mas sem aparência de aplicativo mobile esticado.

Celular:
- reorganizar para uma coluna;
- manter botões fáceis de tocar;
- não criar versão separada;
- não exigir zoom horizontal.

A mesma base deve atender ambas as telas.

## 6. Regras de progresso

Persistir localmente:
- lições concluídas;
- última lição aberta;
- futuramente domínio por assunto e erros de revisão.

Não persistir pontos artificiais.

A próxima lição só deve ser liberada quando a anterior for concluída.

A área Prática deve usar somente assuntos já estudados.

## 7. Trilha pedagógica planejada

### Fase A — Fundamentos
1. Primeiros passos
2. print()
3. comentários
4. variáveis
5. strings
6. números
7. input()
8. operadores matemáticos
9. comparações
10. booleanos
11. if
12. else
13. elif
14. for
15. while

### Fase B — Estruturas de dados
16. listas
17. operações com listas
18. strings avançadas
19. tuplas
20. dicionários
21. sets
22. list comprehensions

### Fase C — Organização do código
23. funções
24. parâmetros
25. retorno
26. escopo
27. módulos
28. tratamento de erros

### Fase D — Python prático
29. arquivos TXT
30. CSV
31. JSON
32. pathlib
33. automação de arquivos
34. requests / APIs

### Fase E — Dados e trabalho
35. pandas básico
36. DataFrame
37. filtros
38. agrupamentos
39. leitura de CSV
40. leitura de Excel
41. comparação de planilhas
42. tratamento de dados

### Fase F — Projetos
Projetos pequenos devem aparecer depois que os fundamentos necessários já tiverem sido ensinados.

Sugestões:
- calculadora;
- calculadora de impostos simples;
- controle de despesas;
- simulador de investimentos;
- leitor de CSV;
- comparação de duas planilhas;
- analisador de extrato;
- organizador de arquivos;
- consulta de API;
- automação com pandas.

## 8. Próximas versões

### v0.2 — Melhorar motor de exercícios
Adicionar tipos declarativos no `course.js`:
- `choice`;
- `output`;
- `fill_choice`;
- `find_error`;
- `order_code`.

O motor deve renderizar o exercício a partir do tipo sem conteúdo HTML duplicado.

### v0.3 — Revisão por dificuldade
Registrar por assunto:
- acertos;
- erros;
- última revisão.

A área Prática deve priorizar assuntos com mais erros.

Não mostrar pontuação gamificada. Mostrar somente algo útil, como:
- "precisa revisar";
- "em aprendizado";
- "bom domínio".

### v0.4 — Código real no navegador
Adicionar Pyodide apenas quando começarem exercícios de digitação.

Requisitos:
- carregar Pyodide sob demanda;
- não tornar cada tela pesada;
- capturar stdout;
- comparar resultado esperado;
- permitir executar novamente;
- manter compatibilidade com GitHub Pages.

### v0.5 — Conteúdo completo de fundamentos
Expandir Fase A e B.

Cada conceito deve ter várias microlições, não uma aula longa.

### v0.6 — Projetos guiados
Criar projetos em etapas pequenas.

Exemplo:
Projeto calculadora
1. criar variáveis;
2. receber valores;
3. fazer cálculo;
4. mostrar resultado;
5. tratar opções.

## 9. Formato recomendado para conteúdo

Continuar mantendo conteúdo fora do motor.

Exemplo:

```js
{
  id: "comparacoes-01",
  title: "Comparando valores",
  steps: [
    {
      type: "info",
      title: "Igualdade",
      text: "Use == para comparar valores.",
      code: "idade == 18"
    },
    {
      type: "choice",
      title: "Qual opção verifica igualdade?",
      options: ["idade == 18", "idade = 18", "idade != 18"],
      answer: 0,
      explanation: "== compara; = atribui."
    }
  ]
}
```

## 10. Regras de qualidade para novas aulas

Toda aula deve:
- ensinar uma ideia por vez;
- evitar parágrafos longos;
- usar exemplos concretos;
- ter pelo menos duas interações;
- explicar por que a resposta está correta;
- evitar pegadinhas;
- evitar perguntas baseadas em memorização inútil;
- progredir em dificuldade;
- reutilizar conhecimentos anteriores.

## 11. Definição de pronto

Uma alteração só está pronta quando:
- abre diretamente no navegador;
- funciona em desktop e celular;
- não quebra GitHub Pages;
- preserva progresso existente sempre que possível;
- não adiciona gamificação sem valor pedagógico;
- novas perguntas podem ser adicionadas preferencialmente editando dados, não o motor;
- console do navegador não apresenta erros em fluxo normal.

## 12. Prioridade imediata

Próxima IA deve, nesta ordem:
1. testar todo o fluxo do protótipo atual;
2. corrigir qualquer erro de navegação ou responsividade;
3. expandir o motor de tipos de exercício;
4. adicionar mais conteúdo de Fundamentos;
5. somente depois avaliar Pyodide e digitação de código.
