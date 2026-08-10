import React, { useState, useEffect, useCallback } from "react";

const FONT_IMPORT_ID = "pmga-fonts";

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_IMPORT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_IMPORT_ID;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=JetBrains+Mono:wght@400;600;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

const STAGES = [
  {
    id: "s1", name: "VARIÁVEIS", boss: "VAR-BOT", color: "#00e5ff", icon: "◆",
    lesson: [
      { title: "O que é uma variável?", body: "Uma variável é um espaço na memória com um nome, usado para guardar um valor. Em Python, você não precisa declarar o tipo — basta atribuir.", code: "nome = 'Igor'\nidade = 30\npreco = 19.90" },
      { title: "Regras de nomes", body: "Nomes de variável não podem começar com número, não podem ter espaço ou hífen, e não podem ser palavras reservadas da linguagem (como 'class' ou 'if').", code: "valor_2 = 10      # válido\n2valor = 10       # inválido\nminha-var = 10    # inválido" },
      { title: "Tipos básicos", body: "Python identifica o tipo automaticamente pelo valor atribuído: int (inteiro), float (decimal), str (texto) e bool (verdadeiro/falso).", code: "x = 10        # int\ny = 3.5       # float\nz = 'oi'      # str\nw = True      # bool" },
    ],
    questions: [
      { type: "mcq", q: "Qual nome de variável é válido em Python?", opts: ["2valor", "valor_2", "valor-2", "class"], a: 1, hint: "Pense nas regras: não pode começar com número, ter hífen, nem usar palavra reservada.", ex: "Nomes de variável não podem começar com número, ter hífen, ou usar palavras reservadas." },
      { type: "code", q: "Qual o valor de x após:\nx = 5\nx = x + 3", opts: ["5", "8", "3", "Erro"], a: 1, hint: "Primeiro x recebe 5. Depois some 3 ao valor atual de x.", ex: "x recebe 5, depois x + 3 = 8, e x passa a valer 8." },
      { type: "mcq", q: "Como declaramos uma variável do tipo texto (string)?", opts: ["nome = 'Igor'", "nome := texto(Igor)", "string nome = Igor", "var nome = 'Igor'"], a: 0, hint: "Strings usam aspas ao redor do texto, sem palavras extras antes do nome.", ex: "Python é dinamicamente tipado: basta atribuir o valor com aspas." },
      { type: "code", q: "Qual o tipo de:\npreco = 19.90", opts: ["int", "str", "float", "bool"], a: 2, hint: "Repare se o número tem casas decimais.", ex: "Números com casas decimais são do tipo float." },
      { type: "mcq", q: "type(10) retorna:", opts: ["<class 'str'>", "<class 'int'>", "<class 'float'>", "<class 'bool'>"], a: 1, hint: "10 não tem ponto decimal — é um número inteiro.", ex: "Números inteiros sem ponto decimal são do tipo int." },
    ],
  },
  {
    id: "s2", name: "OPERADORES", boss: "OP-CANNON", color: "#ffd23f", icon: "▲",
    lesson: [
      { title: "Operadores aritméticos", body: "Além de + - * /, Python tem // (divisão inteira, descarta o resto), % (resto da divisão) e ** (potenciação).", code: "7 / 2    # 3.5\n7 // 2   # 3\n7 % 2    # 1\n2 ** 4   # 16" },
      { title: "Operadores de comparação", body: "Usados para comparar valores e sempre retornam True ou False. Repare que == compara igualdade, diferente de = que atribui valor.", code: "5 == 5   # True\n5 != 3   # True\n5 > 3    # True\n5 <= 4   # False" },
      { title: "Operadores lógicos", body: "and exige que ambos os lados sejam verdadeiros. or basta que um seja verdadeiro. not inverte o valor.", code: "(5 > 3) and (2 > 4)  # False\n(5 > 3) or (2 > 4)   # True\nnot (5 > 3)          # False" },
    ],
    questions: [
      { type: "code", q: "Qual o resultado de:\n7 // 2", opts: ["3.5", "3", "1", "4"], a: 1, hint: "// descarta a parte decimal do resultado da divisão.", ex: "// é divisão inteira (descarta o resto): 7 // 2 = 3." },
      { type: "code", q: "Qual o resultado de:\n7 % 2", opts: ["0", "3", "1", "2"], a: 2, hint: "% retorna o que sobra depois da divisão inteira.", ex: "% retorna o resto da divisão: 7 dividido por 2 sobra 1." },
      { type: "code", q: "Qual o resultado de:\n2 ** 4", opts: ["8", "6", "16", "4"], a: 2, hint: "** multiplica a base por ela mesma o número de vezes do expoente.", ex: "** é potenciação: 2 elevado a 4 = 16." },
      { type: "mcq", q: "Qual operador compara igualdade em Python?", opts: ["=", "==", "===", "eq"], a: 1, hint: "Um símbolo atribui valor, o outro compara dois valores.", ex: "= atribui valor. == compara se dois valores são iguais." },
      { type: "code", q: "Qual o resultado de:\n(5 > 3) and (2 > 4)", opts: ["True", "False", "Erro", "None"], a: 1, hint: "'and' só é True se as duas condições forem verdadeiras.", ex: "5 > 3 é True, mas 2 > 4 é False. 'and' exige ambos True." },
    ],
  },
  {
    id: "s3", name: "CONDICIONAIS", boss: "IF-GUARDIAN", color: "#ff1f4c", icon: "◈",
    lesson: [
      { title: "if / else", body: "O bloco if executa um código somente se a condição for verdadeira. else executa quando a condição é falsa. Python usa dois-pontos e indentação, sem chaves.", code: "x = 10\nif x > 5:\n    print('A')\nelse:\n    print('B')" },
      { title: "elif", body: "Quando há mais de duas possibilidades, usamos elif (senão se) para encadear condições intermediárias entre o if e o else.", code: "nota = 6\nif nota >= 7:\n    print('Aprovado')\nelif nota >= 5:\n    print('Recuperação')\nelse:\n    print('Reprovado')" },
      { title: "Valores 'falsy'", body: "Em uma condição, alguns valores são tratados como falsos automaticamente: 0, '' (string vazia), [] (lista vazia) e None. Qualquer outro valor é 'truthy' (verdadeiro).", code: "if 0:\n    print('nunca executa')\nif 'texto':\n    print('sempre executa')" },
    ],
    questions: [
      { type: "mcq", q: "Qual a sintaxe correta para um 'if' em Python?", opts: ["if x > 5:", "if (x > 5)", "if x > 5 then", "if x > 5 {}"], a: 0, hint: "Python usa dois-pontos no final da linha da condição, sem parênteses obrigatórios.", ex: "Python usa dois-pontos e indentação, sem parênteses ou chaves obrigatórios." },
      { type: "code", q: "Qual a saída?\nx = 10\nif x > 5:\n    print('A')\nelse:\n    print('B')", opts: ["A", "B", "A e B", "Nada"], a: 0, hint: "Verifique se 10 é maior que 5.", ex: "Como x (10) é maior que 5, a condição do if é verdadeira e imprime 'A'." },
      { type: "mcq", q: "Qual palavra é usada para uma condição alternativa (senão se)?", opts: ["else if", "elseif", "elif", "elsif"], a: 2, hint: "É a contração de 'else if' em Python.", ex: "Python usa 'elif' para encadear condições alternativas." },
      { type: "code", q: "Qual a saída?\nnota = 6\nif nota >= 7:\n    print('Aprovado')\nelif nota >= 5:\n    print('Recuperação')\nelse:\n    print('Reprovado')", opts: ["Aprovado", "Recuperação", "Reprovado", "Erro"], a: 1, hint: "6 não passa no primeiro if, mas veja qual condição do elif ele atende.", ex: "6 não é >= 7, mas é >= 5, então cai no elif: 'Recuperação'." },
      { type: "mcq", q: "Qual valor é considerado 'falsy' em uma condição?", opts: ["1", "'texto'", "0", "[1,2]"], a: 2, hint: "Pense em valores que representam 'vazio' ou 'nada'.", ex: "0, listas vazias, strings vazias e None são avaliados como False em condições." },
    ],
  },
  {
    id: "s4", name: "LOOPS", boss: "LOOP-DRONE", color: "#00e5ff", icon: "◉",
    lesson: [
      { title: "for + range()", body: "O for percorre uma sequência. range(n) gera números de 0 até n-1 — repare que nunca inclui o próprio n.", code: "for i in range(3):\n    print(i)\n# 0\n# 1\n# 2" },
      { title: "while", body: "O while repete enquanto uma condição for verdadeira. É essencial atualizar a variável da condição dentro do laço, senão o loop nunca termina.", code: "n = 0\nwhile n < 3:\n    n += 1\nprint(n)   # 3" },
      { title: "break e continue", body: "break encerra o laço imediatamente. continue pula o restante do bloco atual e vai direto para a próxima iteração.", code: "for i in range(5):\n    if i == 3:\n        break\n    print(i)\n# 0, 1, 2" },
    ],
    questions: [
      { type: "code", q: "Quais valores são impressos?\nfor i in range(3):\n    print(i)", opts: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3, 2, 1"], a: 1, hint: "range(3) não inclui o número 3.", ex: "range(3) gera 0, 1, 2 — sempre para em n-1." },
      { type: "mcq", q: "Qual comando interrompe um loop imediatamente?", opts: ["stop", "exit", "break", "return"], a: 2, hint: "Essa palavra 'quebra' o laço na hora.", ex: "'break' encerra o laço mais próximo imediatamente." },
      { type: "mcq", q: "Qual comando pula para a próxima iteração sem executar o resto do bloco?", opts: ["skip", "continue", "next", "pass"], a: 1, hint: "Essa palavra pula direto para a próxima volta do laço.", ex: "'continue' interrompe a iteração atual e vai para a próxima." },
      { type: "code", q: "Qual a saída?\nn = 0\nwhile n < 3:\n    n += 1\nprint(n)", opts: ["2", "3", "4", "Loop infinito"], a: 1, hint: "Repare até qual valor o laço permite n continuar.", ex: "n incrementa até deixar de ser menor que 3: para em n = 3." },
      { type: "code", q: "Qual a saída?\ntotal = 0\nfor i in [1,2,3]:\n    total += i\nprint(total)", opts: ["3", "6", "123", "Erro"], a: 1, hint: "Some os três valores da lista, um a um.", ex: "Soma 1+2+3 = 6." },
    ],
  },
  {
    id: "s5", name: "LISTAS", boss: "LIST-MECH", color: "#b14aff", icon: "▣",
    lesson: [
      { title: "Criando e acessando", body: "Uma lista guarda vários valores em ordem. Os índices começam em 0, e o índice -1 acessa sempre o último elemento.", code: "lista = [10, 20, 30]\nlista[0]    # 10\nlista[-1]   # 30" },
      { title: "Métodos comuns", body: "append() adiciona um item ao final. len() retorna quantos itens existem. sort() ordena a lista em ordem crescente, alterando-a diretamente.", code: "lista = [3, 1, 2]\nlista.append(4)   # [3, 1, 2, 4]\nlen(lista)         # 4\nlista.sort()        # [1, 2, 3, 4]" },
      { title: "Fatiamento (slicing)", body: "lista[inicio:fim] retorna uma sublista, do índice início até fim-1. É a mesma lógica usada também em strings.", code: "lista = [10, 20, 30, 40]\nlista[1:3]   # [20, 30]" },
    ],
    questions: [
      { type: "code", q: "Qual a saída?\nlista = [10, 20, 30]\nprint(lista[1])", opts: ["10", "20", "30", "Erro"], a: 1, hint: "Contagem de índice começa do zero.", ex: "Índices começam em 0, então lista[1] é o segundo item: 20." },
      { type: "mcq", q: "Qual método adiciona um item ao final da lista?", opts: ["lista.add(x)", "lista.push(x)", "lista.append(x)", "lista.insert(x)"], a: 2, hint: "O nome do método lembra 'anexar' ao final.", ex: "append() adiciona um elemento ao final da lista." },
      { type: "code", q: "Qual a saída?\nlista = [1, 2, 3, 4]\nprint(lista[-1])", opts: ["1", "4", "Erro", "None"], a: 1, hint: "Índices negativos contam a partir do final da lista.", ex: "Índice -1 acessa o último elemento da lista." },
      { type: "code", q: "Qual a saída?\nprint(len([1, 2, 3, 4, 5]))", opts: ["4", "5", "6", "Erro"], a: 1, hint: "Conte quantos elementos existem dentro dos colchetes.", ex: "len() retorna a quantidade de elementos: 5." },
      { type: "code", q: "Qual a saída?\nlista = [3, 1, 2]\nlista.sort()\nprint(lista)", opts: ["[3, 1, 2]", "[1, 2, 3]", "[2, 1, 3]", "Erro"], a: 1, hint: "sort() organiza os valores do menor para o maior.", ex: "sort() ordena a lista in-place em ordem crescente." },
    ],
  },
  {
    id: "s6", name: "FUNÇÕES", boss: "FUNC-TURRET", color: "#ffd23f", icon: "◐",
    lesson: [
      { title: "Definindo uma função", body: "Funções agrupam código reutilizável. Usamos def, o nome, parênteses com parâmetros (se houver) e dois-pontos.", code: "def dobro(x):\n    return x * 2\n\ndobro(5)   # 10" },
      { title: "return", body: "return devolve um valor para quem chamou a função e encerra a execução dela. Sem return explícito, a função devolve None.", code: "def saudacao(nome):\n    print('Oi', nome)\n\nresultado = saudacao('Igor')\nprint(resultado)   # None" },
      { title: "Parâmetros com valor padrão", body: "Um parâmetro pode ter um valor padrão, usado quando o argumento não é informado na chamada.", code: "def soma(a, b=10):\n    return a + b\n\nsoma(5)      # 15\nsoma(5, 2)   # 7" },
    ],
    questions: [
      { type: "mcq", q: "Qual palavra-chave define uma função em Python?", opts: ["function", "def", "func", "define"], a: 1, hint: "É a abreviação de 'define' em inglês.", ex: "Funções são definidas com 'def nome():'." },
      { type: "code", q: "Qual a saída?\ndef dobro(x):\n    return x * 2\nprint(dobro(5))", opts: ["5", "10", "25", "Erro"], a: 1, hint: "A função multiplica o valor recebido por 2.", ex: "A função multiplica o argumento por 2: 5 * 2 = 10." },
      { type: "mcq", q: "O que 'return' faz em uma função?", opts: ["Imprime um valor na tela", "Encerra o programa", "Devolve um valor e encerra a função", "Reinicia a função"], a: 2, hint: "Pense no que acontece quando uma função 'devolve' algo.", ex: "'return' devolve um valor para quem chamou a função e a encerra." },
      { type: "code", q: "Qual a saída?\ndef soma(a, b=10):\n    return a + b\nprint(soma(5))", opts: ["5", "10", "15", "Erro"], a: 2, hint: "Como b não foi informado na chamada, ele usa o valor padrão.", ex: "b tem valor padrão 10, então soma(5) = 5 + 10 = 15." },
      { type: "mcq", q: "Uma função sem 'return' explícito retorna:", opts: ["0", "'' (string vazia)", "None", "Erro"], a: 2, hint: "Sem um valor de retorno explícito, Python usa um valor especial de 'nada'.", ex: "Se não houver 'return', a função retorna None por padrão." },
    ],
  },
  {
    id: "s7", name: "DICIONÁRIOS", boss: "DICT-SENTRY", color: "#ff1f4c", icon: "◫",
    lesson: [
      { title: "Chave e valor", body: "Um dicionário guarda pares chave:valor. Diferente da lista, você acessa os dados pela chave, não pela posição.", code: "d = {'nome': 'Ana', 'idade': 30}\nd['nome']   # 'Ana'" },
      { title: "Adicionar e atualizar", body: "Atribuir diretamente a uma chave cria o par se ele não existir, ou atualiza o valor se já existir.", code: "d = {'a': 1}\nd['b'] = 2       # adiciona\nd['a'] = 99      # atualiza" },
      { title: "keys(), values(), get()", body: "keys() lista as chaves, values() lista os valores. get('x') é mais seguro que d['x'] pois não gera erro caso a chave não exista.", code: "d = {'a': 1, 'b': 2}\nd.keys()      # dict_keys(['a', 'b'])\nd.get('c')    # None (sem erro)" },
    ],
    questions: [
      { type: "code", q: "Qual a saída?\nd = {'nome': 'Ana', 'idade': 30}\nprint(d['nome'])", opts: ["'nome'", "Ana", "idade", "Erro"], a: 1, hint: "A chave 'nome' aponta diretamente para o valor associado a ela.", ex: "Acessar pela chave 'nome' retorna o valor associado: 'Ana'." },
      { type: "mcq", q: "Como adicionamos/atualizamos uma chave em um dicionário?", opts: ["d.append('x', 1)", "d['x'] = 1", "d.add('x': 1)", "d + {'x':1}"], a: 1, hint: "Atribua o valor diretamente usando colchetes com a chave.", ex: "Atribuir diretamente pela chave cria ou atualiza o valor." },
      { type: "mcq", q: "Qual método retorna todas as chaves de um dicionário?", opts: ["d.values()", "d.items()", "d.keys()", "d.all()"], a: 2, hint: "O nome do método já indica que ele retorna as chaves.", ex: "keys() retorna as chaves; values() retorna os valores; items() retorna pares." },
      { type: "code", q: "Qual a saída?\nd = {'a': 1, 'b': 2}\nprint(len(d))", opts: ["1", "2", "4", "Erro"], a: 1, hint: "Conte quantos pares chave-valor existem no dicionário.", ex: "len() em um dicionário conta o número de pares chave-valor: 2." },
      { type: "mcq", q: "O que acontece ao acessar uma chave inexistente com d['x']?", opts: ["Retorna None", "Retorna 0", "Lança KeyError", "Cria a chave automaticamente"], a: 2, hint: "Acessar uma chave que não existe gera um erro, não um valor vazio.", ex: "Acessar uma chave que não existe gera um KeyError (use d.get('x') para evitar)." },
    ],
  },
  {
    id: "s8", name: "STRINGS", boss: "STR-WARDEN [FASE FINAL]", color: "#b14aff", icon: "★",
    lesson: [
      { title: "Fatiamento de strings", body: "Strings funcionam como listas de caracteres. texto[inicio:fim] retorna um pedaço do texto, do início até fim-1.", code: "nome = 'Python'\nnome[0:3]   # 'Pyt'\nlen(nome)   # 6" },
      { title: "Métodos úteis", body: "upper() deixa tudo maiúsculo, lower() deixa tudo minúsculo, e replace() troca um trecho por outro em toda a string.", code: "cidade = 'Rio Preto'\ncidade.upper()               # 'RIO PRETO'\ncidade.replace('Rio', 'São') # 'São Preto'" },
      { title: "Concatenação e f-strings", body: "O operador + junta strings. Uma forma mais prática de combinar texto com variáveis é usando f-strings, com o prefixo f antes das aspas.", code: "nome = 'Igor'\n'Olá, ' + nome          # 'Olá, Igor'\nf'Olá, {nome}!'         # 'Olá, Igor!'" },
    ],
    questions: [
      { type: "code", q: "Qual a saída?\nprint('Python'[0:3])", opts: ["Pyt", "yth", "Python", "Erro"], a: 0, hint: "O fatiamento pega do índice 0 até o 2, sem incluir o 3.", ex: "Fatiamento [0:3] pega os caracteres do índice 0 até 2: 'Pyt'." },
      { type: "mcq", q: "Qual método deixa uma string toda em maiúsculas?", opts: [".upper()", ".uppercase()", ".toUpper()", ".caps()"], a: 0, hint: "O nome do método já indica 'para cima' (maiúsculas).", ex: "'texto'.upper() converte todos os caracteres para maiúsculas." },
      { type: "code", q: "Qual a saída?\nprint(len('Python'))", opts: ["5", "6", "7", "Erro"], a: 1, hint: "Conte as letras da palavra Python.", ex: "'Python' tem 6 caracteres." },
      { type: "code", q: "Qual a saída?\nnome = 'Rio Preto'\nprint(nome.replace('Rio', 'São'))", opts: ["Rio Preto", "São Preto", "Rio São", "Erro"], a: 1, hint: "replace() troca todas as ocorrências do primeiro termo pelo segundo.", ex: "replace() troca todas as ocorrências de 'Rio' por 'São'." },
      { type: "mcq", q: "Como concatenamos duas strings em Python?", opts: ["a & b", "a . b", "a + b", "a ++ b"], a: 2, hint: "O mesmo símbolo usado em soma de números também junta textos.", ex: "O operador + concatena (junta) strings em Python." },
    ],
  },
];

const STORAGE_KEY = "pmga-progress-v3";

async function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { unlocked: 1, completed: {} };
}

async function saveProgress(p) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch (e) {
    console.error("Falha ao salvar progresso:", e);
  }
}

function PixelCorners({ color, size = 10, inset = -6 }) {
  const common = { position: "absolute", width: size, height: size, borderColor: color, filter: `drop-shadow(0 0 3px ${color}aa)` };
  return <>
    <div style={{ ...common, top: inset, left: inset, borderTop: "2px solid", borderLeft: "2px solid" }} />
    <div style={{ ...common, top: inset, right: inset, borderTop: "2px solid", borderRight: "2px solid" }} />
    <div style={{ ...common, bottom: inset, left: inset, borderBottom: "2px solid", borderLeft: "2px solid" }} />
    <div style={{ ...common, bottom: inset, right: inset, borderBottom: "2px solid", borderRight: "2px solid" }} />
  </>;
}

function PixelPanel({ color = "#00e5ff", children, style, corners = true }) {
  return <div style={{ position: "relative", background: "#0d0d16", border: `1px solid ${color}55`, boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.02), inset -4px -4px 0 rgba(0,0,0,0.35), inset 4px 4px 0 rgba(255,255,255,0.03), 0 0 22px ${color}22`, ...style }}>
    {corners && <PixelCorners color={color} />}{children}
  </div>;
}

function EnergyBar({ value, max, color, label }) {
  const segments = Array.from({ length: max });
  const filled = Math.max(0, value);
  return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#8890a8", letterSpacing: 1 }}>{label}</span>}
    <div style={{ display: "flex", gap: 3 }}>{segments.map((_, i) => <div key={i} style={{ width: 16, height: 11, background: i < filled ? color : "#14141e", border: `1px solid ${i < filled ? color : "#2a2a3a"}`, boxShadow: i < filled ? `0 0 8px ${color}bb, inset -2px -2px 0 rgba(0,0,0,0.35), inset 2px 2px 0 rgba(255,255,255,0.25)` : "inset 0 0 0 1px rgba(255,255,255,0.02)", transition: "all 0.2s" }} />)}</div>
  </div>;
}

function PixelButton({ children, onClick, color = "#00e5ff", disabled, style }) {
  return <button onClick={onClick} disabled={disabled} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: disabled ? "#555" : "#050508", background: disabled ? "#22222c" : color, border: "none", padding: "12px 18px", cursor: disabled ? "not-allowed" : "pointer", clipPath: "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))", boxShadow: disabled ? "none" : `0 0 18px ${color}99, inset -3px -3px 0 rgba(0,0,0,0.35), inset 3px 3px 0 rgba(255,255,255,0.35)`, letterSpacing: 1, transition: "transform 0.08s ease", ...style }} onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(0.96)")} onMouseUp={(e) => !disabled && (e.currentTarget.style.transform = "scale(1)")} onMouseLeave={(e) => !disabled && (e.currentTarget.style.transform = "scale(1)")}>{children}</button>;
}

function PixelBackdrop() {
  return <>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px)", backgroundSize: "26px 26px", maskImage: "radial-gradient(ellipse 90% 60% at 50% 0%, black 40%, transparent 90%)", zIndex: 0 }} />
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 60% at 50% 30%, transparent 40%, #050508 100%)", zIndex: 1 }} />
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)", mixBlendMode: "overlay", zIndex: 50 }} />
  </>;
}

function CodeBlock({ text }) {
  const lines = text.split("\n");
  return <div style={{ background: "#08080c", border: "1px solid #23233a", borderLeft: "3px solid #00e5ff", padding: "12px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#c9e8ff", lineHeight: 1.7, whiteSpace: "pre", overflowX: "auto", margin: "14px 0", boxShadow: "inset 0 0 12px rgba(0,0,0,0.5)" }}>
    {lines.map((l, i) => <div key={i}><span style={{ color: "#3a3a52", marginRight: 12 }}>{String(i + 1).padStart(2, "0")}</span>{l}</div>)}
  </div>;
}

function MapScreen({ progress, onEnter }) {
  const doneCount = Object.keys(progress.completed).length;
  return <div style={{ padding: "28px 20px 60px", position: "relative", zIndex: 2 }}>
    <div style={{ textAlign: "center", marginBottom: 18 }}>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: "#00e5ff", textShadow: "0 0 4px #00e5ff, 0 0 22px #00e5ffaa, 0 0 46px #00e5ff55", letterSpacing: 2 }}>PYTHON</div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: "#ff1f4c", textShadow: "0 0 4px #ff1f4c, 0 0 16px #ff1f4caa", marginTop: 6, letterSpacing: 3 }}>// BLACK BUSTER</div>
    </div>
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8890a8", border: "1px solid #23233a", padding: "6px 14px", background: "#0d0d16" }}>{doneCount} / {STAGES.length} FASES CONCLUÍDAS</div></div>
    <div style={{ maxWidth: 460, margin: "0 auto", position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", top: 10, bottom: 10, width: 3, background: "repeating-linear-gradient(to bottom, #23233a 0px, #23233a 6px, transparent 6px, transparent 12px)", transform: "translateX(-50%)", zIndex: 0 }} />
      {STAGES.map((stage, i) => {
        const stageNum = i + 1, isUnlocked = stageNum <= progress.unlocked, isDone = !!progress.completed[stage.id], align = i % 2 === 0 ? "flex-start" : "flex-end";
        return <div key={stage.id} style={{ display: "flex", justifyContent: align, marginBottom: 26, position: "relative", zIndex: 1 }}>
          <button onClick={() => isUnlocked && onEnter(stage, i)} disabled={!isUnlocked} style={{ cursor: isUnlocked ? "pointer" : "not-allowed", background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 130 }}>
            <div style={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, background: isUnlocked ? "#0d0d16" : "#111116", border: `2px solid ${isUnlocked ? stage.color : "#2a2a36"}`, color: isUnlocked ? stage.color : "#3a3a46", boxShadow: isUnlocked ? `0 0 20px ${stage.color}66, inset -3px -3px 0 rgba(0,0,0,0.35), inset 3px 3px 0 rgba(255,255,255,0.08)` : "none", clipPath: "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))" }}>
              {isDone ? "✓" : isUnlocked ? stage.icon : "🔒"}{isUnlocked && !isDone && <PixelCorners color={stage.color} size={7} inset={-5} />}
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: isUnlocked ? "#c9ccdb" : "#3a3a46", textAlign: "center", letterSpacing: 0.5 }}>{stage.name}</div>
          </button>
        </div>;
      })}
    </div>
  </div>;
}

function LessonScreen({ stage, onFinish, onExit }) {
  const [cardIndex, setCardIndex] = useState(0);
  const card = stage.lesson[cardIndex], isLast = cardIndex === stage.lesson.length - 1;
  return <div style={{ padding: "20px 18px 40px", position: "relative", zIndex: 2 }}>
    <button onClick={onExit} style={{ background: "none", border: "none", color: "#6b6f85", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, cursor: "pointer", marginBottom: 14 }}>← sair</button>
    <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>{stage.lesson.map((_, i) => <div key={i} style={{ flex: 1, height: 4, background: i <= cardIndex ? stage.color : "#1e1e2c", boxShadow: i <= cardIndex ? `0 0 6px ${stage.color}88` : "none" }} />)}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: stage.color, border: `2px solid ${stage.color}`, boxShadow: `0 0 10px ${stage.color}66`, flexShrink: 0 }}>{stage.icon}</div>
      <div><div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#6b6f85", letterSpacing: 1 }}>AULA · {stage.name}</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4a4e60" }}>{cardIndex + 1} / {stage.lesson.length}</div></div>
    </div>
    <PixelPanel color={stage.color} style={{ padding: 20 }}>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: stage.color, marginBottom: 14, lineHeight: 1.5 }}>{card.title}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, color: "#c9ccdb", lineHeight: 1.7 }}>{card.body}</div>
      <CodeBlock text={card.code} />
    </PixelPanel>
    <div className="lesson-actions" style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 22 }}>
      <PixelButton onClick={() => setCardIndex((i) => Math.max(0, i - 1))} disabled={cardIndex === 0} color="#4a4e60" style={{ background: "#22222c", color: "#c9ccdb", boxShadow: "none" }}>← ANTERIOR</PixelButton>
      {isLast ? <PixelButton onClick={onFinish} color={stage.color}>INICIAR DESAFIO →</PixelButton> : <PixelButton onClick={() => setCardIndex((i) => i + 1)} color={stage.color}>PRÓXIMO →</PixelButton>}
    </div>
  </div>;
}

function BattleScreen({ stage, onWin, onExit }) {
  const [qIndex, setQIndex] = useState(0), [bossHp, setBossHp] = useState(stage.questions.length), [wrongTries, setWrongTries] = useState([]), [correct, setCorrect] = useState(false), [shake, setShake] = useState(false), [flash, setFlash] = useState(null), [hitPulse, setHitPulse] = useState(false);
  const question = stage.questions[qIndex];
  const handleAnswer = (idx) => {
    if (correct || wrongTries.includes(idx)) return;
    if (idx === question.a) {
      setCorrect(true); setFlash(stage.color); setHitPulse(true); setBossHp((h) => h - 1); setTimeout(() => setHitPulse(false), 350);
    } else {
      setWrongTries((w) => [...w, idx]); setShake(true); setFlash("#ff1f4c"); setTimeout(() => setShake(false), 400);
    }
    setTimeout(() => setFlash(null), 250);
  };
  const handleNext = () => {
    if (bossHp <= 0) { onWin(); return; }
    setQIndex((i) => i + 1); setWrongTries([]); setCorrect(false);
  };
  const lastWrong = wrongTries.length > 0 && !correct;
  return <div style={{ padding: "20px 18px 40px", position: "relative", zIndex: 2 }}>
    <button onClick={onExit} style={{ background: "none", border: "none", color: "#6b6f85", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, cursor: "pointer", marginBottom: 14 }}>← sair da fase</button>
    <PixelPanel color={stage.color} style={{ padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 14, animation: shake ? "pmga-shake 0.4s" : "none" }}>
      <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: stage.color, border: `2px solid ${stage.color}`, flexShrink: 0, boxShadow: `0 0 14px ${stage.color}77`, animation: hitPulse ? "pmga-hit 0.35s" : "pmga-bob 2.6s ease-in-out infinite" }}>{stage.icon}</div>
      <div style={{ flex: 1 }}><div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#e8eaf0", marginBottom: 8 }}>{stage.boss}</div><EnergyBar value={bossHp} max={stage.questions.length} color={stage.color} /></div>
    </PixelPanel>
    {question.type === "code" ? <CodeBlock text={question.q} /> : <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: "#e8eaf0", lineHeight: 1.6, marginBottom: 16 }}>{question.q}</div>}
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>{question.opts.map((opt, idx) => {
      let bg = "#0d0d16", border = "#2a2a3a", color = "#c9ccdb", icon = null;
      if (correct && idx === question.a) { bg = "#0f2016"; border = "#2ecc71"; color = "#2ecc71"; icon = "✓"; }
      else if (wrongTries.includes(idx)) { bg = "#1a1014"; border = "#5c2333"; color = "#8a4a58"; icon = "✕"; }
      const isDisabled = correct || wrongTries.includes(idx);
      return <button key={idx} onClick={() => handleAnswer(idx)} disabled={isDisabled} style={{ textAlign: "left", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color, background: bg, border: `1px solid ${border}`, padding: "12px 14px", cursor: isDisabled ? "default" : "pointer", transition: "all 0.15s", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>{opt}</span>{icon && <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11 }}>{icon}</span>}</button>;
    })}</div>
    {lastWrong && <PixelPanel color="#ff1f4c" corners={false} style={{ marginTop: 18, padding: 14 }}><div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#ff1f4c", marginBottom: 8 }}>NÃO FOI DESSA VEZ</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#a8adc0", lineHeight: 1.5 }}>💡 Dica: {question.hint}</div></PixelPanel>}
    {correct && <PixelPanel color="#2ecc71" corners={false} style={{ marginTop: 18, padding: 14 }}><div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#2ecc71", marginBottom: 8 }}>ACERTOU! DANO NO BOSS</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#a8adc0", lineHeight: 1.5 }}>{question.ex}</div><div style={{ marginTop: 14 }}><PixelButton onClick={handleNext} color={stage.color}>CONTINUAR →</PixelButton></div></PixelPanel>}
    {flash && <div style={{ position: "fixed", inset: 0, background: flash, opacity: 0.12, pointerEvents: "none", zIndex: 40 }} />}
    <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4a4e60", textAlign: "center" }}>Questão {qIndex + 1} / {stage.questions.length}</div>
  </div>;
}

function WinScreen({ stage, onContinue }) {
  return <div style={{ padding: "60px 20px", textAlign: "center", position: "relative", zIndex: 2 }}>
    <div style={{ fontSize: 54, marginBottom: 10, filter: "drop-shadow(0 0 14px #2ecc7188)" }}>🏆</div>
    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: "#2ecc71", textShadow: "0 0 4px #2ecc71, 0 0 18px #2ecc7188", marginBottom: 8 }}>FASE CONCLUÍDA</div>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#a8adc0", marginBottom: 30 }}>Você aprendeu {stage.name.toLowerCase()} e derrotou {stage.boss}.</div>
    <PixelButton onClick={onContinue} color="#2ecc71">VOLTAR AO MAPA</PixelButton>
  </div>;
}

export default function App() {
  useGoogleFonts();
  const [progress, setProgress] = useState(null), [screen, setScreen] = useState("loading"), [activeStage, setActiveStage] = useState(null), [activeIndex, setActiveIndex] = useState(null), [battleKey, setBattleKey] = useState(0);
  useEffect(() => { loadProgress().then((p) => { setProgress(p); setScreen("map"); }); }, []);
  const persist = useCallback((next) => { setProgress(next); saveProgress(next); }, []);
  const enterStage = (stage, idx) => { setActiveStage(stage); setActiveIndex(idx); setScreen("lesson"); };
  const startBattle = () => { setBattleKey((k) => k + 1); setScreen("battle"); };
  const handleWin = () => {
    const stage = activeStage;
    const next = { ...progress, unlocked: Math.max(progress.unlocked, activeIndex + 2), completed: { ...progress.completed, [stage.id]: true } };
    persist(next); setScreen("win");
  };
  if (screen === "loading" || !progress) return <div style={{ minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", background: "#050508", fontFamily: "'Press Start 2P', monospace", color: "#00e5ff", fontSize: 12 }}>CARREGANDO...</div>;
  return <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 50% 0%, #10101c 0%, #050508 60%)", position: "relative", overflow: "hidden", fontFamily: "'JetBrains Mono', monospace" }}>
    <style>{`
      @keyframes pmga-shake { 0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)} }
      @keyframes pmga-bob { 0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)} }
      @keyframes pmga-hit { 0%{transform:scale(1);filter:brightness(1)}30%{transform:scale(1.25);filter:brightness(2.2)}100%{transform:scale(1);filter:brightness(1)} }
      *{box-sizing:border-box}
      @media(max-width:560px){.lesson-actions{flex-direction:column-reverse}.lesson-actions button{width:100%}}
    `}</style>
    <PixelBackdrop />
    {screen === "map" && <MapScreen progress={progress} onEnter={enterStage} />}
    {screen === "lesson" && <LessonScreen stage={activeStage} onFinish={startBattle} onExit={() => setScreen("map")} />}
    {screen === "battle" && <BattleScreen key={battleKey} stage={activeStage} onWin={handleWin} onExit={() => setScreen("map")} />}
    {screen === "win" && <WinScreen stage={activeStage} onContinue={() => setScreen("map")} />}
  </div>;
}
