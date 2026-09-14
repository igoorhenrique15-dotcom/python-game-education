# Black Buster — Curso completo de Análise e Desenvolvimento de Sistemas

Curso gratuito e interativo, no estilo Duolingo, para aprender a programar e
entender como um sistema web real é construído — do primeiro `print()` ao
deploy em produção.

Acesse a versão publicada do projeto ou rode localmente (veja abaixo). Não
há vidas, moedas ou qualquer cobrança: todo o conteúdo é 100% aberto.

## Trilhas

30 trilhas no total, cobrindo linguagens, fundamentos de ADS e o ciclo
completo de construção de software:

**Linguagens:** Python, JavaScript, TypeScript, Java, C#, PHP, Kotlin, Go,
C++, Rust, R, Dart & Flutter, Ruby, Swift.

**Web e fundamentos:** HTML & CSS, Banco de Dados (SQL), Estruturas de
Dados e Algoritmos, Engenharia de Software, APIs & HTTP, Bash & Linux.

**Ciclo de vida de um sistema:** Git & GitHub, Testes de Software,
DevOps & CI/CD, Docker & Kubernetes, Supabase, Deploy & Vercel, Segurança
da Informação.

**IA:** Inteligência Artificial (uso no dia a dia), IA para
Desenvolvedores (uso ao programar), Machine Learning.

Cada trilha é dividida em 10 unidades com microlições curtas: uma aula
teórica objetiva, um exemplo de código e desafios de múltipla escolha com
feedback imediato. Tudo se resolve por clique — não é preciso digitar
código para avançar.

## Como rodar localmente

```
npm install
npm run dev
```

Para gerar a versão de produção (publicada via GitHub Pages):

```
npm run build
```

## Estrutura

- `index.html` — ponto de entrada do Vite;
- `src/CompleteApp.jsx` — aplicação React (telas, navegação, progresso);
- `src/data/course*.json` — conteúdo de cada trilha (lições e questões);
- `src/*.css` — tema visual;
- `.github/workflows/pages.yml` — build e publicação automática no GitHub Pages a cada push em `main`.

## Progresso

O progresso (lições concluídas, XP, ofensiva diária, questões dominadas)
fica salvo no `localStorage` do navegador — não há backend nem conta
obrigatória.
