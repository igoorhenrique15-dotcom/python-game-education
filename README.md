# 🐍 Black Buster — Trilha de Programação

Plataforma interativa e gratuita para aprender programação direto no navegador, com aulas curtas, exercícios práticos e acompanhamento de progresso.

🔗 **Acesse:** [igoorhenrique15-dotcom.github.io/python-game-education](https://igoorhenrique15-dotcom.github.io/python-game-education/)

![status](https://img.shields.io/badge/status-ativo-brightgreen)
![licença](https://img.shields.io/badge/licença-livre%20para%20estudo-blue)
![feito com](https://img.shields.io/badge/feito%20com-React%20%2B%20Vite-646CFF)

---

## ✨ Sobre o projeto

O **Black Buster** é uma trilha gamificada de estudos guiada pela mascote **Guia Py**, pensada para tornar o aprendizado de programação leve e prático. O conteúdo é dividido em trilhas independentes, cada uma com lições, exercícios e quizzes de múltipla escolha.

## 🗂️ Trilhas disponíveis

- 🐍 **Python** — fundamentos da linguagem;
- 🌐 **HTML & CSS** — estrutura e estilo para a web;
- ☕ **Java** — lógica e orientação a objetos;
- 🤖 **Inteligência Artificial** — conceitos essenciais, sem necessidade de código.

## 🚀 Como usar

### Online
Basta acessar a [versão publicada](https://igoorhenrique15-dotcom.github.io/python-game-education/) — não requer instalação.

### Localmente
```bash
git clone https://github.com/igoorhenrique15-dotcom/python-game-education.git
cd python-game-education
npm install
npm run dev
```

O projeto sobe com [Vite](https://vitejs.dev/) e fica disponível em `http://localhost:5173`.

## 🧱 Estrutura do projeto

```
├── index.html          # ponto de entrada da aplicação
├── src/
│   ├── App.jsx          # componente raiz
│   ├── CompleteApp.jsx   # fluxo completo da trilha
│   ├── data/             # conteúdo das lições (Python, HTML, Java, IA)
│   └── assets/mascot/    # ilustrações da Guia Py
├── data/course.js       # dados legados da trilha
├── style.css             # visual do projeto
└── .github/workflows/    # deploy automático no GitHub Pages
```

## 🛠️ Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- HTML, CSS e JavaScript puro para partes do conteúdo interativo

## 📦 Deploy

O deploy é automático: todo push na branch `main` publica a versão mais recente no GitHub Pages via GitHub Actions.

## 🤝 Contribuindo

Sugestões, correções e novas lições são bem-vindas! Abra uma *issue* ou envie um *pull request*.
