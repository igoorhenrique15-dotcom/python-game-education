window.PYTHON_COURSE = {
  id: "python-foundations",
  title: "Fundamentos de Python",
  description: "Aprenda Python em etapas curtas, com explicações diretas e respostas por clique.",
  modules: [
    {
      id: "primeiros-passos",
      title: "Primeiros passos",
      description: "Entenda como Python executa instruções e mostre informações na tela.",
      lessons: [
        {
          id: "python-e-instrucoes",
          title: "Python e instruções",
          steps: [
            { type: "info", title: "Python executa instruções", text: "Um programa Python é uma sequência de instruções. O computador lê o código e executa o que foi pedido, normalmente de cima para baixo.", code: "print(\"Olá!\")" },
            { type: "choice", title: "Qual linha pede para Python mostrar um texto?", options: ["print(\"Olá!\")", "texto = Olá", "Python(Olá)"], answer: 0, explanation: "print() mostra uma informação na saída do programa." },
            { type: "choice", title: "O que este código mostra?", code: "print(\"Python\")", options: ["Python", "print", "Nada"], answer: 0, explanation: "O texto entre aspas é enviado para a saída." }
          ]
        },
        {
          id: "print",
          title: "A função print()",
          steps: [
            { type: "info", title: "Mostrando informações", text: "A função print() mostra informações. Textos ficam entre aspas; números podem ser usados diretamente.", code: "print(\"Bom dia\")\nprint(10)" },
            { type: "choice", title: "Complete o código", code: "____(\"Aprendendo Python\")", options: ["print", "show", "write"], answer: 0, explanation: "Em Python usamos print(...)." },
            { type: "choice", title: "Qual é a saída?", code: "print(2 + 3)", options: ["2 + 3", "5", "23"], answer: 1, explanation: "Python calcula 2 + 3 antes de mostrar o resultado." }
          ]
        }
      ]
    },
    {
      id: "variaveis",
      title: "Variáveis e tipos",
      description: "Guarde textos e números para reutilizá-los.",
      lessons: [
        {
          id: "criando-variaveis",
          title: "Criando variáveis",
          steps: [
            { type: "info", title: "Guardando valores", text: "Uma variável associa um nome a um valor. O sinal = faz a atribuição.", code: "nome = \"Igor\"\nidade = 30" },
            { type: "choice", title: "Qual código cria a variável idade com valor 30?", options: ["idade = 30", "idade == 30", "print = idade"], answer: 0, explanation: "Um único = atribui o valor à variável." },
            { type: "choice", title: "Qual é a saída?", code: "nome = \"Ana\"\nprint(nome)", options: ["nome", "Ana", "Erro"], answer: 1, explanation: "print(nome) mostra o valor armazenado em nome." }
          ]
        },
        {
          id: "strings-numeros",
          title: "Textos e números",
          steps: [
            { type: "info", title: "Tipos diferentes", text: "Textos são strings e normalmente ficam entre aspas. Números inteiros podem ser escritos sem aspas.", code: "cidade = \"Rio Preto\"\nquantidade = 5" },
            { type: "choice", title: "Qual opção representa um texto?", options: ["\"500\"", "500", "500.0"], answer: 0, explanation: "As aspas transformam 500 em uma string." },
            { type: "choice", title: "Qual variável contém um número inteiro?", code: "a = \"10\"\nb = 10\nc = 10.5", options: ["a", "b", "c"], answer: 1, explanation: "b contém o inteiro 10, sem aspas e sem parte decimal." }
          ]
        }
      ]
    },
    {
      id: "operadores",
      title: "Operadores",
      description: "Faça cálculos e compare valores.",
      lessons: [
        {
          id: "aritmetica",
          title: "Operações matemáticas",
          steps: [
            { type: "info", title: "Python também calcula", text: "Use + para somar, - para subtrair, * para multiplicar e / para dividir.", code: "total = 10 + 5\npreco = 20 * 2" },
            { type: "choice", title: "Qual é o resultado?", code: "print(8 * 4)", options: ["12", "32", "84"], answer: 1, explanation: "8 multiplicado por 4 é 32." },
            { type: "choice", title: "Qual operador realiza divisão?", options: ["/", "*", "%"], answer: 0, explanation: "/ é o operador de divisão." }
          ]
        },
        {
          id: "comparacoes",
          title: "Comparações",
          steps: [
            { type: "info", title: "Verdadeiro ou falso", text: "Comparações produzem True ou False. Use == para verificar igualdade e != para diferença.", code: "10 == 10  # True\n10 != 5   # True" },
            { type: "choice", title: "Qual expressão verifica se idade é igual a 18?", options: ["idade == 18", "idade = 18", "idade != 18"], answer: 0, explanation: "== compara dois valores; = faz atribuição." },
            { type: "choice", title: "Qual é o resultado?", code: "print(7 > 10)", options: ["True", "False", "7"], answer: 1, explanation: "7 não é maior que 10." }
          ]
        }
      ]
    },
    {
      id: "condicionais",
      title: "Decisões com if",
      description: "Faça o programa escolher o que executar.",
      lessons: [
        {
          id: "if",
          title: "Primeiro if",
          steps: [
            { type: "info", title: "Executar somente quando necessário", text: "if executa um bloco quando a condição é verdadeira. O bloco indentado pertence ao if.", code: "idade = 20\nif idade >= 18:\n    print(\"Adulto\")" },
            { type: "choice", title: "O que falta na linha do if?", code: "if saldo > 0__\n    print(\"Positivo\")", options: [":", ";", ","], answer: 0, explanation: "Uma instrução if termina a condição com dois-pontos." },
            { type: "choice", title: "O que será mostrado?", code: "idade = 16\nif idade >= 18:\n    print(\"Adulto\")", options: ["Adulto", "Nada", "False"], answer: 1, explanation: "A condição é falsa, então o bloco não é executado." }
          ]
        },
        {
          id: "if-else",
          title: "if e else",
          steps: [
            { type: "info", title: "Dois caminhos", text: "else cria um caminho alternativo para quando a condição do if for falsa.", code: "saldo = -5\nif saldo >= 0:\n    print(\"OK\")\nelse:\n    print(\"Negativo\")" },
            { type: "choice", title: "Qual será a saída?", code: "nota = 6\nif nota >= 7:\n    print(\"Aprovado\")\nelse:\n    print(\"Revisar\")", options: ["Aprovado", "Revisar", "Nada"], answer: 1, explanation: "6 não é maior ou igual a 7, então o else é executado." },
            { type: "choice", title: "Qual palavra cria a alternativa ao if?", options: ["else", "then", "other"], answer: 0, explanation: "Python usa else para o caminho alternativo." }
          ]
        }
      ]
    },
    {
      id: "loops",
      title: "Repetições",
      description: "Repita ações com for e while sem copiar código várias vezes.",
      lessons: [
        {
          id: "for",
          title: "Repetindo com for",
          steps: [
            { type: "info", title: "Percorrendo uma sequência", text: "for repete um bloco para cada item de uma sequência. range() é muito usado para gerar números.", code: "for numero in range(3):\n    print(numero)" },
            { type: "choice", title: "Quais valores serão mostrados?", code: "for n in range(3):\n    print(n)", options: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3"], answer: 0, explanation: "range(3) gera 0, 1 e 2." },
            { type: "choice", title: "Qual palavra inicia esse tipo de repetição?", options: ["for", "repeat", "loop"], answer: 0, explanation: "Python usa for para percorrer sequências." }
          ]
        },
        {
          id: "while",
          title: "Repetindo com while",
          steps: [
            { type: "info", title: "Repita enquanto for verdadeiro", text: "while mantém um bloco sendo executado enquanto sua condição permanecer verdadeira.", code: "numero = 0\nwhile numero < 3:\n    print(numero)\n    numero = numero + 1" },
            { type: "choice", title: "Por que numero é aumentado?", options: ["Para a condição eventualmente ficar falsa", "Para criar uma string", "Porque while exige soma"], answer: 0, explanation: "Sem alterar numero, a condição poderia permanecer verdadeira para sempre." },
            { type: "choice", title: "Qual é a última saída?", code: "n = 1\nwhile n <= 3:\n    print(n)\n    n = n + 1", options: ["2", "3", "4"], answer: 1, explanation: "3 ainda atende n <= 3. Depois n vira 4 e o loop termina." }
          ]
        }
      ]
    }
  ]
};
