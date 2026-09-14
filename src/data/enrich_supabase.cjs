const fs = require('fs');
const path = './src/data/course-supabase.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const lessons = [
  // Stage 1: MONTAR UM BACKEND DO ZERO
  [
    {
      title: "O que é o Supabase?",
      body: "O Supabase é uma plataforma Backend-as-a-Service (BaaS) de código aberto construída sobre o PostgreSQL. Ao contrário do Firebase, que utiliza bancos NoSQL proprietários, o Supabase fornece uma instância completa e dedicada do PostgreSQL com autenticação integrada, APIs geradas instantaneamente via PostgREST, armazenamento de arquivos (Storage) e mensageria em tempo real sem prender o desenvolvedor a formatos proprietários.",
      tip: "Como o Supabase é 100% baseado em PostgreSQL padrão, você nunca fica preso (sem vendor lock-in): pode exportar seu banco para qualquer servidor a qualquer momento.",
      code: "-- No Supabase, toda a infraestrutura é PostgreSQL puro\nSELECT version();\n-- Você tem controle total com DDL relacional padrão"
    },
    {
      title: "Por que usar Backend as a Service?",
      body: "Tradicionalmente, criar um backend para uma aplicação web ou mobile exige configurar servidores, provisionar bancos de dados, escrever rotas CRUD repetitivas em APIs REST, implementar autenticação JWT segura com refresh tokens e manter infraestrutura de WebSockets. O Supabase automatiza essas tarefas em minutos, permitindo que o time foque na experiência do usuário e regras de negócio essenciais do produto.",
      tip: "Utilize o Supabase para lançar MVPs ou escalar produtos sem a sobrecarga operacional de gerenciar servidores e pipelines de autenticação manuais.",
      code: "// Conexão inicial com o SDK do Supabase no frontend ou backend\nimport { createClient } from '@supabase/supabase-js';\n\nconst supabase = createClient(\n  process.env.SUPABASE_URL,\n  process.env.SUPABASE_ANON_KEY\n);"
    }
  ],

  // Stage 2: O QUE O SUPABASE ENTREGA
  [
    {
      title: "Arquitetura baseada em Postgres",
      body: "No coração do Supabase reside o PostgreSQL empresarial, um dos motores de banco de dados relacionais mais avançados e estáveis do mundo. Cada projeto provisionado recebe uma instância isolada com suporte a transações ACID estritas, gatilhos (triggers), funções em PL/pgSQL, extensões analíticas e índices geoespaciais e vetoriais. Não há camadas de abstração obscuras entre sua aplicação e os dados reais.",
      tip: "Você pode se conectar ao Supabase tanto via SDK HTTP quanto por conexão direta TCP (pgbouncer) usando clientes como Prisma, Drizzle ou DBeaver.",
      code: "-- Conexão direta SQL com pooling de conexões (porta 6543)\n-- postgresql://postgres:[SUA_SENHA]@db.[REF].supabase.co:6543/postgres\nCREATE TABLE perfis (\n  id UUID PRIMARY KEY REFERENCES auth.users(id),\n  nome TEXT NOT NULL\n);"
    },
    {
      title: "Ecossistema Open-source",
      body: "O Supabase não é um monolito opaco: é uma composição harmoniosa de ferramentas open-source de alto desempenho. Ele combina PostgREST para transformar esquemas em APIs REST, GoTrue para gestão de autenticação, Realtime para streaming de WebSockets do banco, pg_graphql para queries GraphQL nativas e Kong como API Gateway unificado. Você pode rodar a stack completa localmente no Docker sem limitações.",
      tip: "Use o Supabase CLI localmente (`supabase init` e `supabase start`) para desenvolver e rodar testes automatizados sem gastar recursos da nuvem.",
      code: "# Inicializando a stack completa do Supabase localmente via Docker\nnpx supabase init\nnpx supabase start\n# Cria painel Studio, Postgres e APIs locais em portas dedicadas"
    }
  ],

  // Stage 3: SUPABASE NA PRÁTICA
  [
    {
      title: "O Painel de Controle (Studio)",
      body: "O Supabase Studio é uma interface web intuitiva que elimina a necessidade de instalar ferramentas externas de administração de banco. Nele, você pode inspecionar e editar tabelas visualmente, rodar queries SQL interativas, configurar políticas de segurança (RLS) com assistentes gráficos, gerenciar buckets de arquivos e monitorar métricas de uso de CPU, memória, latência e conexões ativas do banco.",
      tip: "Use o SQL Editor no Studio para testar queries e criar migrações antes de integrá-las ao código da aplicação cliente.",
      code: "-- O Studio permite rodar scripts complexos no editor SQL integrado\nSELECT tablename, schemaname \nFROM pg_tables \nWHERE schemaname = 'public'\nORDER BY tablename ASC;"
    },
    {
      title: "Integração nativa com Client SDK",
      body: "A biblioteca `@supabase/supabase-js` oferece uma interface isomórfica fluente que funciona tanto no navegador quanto em ambientes Node.js, Deno, Bun e React Native. Ela lida automaticamente com o armazenamento e renovação de tokens JWT em cookies ou LocalStorage, serialização de parâmetros de consulta, cabeçalhos de autorização e reconexão de canais em tempo real após quedas de rede.",
      tip: "Instale o `@supabase/ssr` caso esteja trabalhando com frameworks modernos que usam Server Components, como Next.js App Router.",
      code: "// Leitura limpa e fortemente tipada pelo SDK\nconst { data, error } = await supabase\n  .from('produtos')\n  .select('id, nome, preco')\n  .order('preco', { ascending: false });\n\nif (error) console.error(error.message);"
    }
  ],

  // Stage 4: POSTGRES POR TRÁS DE TUDO
  [
    {
      title: "Tabelas e Tipos de Dados",
      body: "No Supabase, as tabelas residem no esquema `public` por padrão e herdam todo o poder do sistema de tipos nativo do PostgreSQL. Além de tipos primitivos como `integer`, `text` e `boolean`, o Postgres oferece suporte de primeira classe a colunas `jsonb` para dados semiestruturados, arrays nativos (`text[]`), identificadores universais `uuid` e coordenadas espaciais `geography` com suporte a indexação direta.",
      tip: "Prefira colunas `jsonb` em vez de `json` padrão; o `jsonb` armazena em binário decomposto e aceita índices GIN para buscas ultra-rápidas.",
      code: "-- Tabela combinando tipos relacionais fortes com coluna flexível jsonb\nCREATE TABLE pedidos (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  cliente_id UUID NOT NULL,\n  metadados JSONB DEFAULT '{}'::jsonb,\n  criado_em TIMESTAMPTZ DEFAULT now()\n);"
    },
    {
      title: "A Importância das Chaves Primárias",
      body: "Chaves primárias são indispensáveis para que o Supabase consiga indexar registros, viabilizar mutações no painel Studio e sincronizar alterações via streaming Realtime. O padrão do ecossistema Supabase é utilizar `UUID` gerado pela função nativa `gen_random_uuid()`. Diferente de inteiros sequenciais (1, 2, 3), UUIDs não expõem o volume de negócios para invasores e podem ser gerados com segurança no próprio cliente antes do envio.",
      tip: "Utilize UUIDs como PK para tabelas públicas acessadas pela API; isso previne ataques de enumeração direta contra os recursos do seu sistema.",
      code: "-- Chave primária UUID com geração automática no Postgres\nCREATE TABLE tarefas (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  descricao TEXT NOT NULL,\n  concluida BOOLEAN DEFAULT false\n);"
    }
  ],

  // Stage 5: CRIAR UMA TABELA NO PAINEL
  [
    {
      title: "Relacionamentos com Chaves Estrangeiras",
      body: "Ao vincular tabelas com Chaves Estrangeiras no Postgres, o Supabase ganha o superpoder de entender o grafo de dados da sua aplicação. Isso permite que a API REST do PostgREST resolva consultas aninhadas automaticamente (similar ao GraphQL) sem que você precise escrever rotas especiais ou joins manuais no backend, retornando respostas JSON já aninhadas com hierarquia completa.",
      tip: "Defina Foreign Keys mesmo se usar um ORM externo; é a presença física da FK no catálogo do banco que habilita joins automáticos no SDK do Supabase.",
      code: "-- O PostgREST detecta a FK e permite queries aninhadas automáticas\nCREATE TABLE autores (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  nome TEXT NOT NULL\n);\n\nCREATE TABLE livros (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  titulo TEXT NOT NULL,\n  autor_id UUID REFERENCES autores(id) ON DELETE CASCADE\n);"
    },
    {
      title: "Views e Consultas Complexas",
      body: "Views são consultas SQL pré-definidas que o banco expõe como se fossem tabelas virtuais. No Supabase, toda view criada no esquema `public` se torna instantaneamente um endpoint consultável pela API com suporte a filtros e ordenação pelo SDK. Isso permite encapsular cálculos pesados, agregações analíticas e joins complexos no lado do banco, mantendo o frontend limpo e performático.",
      tip: "Crie Views para expor resumos analíticos protegendo colunas sensíveis da tabela física subjacente.",
      code: "-- View exposta automaticamente como rota GET na API\nCREATE VIEW relatorio_vendas AS\nSELECT \n  a.nome AS autor,\n  COUNT(l.id) AS total_livros\nFROM autores a\nLEFT JOIN livros l ON l.autor_id = a.id\nGROUP BY a.nome;"
    }
  ],

  // Stage 6: TIPOS E RELAÇÕES ENTRE TABELAS
  [
    {
      title: "Gerenciamento de Migrations",
      body: "Conforme seu produto evolui, mudanças na estrutura do banco não devem ser feitas manualmente em produção. O Supabase CLI fornece um fluxo profissional de migrações declarativas onde cada alteração de DDL é gravada em arquivos SQL cronológicos na pasta `supabase/migrations`. Essas migrações são executadas em pipelines de CI/CD, garantindo que os ambientes de desenvolvimento, staging e produção permaneçam idênticos.",
      tip: "Nunca altere o banco de produção diretamente pelo Studio após o lançamento; gere migrations com `supabase db diff` e aplique com `supabase db push`.",
      code: "# Criando e aplicando migrações com o Supabase CLI\nnpx supabase migration new adicionar_coluna_telefone\n# O comando cria um arquivo SQL versionado com timestamp\nnpx supabase db push # Aplica as pendências no banco remoto"
    },
    {
      title: "Extensões do Postgres",
      body: "Um dos maiores diferenciais do Supabase é o ecossistema de extensões do PostgreSQL acessíveis com um clique no Studio. Extensões como `pgvector` permitem armazenar e comparar embeddings vetoriais para Inteligência Artificial; `pg_trgm` habilita busca textual fuzzy ultrarrápida; e `pg_cron` agenda execuções periódicas de procedures SQL diretamente dentro do motor do banco de dados.",
      tip: "Habilite apenas as extensões necessárias para o seu caso de uso para manter o consumo de memória do Postgres sob controle.",
      code: "-- Ativando extensões nativas no PostgreSQL\nCREATE EXTENSION IF NOT EXISTS vector; -- Suporte para IA e busca semântica\nCREATE EXTENSION IF NOT EXISTS pg_trgm; -- Busca textual por aproximação\n\n-- Criando tabela com coluna vetorial de 1536 dimensões (OpenAI)\nCREATE TABLE documentos (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  conteudo TEXT,\n  embedding VECTOR(1536)\n);"
    }
  ],

  // Stage 7: TABELA VIRA ENDPOINT
  [
    {
      title: "O Papel do PostgREST",
      body: "O PostgREST é um servidor web autônomo escrito em Haskell que lê o esquema do PostgreSQL e gera uma API RESTful completa em milissegundos. Cada tabela, view e procedure do esquema `public` é mapeada diretamente para rotas HTTP com verbos padronizados (GET, POST, PATCH, DELETE). Como o PostgREST delega autenticação e permissões integralmente ao banco, ele entrega latências na faixa de sub-milissegundos.",
      tip: "Você não precisa escrever controladores ou rotas CRUD no backend; o PostgREST traduz requisições HTTP em comandos SQL otimizados.",
      code: "// Uma tabela 'produtos' no banco se torna acessível imediatamente\n// GET https://xyz.supabase.co/rest/v1/produtos?select=id,nome,preco\nconst { data } = await supabase\n  .from('produtos')\n  .select('id, nome, preco');"
    },
    {
      title: "Filtragem e Consultas via URL",
      body: "O PostgREST possui uma gramática de operadores de consulta rica passada via parâmetros de URL. Operadores como `eq` (igual), `neq` (diferente), `gt` (maior que), `lt` (menor que) e `ilike` (busca textual) são traduzidos internamente em cláusulas WHERE do SQL. O SDK do Supabase encapsula essa sintaxe em métodos JavaScript limpos e autoexplicativos sem concatenações manuais de strings.",
      tip: "Use os operadores encadeados do SDK (`eq`, `gte`, `lte`) para construir filtros dinâmicos de busca sem risco de injeção de SQL.",
      code: "// Encadeando múltiplos operadores que o PostgREST converte em WHERE\nconst { data } = await supabase\n  .from('produtos')\n  .select('*')\n  .gte('preco', 50)\n  .lte('preco', 200)\n  .eq('disponivel', true);"
    }
  ],

  // Stage 8: FILTROS NA URL DA API
  [
    {
      title: "Relacionamentos Automáticos na API",
      body: "Graças às Foreign Keys declaradas no Postgres, o PostgREST permite aninhar recursos relacionados em uma única requisição HTTP usando a sintaxe de recurso embebido. Ao solicitar `select('id, titulo, autor:autores(nome)')`, o PostgREST executa um join interno no banco e retorna os dados do autor já estruturados como um objeto JSON filho dentro de cada livro, reduzindo múltiplas viagens de rede.",
      tip: "Reduza o problema de N+1 requisições no frontend aproveitando a seleção de tabelas relacionadas em uma só query do Supabase.",
      code: "// Busca pedidos com os dados do cliente e a lista de itens aninhados\nconst { data } = await supabase\n  .from('pedidos')\n  .select(`\n    id,\n    total,\n    cliente:clientes ( id, nome, email ),\n    itens:pedido_itens ( id, quantidade, preco_unitario )\n  `);"
    },
    {
      title: "Ordenação e Paginação Nativas",
      body: "Toda rota do Supabase suporta paginação e ordenação no nível de transporte sem que você precise implementar lógica customizada. Métodos como `.order('campo', { ascending: false })` e `.range(inicio, fim)` traduzem diretamente para `ORDER BY` e `OFFSET/LIMIT` no SQL gerado. Isso garante que coleções com dezenas de milhares de itens sejam consumidas de maneira incremental e econômica pela interface.",
      tip: "Ao implementar paginação infinita, use `.range(page * size, (page + 1) * size - 1)` para fatiar as requisições com exatidão.",
      code: "// Paginação da página 1 trazendo 10 registros ordenados por data\nconst { data, count } = await supabase\n  .from('artigos')\n  .select('id, titulo', { count: 'exact' })\n  .order('criado_em', { ascending: false })\n  .range(0, 9); // Primeiros 10 itens (índice inclusivo)"
    }
  ],

  // Stage 9: MÉTODOS HTTP NA API
  [
    {
      title: "Tratamento de Permissões e Verbos HTTP",
      body: "O PostgREST mapeia os verbos HTTP para comandos SQL semânticos: GET executa SELECT; POST executa INSERT; PATCH executa UPDATE; e DELETE executa a exclusão de tuplas. Quando uma operação é disparada com o cabeçalho de autenticação do usuário, o PostgREST assume o papel de segurança do Postgres (Role) e avalia as regras de Row Level Security antes de permitir qualquer modificação no banco.",
      tip: "Use PATCH quando quiser atualizar apenas alguns campos do registro; o Supabase altera apenas as colunas especificadas no objeto.",
      code: "// Operação de atualização (PATCH) segura contra o banco\nconst { data, error } = await supabase\n  .from('usuarios')\n  .update({ status: 'ativo' })\n  .eq('id', usuarioId);\n\n// Operação de exclusão (DELETE)\nawait supabase.from('notificacoes').delete().eq('lida', true);"
    },
    {
      title: "Chamando Stored Procedures (RPC)",
      body: "Quando uma operação de negócio requer regras transacionais complexas, múltiplos passos condicionais ou cálculos matemáticos pesados que não devem rodar no cliente, a solução ideal é criar uma função SQL no Postgres e invocá-la usando `supabase.rpc('nome_da_funcao', parametros)`. As RPCs rodam diretamente dentro do motor do banco com privilégios controlados e latência zero de rede interna.",
      tip: "Use RPC para transações atômicas de escrita, como debitar de uma carteira e creditar em outra dentro de uma única transação.",
      code: "-- Função SQL criada no Postgres para transferência atômica\nCREATE OR REPLACE FUNCTION transferir_pontos(remetente UUID, destinatario UUID, qtd INT)\nRETURNS VOID AS $$\nBEGIN\n  UPDATE contas SET pontos = pontos - qtd WHERE id = remetente;\n  UPDATE contas SET pontos = pontos + qtd WHERE id = destinatario;\nEND;\n$$ LANGUAGE plpgsql;\n\n// Invocação limpa pelo SDK do Supabase\nawait supabase.rpc('transferir_pontos', { remetente: '...', destinatario: '...', qtd: 50 });"
    }
  ],

  // Stage 10: SIGNUP E LOGIN PRONTOS
  [
    {
      title: "O Motor GoTrue de Autenticação",
      body: "O módulo de autenticação do Supabase é construído sobre o GoTrue, um microsserviço independente que gerencia o ciclo de vida completo de identidade do usuário. Ele cuida do hash criptográfico de senhas usando algoritmos modernos como bcrypt, envio e confirmação de e-mails de ativação, fluxos de recuperação de senha e emissão padronizada de pares de tokens JWT de acesso (Access Token) e renovação (Refresh Token).",
      tip: "Nunca manipule senhas diretamente na tabela `users` do esquema `public`; deixe toda a gestão de senhas a cargo da API `supabase.auth`.",
      code: "// Cadastro de novo usuário com e-mail e senha\nconst { data, error } = await supabase.auth.signUp({\n  email: 'dev@empresa.com',\n  password: 'SenhaSuperSegura123!',\n  options: {\n    data: { nome: 'Carlos Eduardo' } // Metadados iniciais\n  }\n});"
    },
    {
      title: "Tokens JWT e Sessões",
      body: "Após o login bem-sucedido, o Supabase emite um JSON Web Token (JWT) assinado criptograficamente com a chave secreta do seu projeto. Esse token contém o `sub` (ID do usuário), e-mail, metadados e papel (`authenticated`). Em cada requisição HTTP subsequente, o token é enviado no cabeçalho `Authorization: Bearer <token>`. O Postgres valida a assinatura matematicamente e disponibiliza o usuário na função `auth.uid()`.",
      tip: "O SDK do Supabase cuida da renovação automática de tokens expirados em segundo plano sem que o usuário perceba deslogamentos súbitos.",
      code: "// Login com e-mail e senha e obtenção da sessão ativa\nconst { data, error } = await supabase.auth.signInWithPassword({\n  email: 'dev@empresa.com',\n  password: 'SenhaSuperSegura123!'\n});\n\nconsole.log('ID do usuário autenticado:', data.user.id);\nconsole.log('JWT Token:', data.session.access_token);"
    }
  ],

  // Stage 11: PROVEDORES DE LOGIN
  [
    {
      title: "Login com Provedores Sociais (OAuth)",
      body: "O Supabase simplifica a autenticação federada via OAuth com provedores externos como Google, GitHub, Apple, Azure, Discord e dezenas de outros. Toda a negociação complexa de trocas de chaves de autorização, redirecionamentos e verificação de assinaturas é tratada pelo Supabase. O usuário é autenticado pelo provedor e automaticamente inserido na tabela `auth.users` do seu projeto.",
      tip: "Configure as URLs de redirecionamento autorizadas (Redirect URLs) no painel do Supabase para evitar ataques de redirecionamento aberto.",
      code: "// Login com GitHub disparado em apenas uma linha no frontend\nconst { data, error } = await supabase.auth.signInWithOAuth({\n  provider: 'github',\n  options: {\n    redirectTo: 'https://meuapp.com/dashboard'\n  }\n});"
    },
    {
      title: "Magic Links e Login Sem Senha",
      body: "O login sem senha (Passwordless) por Magic Link ou códigos OTP via e-mail ou SMS (Twilio/MessageBird) reduz o atrito de entrada e elimina vulnerabilidades decorrentes de senhas fracas ou reutilizadas. O Supabase envia um link único com token temporal de validação de uso único; ao clicar no link, o navegador valida o token e estabelece a sessão autenticada com máxima segurança.",
      tip: "Adote Magic Links para fluxos de onboarding rápido em produtos onde a barreira de memorizar senhas prejudica a conversão.",
      code: "// Envio de Magic Link de acesso sem senha para o e-mail do usuário\nconst { data, error } = await supabase.auth.signInWithOtp({\n  email: 'usuario@dominio.com',\n  options: {\n    emailRedirectTo: 'https://meuapp.com/bem-vindo'\n  }\n});"
    }
  ],

  // Stage 12: SESSÃO DO USUÁRIO
  [
    {
      title: "Sincronizando Usuários com o Postgres",
      body: "O Supabase separa os dados de login no esquema interno `auth.users`, inacessível diretamente pela API pública por razões óbvias de segurança. Para armazenar informações do perfil do usuário como avatar, biografia e permissões, a melhor prática arquitetural consiste em criar uma tabela `public.perfis` e sincronizá-la automaticamente via PostgreSQL Trigger sempre que um usuário for criado no `auth.users`.",
      tip: "Use uma Trigger no Postgres para criar o perfil público no mesmo milissegundo em que o usuário se cadastra no sistema de auth.",
      code: "-- Trigger automática que cria perfil público no cadastro\nCREATE FUNCTION public.handle_new_user()\nRETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO public.perfis (id, email, criado_em)\n  VALUES (new.id, new.email, now());\n  RETURN new;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER;\n\nCREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();"
    },
    {
      title: "Metadados de Usuário (User Metadata)",
      body: "O objeto de usuário do Supabase suporta `user_metadata` (editável pelo próprio usuário através do SDK) e `app_metadata` (editável exclusivamente por chaves administrativas com privilégio de backend). Armazenar papéis de autorização como `role: 'admin'` dentro de `user_metadata` é uma falha grave de segurança, pois o usuário comum pode injetar esse campo em seu próprio perfil se você permitir.",
      tip: "Guarde cargos administrativos e permissões em `app_metadata` ou em tabelas relacionais protegidas por RLS, nunca em `user_metadata`.",
      code: "// Atualização segura de informações básicas pelo próprio usuário\nconst { data, error } = await supabase.auth.updateUser({\n  data: { display_name: 'Lucas Dev', preferencial_tema: 'dark' }\n});"
    }
  ],

  // Stage 13: DADOS SEM PROTEÇÃO
  [
    {
      title: "O que é Row Level Security (RLS)",
      body: "Por padrão, quando uma tabela é criada no PostgreSQL, qualquer cliente que se conecte com a chave anônima pública (`anon key`) tem leitura e escrita bloqueadas se o RLS estiver ativado. O Row Level Security é a muralha de defesa do Supabase: ele inspeciona cada linha do banco de dados no momento da query e decide se a transação do usuário atual tem autorização para ler, inserir ou modificar aquela tupla.",
      tip: "NUNCA desative o RLS em tabelas do esquema público; sem RLS, sua chave pública de frontend permite que qualquer pessoa esvazie o banco.",
      code: "-- Ativação obrigatória de RLS em qualquer tabela exposta\nALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;\n\n-- Sem políticas adicionadas, a tabela fica 100% inacessível por segurança"
    },
    {
      title: "Anatomia de uma Política (Policy)",
      body: "Uma política de RLS é uma regra declarativa associada a um comando específico (SELECT, INSERT, UPDATE ou DELETE). Ela possui duas cláusulas fundamentais: `USING`, que filtra quais linhas existentes o usuário pode enxergar ou selecionar, e `WITH CHECK`, que valida se os novos dados que o usuário está tentando gravar ou atualizar satisfazem as exigências estipuladas pelo negócio.",
      tip: "Pense na cláusula USING como um WHERE automático invisível aplicado a todas as requisições que chegam pelo cliente.",
      code: "-- Política permitindo que qualquer pessoa leia artigos publicados\nCREATE POLICY \"Artigos públicos podem ser lidos por todos\"\nON public.artigos\nFOR SELECT\nUSING ( status = 'publicado' );"
    }
  ],

  // Stage 14: POLÍTICA BÁSICA DE LEITURA
  [
    {
      title: "Acessando o ID do Usuário (auth.uid)",
      body: "O Supabase disponibiliza funções especiais no Postgres para consultar os dados do token JWT durante a execução da política. A função `auth.uid()` extrai o UUID do usuário autenticado no momento da requisição HTTP. Ao criar uma política com a expressão `USING (user_id = auth.uid())`, garantimos matematicamente no nível do motor de dados que um usuário só pode visualizar suas próprias anotações ou documentos.",
      tip: "Use `auth.uid()` em suas policies para isolamento de dados de múltiplos inquilinos (multi-tenant) com zero linhas de código de backend.",
      code: "-- Política clássica: cada usuário só visualiza seus próprios registros\nCREATE POLICY \"Usuários acessam apenas suas anotações\"\nON public.anotacoes\nFOR SELECT\nUSING ( auth.uid() = usuario_id );"
    },
    {
      title: "Políticas com Regras Complexas e Joins",
      body: "As políticas de RLS não se limitam a comparações simples de colunas. Você pode incluir subconsultas SQL completas, verificando se o usuário é membro de um time ou possui um cargo específico em uma tabela associativa. Como essas subqueries rodam para cada linha avaliada, é crucial criar índices nas colunas consultadas dentro da policy para evitar degradação de performance em tabelas grandes.",
      tip: "Sempre crie índices nas colunas usadas dentro de policies de RLS (como `usuario_id`), caso contrário o PostgreSQL fará scans lentos.",
      code: "-- Política baseada em permissão de membros em tabela de equipe\nCREATE POLICY \"Membros do time podem ler projetos da equipe\"\nON public.projetos\nFOR SELECT\nUSING (\n  EXISTS (\n    SELECT 1 FROM public.time_membros\n    WHERE time_membros.time_id = projetos.time_id\n      AND time_membros.usuario_id = auth.uid()\n  )\n);"
    }
  ],

  // Stage 15: POLÍTICA DE ESCRITA
  [
    {
      title: "A Chave de Serviço (Service Role Key)",
      body: "O Supabase gera duas chaves de API: a chave anônima (`anon key`), feita para ser exposta no frontend público e restrita rigorosamente pelo RLS; e a chave de serviço (`service_role key`), que possui privilégios de superusuário e ignora completamente todas as políticas de RLS. A `service_role key` NUNCA deve ser incluída no frontend, no Git ou em código cliente, devendo ficar isolada em servidores seguros.",
      tip: "Guarde a `service_role key` apenas em variáveis de ambiente de servidores backend confidenciais para rotas administrativas.",
      code: "// Uso exclusivo em ambiente backend seguro (Node.js/Next.js API Route)\nimport { createClient } from '@supabase/supabase-js';\n\nconst adminSupabase = createClient(\n  process.env.SUPABASE_URL,\n  process.env.SUPABASE_SERVICE_ROLE_KEY // Bypassa o RLS!\n);"
    },
    {
      title: "Testando RLS de Forma Segura",
      body: "Antes de publicar uma aplicação, é mandatório testar as políticas de RLS simulando diferentes identidades de usuários. No SQL Editor do Supabase Studio, você pode usar as funções de impersonificação de sessão (`SET LOCAL ROLE authenticated;` e `SET LOCAL \"request.jwt.claim.sub\" = 'uuid';`) para rodar queries e validar se o usuário X realmente consegue ou não ler os dados do usuário Y.",
      tip: "Crie testes automatizados com o Supabase CLI simulando requisições com tokens anônimos e tokens de diferentes usuários para validar o RLS.",
      code: "-- Simulando requisição de um usuário comum no editor SQL para testar RLS\nSET LOCAL ROLE authenticated;\nSET LOCAL \"request.jwt.claim.sub\" = '11111111-1111-1111-1111-111111111111';\n\n-- Esta query retornará apenas as linhas que satisfazem a policy do usuário simulado\nSELECT * FROM public.anotacoes;"
    }
  ],

  // Stage 16: BUCKETS DE ARQUIVOS
  [
    {
      title: "Buckets no Supabase Storage",
      body: "O Supabase Storage fornece um serviço de armazenamento de objetos compatível com o padrão S3 para guardar mídias pesadas como avatares, imagens de produtos, documentos PDF e vídeos. Em vez de inflar o banco relacional salvando arquivos em colunas binárias pesadas (BLOB), os arquivos são armazenados no storage em alta velocidade, gravando no PostgreSQL apenas o caminho ou metadados de referência.",
      tip: "Organize seus arquivos em buckets temáticos (ex: 'avatares', 'documentos-privados') e defina limites de tamanho por arquivo no painel.",
      code: "-- Criando um bucket público para avatares via SQL\nINSERT INTO storage.buckets (id, name, public)\nVALUES ('avatares', 'avatares', true);"
    },
    {
      title: "Upload de Arquivos com o SDK",
      body: "O método `supabase.storage.from('bucket').upload(caminho, arquivo)` simplifica o envio de mídias a partir do navegador ou backend. O SDK aceita objetos `File`, `Blob`, `ArrayBuffer` ou streams do Node.js. Ao enviar o arquivo, é possível configurar o tipo MIME (`contentType`), cabeçalhos de controle de cache (`cacheControl`) e a opção de sobrescrita atômica caso o arquivo já exista no diretório de destino.",
      tip: "Use nomes únicos com UUID para os arquivos (ex: `${userId}/${crypto.randomUUID()}.png`) para evitar conflitos de nomes no upload.",
      code: "// Upload de avatar a partir de um input de arquivo HTML\nconst file = document.querySelector('#avatarInput').files[0];\nconst filePath = `usuarios/${userId}/avatar.png`;\n\nconst { data, error } = await supabase.storage\n  .from('avatares')\n  .upload(filePath, file, {\n    cacheControl: '3600',\n    upsert: true // Sobrescreve se já existir\n  });"
    }
  ],

  // Stage 17: UPLOAD DE ARQUIVOS
  [
    {
      title: "Gerando URLs de Arquivos",
      body: "Após realizar o upload, a aplicação precisa exibir ou compartilhar o arquivo com o usuário. Se o bucket for público, a função `getPublicUrl(caminho)` retorna instantaneamente uma URL estática distribuída via CDN global da Cloudflare. Para buckets privados, é necessário gerar uma URL assinada temporária com validade limitada em segundos usando a função assíncrona `createSignedUrl(caminho, expires)`.",
      tip: "Nunca torne público um bucket que contenha contratos, comprovantes ou documentos sensíveis; use URLs assinadas de curta duração.",
      code: "// Obtendo URL pública para exibição em tag <img />\nconst { data: publicData } = supabase.storage\n  .from('avatares')\n  .getPublicUrl('usuarios/123/avatar.png');\nconsole.log(publicData.publicUrl);\n\n// Gerando URL assinada temporária de 60 segundos para download seguro\nconst { data: signedData } = await supabase.storage\n  .from('contratos')\n  .createSignedUrl('documentos/contrato_final.pdf', 60);"
    },
    {
      title: "Transformação de Imagens na Nuvem",
      body: "O Supabase Storage possui um motor integrado de redimensionamento e otimização de imagens na borda. Em vez de processar thumbnails pesados no servidor ou trafegar fotos de 10 MB tiradas de câmeras modernas para dispositivos móveis, você pode passar parâmetros de transformação de largura (`width`), altura (`height`), qualidade (`quality`) e formato (`format: 'origin' | 'webp'`) direto na requisição de URL.",
      tip: "Utilize parâmetros de transformação de imagem do Supabase para servir imagens em WebP compactadas sob demanda sem servidores extras.",
      code: "// URL com transformação de imagem em tempo real na CDN\nconst { data } = supabase.storage\n  .from('produtos')\n  .getPublicUrl('fotos/notebook.jpg', {\n    transform: {\n      width: 400,\n      height: 300,\n      resize: 'cover',\n      quality: 80\n    }\n  });"
    }
  ],

  // Stage 18: URL PÚBLICA VS PRIVADA
  [
    {
      title: "RLS no Storage do Supabase",
      body: "O sistema de arquivos do Supabase Storage é integrado diretamente ao PostgreSQL através da tabela `storage.objects`. Isso significa que as mesmas políticas de Row Level Security do banco protegem os arquivos físicos armazenados nos buckets! Você pode escrever policies em SQL que impedem downloads ou uploads se o usuário não for o proprietário do diretório ou se sua assinatura estiver expirada.",
      tip: "Use o padrão de pastas com o ID do usuário (ex: `pasta = auth.uid()`) para simplificar policies de upload seguro no Storage.",
      code: "-- Policy de RLS protegendo uploads de arquivos na pasta do próprio usuário\nCREATE POLICY \"Usuário só envia para sua própria pasta\"\nON storage.objects FOR INSERT TO authenticated\nWITH CHECK (\n  bucket_id = 'documentos'\n  AND (storage.foldername(name))[1] = auth.uid()::text\n);"
    },
    {
      title: "Uploads Resumíveis com Protocolo TUS",
      body: "Para arquivos de grande porte (vídeos de centenas de megabytes ou gigabytes), uploads tradicionais via requisições HTTP multipart comuns correm o risco constante de falhar no meio do progresso devido a instabilidades de rede móvel. O Supabase suporta nativamente o protocolo aberto TUS (Resumable Uploads), permitindo pausar e retomar transferências exatamente do byte onde foram interrompidas.",
      tip: "Adote a biblioteca `@tus/tus-js-client` em conjunto com o Supabase para gerenciar uploads de arquivos acima de 50 MB com barras de progresso reais.",
      code: "// Exemplo conceitual de upload resumível via TUS com Supabase\nimport * as tus from 'tus-js-client';\n\nconst upload = new tus.Upload(file, {\n  endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,\n  headers: { Authorization: `Bearer ${session.access_token}` },\n  onError: (err) => console.error(err),\n  onProgress: (bytesUploaded, bytesTotal) => {\n    const percent = ((bytesUploaded / bytesTotal) * 100).toFixed(2);\n    console.log(`Progresso: ${percent}%`);\n  }\n});\nupload.start();"
    }
  ],

  // Stage 19: ASSINAR MUDANÇAS EM TEMPO REAL
  [
    {
      title: "Ouvindo Mudanças no Postgres (Realtime)",
      body: "O motor Supabase Realtime escuta o Write-Ahead Log (WAL) do PostgreSQL utilizando replicação lógica. Sempre que ocorre um INSERT, UPDATE ou DELETE em uma tabela configurada na publicação `supabase_realtime`, o servidor converte essa alteração de disco em uma mensagem JSON e a transmite via WebSockets para os clientes conectados em frações de segundo, sem exigir polling repetitivo.",
      tip: "Adicione apenas tabelas essenciais na publicação `supabase_realtime` para evitar tráfego excessivo e desperdício de CPU no banco.",
      code: "-- Habilitando publicação em tempo real para uma tabela específica no Postgres\nALTER PUBLICATION supabase_realtime ADD TABLE public.mensagens;"
    },
    {
      title: "Inscrevendo-se nos Canais com o SDK",
      body: "No frontend, o método `supabase.channel('nome-do-canal')` abre um canal multiplexado sobre uma conexão WebSocket estável. Com o modificador `.on('postgres_changes', ...)`, você pode filtrar escutas por esquema, tabela ou até mesmo por eventos individuais (`event: 'INSERT'`). Quando a mutação ocorre no banco de dados, o callback é acionado imediatamente com o payload da linha adicionada ou modificada.",
      tip: "Sempre chame `supabase.removeChannel(canal)` na desmontagem de componentes (cleanup de useEffect no React) para evitar vazamento de memória.",
      code: "// Escutando novas mensagens em tempo real no React / Vue\nconst canal = supabase\n  .channel('mensagens-publicas')\n  .on('postgres_changes', {\n    event: 'INSERT',\n    schema: 'public',\n    table: 'mensagens'\n  }, (payload) => {\n    console.log('Nova mensagem recebida:', payload.new);\n  })\n  .subscribe();\n\n// Ao desmontar: supabase.removeChannel(canal);"
    }
  ],

  // Stage 20: CASOS DE USO DO REALTIME
  [
    {
      title: "Segurança no Realtime e RLS",
      body: "O Realtime do Supabase não envia dados indiscriminadamente: ele respeita rigorosamente as políticas de Row Level Security (RLS) configuradas no banco. Antes de emitir o evento WebSocket para um cliente conectado, o motor avalia as permissões do token JWT do usuário. Se o usuário não tiver privilégio de SELECT sobre aquele registro alterado, o payload não é transmitido, protegendo dados confidenciais.",
      tip: "Garanta que suas policies de SELECT estejam ativas e corretas; o streaming Realtime usa essas mesmas regras para filtrar os eventos enviados.",
      code: "-- Se o usuário não tiver permissão de SELECT nesta linha,\n-- o WebSocket simplesmente não despachará o evento para ele\nCREATE POLICY \"Apenas participantes recebem mensagens da sala\"\nON public.mensagens FOR SELECT\nUSING ( auth.uid() IN (SELECT usuario_id FROM sala_membros WHERE sala_id = mensagens.sala_id) );"
    },
    {
      title: "Filtragem de Eventos do Lado do Cliente",
      body: "Além dos filtros gerais de tabela, o SDK permite restringir eventos diretamente na subscrição do canal passando o argumento `filter: 'coluna=eq.valor'`. Dessa forma, o cliente conectado em uma sala de suporte específica não consome banda de rede processando mensagens de outras salas que não lhe dizem respeito, garantindo escalabilidade e menor consumo de processamento no dispositivo móvel.",
      tip: "Adicione filtros de ID nas subscrições (`filter: 'chat_id=eq.123'`) para ouvir apenas os dados relevantes para a tela atual.",
      code: "// Inscrevendo-se apenas para alterações de um pedido específico\nconst canal = supabase\n  .channel('acompanhamento-pedido')\n  .on('postgres_changes', {\n    event: 'UPDATE',\n    schema: 'public',\n    table: 'pedidos',\n    filter: 'id=eq.d1b827e6-8c43-4e67-a64d-3b7c3d254e01'\n  }, (payload) => {\n    console.log('Status atualizado:', payload.new.status);\n  })\n  .subscribe();"
    }
  ],

  // Stage 21: INSTALANDO O CLIENT SDK
  [
    {
      title: "Broadcast e Troca de Mensagens Efêmeras",
      body: "Nem toda interação em tempo real precisa ser persistida no banco de dados. O recurso de Broadcast do Supabase Realtime permite que clientes troquem mensagens efêmeras de baixa latência diretamente via WebSockets, como posição do cursor em um editor colaborativo, indicadores de 'digitando...' em um chat ou sinais de WebRTC para chamadas de vídeo, sem gerar nenhuma gravação em disco no PostgreSQL.",
      tip: "Use Broadcast para dados que mudam várias vezes por segundo (como cursores de mouse); gravar isso no Postgres esgotaria o I/O do banco.",
      code: "// Enviando coordenadas do cursor para outros membros da sala\nconst canal = supabase.channel('quadro-branco');\ncanal.subscribe((status) => {\n  if (status === 'SUBSCRIBED') {\n    canal.send({\n      type: 'broadcast',\n      event: 'cursor-pos',\n      payload: { x: 140, y: 320, usuario: 'Ana' }\n    });\n  }\n});"
    },
    {
      title: "Presence: Monitorando Quem Está Online",
      body: "O recurso de Presence gerencia o estado de presença compartilhado entre clientes conectados em uma sala. Ele utiliza algoritmos de tipos de dados replicados sem conflito (CRDTs) para sincronizar listas de participantes online mesmo sob desconexões de rede momentâneas. Quando um usuário fecha a aba do navegador, seu estado é removido do grupo automaticamente e todos são notificados.",
      tip: "Implemente contadores de 'usuários ativos agora' utilizando o Presence do Supabase sem necessidade de bancos de cache Redis externos.",
      code: "// Rastreando presença online em tempo real\nconst canal = supabase.channel('sala-reuniao');\ncanal\n  .on('presence', { event: 'sync' }, () => {\n    const state = canal.presenceState();\n    console.log('Usuários online agora:', state);\n  })\n  .subscribe(async (status) => {\n    if (status === 'SUBSCRIBED') {\n      await canal.track({ online_at: new Date().toISOString(), usuario: 'Carlos' });\n    }\n  });"
    }
  ],

  // Stage 22: LENDO DADOS COM O SDK
  [
    {
      title: "O Poder do supabase-js",
      body: "O SDK `@supabase/supabase-js` combina simplicidade de uso com robustez enterprise. Ao contrário de ORMs pesados que traduzem modelos de objetos com overhead de memória no runtime, o cliente do Supabase gera diretamente chamadas HTTP otimizadas que batem no PostgREST. A API é intuitiva e encadeável, assemelhando-se à leitura natural de queries relacionais com total transparência.",
      tip: "Crie uma instância única (Singleton) do cliente do Supabase em um arquivo centralizado (`lib/supabase.ts`) e importe-a em todo o projeto.",
      code: "// lib/supabase.ts - Instância única reutilizável\nimport { createClient } from '@supabase/supabase-js';\n\nexport const supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL!,\n  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!\n);"
    },
    {
      title: "Gerando Tipos TypeScript com o CLI",
      body: "O Supabase CLI possui o comando `supabase gen types typescript`, que lê o catálogo do seu banco de dados PostgreSQL e produz um arquivo de definições de tipos (`Database`) contendo todas as tabelas, colunas, enums e views. Ao instanciar o SDK com esse tipo, todos os métodos `.from()`, `.select()` e `.insert()` passam a oferecer autocompletion estrito e validação estática de erros no VS Code.",
      tip: "Rode a geração de tipos TypeScript em seu pipeline de desenvolvimento para capturar erros de nomes de colunas antes do deploy.",
      code: "# Gera tipos TypeScript estritos a partir do banco remoto\nnpx supabase gen types typescript --project-id \"seu-id-de-projeto\" > types/supabase.ts\n\n// No código TypeScript:\nimport { Database } from './types/supabase';\nconst supabase = createClient<Database>(url, anonKey);\n// Agora 'from' e 'select' possuem autocompletion total de tabelas e colunas!"
    }
  ],

  // Stage 23: ESCREVENDO DADOS COM O SDK
  [
    {
      title: "Padrão de Respostas Data / Error",
      body: "O SDK do Supabase não lança exceções inesperadas por padrão (não usa `throw`), adotando o padrão moderno inspirado em linguagens como Go e Rust: todas as operações assíncronas retornam um objeto contendo `{ data, error }`. Isso obriga o desenvolvedor a checar e tratar explicitamente eventuais falhas de validação, violação de constraints ou erros de conexão de rede antes de processar os dados.",
      tip: "Sempre faça `if (error) { ... }` logo após aguardar a Promise; ignorar o erro causará falhas silenciosas na interface.",
      code: "// Tratamento explícito e resiliente do retorno de mutações\nconst { data, error } = await supabase\n  .from('clientes')\n  .insert({ nome: 'Marina Santos', email: 'marina@empresa.com' })\n  .select()\n  .single();\n\nif (error) {\n  console.error('Falha ao inserir cliente:', error.message);\n  return;\n}\nconsole.log('Cliente persistido com sucesso, ID:', data.id);"
    },
    {
      title: "Encadeamento de Modificadores: .select() e .single()",
      body: "Por padrão, operações de INSERT ou UPDATE no PostgREST não retornam a linha criada para poupar banda de rede. Se você precisa do registro recém-gravado com seus valores gerados (como `id` e `criado_em`), basta encadear `.select()`. Se você espera exatamente uma única tupla em vez de uma lista, encadear `.single()` desempacota o array e formata o retorno direto como objeto único.",
      tip: "Utilize `.single()` quando buscar por chave primária ou colunas com constraint UNIQUE para receber um objeto limpo em vez de um array.",
      code: "// Busca um único registro com desempacotamento automático\nconst { data: usuario, error } = await supabase\n  .from('usuarios')\n  .select('id, nome, email')\n  .eq('id', 'e379471d-5226-4d26-b8e7-b695e1e19488')\n  .single();\n\nif (!error) console.log(usuario.nome); // Acesso direto ao atributo"
    }
  ],

  // Stage 24: SERVERLESS NA PRÁTICA
  [
    {
      title: "Múltiplas Inserções e Atualizações (Upsert)",
      body: "O comando `upsert` (combinação de update e insert) resolve o problema de gravar dados sem saber se o registro já existe previamente. Se a chave primária ou restrição UNIQUE especificada for encontrada no banco, o Supabase atualiza a tupla existente; caso contrário, insere uma nova linha. Essa operação atômica substitui a lógica arriscada e propensa a concorrência de 'buscar primeiro, atualizar depois'.",
      tip: "Especifique o parâmetro `onConflict: 'coluna'` no upsert para ditar qual restrição única deve acionar a atualização.",
      code: "// Upsert atômico baseado no e-mail único do usuário\nconst { data, error } = await supabase\n  .from('preferencias')\n  .upsert({\n    usuario_id: userId,\n    tema: 'escuro',\n    notificacoes_push: true\n  }, { onConflict: 'usuario_id' });"
    },
    {
      title: "Integração SSR com Next.js e Nuxt",
      body: "Em frameworks modernos com Server-Side Rendering (SSR), o cliente não pode depender do LocalStorage para gerenciar a sessão de autenticação, pois o servidor Node.js/Edge não tem acesso a esse armazenamento. A biblioteca `@supabase/ssr` padroniza o ciclo de vida dos tokens armazenando-os em Cookies HTTP seguros, viabilizando autenticação perfeita tanto no servidor quanto no navegador.",
      tip: "Utilize Middleware no Next.js para ler a sessão via cookies e redirecionar usuários não autenticados antes mesmo da página começar a renderizar.",
      code: "// Exemplo de Middleware no Next.js App Router com @supabase/ssr\nimport { createServerClient } from '@supabase/ssr';\nimport { NextResponse } from 'next/server';\n\nexport async function middleware(req) {\n  let res = NextResponse.next();\n  const supabase = createServerClient(url, key, {\n    cookies: { getAll: () => req.cookies.getAll() }\n  });\n  const { data: { user } } = await supabase.auth.getUser();\n  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {\n    return NextResponse.redirect(new URL('/login', req.url));\n  }\n  return res;\n}"
    }
  ],

  // Stage 25: QUANDO USAR EDGE FUNCTIONS
  [
    {
      title: "O que são as Edge Functions",
      body: "As Supabase Edge Functions são funções sem servidor (serverless) baseadas na runtime moderna Deno, distribuídas geograficamente em mais de 40 datacenters pela rede da Fastly. Isso significa que o código executa no ponto de presença mais próximo do usuário, proporcionando tempos de inicialização (cold starts) na faixa de 10 a 50 milissegundos — ordens de magnitude mais rápidos que lambdas tradicionais.",
      tip: "Use Edge Functions sempre que precisar executar código com chaves secretas (como pagamentos com Stripe) ou tarefas pesadas fora do navegador.",
      code: "// Edge Function escrita em TypeScript no ambiente Deno\nimport { serve } from \"https://deno.land/std@0.168.0/http/server.ts\";\n\nserve(async (req) => {\n  return new Response(JSON.stringify({ mensagem: \"Olá direto da borda!\" }), {\n    headers: { \"Content-Type\": \"application/json\" }\n  });\n});"
    },
    {
      title: "Casos de Uso para Servidor Próprio vs Edge",
      body: "Embora o Supabase permita que boa parte do frontend converse diretamente com o banco via RLS, existem cenários onde uma função de borda é obrigatória: processar webhooks de plataformas de terceiros (como confirmação de pagamentos da Stripe), orquestrar chamadas a modelos de Inteligência Artificial da OpenAI sem expor sua chave de API, e gerar faturas em PDF ou e-mails transacionais em lote.",
      tip: "Nunca coloque chaves da OpenAI ou Stripe no frontend; invoque uma Edge Function no Supabase para intermediar a requisição com segurança.",
      code: "// Invocando uma Edge Function a partir do frontend pelo SDK\nconst { data, error } = await supabase.functions.invoke('processar-pagamento', {\n  body: { pedidoId: 'ped_123', metodo: 'pix' }\n});\n\nconsole.log('Resultado do processamento:', data);"
    }
  ],

  // Stage 26: PLANEJANDO O BACKEND
  [
    {
      title: "Executando em Deno e TypeScript Nativo",
      body: "O ambiente Deno utilizado nas Edge Functions executa TypeScript nativamente sem etapas lentas de build ou transpile e oferece uma sandbox com segurança reforçada por padrão. O acesso a variáveis de ambiente (`Deno.env.get()`), chamadas de rede e leitura de arquivos requer permissões explícitas. Além disso, o Deno suporta tanto módulos ES via URL quanto pacotes do ecossistema npm padrão.",
      tip: "Você pode importar bibliotecas do npm direto nas Edge Functions usando o prefixo `npm:`, como `import Stripe from 'npm:stripe@^14'`;",
      code: "// Importação direta de pacote npm dentro de uma Edge Function Deno\nimport Stripe from 'npm:stripe@^14.0.0';\n\nconst stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {\n  apiVersion: '2023-10-16'\n});"
    },
    {
      title: "Autenticação em Funções com Cabeçalhos",
      body: "Ao invocar uma Edge Function, o cabeçalho `Authorization: Bearer <token>` do usuário conectado é encaminhado automaticamente. Dentro da função, você pode inicializar o cliente do Supabase passando esse cabeçalho; o cliente herdará o contexto do usuário e respeitará as políticas de RLS no banco, garantindo que o código serverless não execute nada além do que o usuário logado tem direito.",
      tip: "Instancie o cliente dentro da função com o token do cabeçalho da requisição para preservar a identidade do usuário nas queries.",
      code: "// Extraindo a identidade do usuário dentro da Edge Function\nconst authHeader = req.headers.get('Authorization')!;\nconst supabaseClient = createClient(\n  Deno.env.get('SUPABASE_URL')!,\n  Deno.env.get('SUPABASE_ANON_KEY')!,\n  { global: { headers: { Authorization: authHeader } } }\n);\n\nconst { data: { user } } = await supabaseClient.auth.getUser();"
    }
  ],

  // Stage 27: DEFININDO AS POLÍTICAS
  [
    {
      title: "Chamando Functions do SDK com Tratamento",
      body: "A integração entre o SDK do Supabase e as Edge Functions ocorre através do método `supabase.functions.invoke('nome', opcoes)`. Essa chamada gerencia a serialização automática de payloads JSON, transmissão de cookies de autenticação e descompactação de respostas. O tratamento de erros de execução e falhas de rede no nível da função é capturado no objeto de erro retornado pela promise.",
      tip: "Configure cabeçalhos CORS adequados dentro da Edge Function para que ela possa ser invocada com sucesso por diferentes domínios de frontend.",
      code: "// Tratamento completo de resposta de uma Edge Function\nconst { data, error } = await supabase.functions.invoke('gerar-relatorio', {\n  body: { ano: 2026 }\n});\n\nif (error) {\n  console.error('Erro na execução da função serverless:', error);\n} else {\n  console.log('Dados processados:', data);\n}"
    },
    {
      title: "Aplicações de Background: Database Webhooks",
      body: "Os Database Webhooks do Supabase permitem que eventos de escrita no PostgreSQL disparem automaticamente requisições HTTP para serviços externos ou Edge Functions. Por exemplo: sempre que um novo registro for inserido na tabela `pedidos`, um Webhook do banco aciona uma Edge Function para enviar um e-mail com comprovante em segundo plano, sem bloquear a resposta do cliente.",
      tip: "Utilize Database Webhooks para desacoplar ações secundárias de escrita (notificações, integrações CRM) do fluxo transacional principal.",
      code: "-- Webhook configurado no Postgres disparando requisição HTTP via pg_net\n-- Criação feita visualmente no painel em 'Database > Webhooks'\n-- Tabela: pedidos | Evento: INSERT | Destino: Edge Function 'enviar-recibo'"
    }
  ],

  // Stage 28: ESCOLHENDO OS RECURSOS CERTOS
  [
    {
      title: "Modelagem e Relacionamentos Base",
      body: "Planejar a arquitetura de um projeto no Supabase exige desenhar os limites das entidades antes de escrever qualquer código. A divisão entre dados públicos e privados dita como as tabelas serão estruturadas e quais colunas receberão Foreign Keys para `auth.users(id)`. Um esquema bem modelado simplifica drasticamente a escrita de policies de RLS e viabiliza a geração de rotas REST intuitivas.",
      tip: "Vincule tabelas de dados privados à tabela `auth.users` via `REFERENCES auth.users(id) ON DELETE CASCADE` para limpar dados órfãos automaticamente.",
      code: "-- Estrutura relacional ideal com deleção em cascata integrada ao Auth\nCREATE TABLE public.assinaturas (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n  plano TEXT NOT NULL,\n  status TEXT NOT NULL\n);"
    },
    {
      title: "Camadas de Segurança em Cascata",
      body: "A segurança em um aplicativo moderno com Supabase segue o princípio da defesa em profundidade com múltiplas camadas: validação de schemas de entrada no frontend/Edge (com Zod), autenticação de identidade rigorosa via JWT (GoTrue), controle de acesso linha a linha no banco (RLS) e restrições de integridade estrutural com constraints (CHECK, NOT NULL, FOREIGN KEY).",
      tip: "Mesmo com RLS, continue usando constraints como NOT NULL e CHECK no PostgreSQL; elas impedem estados inconsistentes causados por bugs.",
      code: "-- Validação de integridade profunda no nível do Postgres\nALTER TABLE public.assinaturas \n  ADD CONSTRAINT status_valido CHECK (status IN ('ativa', 'cancelada', 'pendente'));"
    }
  ],

  // Stage 29: REVISANDO O FLUXO COMPLETO
  [
    {
      title: "Estruturando os Ambientes (Local, Staging e Prod)",
      body: "Para projetos em produção, trabalhar diretamente no painel da nuvem é uma prática perigosa. O fluxo profissional recomendado pela documentação do Supabase baseia-se em: desenvolver localmente com o CLI e Docker, versionar migrações de esquema em arquivos SQL no repositório Git e utilizar GitHub Actions para aplicar migrações automaticamente no ambiente de homologação e produção durante o deploy.",
      tip: "Configure projetos separados no Supabase para 'Staging' e 'Produção'; nunca teste migrações arriscadas na mesma base onde seus clientes operam.",
      code: "# Workflow de deploy de migrations via GitHub Actions\n# - name: Deploy de Migrations no Supabase\n#   run: npx supabase db push\n#   env:\n#     SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}\n#     SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}"
    },
    {
      title: "Otimizando a Performance com Índices",
      body: "À medida que suas tabelas acumulam milhares de registros, consultas lentas começam a degradar a experiência do usuário. O painel do Supabase Studio oferece uma seção de 'Database Reports' com métricas das queries mais pesadas e sugestões de índices ausentes. Criar índices em colunas utilizadas em cláusulas WHERE, JOINs frequentes e policies de RLS garante tempos de resposta em milissegundos.",
      tip: "Verifique o relatório de 'Slow Queries' no Studio periodicamente para identificar gargalos de CPU e criar índices preventivos.",
      code: "-- Índice B-Tree acelerando buscas e RLS na coluna usuario_id\nCREATE INDEX IF NOT EXISTS idx_assinaturas_usuario_id \nON public.assinaturas (usuario_id);"
    }
  ],

  // Stage 30: PROJETO FINAL CONSOLIDADO
  [
    {
      title: "Conectando Ferramentas Externas",
      body: "Uma das grandes forças do Supabase é a interoperabilidade com o ecossistema global. Como a base é um PostgreSQL padrão, você pode conectar ferramentas analíticas de BI como Metabase e Apache Superset, replicar dados para data warehouses externos via Airbyte, e utilizar ferramentas de monitoramento de performance de banco como Datadog ou Prometheus conectando-se diretamente à porta do pooler.",
      tip: "Ao conectar ferramentas externas com muitas conexões simultâneas, conecte-se pela porta 6543 (PgBouncer/Supavisor) para evitar esgotar conexões do Postgres.",
      code: "-- Conexão direta com string de conexão poolada para alta concorrência\n-- postgresql://postgres.xyz:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres\nSELECT 'Integração Global Concluída com Sucesso' AS status;"
    },
    {
      title: "Escalando de Forma Global e Manutenção Contínua",
      body: "Você concluiu a jornada completa pelo ecossistema do Supabase! Agora domina desde a modelagem relacional de esquemas e permissões estritas com Row Level Security até uploads de arquivos em buckets de storage, streams reativos em tempo real e computação serverless distribuída na borda com Edge Functions. Essa combinação entrega uma infraestrutura robusta e moderna capaz de suportar milhões de usuários.",
      tip: "Continue explorando recursos avançados como busca vetorial com pgvector e réplicas de leitura para acompanhar a evolução do Supabase.",
      code: "-- Parabéns! Sua stack de Backend as a Service está pronta para produção\nSELECT \n  'Supabase Expert' AS certificado,\n  now() AS emitido_em,\n  'Infraestrutura moderna e escalável pronta para o mundo real' AS mensagem;"
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
console.log('Successfully updated course-supabase.json');
