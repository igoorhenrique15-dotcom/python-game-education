# Black Buster — Curso completo de Análise e Desenvolvimento de Sistemas

Curso gratuito e interativo, no estilo Duolingo, para aprender a programar e
entender como um sistema web real é construído — do primeiro `print()` ao
deploy em produção.

Acesse a versão publicada do projeto ou rode localmente (veja abaixo). Não
há vidas, moedas ou qualquer cobrança: todo o conteúdo é 100% aberto.

## Trilhas

- **Python** — do zero à prática profissional;
- **HTML & CSS** — estrutura e estilo para a web;
- **JavaScript** — interatividade, DOM, eventos e requisições;
- **Java** — orientação a objetos e back-end;
- **Banco de Dados** — modelagem relacional e SQL;
- **Git & GitHub** — controle de versão e colaboração;
- **Supabase** — backend, autenticação e banco de dados gerenciado;
- **Deploy & Vercel** — publicar um projeto do zero ao ar;
- **Segurança da Informação** — boas práticas para proteger sistemas e dados;
- **Inteligência Artificial** — usar IA no dia a dia;
- **IA para Desenvolvedores** — usar IA com técnica durante a programação.

Cada trilha é dividida em 10 unidades com microlições curtas: uma explicação
objetiva, um exemplo de código e um desafio de múltipla escolha com
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
