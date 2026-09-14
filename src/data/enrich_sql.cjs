const fs = require('fs');
const path = './src/data/course-sql.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const lessons = [
  // Stage 1: DADOS SEM ORGANIZAÇÃO
  [
    {
      title: "O Problema dos Dados Desorganizados",
      body: "Quando aplicações armazenam dados em arquivos soltos como planilhas CSV ou textos sem esquema, surgem inconsistências críticas. Sem controle de concorrência, acessos simultâneos corrompem arquivos, dados duplicados ficam desatualizados e consultas simples exigem varreduras manuais exaustivas. Bancos de dados relacionais resolvem esse caos estruturando dados em esquemas rígidos com validações atômicas.",
      tip: "Nunca utilize arquivos de texto ou planilhas como fonte primária para dados concorrentes em produção; falhas de I/O causam perda irreparável.",
      code: "-- Em vez de ler um arquivo CSV linha a linha sem travas:\n-- O banco garante atomicidade e integridade no acesso\nSELECT id, nome, saldo FROM contas_bancarias WHERE id = 1042;"
    },
    {
      title: "O Modelo Relacional",
      body: "Proposto por Edgar F. Codd em 1970, o modelo relacional fundamenta-se na teoria dos conjuntos e na lógica de predicados. A informação é modelada em relações bidimensionais (tabelas compostas de tuplas e atributos). Essa abstração separa a representação lógica da forma física de armazenamento em disco, permitindo que a engine do banco otimize caminhos de execução sem alterar como o desenvolvedor consulta os dados.",
      tip: "Pense nas tabelas como conjuntos matemáticos de entidades únicas; cada linha deve ser identificável sem ambiguidades.",
      code: "-- Relação entre clientes e compras via identificadores relacionais\nSELECT clientes.nome, pedidos.valor_total\nFROM clientes\nINNER JOIN pedidos ON pedidos.cliente_id = clientes.id\nWHERE pedidos.status = 'pago';"
    }
  ],

  // Stage 2: TABELAS, LINHAS E COLUNAS
  [
    {
      title: "Tabelas e a Estrutura de Dados",
      body: "Uma tabela relacional é uma entidade estruturada composta por um cabeçalho fixo com nomes e tipos de colunas e um corpo de registros mutáveis. Cada coluna define um domínio restrito de valores aceitos, como inteiros, textos com limites ou timestamps. Essa padronização impede que valores incongruentes entrem no sistema, garantindo previsibilidade de memória e consistência algorítmica para consultas analíticas.",
      tip: "Defina sempre tipos de dados estritos no momento de projetar a tabela para economizar espaço em disco e acelerar a indexação.",
      code: "-- Estrutura formal com domínios de tipos restritos\nCREATE TABLE usuarios (\n  id INT,\n  nome VARCHAR(100),\n  email VARCHAR(150),\n  ativo BOOLEAN\n);"
    },
    {
      title: "Colunas e Linhas (Registros)",
      body: "Em terminologia relacional formal, uma linha representa uma tupla — uma instância atômica do objeto no mundo real — enquanto cada coluna representa um atributo atômico desse objeto. Nenhuma linha deve depender da ordem física de armazenamento no disco para ter significado semântico. A recuperação de dados é declarativa: o desenvolvedor informa o que deseja recuperar, e o SGBD decide como escanear as páginas de dados.",
      tip: "Evite guardar múltiplos valores separados por vírgula em uma única coluna; isso quebra a primeira forma normal e anula a indexação.",
      code: "-- Cada linha representa uma tupla atômica completa\nINSERT INTO usuarios (id, nome, email, ativo)\nVALUES (1, 'Ana Silva', 'ana@empresa.com', true);\n\n-- Busca determinística por atributos da tupla\nSELECT nome FROM usuarios WHERE id = 1;"
    }
  ],

  // Stage 3: POR QUE USAR UM SGBD
  [
    {
      title: "O Papel do SGBD",
      body: "O Sistema de Gerenciamento de Banco de Dados (SGBD) é o software intermediário responsável por abstrair operações de disco, garantir segurança de acesso, gerenciar memória compartilhada e coordenar transações concorrentes. Sem ele, cada desenvolvedor precisaria reescrever mecanismos de lock, journal de recuperação contra quedas de energia (WAL) e otimizadores de árvore de busca para cada software.",
      tip: "Confie a durabilidade ao motor do SGBD; gravar dados diretamente em arquivos pelo backend expõe seu app a race conditions.",
      code: "-- O SGBD gerencia locks de concorrência e buffer pool em segundo plano\nBEGIN;\nUPDATE contas SET saldo = saldo - 100 WHERE id = 1;\nUPDATE contas SET saldo = saldo + 100 WHERE id = 2;\nCOMMIT; -- Salva com segurança usando Write-Ahead Logging"
    },
    {
      title: "Vantagens na Prática e Propriedades ACID",
      body: "Os SGBDs relacionais modernos garantem as propriedades ACID: Atomicidade (tudo ou nada), Consistência (regras e constraints respeitadas), Isolamento (transações simultâneas não interferem umas nas outras) e Durabilidade (dados confirmados sobrevivem a desligamentos repentinos). Esses pilares tornam os bancos relacionais a escolha definitiva para sistemas financeiros, e-commerces e cadastros críticos.",
      tip: "Use transações sempre que duas ou mais operações de escrita dependerem uma da outra para manter o estado do sistema válido.",
      code: "-- Se o segundo comando falhar por erro de rede ou constraint, nada é persistido\nBEGIN TRANSACTION;\nINSERT INTO pedidos (id, cliente_id, total) VALUES (55, 12, 350.00);\nINSERT INTO auditoria_log (evento) VALUES ('Pedido 55 criado');\nCOMMIT;"
    }
  ],

  // Stage 4: ENTIDADES E ATRIBUTOS
  [
    {
      title: "Mapeando Entidades",
      body: "Na modelagem conceitual, uma entidade é qualquer objeto do mundo real sobre o qual a aplicação precisa guardar informações históricas ou transacionais. Identificar entidades exige entender os substantivos essenciais do domínio de negócio: Cliente, Produto, Pedido ou Nota Fiscal. Uma modelagem falha que mistura conceitos em uma única entidade resulta em acoplamento destrutivo e anomalias de atualização.",
      tip: "Ao conversar com especialistas de negócio, destaque os substantivos principais; quase sempre eles se transformarão em entidades do banco.",
      code: "-- Entidades independentes bem delimitadas no esquema relacional\nCREATE TABLE clientes (\n  id INT PRIMARY KEY,\n  razao_social VARCHAR(150)\n);\n\nCREATE TABLE faturas (\n  id INT PRIMARY KEY,\n  cliente_id INT,\n  valor DECIMAL(10,2)\n);"
    },
    {
      title: "Definindo Atributos",
      body: "Atributos são as propriedades quantitativas ou qualitativas que descrevem as características da entidade. Ao modelar atributos, devemos analisar a atomicidade da informação: um campo de nome completo pode dificultar buscas por sobrenome, assim como um endereço em campo único impede filtros confiáveis por estado ou CEP. Dividir atributos na granularidade correta facilita indexações futuras.",
      tip: "Divida campos compostos (como endereço ou nome completo) em atributos específicos se o sistema precisar filtrar ou ordenar por eles.",
      code: "-- Atributos atômicos e granulares permitem buscas precisas por índice\nCREATE TABLE enderecos (\n  id INT PRIMARY KEY,\n  logradouro VARCHAR(120),\n  numero VARCHAR(20),\n  bairro VARCHAR(80),\n  cidade VARCHAR(80),\n  estado CHAR(2),\n  cep CHAR(8)\n);"
    }
  ],

  // Stage 5: CHAVE PRIMÁRIA
  [
    {
      title: "Identificação Única com Primary Key",
      body: "A chave primária (Primary Key ou PK) é uma restrição que garante que cada registro em uma tabela seja único e não nulo. O SGBD cria automaticamente um índice estruturado em árvore B+ sobre a chave primária, permitindo que buscas pelo identificador tenham complexidade de tempo de execução O(log N). Sem ela, atualizar ou deletar um registro específico sem afetar outros se torna uma tarefa perigosa.",
      tip: "Toda tabela sem exceção deve possuir uma chave primária explicitamente declarada para viabilizar replicação e integridade relacional.",
      code: "-- Definindo chave primária inteira autoincrementada\nCREATE TABLE produtos (\n  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  sku VARCHAR(50) NOT NULL UNIQUE,\n  titulo VARCHAR(200) NOT NULL\n);"
    },
    {
      title: "Chaves Naturais vs Chaves Artificiais (Surrogate)",
      body: "Uma chave natural usa um dado real do negócio como identificador primário (como CPF ou CNPJ), enquanto uma surrogate key usa um identificador artificial gerado pelo sistema (como um número sequencial ou UUID). Chaves naturais são arriscadas porque regras de negócio mudam e dados do mundo real podem sofrer correções cadastrais. Chaves substitutas mantêm a estabilidade das relações mesmo se os atributos externos mudarem.",
      tip: "Prefira UUIDs (v7 ou v4) ou BigInt sequencial como chave primária, deixando CPFs ou códigos comerciais apenas como colunas com UNIQUE.",
      code: "-- Surrogate key imutável + Unique constraint no dado do negócio\nCREATE TABLE fornecedores (\n  id BIGINT PRIMARY KEY,          -- Chave surrogate imutável\n  cnpj CHAR(14) NOT NULL UNIQUE,  -- Chave natural para busca\n  nome_fantasia VARCHAR(120)\n);"
    }
  ],

  // Stage 6: TIPOS DE DADOS COMUNS
  [
    {
      title: "Textos e Números no SQL",
      body: "A escolha precisa dos tipos de dados afeta diretamente o consumo de I/O em disco, memória RAM do buffer pool e velocidade de busca. O tipo CHAR(N) possui tamanho fixo preenchido com espaços, enquanto VARCHAR(N) armazena apenas os bytes reais mais o cabeçalho de comprimento. Para números inteiros, SMALLINT (2 bytes), INT (4 bytes) e BIGINT (8 bytes) devem ser selecionados com base no teto de escala do negócio.",
      tip: "Use VARCHAR em vez de TEXT irrestrito quando houver um limite lógico claro para evitar inserções de payloads maliciosos gigantescos.",
      code: "-- Tipos numéricos e textuais alinhados com o tamanho dos dados reais\nCREATE TABLE catalogo (\n  codigo_departamento SMALLINT, -- Aceita de -32768 a 32767\n  identificador BIGINT,         -- Aceita quintilhões de linhas\n  sigla CHAR(3),                -- Tamanho fixo perfeito para siglas como 'BR'\n  descricao VARCHAR(255)        -- Tamanho variável até 255 caracteres\n);"
    },
    {
      title: "Datas, Booleanos e Precisão Monetária",
      body: "Representar dinheiro com tipos decimais de ponto flutuante como FLOAT ou REAL gera erros cumulativos de arredondamento causados pela representação binária fracionária IEEE 754. Sistemas corporativos exigem o tipo DECIMAL/NUMERIC para cálculo monetário com precisão exata. Para datas, TIMESTAMP WITH TIME ZONE (TIMESTAMPTZ) é o padrão da indústria para evitar ambiguidades com fusos horários e horário de verão.",
      tip: "Nunca utilize FLOAT ou DOUBLE para valores monetários; use DECIMAL(15,2) ou guarde o valor em centavos como BIGINT.",
      code: "-- Boas práticas para valores monetários e instantes no tempo\nCREATE TABLE transacoes (\n  id INT PRIMARY KEY,\n  valor DECIMAL(12, 2) NOT NULL, -- Precisão exata de centavos\n  estornada BOOLEAN DEFAULT FALSE,\n  criada_em TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP\n);"
    }
  ],

  // Stage 7: CHAVE ESTRANGEIRA
  [
    {
      title: "Conectando Tabelas com Foreign Key",
      body: "A chave estrangeira (Foreign Key ou FK) é uma restrição de integridade referencial que vincula uma coluna de uma tabela filha à chave primária de uma tabela pai. Essa relação física no esquema impede que sejam criados 'registros órfãos', como vendas apontando para clientes inexistentes. O SGBD recusa transações que tentem violar esse vínculo, garantindo que o grafo relacional permaneça sempre coerente.",
      tip: "Crie sempre índices nas colunas que atuam como chave estrangeira; isso evita scans completos em joins e validações de integridade.",
      code: "-- A chave estrangeira impede a inserção de pedidos para clientes fantasmas\nCREATE TABLE pedidos (\n  id INT PRIMARY KEY,\n  cliente_id INT NOT NULL,\n  data_pedido DATE NOT NULL,\n  CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)\n);"
    },
    {
      title: "Integridade Referencial e Ações em Cascata",
      body: "Ao deletar ou atualizar um registro em uma tabela pai, o SGBD precisa saber o que fazer com as linhas dependentes. As cláusulas ON DELETE e ON UPDATE definem esse comportamento: RESTRICT bloqueia a exclusão se houver dependentes; CASCADE propaga a exclusão para todas as linhas filhas; e SET NULL define o campo referenciado como nulo. O uso inadequado de CASCADE pode apagar históricos inteiros acidentalmente.",
      tip: "Evite ON DELETE CASCADE em tabelas de auditoria ou contábeis; utilize exclusão lógica (soft delete) ou bloqueie com ON DELETE RESTRICT.",
      code: "-- Exclusão controlada com bloqueio protetivo por padrão\nCREATE TABLE itens_pedido (\n  id INT PRIMARY KEY,\n  pedido_id INT,\n  produto_id INT,\n  CONSTRAINT fk_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,\n  CONSTRAINT fk_prod FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT\n);"
    }
  ],

  // Stage 8: RELAÇÃO UM-PARA-MUITOS
  [
    {
      title: "O Relacionamento Mais Comum (1:N)",
      body: "A relação de um-para-muitos (1:N) é a espinha dorsal de quase todos os sistemas transacionais. Ela ocorre quando uma entidade pode estar associada a várias instâncias de outra entidade, mas cada instância dessa segunda entidade pertence a apenas uma da primeira. O lado 'muitos' sempre armazena a chave estrangeira referenciando a chave primária do lado 'um', espelhando a dependência natural do mundo real.",
      tip: "Identifique quem possui quem: a chave estrangeira sempre fica na tabela dependente (lado 'N'), nunca no lado '1'.",
      code: "-- 1 Departamento possui N Funcionários\nCREATE TABLE departamentos (\n  id INT PRIMARY KEY,\n  nome VARCHAR(60)\n);\n\nCREATE TABLE funcionarios (\n  id INT PRIMARY KEY,\n  departamento_id INT REFERENCES departamentos(id),\n  nome VARCHAR(100)\n);"
    },
    {
      title: "Implementação na Prática e Consultas",
      body: "Para navegar em uma relação 1:N, o motor do banco consulta o índice da chave estrangeira na tabela de destino. Por exemplo, ao buscar todos os comentários de uma publicação, o índice por `publicacao_id` localiza instantaneamente o lote de registros sem ler a tabela inteira. Se a cardinalidade for alta (milhões de registros no lado N), a modelagem deve incluir paginação eficiente para manter a latência baixa.",
      tip: "Lembre-se de adicionar paginação com LIMIT/OFFSET ao consultar o lado 'muitos' para não sobrecarregar a memória da aplicação.",
      code: "-- Consulta eficiente de 1:N utilizando índice na FK\nSELECT f.nome, d.nome AS setor\nFROM funcionarios f\nINNER JOIN departamentos d ON d.id = f.departamento_id\nWHERE d.id = 10\nORDER BY f.nome ASC;"
    }
  ],

  // Stage 9: RELAÇÃO MUITOS-PARA-MUITOS
  [
    {
      title: "Quando Tudo se Conecta (N:N)",
      body: "Uma relação muitos-para-muitos (N:N) surge quando instâncias de ambas as entidades podem se associar a múltiplas instâncias da outra. Um aluno cursa várias disciplinas, e cada disciplina tem vários alunos. Bancos relacionais não permitem associar listas diretamente em colunas sem ferir as formas normais. A solução universal para resolver esse problema consiste em decompor a relação N:N em duas relações 1:N.",
      tip: "Nunca crie colunas de arrays ou strings separadas por vírgula para simular N:N; utilize sempre uma tabela associativa.",
      code: "-- Decomposição de Estudantes e Cursos em N:N\nCREATE TABLE estudantes ( id INT PRIMARY KEY, nome VARCHAR(100) );\nCREATE TABLE cursos ( id INT PRIMARY KEY, titulo VARCHAR(100) );"
    },
    {
      title: "A Tabela Associativa (Pivot ou Junção)",
      body: "A tabela de junção (ou associativa) atua como ponte contendo pelo menos duas chaves estrangeiras, cada uma referenciando uma das tabelas originais. A combinação das duas FKs geralmente forma uma chave primária composta, impedindo associações duplicadas. Além das chaves, essa tabela é o local ideal para armazenar atributos da própria associação, como a data da matrícula, notas ou status de conclusão.",
      tip: "Use uma chave primária composta (PK com ambas as FKs) para impedir que o mesmo par seja associado duas vezes acidentalmente.",
      code: "-- Tabela associativa com chave primária composta e atributo próprio\nCREATE TABLE matriculas (\n  estudante_id INT REFERENCES estudantes(id),\n  curso_id INT REFERENCES cursos(id),\n  data_matricula DATE DEFAULT CURRENT_DATE,\n  PRIMARY KEY (estudante_id, curso_id) -- Garante associação única\n);"
    }
  ],

  // Stage 10: CREATE TABLE
  [
    {
      title: "Nasce uma Tabela: Sintaxe e DDL",
      body: "O comando CREATE TABLE faz parte do Data Definition Language (DDL) do SQL. Ele instrui o SGBD a alocar metadados no catálogo do sistema, reservar identificadores de página em disco e preparar as estruturas internas para receber dados. Cada definição requer o nome da coluna, seu tipo de dado e eventuais qualificadores de nulidade, formando o contrato rígido com o qual o sistema operará.",
      tip: "Escreva comandos DDL em scripts de migração versionados no Git (como flyway ou prisma) em vez de criá-los manualmente em ferramentas visuais.",
      code: "-- Definição estruturada formal com boas práticas DDL\nCREATE TABLE produtos (\n  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  sku VARCHAR(30) NOT NULL,\n  preco DECIMAL(10,2) NOT NULL,\n  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);"
    },
    {
      title: "O Cuidado com a Estrutura e Modificações",
      body: "Projetar tabelas requer visão de longo prazo. Adicionar colunas com valores default ou alterar tipos de colunas em tabelas de grande porte (milhões de linhas) pode gerar locks de exclusão de tabela inteira (Access Exclusive Lock), travando o sistema em produção. Por isso, a escolha correta dos nomes, tipos e limites no momento do CREATE inicial economiza migrações dolorosas e arriscadas no futuro.",
      tip: "Em Postgres, ao adicionar uma nova coluna com DEFAULT em tabelas enormes, use versões modernas (PG 11+) onde essa operação não reescreve a tabela.",
      code: "-- Criando tabela com verificações preventivas\nCREATE TABLE IF NOT EXISTS categorias (\n  id SMALLINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  nome VARCHAR(50) NOT NULL UNIQUE,\n  ativo BOOLEAN NOT NULL DEFAULT true\n);"
    }
  ],

  // Stage 11: TIPOS DE COLUNA
  [
    {
      title: "Tipos Otimizados para Performance",
      body: "Escolher o menor tipo numérico que atenda com folga à regra de negócio reduz o volume de páginas de disco lidas em cada consulta e otimiza o uso do cache de memória RAM. Por exemplo, usar SMALLINT (2 bytes) para status em vez de BIGINT (8 bytes) economiza centenas de megabytes em tabelas com dezenas de milhões de registros. Essa economia reflete em menor latência nas leituras analíticas e em índices mais compactos.",
      tip: "Analise o limite de crescimento de cada campo: se um código nunca passará de 30 mil, SMALLINT é muito mais eficiente que INT ou BIGINT.",
      code: "-- Tabela otimizada com consumo mínimo de bytes por linha\nCREATE TABLE logs_acesso (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Suporta bilhões de logs\n  codigo_status SMALLINT NOT NULL,                    -- Status HTTP (ex: 200, 404)\n  ip_origem VARCHAR(45) NOT NULL                     -- Suporta IPv4 e IPv6\n);"
    },
    {
      title: "Lidando com Dinheiro e Precisão Numérica",
      body: "O tipo DECIMAL(M, D) (ou NUMERIC) recebe dois parâmetros: a precisão total M (número total de dígitos) e a escala D (quantidade de casas após a vírgula). Para transações financeiras, DECIMAL(12, 2) comporta valores até 9.999.999.999,99 com exatidão decimal estrita. Qualquer tentativa de cálculo com ponto flutuante binário (FLOAT) acumula resíduos como 0.0000000000000002, inaceitáveis em auditorias contábeis.",
      tip: "Para criptomoedas ou moedas de alta volatilidade com frações microscópicas, use DECIMAL(18, 8) para não perder satoshis por arredondamento.",
      code: "-- Precisão exata obrigatória para controle fiscal e financeiro\nCREATE TABLE saldos_carteira (\n  usuario_id INT PRIMARY KEY,\n  saldo_brl DECIMAL(14, 2) NOT NULL DEFAULT 0.00,  -- Moeda fiat padrão\n  saldo_btc DECIMAL(18, 8) NOT NULL DEFAULT 0.00000000 -- Precisão de cripto\n);"
    }
  ],

  // Stage 12: RESTRIÇÕES DE TABELA
  [
    {
      title: "Mantendo a Qualidade com Constraints",
      body: "As restrições de integridade (Constraints) são sentinelas do banco que validam os dados na porta de entrada da persistência. As principais são NOT NULL (rejeita ausência de valor), UNIQUE (assegura que nenhuma duplicação ocorra na coluna) e FOREIGN KEY (mantém coerência relacional). Delegar a validação de regras de integridade estrutural unicamente ao backend expõe o banco a falhas se outro script ou serviço inserir dados.",
      tip: "Defina constraints no próprio esquema do banco; nunca confie exclusivamente que o frontend ou o backend farão todas as validações.",
      code: "-- Proteção em nível de banco com múltiplas restrições integradas\nCREATE TABLE contas (\n  id INT PRIMARY KEY,\n  numero_conta VARCHAR(20) NOT NULL UNIQUE,\n  saldo DECIMAL(12, 2) NOT NULL DEFAULT 0.00\n);"
    },
    {
      title: "A Regra CHECK e Valores DEFAULT",
      body: "A constraint CHECK permite registrar expressões lógicas que devem retornar verdadeiro para cada linha inserida ou atualizada. Se a condição for violada (por exemplo, um preço menor que zero ou uma data de nascimento no futuro), a transação é abortada com erro. Já o DEFAULT preenche valores automáticos na ausência de especificação no comando INSERT, como timestamps de auditoria e flags de status inicial.",
      tip: "Use CHECK constraints para validar regras de negócio estáticas (ex: descontos entre 0 e 100) para blindar seu banco contra bugs de aplicação.",
      code: "-- Validação condicional em nível de linha via CHECK\nCREATE TABLE contratos (\n  id INT PRIMARY KEY,\n  valor DECIMAL(10, 2) NOT NULL CHECK (valor > 0),\n  percentual_desconto INT DEFAULT 0 CHECK (percentual_desconto BETWEEN 0 AND 100),\n  status VARCHAR(20) DEFAULT 'rascunho'\n);"
    }
  ],

  // Stage 13: INSERT INTO
  [
    {
      title: "Inserindo Registros no Banco (DML)",
      body: "O comando INSERT INTO faz parte do Data Manipulation Language (DML) e é responsável por criar novas tuplas em uma relação existente. É altamente recomendável declarar explicitamente os nomes das colunas de destino. Omitir as colunas e depender da ordem física é um antipadrão perigoso: se o esquema da tabela for alterado com a adição ou reordenação de campos, comandos sem lista explícita quebrarão em produção.",
      tip: "Sempre liste as colunas explicitamente: `INSERT INTO tab (col1, col2) VALUES (...)`. Isso protege o código contra mudanças no esquema.",
      code: "-- Inserção explícita segura contra alterações futuras no esquema\nINSERT INTO usuarios (nome, email, ativo)\nVALUES ('Mariana Costa', 'mariana@tech.com', true);"
    },
    {
      title: "Inserções Múltiplas e Eficiência de Lote",
      body: "Executar dezenas de milhares de comandos INSERT unitários em loops no backend gera um gargalo severo de latência de rede (round-trips) e overhead de transações individuais. O SQL suporta a inserção em lote (batch insert), passando múltiplas tuplas separadas por vírgula em uma única requisição. O SGBD executa o lote dentro de um único bloco transacional, reduzindo o tempo de gravação de minutos para milissegundos.",
      tip: "Em cargas massivas de dados, agrupe inserções em lotes de 500 a 1000 registros para maximizar a taxa de transferência de I/O.",
      code: "-- Inserção múltipla em lote executada em um único comando atômico\nINSERT INTO categorias (nome, ativo) VALUES\n  ('Eletrônicos', true),\n  ('Livros', true),\n  ('Vestuário', false);"
    }
  ],

  // Stage 14: SELECT BÁSICO
  [
    {
      title: "O Poder da Consulta Declarativa",
      body: "A instrução SELECT é o núcleo do SQL e exemplifica o paradigma declarativo: em vez de programar laços imperativos percorrendo matrizes na memória, o desenvolvedor apenas descreve quais atributos e relações deseja ver. O Query Planner interno do SGBD analisa estatísticas das tabelas, decide quais índices consultar e computa a projeção e os filtros pelo caminho computacional mais barato.",
      tip: "Evite utilizar `SELECT *` em sistemas de produção; projete apenas as colunas necessárias para reduzir consumo de memória e rede.",
      code: "-- Projeção explícita de colunas necessárias em vez de asterisco\nSELECT id, nome, preco \nFROM produtos\nWHERE ativo = true;"
    },
    {
      title: "Criando Apelidos com ALIAS (AS)",
      body: "A cláusula AS permite renomear colunas ou tabelas no contexto da consulta gerada. Essa técnica é indispensável para criar nomes amigáveis para campos calculados, evitar colisões de identificadores em junções entre tabelas que possuem colunas com o mesmo nome (como `id` ou `nome`) e simplificar a legibilidade de expressões matemáticas ou funções de agregação no retorno final.",
      tip: "Dê nomes claros para expressões calculadas com ALIAS; isso simplifica a desserialização do JSON ou objeto no backend.",
      code: "-- Apelidos para melhorar legibilidade e desambiguar retornos\nSELECT \n  nome AS nome_produto,\n  preco AS preco_tabela,\n  preco * 0.90 AS preco_com_desconto\nFROM produtos;"
    }
  ],

  // Stage 15: CLÁUSULA WHERE
  [
    {
      title: "Filtrando os Resultados na Fonte",
      body: "A cláusula WHERE aplica predicados booleanos de filtragem linha a linha antes que os dados sejam agrupados ou retornados para a aplicação. Trazer todo o banco para a memória do servidor da aplicação para filtrar no código é um erro grave de arquitetura que satura a banda de rede e esgota a memória RAM. Filtrar no SGBD permite que o motor aproveite índices criados especificamente para essa condição.",
      tip: "Sempre faça filtros restritivos no WHERE do banco; trafegar registros desnecessários para a aplicação é o principal vilão de lentidão.",
      code: "-- Filtro preciso executado no motor do banco via índice\nSELECT id, descricao, estoque\nFROM produtos\nWHERE preco >= 100.00 AND estoque > 0;"
    },
    {
      title: "Buscas Textuais com LIKE e ILIKE",
      body: "O operador LIKE avalia padrões textuais utilizando caracteres curinga: `%` substitui qualquer sequência de zero ou mais caracteres, enquanto `_` substitui exatamente um caractere. No PostgreSQL, o operador ILIKE realiza buscas sem distinção de maiúsculas e minúsculas (case-insensitive). Buscas que iniciam com `%termo` não conseguem aproveitar índices B-Tree padrão, exigindo índices especiais como GIN/GiST com trigramas.",
      tip: "Evite filtros no formato `LIKE '%termo%'` em tabelas gigantes sem índices de trigrama, pois causam varredura completa da tabela (Full Table Scan).",
      code: "-- Busca por sufixo ou trecho de texto\nSELECT id, nome, email \nFROM clientes \nWHERE email LIKE '%@gmail.com'\n  AND nome ILIKE 'carlos%';"
    }
  ],

  // Stage 16: ORDER BY
  [
    {
      title: "Organizando a Saída de Dados",
      body: "No modelo relacional, conjuntos de dados retornados por um SELECT não possuem nenhuma ordem garantida a menos que a cláusula ORDER BY seja explicitamente declarada. Supor que o banco retornará registros na ordem de inserção física no disco é uma armadilha comum: migrações de páginas, atualizações de linhas (MVCC) ou consultas em paralelo alteram a ordem natural de recuperação física a qualquer momento.",
      tip: "Se sua aplicação depende da ordem dos dados para exibir listagens ou relatórios, sempre declare o ORDER BY de forma explícita.",
      code: "-- Ordem determinística garantida pelo SGBD\nSELECT id, nome, valor \nFROM faturas \nORDER BY valor DESC;"
    },
    {
      title: "Ordenação Múltipla: ASC e DESC",
      body: "O SQL permite encadear múltiplos critérios de ordenação separados por vírgula. O SGBD avalia as expressões da esquerda para a direita: se houver empate de valores no primeiro critério, ele recorre ao segundo atributo para desempatar, e assim por diante. Cada critério pode receber modificadores independentes como ASC (ascendente, padrão) ou DESC (descendente), além de instruções para tratamento de valores nulos (NULLS FIRST/LAST).",
      tip: "Em paginações de interface, inclua sempre a chave primária como último critério de desempate no ORDER BY para evitar inconsistências visuais.",
      code: "-- Critérios encadeados com controle de desempate e tratamento de nulos\nSELECT departamento, salario, nome\nFROM colaboradores\nORDER BY \n  departamento ASC, \n  salario DESC, \n  id ASC;"
    }
  ],

  // Stage 17: LIMIT
  [
    {
      title: "Restringindo a Quantidade de Resultados",
      body: "A cláusula LIMIT restringe o número máximo de tuplas transferidas pelo banco de dados para a aplicação. Ela é crucial para prevenir estouros de memória e tráfego massivo acidental em tabelas que contêm milhões de linhas. Em junção com o ORDER BY, o LIMIT transforma uma consulta exaustiva em uma busca top-N altamente otimizada, permitindo que o SGBD interrompa a varredura assim que a cota for preenchida.",
      tip: "Sempre combine LIMIT com ORDER BY; executar LIMIT sem ordenação retorna um conjunto imprevisível de registros.",
      code: "-- Obtendo os 5 produtos mais caros de forma determinística\nSELECT nome, preco \nFROM produtos \nORDER BY preco DESC \nLIMIT 5;"
    },
    {
      title: "Paginação com OFFSET e Seus Gargalos",
      body: "A combinação clássica `LIMIT N OFFSET M` pula os primeiros M registros para entregar a página desejada. No entanto, em valores altos de OFFSET (como páginas avançadas), o banco precisa ler e descartar todos os M registros anteriores na memória antes de retornar os N solicitados. Para tabelas de alta escala, a alternativa de alta performance é a paginação por cursor (keyset pagination), filtrando diretamente pelo último ID visto.",
      tip: "Para grandes volumes, substitua `OFFSET 10000` por `WHERE id > ultimo_id_da_pagina LIMIT 20`; a resposta será instantânea usando o índice.",
      code: "-- Paginação clássica (simples, mas lenta para páginas altas)\nSELECT id, titulo FROM artigos ORDER BY id ASC LIMIT 10 OFFSET 20;\n\n-- Paginação por cursor (escalável e constante em O(1))\nSELECT id, titulo FROM artigos WHERE id > 540 ORDER BY id ASC LIMIT 10;"
    }
  ],

  // Stage 18: AND, OR E IN
  [
    {
      title: "Condições Múltiplas e Precedência Lógica",
      body: "Na álgebra booleana aplicada ao SQL, o operador AND exige que ambas as expressões sejam verdadeiras, enquanto o OR requer apenas uma. Um detalhe crítico é a precedência de operadores: na ausência de parênteses, o AND é avaliado antes do OR pelo compilador do SQL. Não usar parênteses explicitamente para agrupar regras condicionais mistas é uma das principais fontes de bugs silenciosos em filtros de relatórios.",
      tip: "Sempre envolva blocos com OR em parênteses ao combiná-los com AND: `WHERE status = 'A' AND (tipo = 1 OR tipo = 2)`.",
      code: "-- Uso correto de parênteses para ditar a precedência dos filtros\nSELECT id, cliente, valor, status\nFROM pedidos\nWHERE status = 'pendente' \n  AND (valor > 1000 OR cliente_vip = true);"
    },
    {
      title: "Listas de Valores com o Operador IN",
      body: "O operador IN testa se o valor de uma coluna pertence a uma lista finita de opções literais ou ao resultado produzido por uma subquery. Ele funciona como uma simplificação semântica de múltiplos predicados OR encadeados (`col = A OR col = B OR col = C`). Além de tornar o código mais limpo e legível, o SGBD consegue otimizar cláusulas IN convertendo-as internamente em lookups eficientes via índice hash ou B-Tree.",
      tip: "Substitua cadeias longas de `x = 1 OR x = 2 OR x = 3` por `x IN (1, 2, 3)` para simplificar o plano de execução e o código.",
      code: "-- Filtro compacto com IN contra lista fixa de identificadores\nSELECT id, nome, uf \nFROM clientes \nWHERE uf IN ('SP', 'RJ', 'MG', 'PR')\n  AND categoria_id IN (1, 3, 5);"
    }
  ],

  // Stage 19: INNER JOIN
  [
    {
      title: "Juntando Tabelas com INNER JOIN",
      body: "O INNER JOIN é a operação relacional fundamental que cruza registros de duas tabelas com base em uma condição de igualdade (geralmente entre uma Foreign Key e uma Primary Key). O resultado inclui exclusivamente as linhas que satisfazem o predicado ON em ambos os lados. Se houver clientes sem pedidos ou pedidos sem cliente vinculado, essas linhas são omitidas do conjunto retornado.",
      tip: "Sempre declare a condição de cruzamento na cláusula ON; nunca cruze tabelas na cláusula WHERE com vírgulas (padrão antigo e propenso a erros).",
      code: "-- Cruzamento estrito de dados relacionados\nSELECT \n  pedidos.id AS pedido_id,\n  pedidos.data_compra,\n  clientes.nome AS cliente_nome\nFROM pedidos\nINNER JOIN clientes ON clientes.id = pedidos.cliente_id;"
    },
    {
      title: "Múltiplos JOINs e Algoritmos Internos",
      body: "Consultas corporativas frequentemente cruzam várias tabelas no mesmo SELECT. O otimizador de consultas do SGBD seleciona internamente o melhor algoritmo para cada junção: Nested Loop (ideal para tabelas pequenas indexadas), Hash Join (para grandes volumes não indexados) ou Merge Join (quando ambos os lados já estão ordenados). Manter as chaves estrangeiras indexadas é o segredo para garantir que o otimizador escolha planos rápidos.",
      tip: "Use apelidos curtos para as tabelas (ex: `p` para pedidos, `c` para clientes) para manter consultas complexas com vários joins legíveis.",
      code: "-- Encadeamento de múltiplos joins para compor a visão do pedido\nSELECT \n  p.id AS pedido_id,\n  c.nome AS cliente,\n  pr.descricao AS produto,\n  ip.quantidade\nFROM pedidos p\nINNER JOIN clientes c ON c.id = p.cliente_id\nINNER JOIN itens_pedido ip ON ip.pedido_id = p.id\nINNER JOIN produtos pr ON pr.id = ip.produto_id;"
    }
  ],

  // Stage 20: LEFT JOIN
  [
    {
      title: "Mantendo os Dados com LEFT JOIN",
      body: "O LEFT JOIN (ou LEFT OUTER JOIN) preserva todas as linhas da tabela situada à esquerda da declaração, independentemente de haver correspondência na tabela da direita. Quando um registro do lado esquerdo não encontra par no lado direito, as colunas da tabela da direita são preenchidas com valores NULL no resultado final. Ele é indispensável para gerar listagens completas que não podem ocultar itens vazios.",
      tip: "Use LEFT JOIN quando precisar listar todos os registros de uma entidade principal, mesmo que ela ainda não tenha histórico associado.",
      code: "-- Todos os clientes aparecem, mesmo aqueles que nunca compraram nada\nSELECT \n  c.id, \n  c.nome, \n  p.id AS pedido_id\nFROM clientes c\nLEFT JOIN pedidos p ON p.cliente_id = c.id;"
    },
    {
      title: "Descobrindo Ausências com LEFT JOIN e IS NULL",
      body: "Uma das aplicações mais poderosas do LEFT JOIN é identificar registros que NÃO possuem vínculo com outra tabela (operação conhecida como anti-join). Ao solicitar todas as linhas da tabela esquerda e adicionar o filtro `WHERE direita.id IS NULL`, o SGBD isola exatamente os itens sem nenhuma correspondência. Esse padrão é amplamente utilizado em campanhas de marketing, limpezas cadastrais e reconciliações financeiras.",
      tip: "Para encontrar registros órfãos ou inativos (ex: usuários sem login), faça `LEFT JOIN ... WHERE foreign_key IS NULL`.",
      code: "-- Localiza todos os clientes inativos que nunca realizaram nenhum pedido\nSELECT \n  c.id,\n  c.nome,\n  c.email\nFROM clientes c\nLEFT JOIN pedidos p ON p.cliente_id = c.id\nWHERE p.id IS NULL;"
    }
  ],

  // Stage 21: PROJETO: LOJA SIMPLES
  [
    {
      title: "Consolidando a Modelagem da Loja",
      body: "No projeto prático de uma loja, integramos os fundamentos relacionais em um esquema coeso: clientes, categorias, produtos, pedidos e itens de pedidos. A correta separação de responsabilidades e o uso de chaves estrangeiras com constraints evitam anomalias graves de dados, como vender itens de produtos deletados ou aplicar preços desatualizados retroativamente sobre compras passadas já concluídas.",
      tip: "Ao modelar itens de pedido, guarde sempre o preço unitário praticado no momento da venda; nunca confie no preço atual da tabela de produtos.",
      code: "-- Esquema robusto de vendas com congelamento de preço histórico\nCREATE TABLE pedido_itens (\n  pedido_id INT REFERENCES pedidos(id),\n  produto_id INT REFERENCES produtos(id),\n  quantidade INT NOT NULL CHECK (quantidade > 0),\n  preco_unitario DECIMAL(10,2) NOT NULL, -- Preço congelado no momento da compra\n  PRIMARY KEY (pedido_id, produto_id)\n);"
    },
    {
      title: "Integridade de Dados e Transações de Venda",
      body: "A criação de um pedido exige atomicidade estrita: registrar o cabeçalho da venda, inserir os itens individuais e dar baixa nas quantidades em estoque. Se qualquer uma dessas três operações falhar (por exemplo, falta de saldo ou concorrência esgotando o produto), a transação inteira deve sofrer ROLLBACK para evitar inconsistências contábeis e físicas no armazém da empresa.",
      tip: "Toda operação de checkout deve ser envolvida em um bloco `BEGIN ... COMMIT` para blindar o sistema contra inconsistências parciais.",
      code: "-- Fluxo transacional atômico de checkout\nBEGIN;\nINSERT INTO pedidos (id, cliente_id, total) VALUES (101, 4, 189.90);\nINSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario)\n  VALUES (101, 15, 2, 94.95);\nUPDATE produtos SET estoque = estoque - 2 WHERE id = 15;\nCOMMIT;"
    }
  ],

  // Stage 22: COUNT, SUM E AVG
  [
    {
      title: "O Poder da Agregação Numérica",
      body: "Funções de agregação processam múltiplos valores de uma coluna e os reduzem a um único valor escalar resumido. `SUM(coluna)` calcula o somatório aritmético total; `AVG(coluna)` calcula a média aritmética ignorando valores nulos; e `MIN()` / `MAX()` localizam os extremos da distribuição. Elas operam diretamente sobre as páginas de dados do banco, sendo ordens de magnitude mais rápidas que somar matrizes na aplicação.",
      tip: "Valores NULL são sumariamente ignorados no cálculo de AVG e SUM; se precisar tratar nulos como zero, use COALESCE(coluna, 0).",
      code: "-- Métricas financeiras consolidadas com funções de agregação\nSELECT \n  SUM(valor) AS faturamento_total,\n  AVG(valor) AS ticket_medio,\n  MIN(valor) AS menor_venda,\n  MAX(valor) AS maior_venda\nFROM vendas\nWHERE status = 'aprovada';"
    },
    {
      title: "Contando Linhas: COUNT(*) vs COUNT(coluna)",
      body: "Existe uma diferença técnica vital entre `COUNT(*)` e `COUNT(nome_coluna)`. A instrução `COUNT(*)` conta todas as linhas retornadas pela consulta, independentemente do conteúdo das colunas. Já `COUNT(nome_coluna)` avalia cada valor e conta exclusivamente as linhas onde aquela coluna específica não é nula (NOT NULL). Usar `COUNT(coluna)` sem necessidade pode degradar o desempenho de cache do otimizador.",
      tip: "Use `COUNT(*)` para contar registros da tabela; use `COUNT(coluna)` apenas quando sua intenção explícita for ignorar valores NULL.",
      code: "-- COUNT(*) conta todas as tuplas; COUNT(coluna) descarta NULLs\nSELECT \n  COUNT(*) AS total_usuarios,\n  COUNT(telefone) AS usuarios_com_telefone_cadastrado\nFROM usuarios;"
    }
  ],

  // Stage 23: GROUP BY
  [
    {
      title: "Agrupando Informações em Balanços",
      body: "A cláusula GROUP BY divide as linhas retornadas em subconjuntos com base na igualdade de valores de uma ou mais colunas especificadas, aplicando em seguida as funções de agregação individualmente sobre cada grupo. Em vez de calcular métricas globais para a tabela inteira, o GROUP BY permite gerar relatórios segmentados, como total faturado por categoria, vendas por mês ou média salarial por setor.",
      tip: "Sempre que usar funções de agregação com colunas normais no SELECT, todas as colunas normais devem obrigatoriamente estar no GROUP BY.",
      code: "-- Agrupamento de métricas por departamento de colaboradores\nSELECT \n  departamento,\n  COUNT(*) AS total_funcionarios,\n  AVG(salario) AS salario_medio\nFROM funcionarios\nGROUP BY departamento;"
    },
    {
      title: "A Regra de Ouro do Agrupamento Relacional",
      body: "A regra fundamental do SQL relacional determina que qualquer coluna presente na lista de projeção do SELECT que não esteja dentro de uma função de agregação DEVE obrigatoriamente fazer parte da cláusula GROUP BY. O motivo lógico é óbvio: se o banco agrupa 50 linhas em uma só, ele não pode escolher arbitrariamente qual dos 50 nomes individuais exibir ao lado do total consolidado sem violar o determinismo.",
      tip: "Se o SGBD disparar o erro 'column must appear in the GROUP BY clause', verifique qual campo do SELECT você esqueceu de incluir no GROUP BY.",
      code: "-- Agrupando por múltiplos atributos sem ambiguidades de projeção\nSELECT \n  categoria_id,\n  status,\n  COUNT(*) AS total_itens,\n  SUM(preco * estoque) AS patrimonio_alocado\nFROM produtos\nGROUP BY categoria_id, status;"
    }
  ],

  // Stage 24: HAVING
  [
    {
      title: "Filtrando Depois do Agrupamento com HAVING",
      body: "Enquanto a cláusula WHERE filtra tuplas individuais ANTES que qualquer agregação aconteça, a cláusula HAVING filtra os grupos consolidados DEPOIS que o agrupamento e os cálculos agregados foram executados. Escrever `WHERE COUNT(*) > 5` resulta em erro de compilação SQL, porque no momento em que o WHERE é executado pelo motor, os grupos ainda nem foram sintetizados na memória de trabalho.",
      tip: "Lembre-se da sequência mental de processamento: WHERE filtra linhas individuais; HAVING filtra grupos agregados.",
      code: "-- HAVING descarta categorias que possuem menos de 10 produtos cadastrados\nSELECT \n  categoria_id,\n  COUNT(*) AS total_produtos,\n  AVG(preco) AS preco_medio\nFROM produtos\nGROUP BY categoria_id\nHAVING COUNT(*) >= 10;"
    },
    {
      title: "Combinando WHERE e HAVING na Prática",
      body: "Consultas analíticas refinadas combinam as duas cláusulas em harmonia estratégica. Primeiro, o WHERE reduz o universo de dados lidos em disco descartando registros irrelevantes (como vendas canceladas ou dados antigos). Em seguida, o GROUP BY consolida as tuplas remanescentes e o HAVING descarta os grupos que não batem a meta estipulada. Essa divisão de tarefas economiza memória e acelera o processamento.",
      tip: "Filtre o máximo de dados possível no WHERE para aliviar o volume de processamento na fase de agrupamento do GROUP BY.",
      code: "-- WHERE descarta cancelamentos antes; HAVING filtra faturamentos expressivos\nSELECT \n  vendedor_id,\n  SUM(valor) AS faturamento_liquido\nFROM pedidos\nWHERE status = 'concluido' AND data >= '2026-01-01' -- Filtro preliminar de linhas\nGROUP BY vendedor_id\nHAVING SUM(valor) > 50000.00;                       -- Filtro do grupo resultante"
    }
  ],

  // Stage 25: UPDATE E DELETE
  [
    {
      title: "Modificando Dados Existentes (UPDATE)",
      body: "O comando UPDATE modifica os valores de colunas em registros já existentes. A cláusula WHERE é estritamente indispensável: executar um UPDATE sem WHERE altera indistintamente todas as linhas de toda a tabela, provocando catástrofes que exigem recuperação de backups. Em bancos com controle de concorrência multiversão (MVCC), o UPDATE grava uma nova versão da tupla e marca a anterior como morta.",
      tip: "Antes de executar um UPDATE arriscado, execute a mesma condição em um `SELECT ... WHERE` para inspecionar exatamente quais linhas serão alteradas.",
      code: "-- Atualização condicional controlada e restrita a um único ID\nUPDATE produtos\nSET preco = preco * 1.05,\n    atualizado_em = CURRENT_TIMESTAMP\nWHERE categoria_id = 2 AND ativo = true;"
    },
    {
      title: "Excluindo Registros com Cuidado (DELETE vs TRUNCATE)",
      body: "O comando DELETE remove linhas específicas avaliadas pelo WHERE, disparando triggers e checando restrições de integridade referencial para cada linha. Já o comando TRUNCATE é uma operação DDL de alta velocidade que desvincula páginas inteiras do disco de uma só vez, zerando a tabela sem registrar exclusões individuais no log. Por segurança, a maioria das aplicações modernas adota 'soft delete' com flag de inativação.",
      tip: "Em tabelas de produção com dependências críticas, use exclusão lógica com `deleted_at TIMESTAMP` em vez de DELETE físico destrutivo.",
      code: "-- Soft delete profissional preserva histórico para auditoria e inteligência\nUPDATE clientes\nSET deletado_em = CURRENT_TIMESTAMP,\n    ativo = false\nWHERE id = 502;"
    }
  ],

  // Stage 26: NORMALIZAÇÃO
  [
    {
      title: "Ocultando Redundâncias: 1FN e 2FN",
      body: "A normalização de dados é uma metodologia formal para estruturar tabelas eliminando redundâncias e evitando anomalias de inserção, atualização e exclusão. A Primeira Forma Normal (1FN) exige atomicidade: cada coluna guarda um único valor indivisível, sem listas ou repetições. A Segunda Forma Normal (2FN) exige que toda coluna não chave dependa integralmente de toda a chave primária, eliminando dependências parciais.",
      tip: "Se você tem colunas como `telefone1`, `telefone2` ou salva arrays em texto, seu banco está violando a 1FN.",
      code: "-- Estrutura normalizada (1FN): cada telefone é um registro atômico\nCREATE TABLE cliente_telefones (\n  id INT PRIMARY KEY,\n  cliente_id INT REFERENCES clientes(id),\n  numero VARCHAR(20) NOT NULL,\n  tipo VARCHAR(15) -- 'celular', 'residencial'\n);"
    },
    {
      title: "A Terceira Forma Normal (3FN) e Desnormalização",
      body: "A Terceira Forma Normal (3FN) estipula que nenhuma coluna não-chave pode depender de outra coluna não-chave (eliminação de dependências transitivas). Exemplo: não guarde o nome da cidade e a alíquota de imposto se a alíquota é determinada puramente pelo estado. Normalizar até a 3FN é a regra em bancos OLTP transacionais. Em data warehouses OLAP, porém, adota-se a desnormalização controlada para acelerar consultas analíticas.",
      tip: "Mantenha seus bancos transacionais (OLTP) na 3FN para garantir integridade; use réplicas ou star schema para analytics pesados.",
      code: "-- 3FN estrita: o imposto depende do estado, que tem sua própria tabela\nCREATE TABLE estados (\n  sigla CHAR(2) PRIMARY KEY,\n  aliquota_icms DECIMAL(4,2) NOT NULL\n);\n\nCREATE TABLE filiais (\n  id INT PRIMARY KEY,\n  nome VARCHAR(100),\n  uf CHAR(2) REFERENCES estados(sigla) -- Evita duplicar a alíquota aqui\n);"
    }
  ],

  // Stage 27: PROJETO: PRODUTOS E PEDIDOS
  [
    {
      title: "O Ponto Crítico da Modelagem de Pedidos",
      body: "Modelar o relacionamento entre produtos e pedidos exige atenção redobrada à volatilidade de preços e estoques. Um erro comum é referenciar o produto apenas com uma Foreign Key simples e multiplicar a quantidade pelo preço cadastrado na tabela de produtos. Como os preços dos produtos mudam com o tempo, consultas futuras em pedidos passados calcularão valores incorretos, gerando inconsistências fiscais.",
      tip: "Congele sempre o preço unitário e o percentual de imposto na tabela associativa do pedido no exato instante do fechamento da compra.",
      code: "-- Tabela de itens persistindo o valor praticado no momento exato do checkout\nCREATE TABLE itens_pedido (\n  pedido_id INT REFERENCES pedidos(id),\n  produto_id INT REFERENCES produtos(id),\n  quantidade INT NOT NULL,\n  preco_unitario_gravado DECIMAL(10,2) NOT NULL,\n  PRIMARY KEY (pedido_id, produto_id)\n);"
    },
    {
      title: "Calculando Subtotais por Linha e Totais de Venda",
      body: "Com a modelagem de itens consolidada, consultas analíticas podem extrair a receita exata multiplicando a quantidade pelo preço histórico registrado na linha do item. Esse cálculo pode ser sintetizado com `SUM(quantidade * preco_unitario_gravado)` agrupado pelo identificador do pedido. Essa abordagem garante fidelidade contábil inabalável mesmo que o catálogo de produtos sofra reajustes inflacionários no futuro.",
      tip: "Valide se o total do cabeçalho do pedido bate exatamente com a soma dos subtotais dos itens para manter integridade contábil.",
      code: "-- Cálculo preciso do total do pedido baseado no histórico dos itens\nSELECT \n  p.id AS pedido_id,\n  p.criado_em,\n  SUM(ip.quantidade * ip.preco_unitario_gravado) AS total_calculado\nFROM pedidos p\nINNER JOIN itens_pedido ip ON ip.pedido_id = p.id\nGROUP BY p.id, p.criado_em\nORDER BY total_calculado DESC;"
    }
  ],

  // Stage 28: PROJETO: CONSULTAS DA LOJA
  [
    {
      title: "Respondendo Perguntas de Negócio com SQL",
      body: "O objetivo final de um banco relacional em uma empresa é transformar dados brutos em decisões de negócios inteligentes. Perguntas como 'Quais foram os 10 produtos mais vendidos no último trimestre?', 'Qual cliente possui maior lifetime value (LTV)?' e 'Qual categoria tem o menor giro de estoque?' são respondidas cruzando múltiplas tabelas com filtros temporais, joins estratégicos e agregações agrupadas.",
      tip: "Construa consultas analíticas complexas passo a passo: primeiro faça os joins, depois os filtros no WHERE e por fim o GROUP BY.",
      code: "-- Relatório dos 5 produtos líderes em faturamento líquido\nSELECT \n  pr.id,\n  pr.descricao,\n  SUM(ip.quantidade) AS unidades_vendidas,\n  SUM(ip.quantidade * ip.preco_unitario_gravado) AS receita_total\nFROM produtos pr\nINNER JOIN itens_pedido ip ON ip.produto_id = pr.id\nGROUP BY pr.id, pr.descricao\nORDER BY receita_total DESC\nLIMIT 5;"
    },
    {
      title: "Agrupamento por Datas e Janelas Temporais",
      body: "Para analisar séries temporais e faturamento mensal ou anual, usamos funções que truncam ou extraem componentes de datas, como `DATE_TRUNC('month', data)` no PostgreSQL ou `strftime()` no SQLite. Esse agrupamento temporal permite que a gestão identifique sazonalidades de vendas, picos de tráfego e tendências de crescimento percentual mês a mês (MoM) sem transferir dados para softwares externos.",
      tip: "Utilize `DATE_TRUNC` para agrupar dados por dia, mês ou ano de forma muito mais rápida do que manipular strings de data.",
      code: "-- Faturamento consolidado mês a mês utilizando DATE_TRUNC\nSELECT \n  DATE_TRUNC('month', data_criacao) AS mes_ano,\n  COUNT(*) AS total_pedidos,\n  SUM(valor_total) AS faturamento\nFROM pedidos\nWHERE status = 'pago'\nGROUP BY DATE_TRUNC('month', data_criacao)\nORDER BY mes_ano ASC;"
    }
  ],

  // Stage 29: PROJETO: REVISANDO O MODELO
  [
    {
      title: "Analisando Possíveis Gargalos com EXPLAIN",
      body: "À medida que as tabelas crescem, consultas antes instantâneas começam a ficar lentas. O comando `EXPLAIN ANALYZE` é a ferramenta definitiva para inspecionar o plano de execução compilado pelo otimizador do SGBD. Ele revela se o banco está realizando um 'Seq Scan' (varredura sequencial em todas as páginas do disco) ou um 'Index Scan' (navegação direta pela árvore B+ do índice), exibindo tempos reais de CPU e I/O.",
      tip: "Sempre rode `EXPLAIN ANALYZE` antes de colocar uma consulta complexa em produção para validar se os índices estão sendo utilizados.",
      code: "-- Inspeção do custo de planejamento e execução do banco\nEXPLAIN ANALYZE\nSELECT * FROM pedidos \nWHERE cliente_id = 9520 AND data_criacao >= '2026-01-01';"
    },
    {
      title: "Refatorações Inteligentes e Criação de Índices",
      body: "Índices funcionam como sumários de livros: aceleram leituras dramaticamente, mas custam espaço em disco e impõem sobretaxa de escrita em cada INSERT, UPDATE e DELETE. Criar índices compostos (cobrindo múltiplos campos comumente consultados juntos) e eliminar índices redundantes ou não utilizados é parte vital da manutenção e governança contínua de qualquer arquitetura de banco de dados corporativa.",
      tip: "No PostgreSQL, use `CREATE INDEX CONCURRENTLY` em produção para criar novos índices sem travar a escrita nas tabelas durante o processo.",
      code: "-- Criação segura de índice composto sem indisponibilidade\nCREATE INDEX CONCURRENTLY idx_pedidos_cliente_data \nON pedidos (cliente_id, data_criacao DESC);"
    }
  ],

  // Stage 30: PROJETO: FECHAMENTO
  [
    {
      title: "A Jornada Relacional Concluída",
      body: "Dominar o modelo relacional e a linguagem SQL confere uma vantagem duradoura na carreira de engenharia de software. Compreender modelagem lógica, constraints de integridade, álgebra relacional com joins, operações atômicas ACID e estratégias de agregação permite projetar aplicações resilientes que suportam crescimento de escala sem corrupção de dados ou custos astronômicos de infraestrutura.",
      tip: "Mesmo utilizando frameworks modernos e ORMs no dia a dia, sempre inspecione e compreenda o SQL gerado sob o capô da aplicação.",
      code: "-- Uma base relacional sólida sustenta sistemas de qualquer escala\nSELECT \n  'SQL Master' AS status,\n  CURRENT_TIMESTAMP AS conclusao,\n  'SGBDs relacionais continuam sendo a base da computação moderna' AS reflexao;"
    },
    {
      title: "Próximos Passos: Do Transacional ao Analítico",
      body: "Com a fundação do SQL consolidada, os próximos passos envolvem recursos avançados: Window Functions (`ROW_NUMBER()`, `RANK()`), Common Table Expressions (`WITH`), Views Materializadas, controle de concorrência com isolamento transacional estrito (Serializable) e extensões de busca vetorial como pgvector para integrar bancos relacionais com Inteligência Artificial e sistemas de busca semântica modernos.",
      tip: "Aprofunde-se em CTEs e Window Functions; elas são o divisor de águas entre o desenvolvedor júnior e o especialista em dados.",
      code: "-- Exemplo de recurso avançado: CTE com Window Function analítica\nWITH RankingVendas AS (\n  SELECT \n    vendedor_id,\n    valor,\n    ROW_NUMBER() OVER (PARTITION BY vendedor_id ORDER BY valor DESC) as pos\n  FROM pedidos\n)\nSELECT * FROM RankingVendas WHERE pos <= 3;"
    }
  ]
];

// Validations
console.log('Stages count in script:', lessons.length);
if (lessons.length !== 30) throw new Error('Must have exactly 30 stages');

lessons.forEach((stageLessons, idx) => {
  if (stageLessons.length !== 2) throw new Error(`Stage ${idx + 1} must have exactly 2 lessons`);
  stageLessons.forEach((l, lIdx) => {
    if (!l.title) throw new Error(`Stage ${idx + 1} lesson ${lIdx + 1} missing title`);
    if (!l.body) throw new Error(`Stage ${idx + 1} lesson ${lIdx + 1} missing body`);
    if (l.body.length < 350 || l.body.length > 650) {
      console.warn(`Stage ${idx + 1} lesson ${lIdx + 1} body length: ${l.body.length}`);
    }
    if (!l.tip) throw new Error(`Stage ${idx + 1} lesson ${lIdx + 1} missing tip`);
    if (!l.code) throw new Error(`Stage ${idx + 1} lesson ${lIdx + 1} missing code`);
  });
});

// Update data
data.stages.forEach((s, idx) => {
  s.lesson = lessons[idx];
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated course-sql.json');
