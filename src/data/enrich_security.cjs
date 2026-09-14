const fs = require('fs');
const path = './src/data/course-security.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const lessons = [
  // Stage 1: SEGURANÇA NÃO É DEPOIS
  [
    {
      title: "O Mito do 'Depois a Gente Vê'",
      body: "Adiar a segurança para depois do lançamento é uma das armadilhas mais caras do desenvolvimento de software. Vulnerabilidades arquiteturais, como armazenamento de senhas em texto puro ou ausência de controle de acesso, não podem ser corrigidas com um simples 'remendo' superficial posterior. A segurança deve ser tratada como requisito não-funcional prioritário desde o primeiro diagrama de classes até o deploy final.",
      tip: "Integre práticas de 'Shift Left Security': analise riscos e modele ameaças durante a concepção das histórias de usuário.",
      code: "// Inseguro: adiar validação cria brechas graves no sistema\n// app.post('/admin', (req, res) => { processarAcao(req.body); });\n\n// Seguro: autenticação e autorização exigidas desde o dia zero\napp.post('/admin', exigirAutenticacao, exigirRole('admin'), (req, res) => {\n  processarAcao(req.body);\n});"
    },
    {
      title: "O Custo de Ignorar a Segurança",
      body: "Corrigir uma brecha de segurança em ambiente de produção após um vazamento real chega a custar até cem vezes mais do que mitigá-la durante a fase de desenvolvimento. Além de multas regulatórias severas impostas por legislações como LGPD e GDPR, a perda irreparável da reputação da marca e a rescisão de contratos corporativos podem inviabilizar a sobrevivência da empresa no mercado moderno.",
      tip: "Monitore dependências vulneráveis no pipeline de CI com ferramentas gratuitas como `npm audit` ou Snyk.",
      code: "# Verificando vulnerabilidades conhecidas em dependências do projeto\nnpm audit\n# Bloqueia o build no CI caso haja vulnerabilidades críticas ou altas\nnpm audit --audit-level=high"
    }
  ],

  // Stage 2: DADOS VAZADOS
  [
    {
      title: "Anatomia de um Vazamento de Dados",
      body: "Um vazamento de dados raramente decorre de invasões hollywoodianas cinematográficas; na maioria esmagadora dos incidentes reais, a causa é uma falha elementar: credenciais e chaves expostas em repositórios públicos do GitHub, servidores de banco de dados ou buckets S3 deixados abertos na internet sem senha, ou APIs que respondem com objetos completos do usuário sem filtragem de campos.",
      tip: "Nunca confie na obscuridade: robôs escaneiam a internet 24/7 buscando portas abertas e endpoints desprotegidos.",
      code: "// Ruim: expõe o objeto do banco inteiro com hash de senha e dados fiscais\nres.json(usuario);\n\n// Seguro: projeta e filtra explicitamente apenas campos inofensivos para a resposta\nconst { id, nome, email } = usuario;\nres.json({ id, nome, email });"
    },
    {
      title: "Danos Reais de um Vazamento",
      body: "Quando uma base de usuários é comprometida, o efeito dominó é devastador. Usuários tendem a reutilizar a mesma combinação de e-mail e senha em dezenas de serviços online. Criminosos utilizam técnicas de Credential Stuffing para testar essas credenciais vazadas em bancos, lojas e redes corporativas, transformando a brecha do seu sistema em um vetor de invasão contra serviços de terceiros.",
      tip: "Adote autenticação em dois fatores (MFA/2FA) para proteger contas privilegiadas mesmo que a senha seja comprometida.",
      code: "-- Registro de auditoria obrigatório para detectar anomalias de acesso\nCREATE TABLE logs_seguranca (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  usuario_id UUID NOT NULL,\n  ip_origem VARCHAR(45) NOT NULL,\n  evento TEXT NOT NULL,\n  criado_em TIMESTAMPTZ DEFAULT now()\n);"
    }
  ],

  // Stage 3: A MENTALIDADE DE SEGURANÇA
  [
    {
      title: "Princípio do Menor Privilégio (PoLP)",
      body: "O Princípio do Menor Privilégio determina que qualquer usuário, programa, microsserviço ou processo deve operar utilizando estritamente o conjunto mínimo de permissões necessárias para cumprir sua tarefa específica, e nada além disso. Uma aplicação web nunca deve se conectar ao banco de dados com usuário 'root' ou 'postgres', que possui privilégios para apagar bancos ou reconfigurar o sistema operacional.",
      tip: "Crie usuários específicos de banco de dados para a aplicação com permissões restritas apenas a SELECT, INSERT e UPDATE nas tabelas necessárias.",
      code: "-- Ruim: aplicação usando o superusuário 'postgres'\n-- Bom: usuário com menor privilégio restrito ao esquema da aplicação\nCREATE USER app_backend WITH PASSWORD 'senha_forte_aqui';\nGRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_backend;\nREVOKE TRUNCATE, DROP ON ALL TABLES IN SCHEMA public FROM app_backend;"
    },
    {
      title: "Defesa em Profundidade (Defense in Depth)",
      body: "O conceito de Defesa em Profundidade postula que nenhum mecanismo de segurança isolado é infalível. Uma arquitetura resiliente posiciona múltiplas barreiras defensivas redundantes: firewall de borda (WAF), rate limiting no gateway, validação estrita de esquemas na entrada, autenticação JWT, autorização granular por papéis, criptografia em repouso e políticas de Row Level Security no próprio banco.",
      tip: "Nunca confie apenas em uma barreira; se a validação do frontend falhar, o backend e o banco devem barrar a anomalia.",
      code: "// Camada 1: Validação de Schema (Zod)\n// Camada 2: Checagem de Autenticação (JWT)\n// Camada 3: Controle de Acesso (RBAC)\n// Camada 4: Sanitização no Banco (Queries parametrizadas)\nrouter.post('/artigos', validarSchema(ArtigoSchema), autenticar, autorizar('editor'), salvarArtigo);"
    }
  ],

  // Stage 4: SENHA NÃO É TEXTO PURO
  [
    {
      title: "O Perigo do Texto Puro (Plaintext)",
      body: "Armazenar senhas em texto puro (plaintext) no banco de dados é uma negligência gravíssima e ilegal perante as leis modernas de proteção de dados. Se o banco sofrer um dump acidental, um backup for exposto ou um colaborador mal-intencionado tiver acesso de leitura, todas as senhas de todos os usuários serão expostas imediatamente sem qualquer barreira de proteção criptográfica.",
      tip: "Se você consegue enxergar a senha original do seu usuário no banco de dados, o sistema está fundamentalmente quebrado.",
      code: "-- CRIME DE SEGURANÇA: NUNCA armazene senhas legíveis no banco!\n-- INSERT INTO usuarios (email, senha) VALUES ('ana@exemplo.com', '123456');\n\n-- CORRETO: armazene apenas o hash criptográfico unidirecional\nINSERT INTO usuarios (email, senha_hash) \nVALUES ('ana@exemplo.com', '$2b$12$e8uqY.y0B5dYQJ1x0zR4O.k9z9p... ');"
    },
    {
      title: "O que o Banco Realmente Deve Guardar",
      body: "O banco de dados nunca deve armazenar a senha em si, mas sim o resultado de uma função hash criptográfica lenta e unidirecional aplicada sobre ela. Quando o usuário tenta se autenticar, a aplicação recalcula o hash do texto digitado no formulário e compara com a assinatura armazenada. Se os hashes forem idênticos, a identidade é confirmada sem que o servidor jamais precise guardar o segredo original.",
      tip: "Ao resetar senhas, envie links com tokens de expiração curta; nunca envie a senha antiga por e-mail, pois você nem deve saber qual é.",
      code: "// Validação segura comparando o texto digitado contra o hash do banco\nconst hashArmazenado = usuario.senha_hash;\nconst senhaInformada = req.body.senha;\n\n// A função compara sem decriptar (pois hash não se decripta)\nconst ehValida = await bcrypt.compare(senhaInformada, hashArmazenado);"
    }
  ],

  // Stage 5: O QUE É HASH
  [
    {
      title: "O Conceito de Função Hash Criptográfica",
      body: "Uma função hash é um algoritmo matemático determinístico que recebe uma entrada de qualquer tamanho e a converte em uma sequência alfanumérica de tamanho fixo (digest). A mesma entrada sempre gerará exatamente a mesma saída. Porém, o algoritmo é desenhado para ser unidirecional: é computacionalmente inviável reverter o hash gerado de volta para a entrada original que o produziu.",
      tip: "Uma função hash segura possui o 'efeito avalanche': alterar uma única letra da entrada altera completamente todo o hash resultante.",
      code: "// Exemplo com biblioteca nativa de criptografia do Node.js\nimport crypto from 'node:crypto';\n\nconst hash1 = crypto.createHash('sha256').update('senha123').digest('hex');\nconst hash2 = crypto.createHash('sha256').update('senha124').digest('hex');\n// hash1 e hash2 serão completamente diferentes apesar da semelhança da entrada"
    },
    {
      title: "Propriedades Essenciais do Hash",
      body: "Uma função hash criptográfica robusta deve satisfazer três propriedades matemáticas: 1) Resistência à pré-imagem (dado um hash H, é impossível encontrar a mensagem M tal que hash(M) = H); 2) Resistência à segunda pré-imagem (dada uma entrada M1, é impossível achar M2 com o mesmo hash); e 3) Resistência à colisão (é impraticável encontrar duas entradas distintas quaisquer que gerem saídas iguais).",
      tip: "Algoritmos como MD5 e SHA-1 sofreram ataques práticos de colisão e estão banidos para qualquer uso em segurança da informação.",
      code: "// MD5 E SHA-1 ESTÃO QUEBRADOS! Não use para integridade de dados críticos\n// Ruim: crypto.createHash('md5').update(dados).digest('hex');\n\n// Bom: utilize SHA-256 ou SHA-512 para integridade de dados e assinaturas\nconst digestSeguro = crypto.createHash('sha256').update(dados).digest('hex');"
    }
  ],

  // Stage 6: HASH VS CRIPTOGRAFIA
  [
    {
      title: "Criptografia: A Rodovia de Mão Dupla",
      body: "A criptografia é um mecanismo bidirecional criado para proteger dados em trânsito ou repouso que precisam ser recuperados posteriormente em sua forma original. Ela pode ser simétrica (a mesma chave cifra e decifra, como no algoritmo AES-256-GCM) ou assimétrica (uma chave pública cifra e uma chave privada correspondente decifra, como no RSA e na criptografia de curvas elípticas).",
      tip: "Use criptografia simétrica (AES-256) para guardar números de cartão de crédito tokenizados ou prontuários médicos confidenciais.",
      code: "// Criptografia bidirecional: cifrar e decifrar usando chave secreta\nimport crypto from 'node:crypto';\n\nfunction cifrar(texto, chave, iv) {\n  const cipher = crypto.createCipheriv('aes-256-gcm', chave, iv);\n  let encrypted = cipher.update(texto, 'utf8', 'hex');\n  encrypted += cipher.final('hex');\n  return { encrypted, tag: cipher.getAuthTag().toString('hex') };\n}"
    },
    {
      title: "Hash: O Caminho Sem Volta",
      body: "Enquanto a criptografia foi desenhada para permitir a recuperação reversível dos dados mediante a posse da chave secreta, o hash é matematicamente unidirecional e não possui chave de reversão. É por essa razão exata que senhas de usuários devem ser tratadas com funções hash lentas e nunca com criptografia simétrica: se a chave de criptografia do servidor vazar, todas as senhas poderão ser decifradas.",
      tip: "Regra mnemônica: Senhas você hasheia (sem volta). Documentos e tokens confidenciais você criptografa (com volta).",
      code: "// Senhas -> SEMPRE HASH (sem possibilidade de descriptografia)\nconst hashSenha = await argon2.hash(senhaDigitada);\n\n// Dados que o sistema precisa ler de volta (ex: chave de API de terceiro) -> CRIPTOGRAFIA\nconst apiKeyProtegida = cifrar(apiKeyTerceiro, CHAVE_MESTRA, iv);"
    }
  ],

  // Stage 7: RAINBOW TABLES E SALT
  [
    {
      title: "O Ataque com Rainbow Tables",
      body: "Embora um hash não possa ser revertido matematicamente, atacantes usam tabelas pré-computadas gigantescas chamadas Rainbow Tables contendo bilhões de senhas comuns e seus respectivos hashes. Se você hashear '123456' usando SHA-256 puro, o atacante apenas faz uma busca indexada rápida pelo hash na tabela pré-calculada e descobre a senha original em frações de milissegundo.",
      tip: "Nunca utilize algoritmos rápidos de propósito geral (como SHA-256 ou SHA-512 puros) para hashear senhas de usuários.",
      code: "// Ataque de dicionário/rainbow table contra hashes simples sem sal:\n// Hash conhecido: 'e10adc3949ba59abbe56e057f20f883e'\n// Lookup instantâneo no banco de hashes do invasor revela: '123456'"
    },
    {
      title: "O Sal que Salva Tudo (Cryptographic Salt)",
      body: "O Salt (sal criptográfico) é uma sequência aleatória e criptograficamente imprevisível de bytes gerada individualmente para cada senha antes de submetê-la ao hash. Ao combinar a senha com um salt único antes de calcular o digest, mesmo que dois usuários tenham a mesmíssima senha '123456', seus hashes finais no banco serão completamente diferentes, neutralizando ataques por Rainbow Tables.",
      tip: "O salt não é um segredo: ele é armazenado abertamente no próprio banco junto com o hash para permitir a comparação posterior.",
      code: "// O bcrypt gera o salt aleatório automaticamente e o inclui no hash final\nimport bcrypt from 'bcrypt';\n\nconst saltRounds = 12; // Custo computacional que define o tempo de cálculo\nconst hashSeguro = await bcrypt.hash('minha_senha_123', saltRounds);\n// Formato gerado: $2b$[custo]$[22 caracteres de salt][31 caracteres de hash]"
    }
  ],

  // Stage 8: ALGORITMOS RECOMENDADOS
  [
    {
      title: "Os Algoritmos Condenados",
      body: "Algoritmos como MD5, SHA-1 e até mesmo a família SHA-2 (SHA-256) foram projetados especificamente para serem extremamente rápidos e eficientes no cálculo de checksums de integridade de arquivos. No entanto, para senhas, velocidade é uma fraqueza catastrófica: placas de vídeo modernas (GPUs) conseguem calcular centenas de bilhões de hashes SHA-256 por segundo em ataques de força bruta.",
      tip: "Banir MD5 e SHA-1 de qualquer aplicação nova é a primeira regra de ouro das diretrizes da OWASP e NIST.",
      code: "// NUNCA FAÇA ISSO PARA SENHAS: Muito rápido, GPUs quebram em segundos\n// const hashInseguro = crypto.createHash('sha256').update(senha).digest('hex');"
    },
    {
      title: "O Padrão Ouro: Argon2 e bcrypt",
      body: "Para hashing de senhas, utilizamos KDFs (Key Derivation Functions) propositalmente lentas e ajustáveis. O Argon2 (vencedor do Password Hashing Competition) e o bcrypt exigem múltiplos ciclos de CPU e grande consumo de memória RAM (memory-hard). Isso impede que ataques em massa com hardware dedicado (ASICs e GPUs) quebrem senhas em paralelo por limitação física de barramento de memória.",
      tip: "Utilize Argon2id como primeira escolha; se não estiver disponível em seu ecossistema, use bcrypt com fator de custo 12.",
      code: "import argon2 from 'argon2';\n\n// Gerando hash com Argon2id resistente a ataques de GPU/ASIC\nconst hash = await argon2.hash('senhaForte@2026', {\n  type: argon2.argon2id,\n  memoryCost: 2 ** 16, // 64 MB de consumo de memória\n  timeCost: 3          // 3 iterações de processador\n});\n\nconst valido = await argon2.verify(hash, 'senhaForte@2026');"
    }
  ],

  // Stage 9: AUTENTICAÇÃO VS AUTORIZAÇÃO
  [
    {
      title: "Quem é Você? (Autenticação)",
      body: "Autenticação (AuthN) é o processo pelo qual o sistema verifica e confirma a identidade declarada por um usuário, serviço ou entidade. Ela responde à pergunta: 'Você é realmente quem afirma ser?'. Essa verificação ocorre por meio de fatores como algo que o usuário sabe (senha), algo que ele possui (dispositivo móvel, chave física WebAuthn/FIDO2) ou algo que ele é (biometria facial ou digital).",
      tip: "Sempre diferencie mensagens de erro: informe 'E-mail ou senha inválidos' para impedir que atacantes enumerem e-mails cadastrados.",
      code: "// Processo de Autenticação (AuthN): conferir credenciais de acesso\nconst usuario = await buscarPorEmail(req.body.email);\nif (!usuario || !(await bcrypt.compare(req.body.senha, usuario.senha_hash))) {\n  return res.status(401).json({ erro: 'Credenciais inválidas' }); // Mensagem neutra\n}"
    },
    {
      title: "O que Você Pode Fazer? (Autorização)",
      body: "Autorização (AuthZ) entra em ação imediatamente após a identidade ter sido confirmada pela autenticação. Ela responde à pergunta: 'Este usuário autenticado possui permissão para executar esta ação sobre este recurso específico?'. Um estagiário autenticado com sucesso não deve ter autorização para acessar a rota de folha de pagamento ou deletar o banco de dados corporativo.",
      tip: "Retorne status HTTP 401 para falhas de Autenticação (não identificado) e HTTP 403 para falhas de Autorização (sem permissão).",
      code: "// Processo de Autorização (AuthZ): checar se a identidade pode agir\nif (usuario.cargo !== 'diretor_financeiro') {\n  return res.status(403).json({ erro: 'Acesso negado: privilégios insuficientes' });\n}\n// Prossiga com a emissão do pagamento..."
    }
  ],

  // Stage 10: PRIMEIRO AUTENTICA, DEPOIS AUTORIZA
  [
    {
      title: "A Ordem dos Fatores Altera Tudo",
      body: "Na arquitetura de software seguro, a ordem de execução do pipeline de segurança é imutável: primeiro autenticamos a requisição para determinar quem está chamando; somente após validar essa identidade é que avaliamos os privilégios e permissões de autorização. Tentar autorizar uma requisição antes de autenticá-la cria brechas fatais onde endpoints avaliam dados não confiáveis enviados pelo cliente.",
      tip: "No Express ou Fastify, estruture seus middlewares em cascata: `[verificarTokenJWT, verificarPermissao, handler]`.",
      code: "// Pipeline de middlewares estritamente ordenado\nrouter.delete('/usuario/:id',\n  middlewareAutenticacao, // 1º: Valida o JWT e popula req.user (AuthN)\n  middlewareAutorizacao,  // 2º: Checa se req.user é admin (AuthZ)\n  controladorDelecao      // 3º: Executa a ação de negócio\n);"
    },
    {
      title: "Exemplo Prático da Sequência Defensiva",
      body: "Imagine uma requisição para transferir fundos bancários. Primeiro, o servidor extrai o token JWT do cabeçalho HTTP e valida a assinatura criptográfica e o tempo de expiração (Autenticação). Se for válido, o ID do usuário é extraído do token. Em seguida, o sistema verifica se aquele usuário específico é o titular legítimo da conta ou se possui procuração legal ativa para movimentá-la (Autorização).",
      tip: "Nunca confie em IDs de usuários passados no corpo da requisição ou na URL; utilize sempre o ID autenticado extraído do token.",
      code: "async function transferirHandler(req, res) {\n  // Inseguro: const titularId = req.body.usuarioId;\n  // Seguro: obter a identidade diretamente do token autenticado pelo middleware\n  const titularId = req.user.id; \n  \n  const podeTransferir = await checarPermissaoConta(titularId, req.body.contaOrigem);\n  if (!podeTransferir) return res.status(403).send('Não autorizado');\n}"
    }
  ],

  // Stage 11: PAPÉIS E PERMISSÕES (RBAC)
  [
    {
      title: "O Modelo de Papéis (RBAC)",
      body: "O Role-Based Access Control (RBAC) organiza o acesso dos usuários atribuindo-lhes papéis (como 'admin', 'editor', 'leitor') e associando permissões atômicas a esses papéis (como 'artigo:criar', 'artigo:deletar'). Esse modelo desacopla os usuários individuais das regras de permissão, facilitando a gestão de milhares de contas sem necessidade de configurar privilégios usuário por usuário.",
      tip: "Prefira autorizar verificando a permissão atômica (`temPermissao('artigo:editar')`) em vez do papel direto (`role === 'admin'`).",
      code: "-- Modelagem clássica e flexível de RBAC no banco de dados\nCREATE TABLE permissoes (\n  id INT PRIMARY KEY,\n  slug VARCHAR(50) UNIQUE -- ex: 'usuarios:excluir'\n);\n\nCREATE TABLE papeis_permissoes (\n  papel_id INT REFERENCES papeis(id),\n  permissao_id INT REFERENCES permissoes(id),\n  PRIMARY KEY (papel_id, permissao_id)\n);"
    },
    {
      title: "Evitando o Acoplamento de Telas com Permissões",
      body: "Um erro clássico de segurança é esconder botões na interface do usuário (frontend) e acreditar que a ação está protegida. Ocultar o botão 'Excluir Usuário' no React apenas melhora a experiência visual; qualquer pessoa pode abrir o console de rede e disparar uma chamada `fetch(DELETE)` diretamente contra a API. A autorização DEVE ser validada obrigatoriamente no backend a cada requisição.",
      tip: "Lembre-se: o frontend é um ambiente totalmente hostil e controlado pelo cliente; a segurança real só existe no servidor e no banco.",
      code: "// Frontend: esconde o botão para boa UX\n{podeExcluir && <BotaoDeletar />}\n\n// Backend: ONDE A SEGURANÇA REAL ACONTECE\napp.delete('/api/itens/:id', autenticar, (req, res) => {\n  if (!req.user.permissoes.includes('itens:excluir')) {\n    return res.status(403).json({ erro: 'Ação não permitida' });\n  }\n  // Exclui o item com segurança\n});"
    }
  ],

  // Stage 12: TOKENS E SESSÕES
  [
    {
      title: "Mantendo o Usuário Logado: Sessões vs JWT",
      body: "Aplicações baseadas em sessões armazenam um ID opaco no cookie do cliente e guardam os dados do usuário em um banco rápido (como Redis) no servidor. Já com JSON Web Tokens (JWT), o token é 'stateless': os dados do usuário e a assinatura criptográfica viajam dentro do próprio token codificado em Base64URL, permitindo que múltiplos microsserviços validem o token sem consultar um banco centralizado.",
      tip: "JWTs são excelentes para sistemas distribuídos, mas revogá-los imediatamente antes da expiração exige listas de bloqueio (blacklists).",
      code: "// Anatomia de um JWT gerado com biblioteca padronizada\nimport jwt from 'jsonwebtoken';\n\nconst token = jwt.sign(\n  { sub: usuario.id, role: usuario.role },\n  process.env.JWT_SECRET,\n  { expiresIn: '15m' } // Tempo de vida curto é mandatório por segurança\n);"
    },
    {
      title: "Protegendo os Tokens de Acesso",
      body: "Guardar tokens JWT no LocalStorage do navegador expõe a sessão inteira a ataques de roubo via Cross-Site Scripting (XSS), pois qualquer script malicioso injetado pode ler o LocalStorage. A abordagem recomendada pela OWASP para SPAs é armazenar o token em Cookies HTTP com as flags: `HttpOnly` (impede leitura via JavaScript), `Secure` (trafega apenas via HTTPS) e `SameSite=Strict` (mitiga CSRF).",
      tip: "Configure seus cookies de autenticação sempre com `httpOnly: true` e `sameSite: 'strict'` para blindar as sessões contra XSS.",
      code: "// Enviando cookie de autenticação blindado contra leitura via JavaScript\nres.cookie('token_acesso', jwtToken, {\n  httpOnly: true, // Protege contra XSS (document.cookie não enxerga)\n  secure: true,   // Exige conexão HTTPS cifrada\n  sameSite: 'strict', // Protege contra CSRF\n  maxAge: 15 * 60 * 1000 // 15 minutos\n});"
    }
  ],

  // Stage 13: COMO A INJEÇÃO ACONTECE
  [
    {
      title: "O Pesadelo da Injeção (SQL Injection)",
      body: "A injeção de SQL (SQLi) ocorre quando dados enviados pelo usuário são concatenados diretamente em uma instrução SQL sem sanitização ou parametrização. O motor do banco de dados não consegue distinguir onde termina a lógica da consulta e onde começam os dados de entrada, permitindo que caracteres como aspas simples (`'`) alterem a sintaxe da consulta e executem comandos arbitrários.",
      tip: "A injeção de SQL liderou a lista da OWASP por décadas; ela permite ler senhas, apagar tabelas inteiras ou assumir o servidor.",
      code: "// CÓDIGO VULNERÁVEL (NUNCA FAÇA ISSO!):\nconst query = `SELECT * FROM usuarios WHERE email = '${req.body.email}'`;\n// Se o atacante enviar: ' OR '1'='1\n// A query executada se torna:\n// SELECT * FROM usuarios WHERE email = '' OR '1'='1'; (Retorna todos os usuários!)"
    },
    {
      title: "Impactos Extremos da Injeção",
      body: "Em casos severos de SQL Injection, atacantes usam comandos empilhados (stacked queries) para executar comandos destrutivos como `DROP TABLE` ou utilizam funções de leitura de arquivos e execução de comandos do sistema operacional suportadas por bancos como PostgreSQL e SQL Server (`xp_cmdshell`), obtendo controle remoto total da máquina física do servidor.",
      tip: "Audite o código legado procurando concatenações de strings em queries de banco; este é o bug mais crítico da web.",
      code: "// Payload malicioso destruindo o banco via injeção:\n// email = \"admin@empresa.com'; DROP TABLE transacoes; --\"\n// Query resultante:\n// SELECT * FROM usuarios WHERE email = 'admin@empresa.com'; DROP TABLE transacoes; --'"
    }
  ],

  // Stage 14: QUERIES PARAMETRIZADAS
  [
    {
      title: "A Cura: Queries Parametrizadas (Prepared Statements)",
      body: "A solução universal e definitiva contra a injeção de SQL é a parametrização de consultas (Prepared Statements). Com ela, a estrutura do comando SQL é enviada previamente ao banco e pré-compilada. Os dados do usuário são transmitidos separadamente como literais atômicos. Mesmo que a entrada contenha comandos como `DROP TABLE` ou `' OR '1'='1`, ela será tratada estritamente como uma string inofensiva.",
      tip: "Sempre use placeholders (`$1, $2` no Postgres ou `?` no MySQL); nunca interpole strings com template literals em queries SQL.",
      code: "// SEGURO: Parâmetros passados separadamente como argumentos\nconst query = 'SELECT * FROM usuarios WHERE email = $1 AND ativo = $2';\nconst valores = [req.body.email, true];\n\n// O driver envia a consulta compilada e os parâmetros isolados\nconst resultado = await db.query(query, valores);"
    },
    {
      title: "A Vantagem dos ORMs Modernos",
      body: "Ferramentas modernas de mapeamento objeto-relacional (ORMs e Query Builders) como Prisma, Drizzle, TypeORM e Kysely utilizam Prepared Statements sob o capô por padrão em todos os seus métodos de busca e mutação. No entanto, é fundamental manter a cautela: se o desenvolvedor utilizar funções de 'raw query' (queries brutas) interpolando strings manualmente, o risco de SQLi retorna integralmente.",
      tip: "Ao usar queries cruas no Prisma (`$queryRaw`) ou Drizzle, utilize as tags de template nativas do ORM que geram placeholders seguros.",
      code: "// Prisma: seguro por padrão utilizando prepared statements internamente\nconst usuario = await prisma.usuario.findUnique({\n  where: { email: req.body.email } // Totalmente imune a SQL Injection\n});\n\n// Se usar raw query, use a tagged template function nativa:\nconst itens = await prisma.$queryRaw`SELECT * FROM itens WHERE preco > ${valor};`;"
    }
  ],

  // Stage 15: OUTRAS DEFESAS DE DADOS
  [
    {
      title: "NoSQL Também Sofre Injeção",
      body: "Existe um mito comum de que bancos NoSQL (como MongoDB) são imunes a ataques de injeção. Na prática, o MongoDB aceita objetos em suas consultas: se um endpoint recebe diretamente o `req.body` em formato JSON e o atacante envia `{\"senha\": {\"$gt\": \"\"}}`, o operador `$gt` (maior que) faz a condição retornar verdadeiro para qualquer senha, permitindo login sem credenciais.",
      tip: "Sempre valide os tipos das entradas: garanta que strings sejam realmente primitivos do tipo string e não objetos JSON aninhados.",
      code: "// Vulnerável em MongoDB:\n// db.usuarios.find({ email: req.body.email, senha: req.body.senha });\n// Se o atacante enviar { senha: { $ne: null } }, ele burla a senha!\n\n// Seguro: forçar tipo primitivo de string\nconst senhaString = String(req.body.senha);\ndb.usuarios.find({ email: String(req.body.email), senha: senhaString });"
    },
    {
      title: "Defesa Baseada em Validação Estrita",
      body: "A proteção de dados exige a combinação de princípios: parametrização no banco, tipagem estrita no backend e sanitização contextual. Além de impedir injeções, validações que restringem tamanho máximo de strings e rejeitam caracteres de controle evitam estouro de buffer, consumo excessivo de memória no motor de serialização JSON e ataques de negação de serviço em expressões regulares (ReDoS).",
      tip: "Adote a estratégia 'whitelist' (permitir apenas o que é expressamente esperado) em vez de 'blacklist' (tentar bloquear palavras proibidas).",
      code: "// Validação whitelist com regex restritiva para código postal\nfunction validarCep(cep) {\n  const padrao = /^\\d{5}-\\d{3}$/;\n  if (!padrao.test(cep)) {\n    throw new Error('Formato de CEP inválido');\n  }\n  return cep;\n}"
    }
  ],

  // Stage 16: O QUE É XSS
  [
    {
      title: "Ameaça Invisível: Cross-Site Scripting (XSS)",
      body: "O Cross-Site Scripting (XSS) ocorre quando uma aplicação web inclui dados não confiáveis em uma página sem validação ou escape adequados, permitindo que um invasor execute scripts JavaScript arbitrários no navegador da vítima. O XSS divide-se em: Armazenado (Stored - gravado no banco e exibido para todos), Refletido (Reflected - via parâmetros de URL) e baseado em DOM.",
      tip: "Nunca utilize propriedades como `innerHTML` ou `dangerouslySetInnerHTML` com entradas vindas de usuários ou URLs.",
      code: "<!-- Exemplo vulnerável em HTML puro -->\n<div id=\"comentario\"></div>\n<script>\n  // Se o comentário salvo for: <img src=x onerror=\"alert('XSS')\" />\n  document.getElementById('comentario').innerHTML = comentarioDoBanco; // VULNERÁVEL!\n</script>"
    },
    {
      title: "Consequências Catastróficas do XSS",
      body: "Como o código JavaScript injetado via XSS roda com os mesmos privilégios do usuário legítimo dentro da sessão do navegador, o invasor pode ler tokens no LocalStorage, capturar teclas digitadas no teclado (Keylogging), forçar ações financeiras simulando cliques legítimos e redirecionar a vítima para páginas falsas de phishing perfeitas sem alterar o domínio na barra de endereços.",
      tip: "Utilize uma política rígida de Content Security Policy (CSP) nos cabeçalhos HTTP para impedir a execução de scripts inline não autorizados.",
      code: "// Cabeçalho HTTP de Content Security Policy (CSP) mitigando execução de XSS\n// Content-Security-Policy: default-src 'self'; script-src 'self';\napp.use((req, res, next) => {\n  res.setHeader(\"Content-Security-Policy\", \"default-src 'self'; script-src 'self'\");\n  next();\n});"
    }
  ],

  // Stage 17: O QUE É CSRF
  [
    {
      title: "Falsificação de Pedidos (CSRF)",
      body: "O Cross-Site Request Forgery (CSRF) é um ataque que induz um usuário autenticado a executar ações não intencionais em uma aplicação web na qual ele está autenticado no momento. Como navegadores anexam cookies de sessão automaticamente em requisições de terceiros por padrão histórico, uma página maliciosa pode conter formulários invisíveis que disparam transferências bancárias ou trocas de senha.",
      tip: "O CSRF explora a confiança que o servidor deposita no navegador do usuário autenticado por meio do envio automático de cookies.",
      code: "<!-- Site malicioso (evil.com) com formulário invisível de auto-submissão -->\n<form action=\"https://banco.com/transferir\" method=\"POST\" id=\"hackForm\">\n  <input type=\"hidden\" name=\"destinatario\" value=\"hacker\" />\n  <input type=\"hidden\" name=\"valor\" value=\"5000\" />\n</form>\n<script>document.getElementById('hackForm').submit();</script>"
    },
    {
      title: "Diferença Entre XSS e CSRF",
      body: "A distinção fundamental é: no XSS, o atacante explora a confiança que o usuário deposita em um site específico (conseguindo rodar JavaScript dentro do domínio vulnerável). No CSRF, o atacante explora a confiança que o servidor deposita no navegador do usuário (forçando o navegador a despachar requisições com cookies válidos sem precisar roubar o script do site).",
      tip: "Se sua API utiliza apenas tokens no cabeçalho `Authorization: Bearer` (sem cookies automáticos), ela já é imune por natureza ao CSRF.",
      code: "// Autenticação baseada em Header Bearer: imune a CSRF tradicional\n// Navegadores NUNCA anexam cabeçalhos personalizados 'Authorization' automaticamente em links externos\nfetch('/api/transferir', {\n  method: 'POST',\n  headers: { 'Authorization': `Bearer ${token}` }\n});"
    }
  ],

  // Stage 18: MITIGANDO XSS E CSRF
  [
    {
      title: "Neutralizando o XSS: Escape e Sanitização",
      body: "Para neutralizar o XSS, todo caractere especial com significado sintático em HTML (`<`, `>`, `&`, `\"`, `'`) deve ser convertido em suas entidades HTML correspondentes (`&lt;`, `&gt;`, `&amp;`) antes da renderização na tela. Frameworks modernos como React, Vue e Angular aplicam esse escape automaticamente por padrão ao interpolar variáveis de estado (`{variavel}`), impedindo a interpretação de tags como tags reais.",
      tip: "Se precisar aceitar HTML formatado do usuário (como editores rich-text), use bibliotecas consolidadas de sanitização como DOMPurify.",
      code: "// Sanitização de HTML rico usando DOMPurify antes da renderização\nimport DOMPurify from 'dompurify';\n\nconst htmlSujo = '<p>Texto limpo</p><script>alert(\"hack\")</script>';\nconst htmlSeguro = DOMPurify.sanitize(htmlSujo);\n// Resultado limpo: '<p>Texto limpo</p>'"
    },
    {
      title: "Defendendo-se do CSRF: SameSite e Anti-CSRF Tokens",
      body: "A proteção mais eficiente contra CSRF hoje é o atributo `SameSite=Lax` ou `SameSite=Strict` nos cookies de autenticação. Essa instrução diz ao navegador para não enviar o cookie se a requisição originar de um site externo. Para formulários tradicionais renderizados no servidor, utiliza-se o padrão Synchronizer Token (Anti-CSRF Token), inserindo um valor aleatório secreto e efêmero em cada formulário.",
      tip: "Defina `SameSite=Lax` como padrão mínimo absoluto em todos os cookies da sua aplicação para barrar CSRF na raiz.",
      code: "// Configuração de Cookie moderno mitigando CSRF automaticamente\nres.cookie('sessao', sessionId, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'lax' // O navegador bloqueia o envio deste cookie em requisições de sites externos\n});"
    }
  ],

  // Stage 19: NÃO COMMITE SEGREDOS
  [
    {
      title: "O Veneno no Repositório",
      body: "Chaves de API da AWS, strings de conexão de bancos de dados com senhas, certificados SSL e segredos JWT nunca devem ser escritos diretamente no código-fonte nem comitados no Git. Uma vez que o código é empurrado para o GitHub (mesmo em repositórios privados que podem se tornar públicos por engano), ferramentas automatizadas de varredura capturam essas chaves em segundos.",
      tip: "Instale ferramentas de pré-commit como `gitleaks` ou `git-secrets` para impedir commits acidentais de senhas na sua máquina.",
      code: "# Instalando e rodando varredura com Gitleaks para detectar segredos no repositório\ngitleaks detect --source . -v\n# Bloqueia commits locais contendo credenciais suspeitas"
    },
    {
      title: "Histórico Permanente do Git",
      body: "Fazer um novo commit apagando uma senha exposta NÃO resolve o problema. O Git é um sistema de controle de versão imutável que preserva todo o histórico de snapshots anteriores. Qualquer pessoa que clone o projeto pode voltar ao commit antigo e extrair a chave exposta. Se uma chave vazar para o repositório, ela deve ser considerada imediatamente comprometida e revogada no provedor.",
      tip: "Se comitar uma chave acidentalmente, revogue-a imediatamente no provedor (AWS, Stripe, Supabase); não basta deletar o commit.",
      code: "# Para expurgar um arquivo permanentemente de todo o histórico do Git\ngit filter-repo --path arquivo-secreto.env --invert-paths\n# E O MAIS IMPORTANTE: Acesse o painel do serviço e regenere a chave imediatamente!"
    }
  ],

  // Stage 20: USANDO ARQUIVO .ENV
  [
    {
      title: "A Solução das Variáveis de Ambiente",
      body: "O manifesto 'The Twelve-Factor App' estipula que toda configuração e segredo volátil de um sistema deve ser estritamente separado do código e injetado em tempo de execução via Variáveis de Ambiente (Environment Variables). Em desenvolvimento local, utilizamos arquivos `.env` para carregar esses valores na memória do processo da aplicação sem que eles façam parte dos arquivos versionados.",
      tip: "Crie sempre um arquivo `.env.example` no repositório contendo apenas os nomes das variáveis com valores vazios como modelo para o time.",
      code: "# .env (Arquivo local secreto - JAMAIS envie ao Git)\nDATABASE_URL=postgresql://app:segredo123@localhost:5432/meubanco\nJWT_SECRET=chave_super_longa_e_aleatoria_com_64_caracteres\n\n# .env.example (Pode ser commitado no Git como modelo)\nDATABASE_URL=\nJWT_SECRET="
    },
    {
      title: "Bloqueando o .env com .gitignore",
      body: "A regra de ouro de qualquer projeto que utilize arquivos `.env` é garantir que o arquivo `.gitignore` contenha `.env` e suas variações (`.env.local`, `.env.production`) antes do primeiro commit ser realizado. Adicionar ao `.gitignore` impede que o comando `git add .` inclua os arquivos locais de credenciais no índice de rastreamento do repositório.",
      tip: "Verifique o status do git com `git status` antes de comitar para confirmar que seus arquivos `.env` não estão sendo rastreados.",
      code: "# Conteúdo obrigatório no arquivo .gitignore na raiz do projeto:\n.env\n.env.*\n!.env.example\nnode_modules/\ndist/"
    }
  ],

  // Stage 21: GERENCIANDO SEGREDOS
  [
    {
      title: "Separando Ambientes (Dev, Staging e Prod)",
      body: "Cada ambiente deve operar com credenciais e chaves totalmente isoladas. Jamais reutilize chaves de APIs de produção ou senhas de bancos reais no ambiente de desenvolvimento local dos programadores. Um bug em um script de testes local rodando em máquina de desenvolvimento poderia acidentalmente apagar dados de faturamento reais de clientes em produção se o banco for compartilhado.",
      tip: "Utilize chaves de modo de teste (test mode) fornecidas por gateways de pagamento como Stripe durante o desenvolvimento local.",
      code: "// Carregamento condicional baseado na variável de ambiente NODE_ENV\nconst isProd = process.env.NODE_ENV === 'production';\nconst stripeKey = isProd \n  ? process.env.STRIPE_LIVE_KEY \n  : process.env.STRIPE_TEST_KEY;"
    },
    {
      title: "Gerenciadores Seguros em Produção",
      body: "Em servidores de produção, arquivos `.env` soltos em disco não são a solução ideal. Plataformas modernas (Vercel, AWS Secrets Manager, HashiCorp Vault, Doppler) injetam variáveis diretamente na memória dos contêineres e funções serverless com criptografia de ponta a ponta, auditoria de acesso de funcionários e suporte a rotação automática de chaves sem indisponibilidade do serviço.",
      tip: "Adote ferramentas como Doppler ou AWS Secrets Manager se seu time tiver múltiplos desenvolvedores acessando dezenas de microsserviços.",
      code: "# Injetando segredos diretamente no container Docker sem arquivos no disco\ndocker run -e DATABASE_URL=\"$SECRET_DB_URL\" -p 3000:3000 minha-api:latest"
    }
  ],

  // Stage 22: VALIDANDO ENTRADAS
  [
    {
      title: "Validação em Duas Camadas",
      body: "A validação de dados deve ocorrer em duas camadas com propósitos distintos: no frontend, para oferecer feedback instantâneo ao usuário e evitar requisições desnecessárias; e no backend, de forma obrigatória e irrestrita, para garantir a segurança e a consistência do sistema. Como qualquer cliente HTTP pode ignorar as regras do navegador, nunca confie exclusivamente em validações de frontend.",
      tip: "Considere qualquer dado vindo de fora (corpo, query params, headers, cookies) como potencialmente hostil até que seja validado.",
      code: "// Validação no frontend: excelente para UX rápida\n// Validação no backend: OBRIGATÓRIA para segurança do banco de dados\napp.post('/usuarios', (req, res) => {\n  const resultado = validarEntrada(req.body);\n  if (!resultado.sucesso) return res.status(400).json({ erros: resultado.erros });\n});"
    },
    {
      title: "O Poder do Zod e Bibliotecas de Schema",
      body: "Bibliotecas de validação declarativa de schemas como Zod, Yup ou Valibot permitem definir a forma exata esperada para os dados de entrada. Elas realizam 'parsing': se a entrada estiver em conformidade, retornam um objeto tipado seguro; se houver campos a mais ou tipos inconsistentes (como números no lugar de strings), os dados malformados são limpos ou a requisição é rejeitada.",
      tip: "Utilize `.strip()` ou o comportamento padrão do Zod para remover campos inesperados injetados maliciosamente no corpo da requisição.",
      code: "import { z } from 'zod';\n\n// Definição estrita do schema de entrada com validações de negócio\nconst RegistroSchema = z.object({\n  nome: z.string().min(3).max(100),\n  email: z.string().email(),\n  idade: z.number().int().min(18).max(120)\n});\n\n// Parsing seguro da entrada na rota da API\nconst dadosLimpos = RegistroSchema.parse(req.body);"
    }
  ],

  // Stage 23: LIMITANDO TENTATIVAS
  [
    {
      title: "Ataques de Força Bruta e Dicionário",
      body: "Ataques de força bruta consistem em enviar milhares de palpites de senhas ou códigos de verificação por segundo contra endpoints de login ou recuperação de conta usando ferramentas automatizadas. Se a sua API permitir requisições ilimitadas sem impor limites temporais ou bloqueios progressivos, senhas previsíveis serão eventualmente descobertas pelos atacantes.",
      tip: "Adicione atrasos progressivos (delays) ou CAPTCHAs inteligentes (Cloudflare Turnstile) após 3 tentativas de login incorretas.",
      code: "-- Acompanhamento de tentativas consecutivas de login falhas por IP\nCREATE TABLE tentativas_login (\n  ip VARCHAR(45) PRIMARY KEY,\n  falhas INT DEFAULT 1,\n  bloqueado_ate TIMESTAMPTZ\n);"
    },
    {
      title: "Rate Limiting como Defesa Essencial",
      body: "O Rate Limiting impõe um teto ao número de requisições que um determinado cliente (identificado por endereço IP ou token de usuário) pode efetuar em uma janela de tempo. Por exemplo: no máximo 5 tentativas de login por minuto. Se o limite for excedido, o servidor rejeita as requisições subsequentes com o status HTTP 429 Too Many Requests, protegendo CPU e banco de sobrecarga.",
      tip: "Utilize Redis em conjunto com algoritmos como Token Bucket ou Sliding Window para gerenciar contadores de rate limit em clusters.",
      code: "import rateLimit from 'express-rate-limit';\n\n// Limitador estrito para rotas de autenticação\nconst limitadorLogin = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutos\n  max: 5,                   // Máximo de 5 tentativas por IP\n  message: { erro: 'Muitas tentativas. Tente novamente em 15 minutos.' }\n});\n\napp.post('/api/login', limitadorLogin, handlerLogin);"
    }
  ],

  // Stage 24: ENTENDENDO CORS
  [
    {
      title: "O que é CORS e Políticas do Navegador",
      body: "O Cross-Origin Resource Sharing (CORS) é um mecanismo de segurança implementado pelos navegadores que restringe como recursos em uma página podem solicitar dados de outro domínio, porta ou protocolo diferente da origem da página atual. O CORS protege os usuários e não o servidor: ele impede que um site malicioso leia dados restritos da sua API usando a sessão do navegador da vítima.",
      tip: "O CORS é uma restrição imposta exclusivamente por navegadores; ferramentas como cURL, Postman ou scripts backend ignoram o CORS.",
      code: "// Requisição Preflight automática disparada pelo navegador com verbo OPTIONS:\n// OPTIONS /api/dados HTTP/1.1\n// Origin: https://meusite.com\n// Access-Control-Request-Method: POST"
    },
    {
      title: "Configurando o CORS com Cuidado",
      body: "A armadilha mais perigosa cometida por desenvolvedores iniciantes para silenciar erros de CORS no console do navegador é configurar `Access-Control-Allow-Origin: *` juntamente com credenciais ativadas. Isso abre a API para ser consultada por qualquer site da internet. A configuração segura lista explicitamente apenas os domínios confiáveis do seu frontend que possuem autorização de acesso.",
      tip: "Nunca use `origin: '*'` em APIs que lidam com dados autenticados por cookies ou sessões privadas.",
      code: "import cors from 'cors';\n\n// Configuração profissional com lista restrita de origens confiáveis\nconst origensPermitidas = ['https://meuapp.com', 'https://admin.meuapp.com'];\n\napp.use(cors({\n  origin: (origem, callback) => {\n    if (!origem || origensPermitidas.includes(origem)) callback(null, true);\n    else callback(new Error('Origem bloqueada por CORS'));\n  },\n  credentials: true\n}));"
    }
  ],

  // Stage 25: O QUE É DADO PESSOAL
  [
    {
      title: "A Definição de Dado Pessoal perante a Lei",
      body: "Sob legislações de privacidade como a LGPD (Brasil) e GDPR (Europa), dado pessoal é qualquer informação relacionada a uma pessoa natural identificada ou identificável. Isso inclui não apenas nome completo, CPF e RG, mas também identificadores indiretos que, combinados, permitem individualizar o usuário: endereços IP de conexão, cookies de rastreamento, geolocalização e histórico de navegação.",
      tip: "Se um conjunto de dados técnicos permite apontar quem é o indivíduo, ele é classificado legalmente como dado pessoal.",
      code: "-- Dados cadastrais e técnicos sujeitos às regras da LGPD\nCREATE TABLE dados_titular (\n  id UUID PRIMARY KEY,\n  nome TEXT,                  -- Dado pessoal direto\n  cpf CHAR(11) UNIQUE,        -- Dado pessoal direto\n  ultimo_ip_acesso TEXT       -- Dado pessoal indireto\n);"
    },
    {
      title: "Dados Pessoais Sensíveis e Seus Riscos",
      body: "A legislação estabelece uma categoria especial de maior rigor: os Dados Pessoais Sensíveis. São dados sobre origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, dados genéticos, biométricos ou relativos à saúde e vida sexual. O tratamento desses dados exige bases legais muito mais estritas, consentimento explícito e medidas avançadas de isolamento criptográfico.",
      tip: "Evite coletar dados sensíveis se eles não forem estritamente indispensáveis para o propósito principal do aplicativo.",
      code: "-- Dados sensíveis exigem criptografia em repouso e controle de auditoria de acesso\nCREATE TABLE prontuarios_saude (\n  id UUID PRIMARY KEY,\n  paciente_id UUID REFERENCES dados_titular(id),\n  diagnostico_cifrado BYTEA NOT NULL, -- Criptografado com chave AES dedicada\n  auditoria_motivo TEXT NOT NULL\n);"
    }
  ],

  // Stage 26: PRINCÍPIOS DA LGPD
  [
    {
      title: "Finalidade, Necessidade e Adequação",
      body: "Os princípios centrais da LGPD determinam que o tratamento de dados deve ter propósitos legítimos e específicos informados ao titular (Finalidade) e limitar-se ao mínimo estritamente necessário para alcançar esses objetivos (Necessidade). Solicitar o CPF ou a profissão de um usuário para ele apenas ler um artigo de blog viola o princípio da necessidade e expõe a empresa a penalidades administrativas.",
      tip: "Pratique o princípio da 'Minimização de Dados': só colete campos que seu sistema realmente utilizará para operar.",
      code: "// Antipadron: coletar dezenas de dados supérfluos no cadastro\n// { nome, email, cpf, nomeMae, religiao, salario }\n\n// Bom (Minimização de Dados): colete apenas o essencial para a funcionalidade\nconst dadosRegistroEssenciais = { nome, email, senhaHash };"
    },
    {
      title: "Transparência Total e Consentimento Livre",
      body: "O titular dos dados tem o direito garantido de saber exatamente como seus dados são coletados, onde são armazenados e com quem são compartilhados. O consentimento, quando utilizado como base legal, deve ser uma manifestação livre, informada e inequívoca. Checkboxes pré-marcados de 'aceito receber ofertas de parceiros' são considerados nulos perante a legislação.",
      tip: "Mantenha registros com data, hora e versão do termo de privacidade que o usuário aceitou para fins de conformidade jurídica.",
      code: "-- Registro auditável de consentimento do usuário\nCREATE TABLE registros_consentimento (\n  usuario_id UUID REFERENCES usuarios(id),\n  versao_termos VARCHAR(10) NOT NULL,\n  consentiu_em TIMESTAMPTZ DEFAULT now(),\n  ip_consentimento VARCHAR(45) NOT NULL\n);"
    }
  ],

  // Stage 27: DIREITOS DO USUÁRIO
  [
    {
      title: "Os Direitos do Titular (Acesso e Exclusão)",
      body: "A LGPD garante ao cidadão o direito de confirmar a existência de tratamento, acessar seus dados completos, corrigir dados incompletos ou inexatos, solicitar a portabilidade para outro fornecedor e exigir a eliminação (direito ao esquecimento) dos dados tratados com base no consentimento. Sua arquitetura de software deve ser projetada para viabilizar essas operações sob demanda.",
      tip: "Implemente rotas para exportação de dados em JSON estruturado e exclusão completa da conta do usuário.",
      code: "// Rota de conformidade LGPD: exportação completa dos dados do titular\napp.get('/api/meus-dados/exportar', autenticar, async (req, res) => {\n  const dadosCompletos = await coletarTodosOsDadosDoUsuario(req.user.id);\n  res.attachment('meus_dados_lgpd.json').json(dadosCompletos);\n});"
    },
    {
      title: "Processos de Vazamento e Notificação de Incidentes",
      body: "Em caso de incidente de segurança relevante que envolva dados pessoais, a legislação impõe o dever de comunicar a Autoridade Nacional de Proteção de Dados (ANPD) e os titulares afetados em prazo razoável. O comunicado deve descrever a natureza dos dados violados, as medidas técnicas tomadas para conter os danos e os riscos potenciais para os cidadãos impactados.",
      tip: "Mantenha um Plano de Resposta a Incidentes (IRP) documentado com responsáveis pré-definidos para situações de crise.",
      code: "// Estrutura formal de log de contenção de incidentes de segurança\nconst registroIncidente = {\n  dataDetecao: new Date().toISOString(),\n  vetorAtaque: 'Vazamento de credencial de API',\n  impactoEstimado: '150 contas comprometidas',\n  acoesImediatas: ['Chaves revogadas', 'Sessões invalidadas', 'ANPD notificada']\n};"
    }
  ],

  // Stage 28: CHECKLIST DE LANÇAMENTO
  [
    {
      title: "Checagem de Infraestrutura e Rede",
      body: "Antes de abrir as portas do sistema para o tráfego público de produção, uma checagem rigorosa de infraestrutura deve ser concluída: verificar se o tráfego HTTP é forçosamente redirecionado para HTTPS com certificados TLS válidos, checar se portas administrativas de bancos de dados estão inacessíveis pela internet pública e validar se cabeçalhos de segurança (HSTS, CSP, X-Frame-Options) estão ativados.",
      tip: "Utilize a biblioteca `helmet` no ecossistema Node.js para configurar cabeçalhos HTTP de segurança com apenas uma linha de código.",
      code: "import helmet from 'helmet';\n\n// Ativa automaticamente 15 proteções via cabeçalhos HTTP essenciais\napp.use(helmet());"
    },
    {
      title: "Checagem do Código e Auditoria de Logs",
      body: "A auditoria pré-lançamento do código deve certificar que nenhum `console.log` está imprimindo senhas, dados bancários ou tokens JWT nos logs do servidor. Além de consumir espaço em disco, logs contendo dados confidenciais violam a privacidade e se tornam alvos fáceis se a ferramenta de agregação de logs (Datadog, Grafana) sofrer acesso indevido.",
      tip: "Configure mascaramento automático de campos sensíveis (como 'senha' e 'cartao') no seu formatador de logs (ex: Winston ou Pino).",
      code: "// Formatador de logs com mascaramento preventivo de dados sensíveis\nimport pino from 'pino';\n\nconst logger = pino({\n  redact: ['senha', 'cartao.numero', 'token', '*.jwt'] // Mascara esses campos como [Redacted]\n});\nlogger.info({ usuario: 'ana', senha: '123' }, 'Tentativa de login');"
    }
  ],

  // Stage 29: ANÁLISE DE CENÁRIOS
  [
    {
      title: "Planejamento de Recuperação de Desastres (DRP)",
      body: "Um Disaster Recovery Plan (DRP) define como a organização restaura suas operações após eventos catastróficos, como sequestro de dados por ransomware, corrupção acidental do banco de dados ou indisponibilidade total de uma região de datacenter na nuvem. Os pilares do DRP são o RTO (tempo máximo aceitável para o sistema voltar ao ar) e o RPO (volume máximo aceitável de dados perdidos).",
      tip: "Um backup não testado não existe: execute testes periódicos de restauração de dumps de banco para validar se eles funcionam de verdade.",
      code: "# Testando a restauração de um backup de banco em ambiente isolado de teste\npg_restore --clean --if-exists -h localhost -U postgres -d banco_teste backup_2026.dump\n# Validação de integridade do schema e dos dados restaurados"
    },
    {
      title: "Testes de Penetração e Auditorias Frequentes",
      body: "A segurança de um sistema não é um estado definitivo, mas um processo contínuo de vigilância. Conforme novas funcionalidades são adicionadas, novas brechas podem surgir. Realizar auditorias externas periódicas e submeter a aplicação a testes de intrusão éticos (Penetration Testing ou Pentests) permite identificar e remediar vulnerabilidades antes que invasores reais as explorem.",
      tip: "Incentive relatórios responsáveis de bugs criando um arquivo `security.txt` público no domínio da sua aplicação.",
      code: "# Arquivo https://meusite.com/.well-known/security.txt\nContact: mailto:seguranca@meusite.com\nExpires: 2027-12-31T23:59:59.000Z\nPreferred-Languages: pt, en\nPolicy: https://meusite.com/politica-divulgacao-responsavel"
    }
  ],

  // Stage 30: PROJETO FINAL DE SEGURANÇA
  [
    {
      title: "Um Jogo de Camadas: A Visão Sistêmica",
      body: "Parabéns por concluir a trilha de Segurança! Você aprendeu que proteger aplicações não consiste em aplicar uma bala de prata mágica, mas em orquestrar harmoniosamente múltiplas camadas integradas: modelagem de ameaças com menor privilégio, hashing seguro de senhas com algoritmos lentos, isolamento de acessos com RBAC e JWTs protegidos, higienização rigorosa contra injeções e conformidade legal estrita.",
      tip: "A segurança mais eficiente é invisível para o usuário legítimo e intransponível para o atacante.",
      code: "-- Certificação de conclusão em Engenharia de Software Seguro\nSELECT \n  'Security Champion' AS titulo,\n  now() AS emitido_em,\n  'Sistemas construídos com princípios sólidos de segurança resistem ao tempo' AS conclusao;"
    },
    {
      title: "Vigilância, Estudos e Cultura de Segurança",
      body: "O cenário de cibersegurança é dinâmico e evolui constantemente. Manter-se atualizado com publicações de segurança, seguir as atualizações dos guias da OWASP (Open Web Application Security Project) e fomentar uma cultura de responsabilidade compartilhada no time de engenharia são as práticas definitivas para construir produtos digitais confiáveis, éticos e resilientes ao longo de toda a sua jornada profissional.",
      tip: "Acompanhe as divulgações do CVE (Common Vulnerabilities and Exposures) para manter suas bibliotecas e frameworks sempre seguros.",
      code: "// Uma cultura técnica sólida transforma desenvolvedores em sentinelas do produto\nconst culturaSeguranca = {\n  codeReview: 'Checar permissões e validações em cada PR',\n  ciCd: 'Varredura automática com SAST e npm audit',\n  monitoramento: 'Alertas em tempo real de picos de acessos e erros 403'\n};"
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
console.log('Successfully updated course-security.json');
