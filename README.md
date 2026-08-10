# Python Game Education

Protótipo mobile-first de uma plataforma pessoal para estudar Python em sessões curtas e interativas.

## Objetivo

Ensinar Python com o menor atrito possível:

1. explicação curta;
2. pergunta clicável;
3. feedback imediato;
4. próxima etapa;
5. progresso salvo automaticamente.

O projeto **não usa XP, ranking, moedas, conquistas ou vidas**. O único indicador é o progresso real de aprendizagem.

## Executar

Não há build nem dependências.

- Abra `index.html` no navegador; ou
- rode um servidor local simples, por exemplo `python -m http.server 8000`.

## Arquivos principais

- `index.html` — estrutura da aplicação.
- `style.css` — visual mobile-first.
- `data/course.js` — conteúdo da trilha.
- `script.js` — motor de navegação, exercícios e progresso.
- `ROADMAP_AI.md` — especificação para uma IA continuar o projeto.

## Estado atual

O protótipo inicial inclui:

- tela inicial com botão Continuar;
- trilha sequencial de Python;
- módulos e lições;
- explicações curtas;
- respostas por toque;
- exercícios de múltipla escolha, previsão de saída e completar código;
- feedback imediato;
- progresso persistido no navegador;
- opção de zerar o progresso.

Consulte `ROADMAP_AI.md` antes de alterar a arquitetura ou adicionar conteúdo.
