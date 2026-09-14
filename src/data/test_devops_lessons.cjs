const fs = require('fs');

const devopsLessons = [
  // Stage 1: CULTURA DEVOPS
  [
    {
      title: "Cultura DevOps e o Framework CALMS",
      body: "DevOps não é apenas um conjunto de ferramentas ou um cargo isolado, mas uma profunda transformação cultural que integra equipes de Desenvolvimento e Operações. O framework CALMS resume os pilares essenciais dessa filosofia: Cultura de colaboração empática, Automação de processos repetitivos, princípios Lean para eliminar desperdícios de fluxo, Medição constante de métricas operacionais e Compartilhamento aberto de conhecimento entre times multidisciplinares.",
      tip: "Não comece sua jornada DevOps comprando ferramentas caras. Foque primeiro em alinhar incentivos entre desenvolvedores e operadores, estabelecendo metas comuns de estabilidade e velocidade.",
      code: "# Medindo o Lead Time através do histórico de commits\ngit log --pretty=format:\"%ad | %s\" --date=short -n 5\necho \"Analise o intervalo entre commits e deploys para guiar melhorias no fluxo de trabalho.\""
    },
    {
      title: "Feedback Loops Curtos e Redução de Lotes",
      body: "O objetivo central da entrega contínua é encurtar os ciclos de feedback (feedback loops). Quando um desenvolvedor faz commit, validações automáticas devem retornar o status em minutos, e não em semanas. De acordo com a teoria das filas e métodos ágeis, trabalhar com lotes pequenos de código reduz o trabalho em progresso (WIP), minimiza conflitos de merge e diminui expressivamente o custo cognitivo e financeiro de corrigir defeitos em produção.",
      tip: "Mantenha o tempo total de execução do seu pipeline de validação inicial abaixo de 10 minutos. Pipelines lentos incentivam desenvolvedores a acumular commits gigantes e ignorar quebras.",
      code: "# Exemplo de feedback imediato no push via script de CI\nnpm run lint --silent\nnpm test -- --bail --findRelatedTests $(git diff --name-only HEAD~1)\necho \"Feedback rápido concluído: código seguro para integrar ao branch compartilhado!\""
    }
  ],

  // Stage 2: CULTURA DEVOPS
  [
    {
      title: "Derrubando Silos entre Dev e Ops",
      body: "Historicamente, Desenvolvimento e Operações operavam em silos isolados com incentivos conflitantes: desenvolvedores eram recompensados por entregar novas funcionalidades rapidamente, enquanto operadores eram avaliados pela estabilidade do ambiente. 'Jogar o código por cima do muro' gerava deploys noturnos traumáticos, acusações mútuas e indisponibilidades. DevOps unifica esses objetivos em torno da entrega de valor sustentável ao usuário final.",
      tip: "Adote a mentalidade 'You build it, you run it'. Quando os mesmos engenheiros que codificam participam do suporte e sustentação em produção, o cuidado com logs e resiliência aumenta organicamente.",
      code: "{\n  \"service\": \"payment-gateway\",\n  \"owner_squad\": \"checkout-team\",\n  \"on_call_rotation\": \"squad-engineers\",\n  \"health_endpoint\": \"/healthz\",\n  \"alert_channel\": \"#squad-checkout-alerts\"\n}"
    },
    {
      title: "Responsabilidade Compartilhada e Post-mortems Blameless",
      body: "A responsabilidade compartilhada estabelece que qualidade, segurança e confiabilidade são deveres de toda a equipe de engenharia. Quando incidentes críticos ocorrem, equipes maduras realizam Post-mortems Blameless (sem atribuição de culpa individual). O foco investigativo não é punir quem executou o comando que causou a queda, mas identificar quais salvaguardas sistêmicas, testes e automações falharam em proteger o operador humano.",
      tip: "Se um engenheiro derrubou a produção ao rodar um comando manual, a verdadeira falha do sistema foi permitir que um comando manual destrutivo pudesse ser executado sem barreiras de proteção.",
      code: "# Template conceitual de Post-Mortem Blameless\nINCIDENTE: \"INC-1092 - Instabilidade no Checkout\"\nIMPACTO: \"12 minutos com taxa de erro HTTP 500 em 8% das requisições\"\nCAUSA_RAIZ: \"Falta de timeout configurado no cliente HTTP para o serviço legado\"\nACAO_PREVENTIVA: \"Adicionar circuit breaker e testes de caos no pipeline de CI\""
    }
  ],

  // Stage 3: CULTURA DEVOPS
  [
    {
      title: "Fundamentos da Automação de Processos",
      body: "A automação é o motor que viabiliza a agilidade e a confiabilidade operacional. Tarefas manuais — como compilar projetos em máquinas locais, copiar arquivos via FTP ou configurar servidores por SSH — são lentas, não reproduzíveis e altamente vulneráveis a erros humanos. Automatizar tarefas recorrentes libera o tempo dos engenheiros para resolver problemas de arquitetura e garante que cada execução siga rigorosamente os mesmos passos auditáveis.",
      tip: "Aplique a 'Regra dos Três': se você precisou executar uma tarefa operacional manualmente mais de duas vezes, escreva um script ou playbook para automatizá-la de forma definitiva.",
      code: "#!/usr/bin/env bash\nset -euo pipefail # Interrompe imediatamente se houver qualquer erro\n\necho \"==> 1. Limpando diretórios antigos...\"\nrm -rf ./dist && mkdir ./dist\necho \"==> 2. Instalando dependências e compilando...\"\nnpm ci && npm run build\necho \"==> Processo automatizado e reproduzível finalizado!\""
    },
    {
      title: "O Conceito de CI/CD (Integração e Entrega Contínuas)",
      body: "CI/CD é a espinha dorsal da engenharia moderna. Continuous Integration (CI) consiste em integrar alterações de código frequentemente ao branch principal, disparando testes e builds automáticos para detectar conflitos precocemente. Continuous Delivery (CD) garante que todo build aprovado esteja pronto para implantação em produção com apenas um clique, enquanto Continuous Deployment elimina totalmente intervenções manuais na publicação.",
      tip: "CI não é apenas ter um servidor como GitHub Actions configurado; CI é um hábito de equipe. Se desenvolvedores passam semanas sem integrar no branch principal, eles não estão praticando CI.",
      code: "# Pipeline conceitual de CI/CD em etapas ordenadas\nstages:\n  - lint       # Validação estática e formatação de código\n  - test       # Testes unitários e de integração com cobertura\n  - package    # Construção de artefato imutável (ex: Docker Image)\n  - deploy_stg # Publicação contínua em ambiente de homologação\n  - deploy_prd # Publicação contínua ou sob aprovação em produção"
    }
  ],

  // Stage 4: CONTROLE DE VERSÃO
  [
    {
      title: "Git Flow vs Trunk-Based Development",
      body: "O modelo Git Flow tradicional depende de branches de longa duração (develop, release, hotfix), o que gera 'infernos de merge' e atrasa a integração do código. Em contrapartida, o Trunk-Based Development preconiza que todos os desenvolvedores integrem pequenas alterações diretamente no branch principal (trunk/main) diariamente ou usem branches efêmeras que duram poucas horas. Esse fluxo é essencial para viabilizar pipelines velozes de CI/CD.",
      tip: "Se uma feature branch demorar mais de 48 horas para ser mergeada, divida o problema em tarefas menores ou use Feature Flags para subir código em progresso sem impactar o usuário.",
      code: "# Fluxo Trunk-Based: branch de vida curta integrada rapidamente\ngit checkout -b feat/valida-cpf main\n# ... implementa alteração pequena e focada ...\ngit commit -m \"feat: adiciona algoritmo de validação de CPF no checkout\"\ngit push origin feat/valida-cpf\n# Abre Pull Request imediatamente para merge no mesmo dia"
    },
    {
      title: "Controle de Versão como Única Fonte da Verdade",
      body: "No paradigma DevOps contemporâneo, o controle de versão com Git não serve apenas para armazenar código-fonte da aplicação. Ele atua como a única fonte da verdade para infraestrutura (IaC), configurações operacionais, manifestos de deploy e políticas de segurança (GitOps). Toda e qualquer modificação em ambiente produtivo deve ser precedida por um commit auditável, permitindo rastreabilidade histórica e rollback instantâneo.",
      tip: "Proíba qualquer alteração manual realizada diretamente nos servidores (ClickOps). Se uma mudança foi feita por fora do Git, ela será inevitavelmente sobrescrita na próxima execução do pipeline.",
      code: "# Rastreando histórico e revertendo alterações com auditoria completa\ngit log --oneline -n 3\n# d83e91a feat: atualiza limite de memória da JVM para 4GB\n# c21b44f fix: corrige porta do serviço de autenticação\n\n# Reversão segura através de um novo commit de rollback\ngit revert d83e91a --no-edit\ngit push origin main"
    }
  ],

  // Stage 5: CONTROLE DE VERSÃO
  [
    {
      title: "Feature Flags e Separação entre Deploy e Release",
      body: "Tradicionalmente, implantar código em produção (Deploy) significava expor imediatamente a funcionalidade aos usuários (Release). Feature Flags (ou feature toggles) desacoplam esses dois momentos: o código novo é implantado em produção desligado por padrão, permitindo que a equipe valide o comportamento sob carga real (Dark Launching) e ative a funcionalidade gradualmente para grupos específicos sem precisar de um novo deploy.",
      tip: "Trate Feature Flags como dívida técnica temporária. Estabeleça cards no backlog para remover as flags e os condicionais do código assim que a funcionalidade for 100% estabilizada.",
      code: "import { isFeatureActive } from './featureManager';\n\nexport async function renderCheckout(usuario) {\n  // Deploy já foi feito; o Release é controlado dinamicamente em runtime\n  const usarNovoCheckout = await isFeatureActive('checkout_v2', usuario.id);\n  if (usarNovoCheckout) {\n    return renderNovoCheckoutPix();\n  }\n  return renderCheckoutLegado();\n}"
    },
    {
      title: "Estratégias de Branching e Integração com CI",
      body: "A estratégia de branching escolhida dita como os gatilhos dos pipelines de CI operam. Em branches de curta duração, cada evento de push aciona validações leves (lint, testes unitários rápidos e checagem de tipos) para fornecer feedback imediato durante a revisão do Pull Request. Quando o PR é aprovado e mergeado na main, o pipeline dispara tarefas mais pesadas: testes de integração, auditorias de segurança e geração de artefatos.",
      tip: "Configure a proteção de branch no GitHub/GitLab exigindo que os checks de status do CI passem obrigatoriamente antes de permitir o clique no botão de merge na branch principal.",
      code: "# Exemplo de trigger condicional no pipeline conforme a branch\non:\n  pull_request:\n    branches: [ main ] # Validação rápida de PR antes do merge\n  push:\n    branches: [ main ] # Pipeline completo de compilação e publicação\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test"
    }
  ],

  // Stage 6: CONTROLE DE VERSÃO
  [
    {
      title: "Revisão de Código Automatizada em Pull Requests",
      body: "Revisões de código por pares (Code Review) tornam-se muito mais produtivas quando integradas à automação do CI. Em vez de revisores humanos perderem tempo apontando erros de sintaxe, indentação ou dependências desatualizadas, ferramentas automatizadas (linters, SAST, formatadores de estilo) validam o Pull Request no instante da abertura. Dessa forma, a revisão humana foca exclusivamente em arquitetura, lógica de negócio e legibilidade.",
      tip: "Configure linters e pre-commit hooks (usando Husky) localmente nas máquinas dos desenvolvedores para impedir que commits com erros triviais de formatação sequer subam para o repositório.",
      code: "# Execução de linters e análise estática no pipeline de PR\nname: Quality Gate\non: [pull_request]\njobs:\n  code-quality:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm run lint\n      - run: npm run type-check\n      - run: npx audit-ci --high"
    },
    {
      title: "Estratégias de Merge: Squash, Rebase e Merge Commit",
      body: "A maneira como uma branch é incorporada à main impacta diretamente a clareza do histórico de auditoria do Git. O 'Merge Commit' clássico preserva todos os commits individuais com ramificações visuais; o 'Rebase' reaplica os commits linearmente sobre o topo da base; e o 'Squash and Merge' compacta todos os commits da feature branch em um único commit conciso e semântico, sendo a estratégia mais recomendada em equipes ágeis com CI.",
      tip: "Adote 'Squash and Merge' como padrão no GitHub para consolidar dezenas de commits pontuais ('fix typo', 'ajuste') em um único commit rastreável com link para o Pull Request.",
      code: "# Mesclagem com squash via CLI para manter histórico 100% linear\ngit checkout main\ngit pull origin main\ngit merge --squash feat/novo-filtro-busca\ngit commit -m \"feat: implementa filtro avançado de produtos (#304)\"\ngit push origin main"
    }
  ],

  // Stage 7: CI COM GITHUB ACTIONS
  [
    {
      title: "Introdução e Arquitetura do GitHub Actions",
      body: "O GitHub Actions é uma plataforma moderna orientada a eventos para automação de tarefas e integração contínua. Sua arquitetura é composta por Workflows (definidos em arquivos YAML dentro de .github/workflows/), Runners (máquinas virtuais ou containers que executam os comandos), Jobs (grupos de etapas isoladas) e Steps (passos individuais sequenciais). Ele unifica o ciclo de vida do código, do commit ao deploy, sob uma infraestrutura escalável.",
      tip: "Se sua organização lida com dados altamente sensíveis ou redes privadas corporativas, adicione Self-Hosted Runners configurados dentro da sua própria VPC para rodar os jobs com segurança.",
      code: "# .github/workflows/ci-basico.yml\nname: Pipeline de Integracao\non: [push]\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Mensagem de inicio\n        run: echo \"Iniciando execucao do runner gerenciado pelo GitHub...\""
    },
    {
      title: "Gatilhos de Eventos (Event Triggers e Filtros)",
      body: "Workflows do GitHub Actions iniciam sua execução através do bloco 'on:', que escuta eventos nativos do repositório. É possível disparar automações em eventos como push, pull_request, schedules temporais (expressões cron), gatilhos manuais (workflow_dispatch) ou webhooks externos. Filtros avançados de caminhos (paths) permitem evitar execuções desnecessárias quando apenas documentos ou arquivos estáticos forem alterados.",
      tip: "Use 'paths-ignore' para ignorar alterações em pastas como docs/ ou README.md, economizando minutos preciosos da sua cota de execução no GitHub Actions.",
      code: "name: Pipeline de Backend\non:\n  push:\n    branches: [ main, staging ]\n    paths:\n      - 'backend/**'\n      - 'package.json'\n    paths-ignore:\n      - '**.md'\n  workflow_dispatch: # Permite disparo manual com clique na interface"
    }
  ],

  // Stage 8: CI COM GITHUB ACTIONS
  [
    {
      title: "Jobs, Steps e Orquestração de Dependências",
      body: "Dentro de um workflow, os jobs rodam em paralelo por padrão em máquinas virtuais completamente separadas. Para criar uma esteira ordenada, usamos a diretiva 'needs:', definindo uma árvore de dependências (DAG). Por exemplo, o job de deploy só deve iniciar se os jobs de lint e testes forem concluídos com sucesso. Cada job encapsula steps sequenciais executados no mesmo sistema de arquivos do runner.",
      tip: "Divida pipelines em jobs especializados: se o job de lint rodar em 20 segundos e falhar, o pipeline aborta antes de alocar máquinas mais pesadas e custosas para os testes.",
      code: "jobs:\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm run lint\n  test:\n    needs: lint # Só executa se o lint passar\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test\n  deploy:\n    needs: test # Só roda após os testes passarem\n    runs-on: ubuntu-latest\n    steps:\n      - run: ./deploy.sh"
    },
    {
      title: "A Action de Checkout e o Marketplace de Actions",
      body: "Por padrão, o runner alocado pelo GitHub inicia com um diretório de trabalho totalmente vazio. A action padrão 'actions/checkout@v4' faz o clone do repositório no commit exato que disparou o evento. Além disso, o ecossistema do GitHub Marketplace permite reutilizar componentes modulares desenvolvidos pela comunidade e grandes fornecedores, como actions de setup de linguagens, login em nuvens e linters.",
      tip: "Sempre fixe versões de actions externas usando tags semânticas estáveis (ex: @v4) ou hashes SHA completos do commit para se proteger contra supply-chain attacks e quebras não planejadas.",
      code: "steps:\n  - name: Clonar o codigo-fonte no runner\n    uses: actions/checkout@v4\n    with:\n      fetch-depth: 0 # Clona historico completo para geracao de tags\n  - name: Instalar versao LTS do Node.js\n    uses: actions/setup-node@v4\n    with:\n      node-version: 20\n      cache: 'npm'"
    }
  ],

  // Stage 9: CI COM GITHUB ACTIONS
  [
    {
      title: "Gerenciamento Seguro de Secrets e Credenciais",
      body: "Senhas, chaves de API, certificados e tokens de nuvem jamais devem ser comitados no código-fonte sob nenhuma hipótese. O GitHub Secrets fornece armazenamento seguro criptografado com a biblioteca Libsodium. Durante a execução do job, essas credenciais são injetadas em memória como variáveis de ambiente e são automaticamente mascaradas com asteriscos (***) nos logs públicos do console.",
      tip: "Utilize OpenID Connect (OIDC) com AWS, GCP ou Azure para autenticar pipelines em nuvem sem armazenar chaves de acesso estáticas e permanentes nos secrets do repositório.",
      code: "steps:\n  - name: Publicar pacote com credencial segura\n    env:\n      NPM_TOKEN: ${{ secrets.NPM_PUBLISH_TOKEN }}\n      DATABASE_PASSWORD: ${{ secrets.PROD_DB_PASS }}\n    run: |\n      echo \"//registry.npmjs.org/:_authToken=$NPM_TOKEN\" > ~/.npmrc\n      npm publish"
    },
    {
      title: "Variáveis de Ambiente e Gestão por Ambientes",
      body: "Enquanto secrets guardam dados confidenciais, variáveis de ambiente configuram comportamentos operacionais não sigilosos da aplicação (como portas, URLs de endpoints, níveis de log e flags de ambiente). No GitHub Actions, variáveis podem ser definidas no escopo do workflow, do job ou associadas a Environments específicos (staging, production), aderindo ao princípio de separação de configuração do código (Twelve-Factor App).",
      tip: "Crie Environments no repositório (Settings > Environments) com regras de proteção rígidas para o ambiente 'production', garantindo isolamento completo de variáveis e secrets de homologação.",
      code: "env:\n  LOG_LEVEL: 'info'\n  NODE_ENV: 'production'\n\njobs:\n  deploy-staging:\n    environment: staging\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo \"Publicando na URL da API: ${{ vars.API_GATEWAY_URL }}\""
    }
  ],

  // Stage 10: TESTES NO PIPELINE
  [
    {
      title: "A Pirâmide de Testes Automatizados no Pipeline",
      body: "A Pirâmide de Testes é o modelo de referência para equilibrar velocidade e cobertura no pipeline de CI. A base da pirâmide é composta por testes unitários: rápidos, baratos e que testam funções isoladas em segundos. O meio contém testes de integração: validam a comunicação entre módulos, bancos de dados e APIs. O topo contém testes ponta a ponta (E2E): lentos, caros e focados na jornada do usuário no navegador.",
      tip: "Não sobrecarregue o pipeline com centenas de testes E2E lentos. Concentre a maior parte das regras de negócio complexas em testes unitários para manter o feedback do CI veloz.",
      code: "# Execução ordenada respeitando a pirâmide de testes\njobs:\n  unit-tests:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm run test:unit # Roda em menos de 30 segundos\n  integration-tests:\n    needs: unit-tests\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm run test:integration # Roda em bancos de teste"
    },
    {
      title: "O Princípio Fail Fast e Feedback Imediato",
      body: "O princípio Fail Fast dita que um pipeline deve falhar e interromper sua execução no instante mais inicial possível. Se o linter encontrar uma violação de sintaxe ou o primeiro teste unitário quebrar, não faz sentido gastar minutos compilando imagens Docker pesadas ou subindo servidores de homologação. Essa abordagem economiza custos de computação em nuvem e devolve feedback urgente para o desenvolvedor.",
      tip: "Ao utilizar matrizes de teste com múltiplas versões, mantenha a flag 'fail-fast: true' habilitada para cancelar todos os outros jobs paralelos assim que a primeira falha for detectada.",
      code: "jobs:\n  matrix-validation:\n    strategy:\n      fail-fast: true # Cancela imediatamente os outros jobs se um falhar\n      matrix:\n        os: [ubuntu-latest, macos-latest]\n        node: [18, 20]\n    runs-on: ${{ matrix.os }}\n    steps:\n      - run: npm test"
    }
  ],

  // Stage 11: TESTES NO PIPELINE
  [
    {
      title: "Artefatos de Pipeline: Armazenamento e Reutilização",
      body: "Como cada job do CI executa em uma máquina virtual efêmera com disco isolado, qualquer arquivo gerado durante a execução é descartado ao término do runner. Artefatos de pipeline permitem compactar, fazer upload e persistir arquivos no servidor de CI (como pacotes compilados, relatórios HTML de testes e logs de execução), viabilizando seu download manual ou reutilização em jobs subsequentes.",
      tip: "Defina períodos curtos de retenção para artefatos intermediários de Pull Requests (ex: retention-days: 5) para evitar consumo excessivo da cota de armazenamento do seu provedor de CI.",
      code: "steps:\n  - name: Compilar codigo e gerar pacote\n    run: npm run build\n  - name: Salvar artefatos gerados\n    uses: actions/upload-artifact@v4\n    with:\n      name: bundle-producao\n      path: dist/\n      retention-days: 7"
    },
    {
      title: "Métricas de Cobertura de Código e Thresholds",
      body: "A cobertura de código (code coverage) avalia a porcentagem de linhas, funções e branches de decisão do código-fonte exercitadas pela suíte de testes automatizados. Motores como Jest, c8 e JaCoCo geram relatórios detalhados que podem ser publicados no PR. Pipelines maduros estabelecem barreiras de qualidade (thresholds) que reprovam automaticamente Pull Requests que reduzam a cobertura global.",
      tip: "Não persiga uma meta ilusória de 100% de cobertura; linhas cobertas não garantem ausência de falhas lógicas. Priorize alta cobertura nas áreas críticas de faturamento e regras de negócio.",
      code: "# Rodando Jest com threshold mínimo obrigatório de 80% de cobertura\nnpx jest --coverage --coverageThreshold='{\n  \"global\": {\n    \"branches\": 80,\n    \"functions\": 80,\n    \"lines\": 80\n  }\n}'\n# Se a cobertura for menor que 80%, o comando encerra com exit code 1"
    }
  ],

  // Stage 12: TESTES NO PIPELINE
  [
    {
      title: "Estratégia de Matriz de Build (Matrix Strategy)",
      body: "A matriz de build permite testar seu software em múltiplos ambientes simultaneamente sem duplicar código YAML. Você pode combinar versões de sistemas operacionais (Ubuntu, Windows, macOS), versões de runtimes (Node 18, 20, 22) e bancos de dados. O GitHub Actions calcula o produto cartesiano das variáveis e dispara jobs paralelos independentes para cada combinação declarada.",
      tip: "Para bibliotecas e pacotes open-source, inclua na matriz a versão LTS anterior, a LTS corrente e a versão mais recente em estágio beta para antecipar depreciações da linguagem.",
      code: "jobs:\n  cross-platform-test:\n    strategy:\n      matrix:\n        os: [ubuntu-latest, windows-latest]\n        node-version: [18.x, 20.x]\n    runs-on: ${{ matrix.os }}\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node-version }}\n      - run: npm test"
    },
    {
      title: "Paralelismo e Caching de Dependências no CI",
      body: "Pipelines lentos matam a produtividade da engenharia. Acelerar o pipeline envolve paralelismo horizontal (executar testes independentes em runners separados simultaneamente) e caching inteligente de dependências. Ao salvar em cache os diretórios de pacotes (como ~/.npm ou ~/.cache/pip) com base no hash do arquivo de lock, o download repetitivo de pacotes externos da internet é quase eliminado.",
      tip: "Use 'actions/cache' ou configure o parâmetro nativo de cache em 'actions/setup-node'. O reaproveitamento de pacotes pode reduzir o tempo de execução do job de 4 minutos para 30 segundos.",
      code: "steps:\n  - uses: actions/checkout@v4\n  - name: Restaurar ou salvar cache de dependencias\n    uses: actions/cache@v4\n    with:\n      path: ~/.npm\n      key: ${{ runner.os }}-build-${{ hashFiles('**/package-lock.json') }}\n      restore-keys: |\n        ${{ runner.os }}-build-\n  - run: npm ci"
    }
  ],

  // Stage 13: BUILD E ARTEFATOS
  [
    {
      title: "Compilação, Empacotamento e Imutabilidade",
      body: "Na etapa de build, o código-fonte legível é transformado em um artefato binário ou empacotado otimizado para execução (como pacotes minificados, executáveis Go ou imagens de container). O princípio do Artefato Imutável dita que uma vez compilado e validado no CI, o mesmo artefato exato deve ser promovido através de todos os ambientes (staging, produção) sem sofrer recompilação.",
      tip: "Nunca recompile o código entre homologação e produção com argumentos diferentes. O que foi homologado é o que deve subir em produção, variando apenas variáveis de ambiente.",
      code: "# Compilação determinística e empacotamento com hash de integridade\nnpm ci\nnpm run build -- --mode=production\nARTEFATO=\"app-$(git rev-parse --short HEAD).tar.gz\"\ntar -czf \"$ARTEFATO\" ./dist\nsha256sum \"$ARTEFATO\" > checksum.sha256\necho \"Artefato imutável criado: $ARTEFATO\""
    },
    {
      title: "Lockfiles e a Importância de Builds Reprodutíveis",
      body: "Gerenciadores de dependências modernos geram arquivos de trava (lockfiles como package-lock.json, poetry.lock, Cargo.lock). Esses arquivos registram a árvore completa de dependências, versões exatas instaladas e hashes de verificação de integridade. Em pipelines de CI, instalar pacotes sem respeitar o lockfile pode baixar versões atualizadas que quebrem o sistema inesperadamente.",
      tip: "No CI, nunca execute 'npm install'; utilize estritamente 'npm ci'. O comando 'npm ci' valida se o lockfile bate perfeitamente com o package.json e aborta o build se houver discrepância.",
      code: "# Ruim: pode instalar versões mais novas que quebrem a build\n# npm install\n\n# Bom: instalação 100% reproduzível, limpa e congelada\nnpm ci --prefer-offline --no-audit\necho \"Dependências instaladas com fidelidade absoluta ao lockfile!\""
    }
  ],

  // Stage 14: BUILD E ARTEFATOS
  [
    {
      title: "Versionamento Semântico (SemVer: MAJOR.MINOR.PATCH)",
      body: "O Versionamento Semântico (SemVer 2.0) define um contrato universal para lançamentos de software no formato X.Y.Z (MAJOR.MINOR.PATCH). O número MAJOR é incrementado ao introduzir quebras incompatíveis de API; MINOR é incrementado ao adicionar novas funcionalidades mantendo a retrocompatibilidade; e PATCH é incrementado em correções de bugs retrocompatíveis sem novas funções.",
      tip: "Adote a convenção de Conventional Commits (prefixos feat:, fix:, chore:, feat!:) para que ferramentas automatizadas calculem o próximo incremento SemVer sem esforço humano.",
      code: "# Estrutura semântica:\n# 2.4.1 -> PATCH: correção de segurança no parsing de JWT\n# 2.5.0 -> MINOR: adicionado endpoint de pagamentos por Pix\n# 3.0.0 -> MAJOR: remoção de endpoints legados da API v1\n\nnpm version minor -m \"chore(release): incrementa versao para %s\""
    },
    {
      title: "Automação de Releases, Tags e Changelogs",
      body: "Gerenciar tags no Git e redigir notas de versão manualmente é um processo tedioso e propenso a esquecimentos. Ferramentas de automação de release (como Semantic-Release e Release-Please) analisam os commits da branch main, determinam se houve mudanças funcionais, criam a tag Git correspondente, geram um arquivo CHANGELOG.md bem formatado e publicam a GitHub Release.",
      tip: "Padronize a escrita das mensagens de commit em toda a equipe. Quando as mensagens são padronizadas, a documentação de lançamento é gerada de forma 100% autônoma e legível.",
      code: "# Workflow automatizado de Release no GitHub Actions\nname: Publicar Release\non:\n  push:\n    branches: [ main ]\njobs:\n  release:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Executa Semantic Release\n        uses: cycjimmy/semantic-release-action@v4\n        env:\n          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"
    }
  ],

  // Stage 15: BUILD E ARTEFATOS
  [
    {
      title: "Criando Dockerfiles Eficientes para Produção",
      body: "Um Dockerfile é uma receita declarativa que empacota o código, suas dependências e o ambiente de execução em uma imagem de container reproduzível. Criar Dockerfiles de qualidade profissional exige usar imagens base mínimas e seguras (como Alpine Linux ou imagens Distroless), definir o diretório de trabalho com WORKDIR e executar a aplicação com um usuário sem privilégios de root.",
      tip: "Nunca execute containers como 'root' em ambientes produtivos. Crie ou utilize um usuário dedicado sem privilégios administrativos (como 'USER node') para mitigar vulnerabilidades de escape.",
      code: "FROM node:20-alpine\nWORKDIR /app\n# Instala apenas dependências de produção\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\n# Executa com usuário sem privilégios\nUSER node\nEXPOSE 3000\nCMD [\"node\", \"src/server.js\"]"
    },
    {
      title: "O Papel dos Containers na Padronização em DevOps",
      body: "A clássica desculpa 'na minha máquina funciona' foi superada pela conteinerização com Docker. Containers isolam a aplicação no nível do sistema operacional, garantindo que o mesmo ambiente exato executado no notebook do desenvolvedor seja replicado de forma idêntica nos runners de CI, nos servidores de homologação e nos clusters de produção Kubernetes.",
      tip: "Utilize o Docker Compose para subir todo o ecossistema da aplicação (banco Postgres, fila RabbitMQ, cache Redis) de forma local e nas etapas de teste de integração do pipeline.",
      code: "# docker-compose.yml para testes locais e em esteiras de CI\nservices:\n  api:\n    build: .\n    ports: [\"3000:3000\"]\n    environment:\n      - DATABASE_URL=postgres://user:pass@db:5432/appdb\n    depends_on: [db]\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_PASSWORD: pass"
    }
  ],

  // Stage 16: DOCKER NO CI/CD
  [
    {
      title: "Multi-stage Builds no Docker",
      body: "Multi-stage builds são cruciais para produzir imagens Docker enxutas, rápidas de baixar e altamente seguras. Esse padrão utiliza múltiplas instruções FROM em um único arquivo: os primeiros estágios realizam a compilação pesada com compiladores e SDKs completos, enquanto o estágio final copia exclusivamente os binários finais para uma imagem base ultra-leve.",
      tip: "Ao utilizar multi-stage builds, você impede que compiladores pesados (como GCC, Go ou npm) fiquem presentes na imagem final de produção, reduzindo drasticamente a superfície de ataque.",
      code: "# Multi-stage build em Go\nFROM golang:1.22 AS builder\nWORKDIR /src\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /bin/api .\n\n# Imagem final estéril e ultra-leve (menos de 20MB)\nFROM alpine:3.19\nWORKDIR /app\nCOPY --from=builder /bin/api /app/api\nUSER 1000:1000\nENTRYPOINT [\"/app/api\"]"
    },
    {
      title: "Otimização de Cache de Camadas (Layer Caching)",
      body: "O Docker constrói imagens divididas em camadas somente-leitura (layers). Ao rodar o build, se uma camada e seus arquivos não sofreram alteração, o Docker reaproveita a camada em cache. Organizar os comandos do mais estável para o mais frequente (ex: copiar package.json antes do código-fonte) acelera o build de minutos para poucos segundos no pipeline.",
      tip: "Sempre faça 'COPY package*.json ./' antes de 'COPY . .'. Se você copiar o código-fonte antes de instalar os pacotes, qualquer alteração em um comentário invalidará o cache de instalação.",
      code: "FROM node:20-alpine\nWORKDIR /app\n# Camada cacheada: só reexecuta se as dependências mudarem\nCOPY package*.json ./\nRUN npm ci\n# Camada dinâmica: muda a cada commit\nCOPY . .\nRUN npm run build"
    }
  ],

  // Stage 17: DOCKER NO CI/CD
  [
    {
      title: "Compilação e Teste de Containers no Pipeline de CI",
      body: "Integrar a compilação do Docker na esteira de CI garante que nenhum erro de empacotamento ou dependência quebrada passe despercebido. Utilizando motores modernos como o Docker Buildx com BuildKit ativado, é possível compilar containers em paralelo, exportar caches remotos diretamente para o repositório e executar testes dentro do container recém-construído.",
      tip: "Ative sempre o Docker BuildKit adicionando 'DOCKER_BUILDKIT=1' no ambiente do runner para desfrutar de compilações paralelas e montagem segura de secrets em tempo de build.",
      code: "steps:\n  - uses: actions/checkout@v4\n  - name: Configurar Docker Buildx\n    uses: docker/setup-buildx-action@v3\n  - name: Compilar imagem de teste\n    run: |\n      docker build --build-arg BUILDKIT_INLINE_CACHE=1 \\\n        -t minha-api:test .\n      docker run --rm minha-api:test npm test"
    },
    {
      title: "Estratégias de Tagging Imutável de Imagens Docker",
      body: "Um dos piores antipadrões em DevOps é publicar imagens de container em produção usando apenas a tag ':latest'. A tag latest é mutável e impede que a equipe saiba com precisão qual versão do código está em execução. Pipelines maduros etiquetam imagens utilizando o hash do commit do Git (SHA curto), o número da versão SemVer e o branch correspondente.",
      tip: "Proíba o uso da tag ':latest' em ambientes de produção Kubernetes. Utilize sempre o hash do commit (ex: api:sha-a1b2c3d) para garantir auditoria total e permitir rollbacks determinísticos.",
      code: "# Gerando tags rastreáveis e imutáveis no pipeline de CI\nCOMMIT_SHA=$(git rev-parse --short HEAD)\nTAG_VERSAO=\"1.2.0\"\nREGISTRY=\"ghcr.io/empresa/minha-api\"\n\ndocker tag minha-api:local $REGISTRY:$COMMIT_SHA\ndocker tag minha-api:local $REGISTRY:v$TAG_VERSAO\necho \"Imagens etiquetadas para auditoria com SHA: $COMMIT_SHA\""
    }
  ],

  // Stage 18: DOCKER NO CI/CD
  [
    {
      title: "Autenticação Segura em Container Registries",
      body: "Um Container Registry (como GitHub Container Registry - GHCR, AWS ECR ou Docker Hub) é o repositório centralizado onde as imagens de produção ficam armazenadas. O runner de CI precisa se autenticar no registro com permissões de escrita de forma segura, utilizando tokens de curta duração ou chaves gerenciadas, sem expor senhas permanentes em texto simples nos logs.",
      tip: "No GitHub Actions, use a action oficial 'docker/login-action' com o token nativo '${{ secrets.GITHUB_TOKEN }}' para publicar no GHCR sem criar chaves de acesso externas.",
      code: "- name: Login no GitHub Container Registry (GHCR)\n  uses: docker/login-action@v3\n  with:\n    registry: ghcr.io\n    username: ${{ github.actor }}\n    password: ${{ secrets.GITHUB_TOKEN }}"
    },
    {
      title: "Publicação (Push) e Verificação de Vulnerabilidades",
      body: "Após a compilação e autenticação, a imagem é publicada no registro via 'docker push'. Em esteiras avançadas de DevSecOps, scanners de vulnerabilidades (como Trivy ou Grype) inspecionam todas as camadas da imagem em busca de falhas conhecidas de segurança (CVEs) em pacotes do sistema operacional antes que a imagem seja liberada para deploy em produção.",
      tip: "Adicione uma verificação com Trivy que quebre o pipeline caso sejam encontradas vulnerabilidades de severidade CRITICAL com correção oficial já disponível no upstream.",
      code: "- name: Escaneamento de seguranca da imagem com Trivy\n  uses: aquasecurity/trivy-action@master\n  with:\n    image-ref: 'ghcr.io/empresa/app:latest'\n    format: 'table'\n    exit-code: '1' # Falha a pipeline se houver falhas críticas\n    severity: 'CRITICAL'"
    }
  ],

  // Stage 19: DEPLOY AUTOMATIZADO
  [
    {
      title: "Continuous Deployment vs Continuous Delivery",
      body: "Embora frequentemente usados como sinônimos, Continuous Delivery e Continuous Deployment representam níveis distintos de maturidade de automação. No Continuous Delivery, cada alteração aprovada nos testes é compilada e fica pronta para ir a produção, mas a publicação depende de um clique ou aprovação de negócio. No Continuous Deployment, todo commit verde vai automaticamente para produção.",
      tip: "Inicie adotando Continuous Delivery até que a cobertura de testes e a observabilidade estejam robustas o bastante para permitir Continuous Deployment completo e seguro.",
      code: "# Continuous Delivery: Requer gatilho ou aprovacao humana para producao\n# Continuous Deployment: Fluxo totalmente direto e automatizado\n\n# Exemplo conceitual de decisao em pipeline\nif [ \"$BRANCH\" = \"main\" ] && [ \"$SUCESSO_TESTES\" = true ]; then\n  echo \"Liberado para producao instantanea (Continuous Deployment)\"\n  ./scripts/deploy-prod.sh\nfi"
    },
    {
      title: "Paridade de Ambientes: Dev, Staging e Produção",
      body: "A regra de ouro da confiabilidade em DevOps é a Paridade de Ambientes. Discrepâncias arquiteturais entre o ambiente de testes (Staging) e o ambiente produtivo (bancos de dados com versões diferentes, limites de memória discrepantes ou sistemas operacionais distintos) geram bugs silenciosos que só se manifestam sob tráfego real de clientes.",
      tip: "Nunca use bancos em memória como SQLite em desenvolvimento se sua produção roda PostgreSQL. Diferenças em índices e concorrência inevitavelmente quebrarão sua aplicação.",
      code: "# Declarando ambiente controlado no GitHub Actions\njobs:\n  deploy-staging:\n    environment:\n      name: staging\n      url: https://staging.minha-api.com\n    runs-on: ubuntu-latest\n    steps:\n      - run: ./deploy.sh staging"
    }
  ],

  // Stage 20: DEPLOY AUTOMATIZADO
  [
    {
      title: "Gates de Aprovação Manual e Governança",
      body: "Em setores regulados (como bancos, seguradoras e telecomunicações), normas de compliance e segurança da informação exigem segregação de funções: o desenvolvedor que escreveu a funcionalidade não pode aprová-la e publicá-la sozinho em produção. Ferramentas modernas de CI/CD suportam Gates de Aprovação, pausando o pipeline até que gestores autorizem a execução.",
      tip: "Configure revisores obrigatórios (Required Reviewers) nas configurações de ambiente do GitHub para disparar alertas no Slack ou Teams quando um deploy aguardar liberação humana.",
      code: "# Configuracao conceitual de protecao de ambiente no GitHub Actions\n# Settings > Environments > production > Required reviewers\njobs:\n  deploy-producao:\n    environment: production # Aguarda aprovacao de um Tech Lead\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo \"Deploy autorizado e auditado por gestores!\""
    },
    {
      title: "Estratégia de Deploy Blue-Green",
      body: "O deploy Blue-Green é uma técnica de liberação que elimina o tempo de inatividade (zero downtime) e reduz o risco de atualizações. Mantêm-se dois ambientes de produção idênticos: Blue (ativo recebendo 100% do tráfego) e Green (inativo). A nova versão é implantada no Green e testada exaustivamente; quando validada, o roteador/load balancer chaveia o tráfego instantaneamente para o Green.",
      tip: "Garanta que as migrações de esquema no banco de dados sejam retrocompatíveis tanto com o ambiente antigo (Blue) quanto com o novo (Green), aplicando o padrão Expand and Contract.",
      code: "# Chaveando o tráfego no Nginx de Blue para Green instantaneamente\nupstream backend_pool {\n    # server 10.0.0.1:8080; # Blue (versão antiga desativada)\n    server 10.0.0.2:8080;   # Green (nova versão ativada instantaneamente)\n}\n\n# Recarrega a configuração sem derrubar conexões ativas\n# sudo nginx -s reload"
    }
  ],

  // Stage 21: DEPLOY AUTOMATIZADO
  [
    {
      title: "Canary Releases e Liberação Progressiva",
      body: "Diferente do Blue-Green onde todo o tráfego é trocado de uma só vez, a técnica de Canary Release expõe a nova versão inicialmente a uma fração minúscula de usuários reais (ex: 1%, 5%, 25%). Malhas de serviços (Service Meshes como Istio) e gateways de API direcionam o tráfego enquanto métricas de erro e latência são monitoradas antes de expandir o rollout para 100%.",
      tip: "Monitore a taxa de respostas HTTP 5xx especificamente nas instâncias Canary. Se a taxa subir além do normal nos primeiros 5 minutos, aborte a liberação automaticamente.",
      code: "# Roteamento Canary no Istio VirtualService\nspec:\n  hosts:\n    - servico-pagamento\n  http:\n    - route:\n        - destination:\n            host: servico-pagamento\n            subset: v1-estavel\n          weight: 95 # 95% do tráfego na versão consolidada\n        - destination:\n            host: servico-pagamento\n            subset: v2-canary\n          weight: 5  # 5% do tráfego na versão experimental"
    },
    {
      title: "Estratégias de Rollback Automatizado",
      body: "Mesmo com testes rigorosos, anomalias inesperadas podem surgir sob tráfego real. Uma esteira de entrega moderna não depende de intervenção humana demorada para desfazer uma alteração problemática. Sistemas de rollback automatizado analisam a saúde do deploy através de probes e métricas de APM, revertendo o release para a versão anterior em segundos caso falhas aconteçam.",
      tip: "Treine e teste comandos de rollback regularmente. O tempo médio de recuperação (MTTR) depende da velocidade do rollback, e não da velocidade com que o time corrige a falha no código.",
      code: "# Verificando status do deploy e executando rollback em caso de falha\nkubectl rollout status deployment/catalogo-api --timeout=60s || {\n  echo \"Deploy nao estabilizou a tempo! Executando rollback imediato...\"\n  kubectl rollout undo deployment/catalogo-api\n  exit 1\n}"
    }
  ],

  // Stage 22: MONITORAMENTO
  [
    {
      title: "Os Três Pilares da Observabilidade: M, L, T",
      body: "Enquanto o monitoramento tradicional responde se o sistema está funcionando, a Observabilidade permite inferir o estado interno do sistema e descobrir o porquê de anomalias inesperadas. A observabilidade moderna assenta-se em três pilares complementares: Métricas (dados numéricos agregados ao longo do tempo), Logs (registros pontuais de eventos) e Distributed Tracing (rastreamento do caminho da requisição).",
      tip: "Propague sempre o 'Trace ID' nos cabeçalhos HTTP entre todos os microsserviços e inclua esse ID nos logs para correlacionar uma requisição pontual em qualquer parte do sistema.",
      code: "{\n  \"timestamp\": \"2026-09-13T21:15:00Z\",\n  \"level\": \"ERROR\",\n  \"service\": \"order-api\",\n  \"trace_id\": \"9c8b7a6f5e4d3c2b\",\n  \"message\": \"Falha de comunicacao com gateway de cartao\",\n  \"duration_ms\": 1240\n}"
    },
    {
      title: "Logs Estruturados e Agregação Centralizada",
      body: "Logs em texto puro sem formatação padrão são difíceis de pesquisar e analisar em arquiteturas distribuídas compostas por dezenas de containers. Logs estruturados utilizam o formato JSON com campos bem definidos (nível, serviço, mensagem, usuário, duração). Coletores de telemetria (Fluentd, Vector, Logstash) encaminham esses dados para repositórios indexados como OpenSearch ou Grafana Loki.",
      tip: "Nunca grave dados pessoais ou sigilosos nos logs (senhas, números de cartão, CPFs). Além de violar leis de privacidade como a LGPD, logs com dados sensíveis criam brechas graves de segurança.",
      code: "import pino from 'pino';\nconst logger = pino();\n\n// Emite JSON estruturado padronizado\nlogger.info({\n  event: 'pagamento_processado',\n  pedidoId: 'PED-4501',\n  valorTotal: 159.90,\n  tempoExecucaoMs: 45\n}, 'Pagamento concluído com sucesso');"
    }
  ],

  // Stage 23: MONITORAMENTO
  [
    {
      title: "Métricas com Prometheus e Formato OpenMetrics",
      body: "O Prometheus é o padrão de mercado para monitoramento de métricas em ambientes cloud-native. Ele opera com base no modelo de raspagem periódica (pull/scrape), consultando endpoints HTTP /metrics expostos pelas aplicações. O Prometheus categoriza métricas em quatro tipos: Counters (contadores que só aumentam), Gauges (valores que sobem e descem), Histograms e Summaries de distribuição.",
      tip: "Para avaliar latência de APIs, use Histograms e analise percentis (p95, p99) em vez de médias simples; valores médios mascaram lentidões extremas sofridas pelos clientes.",
      code: "# Exemplo de saída formatada no endpoint /metrics do Prometheus\n# HELP http_requests_total Total acumulado de requisicoes recebidas\n# TYPE http_requests_total counter\nhttp_requests_total{metodo=\"GET\",status=\"200\"} 18450\nhttp_requests_total{metodo=\"POST\",status=\"500\"} 42\n\n# HELP memoria_heap_bytes Quantidade de memoria heap em uso\n# TYPE memoria_heap_bytes gauge\nmemoria_heap_bytes 84210340"
    },
    {
      title: "Visualização com Grafana e Alertas Proativos",
      body: "O Grafana atua como a interface visual da observabilidade, transformando consultas analíticas de métricas (PromQL), logs e traces em painéis gráficos interativos e intuitivos. Além de dashboards em tempo real, sistemas maduros configuram alertas automatizados que notificam as equipes em canais como Slack, Discord ou PagerDuty antes que os clientes percebam a lentidão.",
      tip: "Configure alertas baseados em sintomas que afetam diretamente o usuário (taxa de erro e latência alta), e não em causas indiretas (como uso de CPU em 75%), prevenindo fadiga de alertas.",
      code: "# Regra de alerta no Prometheus (PromQL)\ngroups:\n  - name: alertas-api\n    rules:\n      - alert: TaxaErroElevada\n        expr: sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) > 0.05\n        for: 2m\n        labels:\n          severity: critical\n        annotations:\n          summary: \"Taxa de erros 5xx superior a 5% por mais de 2 minutos!\""
    }
  ],

  // Stage 24: MONITORAMENTO
  [
    {
      title: "Acordos e Indicadores de Nível de Serviço: SLA, SLO e SLI",
      body: "A engenharia de confiabilidade de sites (SRE) estabelece metas claras através do trio SLI, SLO e SLA. O SLI (Service Level Indicator) é a medição real em tempo real (ex: taxa de sucesso de requisições em 99,94%). O SLO (Service Level Objective) é a meta interna pactuada pela engenharia (ex: 99,9%). Já o SLA (Service Level Agreement) é o compromisso comercial com os clientes com previsão de penalidades financeiras.",
      tip: "Jamais defina um SLO de 100% de disponibilidade. Além de ser tecnicamente inviável, buscar 100% encarece a infraestrutura absurdamente e paralisa a capacidade do time de inovar.",
      code: "# Mapeamento prático de confiabilidade:\n# SLI: requisições com código < 500 / total de requisições nos últimos 30 dias\n# SLO: 99.9% de sucesso ao longo de 30 dias contínuos\n# SLA: 99.5% de disponibilidade garantida contratualmente aos clientes"
    },
    {
      title: "Error Budgets (Orçamento de Erro) e Ritmo de Inovação",
      body: "O Error Budget é o saldo aceitável de instabilidade ou lentidão permitido pelo SLO. Se a meta de disponibilidade interna é 99,9%, a equipe possui 0,1% de margem de erro permitida ao longo do mês. O orçamento de erro harmoniza o conflito clássico entre velocidade e estabilidade: se o saldo estiver positivo, entregam-se features velozmente; se esgotar, prioriza-se refatoração e resiliência.",
      tip: "Utilize o saldo do Error Budget como critério objetivo para suspender novos deploys de features quando a estabilidade estiver em risco, sem gerar atritos entre Produto e Engenharia.",
      code: "# Calculando o saldo do Error Budget\ntotal_requisicoes = 10000000\nslo_meta = 0.999 # 99.9%\nfalhas_permitidas = total_requisicoes * (1 - slo_meta) # 10.000 falhas permitidas\nfalhas_ocorridas = 6500\n\nsaldo_restante = (falhas_permitidas - falhas_ocorridas) / falhas_permitidas\nprint(f\"Saldo restante do Error Budget: {saldo_restante * 100:.1f}%\")"
    }
  ],

  // Stage 25: INFRASTRUCTURE AS CODE
  [
    {
      title: "Infraestrutura como Código (IaC) e Declaratividade",
      body: "Infraestrutura como Código (IaC) substitui cliques manuais em consoles de nuvem por arquivos declarativos gerenciados no Git. Ao descrever servidores, redes virtuais (VPCs), clusters e bancos de dados através de código, a equipe elimina inconsistências entre ambientes (Configuration Drift), assegura reprodutibilidade total e permite recriar datacenters inteiros em poucos minutos.",
      tip: "Evite scripts imperativos (como comandos manuais da CLI de nuvens). Dê preferência a ferramentas declarativas como Terraform ou OpenTofu, que gerenciam o estado final desejado do sistema.",
      code: "# Exemplo declarativo em HCL (Terraform)\nresource \"aws_s3_bucket\" \"artefatos\" {\n  bucket = \"empresa-artefatos-ci-2026\"\n\n  tags = {\n    Ambiente   = \"Producao\"\n    Gerenciado = \"Terraform\"\n  }\n}"
    },
    {
      title: "Terraform: Providers, Recursos e Linguagem HCL",
      body: "O Terraform utiliza a linguagem declarativa HCL (HashiCorp Configuration Language). Seu funcionamento apoia-se em Providers: plugins que fazem a ponte entre o Terraform e as APIs de provedores de nuvem (AWS, Azure, Google Cloud, Cloudflare, GitHub). Ao executar o código, o Terraform calcula o grafo de dependências entre os recursos e provisiona componentes paralelos de maneira otimizada.",
      tip: "Sempre trave a versão exata dos providers no bloco 'required_providers' do Terraform para evitar que atualizações inesperadas de plugins quebrem os scripts da infraestrutura.",
      code: "terraform {\n  required_version = \">= 1.5.0\"\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nprovider \"aws\" {\n  region = \"us-east-1\"\n}"
    }
  ],

  // Stage 26: INFRASTRUCTURE AS CODE
  [
    {
      title: "O Ciclo de Vida: Terraform Plan e Terraform Apply",
      body: "O fluxo de trabalho com Terraform opera em etapas previsíveis e controladas: 'terraform init' inicializa os módulos e faz download dos plugins de providers; 'terraform plan' analisa o código e gera um planejamento detalhado das ações (+ criar, ~ alterar, - destruir), permitindo revisão antes da execução; e 'terraform apply' aplica as modificações planejadas nas APIs da nuvem.",
      tip: "Nas esteiras de CI, nunca execute 'terraform apply' sem antes salvar o plano com '-out=tfplan' no Pull Request, garantindo que o que foi revisado pelos pares seja exatamente o aplicado.",
      code: "# Sequência padrão de automação no CI\nterraform init -backend-config=prod.conf\nterraform plan -out=plano.tfplan\n\n# Apenas após aprovação no pipeline de CD:\nterraform apply -auto-approve plano.tfplan"
    },
    {
      title: "Terraform State: O Estado da Infraestrutura e Locks",
      body: "O arquivo de estado do Terraform (terraform.tfstate) é o elemento central que mapeia os recursos declarados no código com os IDs reais dos componentes criados na nuvem. Em equipes profissionais, o estado jamais deve ficar em discos locais; ele deve ser armazenado em um Backend Remoto compartilhado (ex: bucket S3 com criptografia e DynamoDB para State Locking).",
      tip: "Nunca comite arquivos .tfstate no repositório Git! Eles podem conter variáveis e credenciais confidenciais em texto simples. Armazene o estado exclusivamente em storage remoto seguro.",
      code: "terraform {\n  backend \"s3\" {\n    bucket         = \"empresa-terraform-state-prod\"\n    key            = \"redes/vpc.tfstate\"\n    region         = \"us-east-1\"\n    encrypt        = true\n    dynamodb_table = \"terraform-locks\"\n  }\n}"
    }
  ],

  // Stage 27: INFRASTRUCTURE AS CODE
  [
    {
      title: "Gerenciamento de Configuração com Ansible",
      body: "Enquanto o Terraform se destaca no provisionamento estrutural da infraestrutura (criação de VMs, redes e bancos), ferramentas de Gerenciamento de Configuração como o Ansible destacam-se em configurar o interior das máquinas (instalar pacotes, gerenciar arquivos de configuração e serviços). O Ansible opera sem agentes (agentless), comunicando-se via SSH com Playbooks declarativos em YAML.",
      tip: "Escreva Playbooks Ansible idempotentes: executar a mesma automação 10 vezes consecutivas no mesmo servidor deve produzir exatamente o mesmo estado final sem causar efeitos colaterais.",
      code: "# playbook.yml para configuracao padronizada do Nginx\n- name: Configurar servidor Nginx\n  hosts: webservers\n  become: true\n  tasks:\n    - name: Garantir instalacao do Nginx\n      apt:\n        name: nginx\n        state: present\n    - name: Garantir que o servico esta ativo\n      service:\n        name: nginx\n        state: started\n        enabled: true"
    },
    {
      title: "Integração de IaC no Pipeline de CI/CD",
      body: "A união de IaC com CI/CD viabiliza esteiras de infraestrutura automatizadas. A cada Pull Request de infraestrutura, o pipeline formata o código (terraform fmt), executa linters estáticos (tflint), analisa vulnerabilidades de segurança (com Checkov ou tfsec) e gera um comentário automático no PR com o output de 'terraform plan', trazendo total transparência antes do merge na branch principal.",
      tip: "Adicione ferramentas como Infracost no pipeline de PR para estimar o impacto financeiro em dólares na fatura da nuvem antes de autorizar o provisionamento de novos recursos.",
      code: "# Pipeline de validacao estatica e planejamento de infraestrutura\nsteps:\n  - uses: actions/checkout@v4\n  - uses: hashicorp/setup-terraform@v3\n  - run: terraform fmt -check\n  - run: tflint\n  - run: terraform plan -no-color"
    }
  ],

  // Stage 28: PROJETO FINAL
  [
    {
      title: "Montando uma Esteira de Pipeline End-to-End",
      body: "Um pipeline End-to-End integra todas as etapas da entrega de software de ponta a ponta: desde o commit inicial até a aplicação rodando em produção com telemetria ativa. A esteira funciona como um funil de qualidade unidirecional: validações estáticas e linters -> suíte de testes rápidos -> compilação de imagem imutável de container -> homologação em Staging -> deploy em produção sob métricas.",
      tip: "Desenhe a esteira de entrega para que as etapas mais velozes e com maior probabilidade de erro rodem primeiro, garantindo feedback econômico e imediato para a equipe.",
      code: "# Arquitetura de pipeline End-to-End\nname: Pipeline End-to-End\non:\n  push:\n    branches: [ main ]\njobs:\n  validacao: # 1. Rapido: Lint e Testes Unitarios\n    runs-on: ubuntu-latest\n    steps: [ run: npm test ]\n  build:     # 2. Empacotamento imutavel\n    needs: validacao\n    runs-on: ubuntu-latest\n    steps: [ run: docker build -t app:${{ github.sha }} . ]\n  deploy:    # 3. Publicacao automatizada\n    needs: build\n    runs-on: ubuntu-latest\n    steps: [ run: ./deploy.sh ]"
    },
    {
      title: "DevSecOps: Segurança Contínua e Shift-Left",
      body: "DevSecOps é a integração de práticas e ferramentas de segurança da informação em todas as fases do ciclo de desenvolvimento, em vez de deixar auditorias de segurança para um momento tardio antes do lançamento. A abordagem 'Shift-Left' move a segurança para o início do ciclo, integrando análise estática de código (SAST), análise de composição de software (SCA) e escaneamento de segredos no CI.",
      tip: "Adicione scanners de credenciais (como Gitleaks) em pre-commit hooks e no CI para impedir que desenvolvedores comitem tokens de acesso da AWS ou chaves privadas por engano.",
      code: "- name: Auditoria de vulnerabilidades em dependencias (SCA)\n  run: npm audit --audit-level=high\n- name: Inspecionar vazamento de segredos com Gitleaks\n  uses: gitleaks/gitleaks-action@v2\n  env:\n    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"
    }
  ],

  // Stage 29: PROJETO FINAL
  [
    {
      title: "Provisionamento de Ambientes Efêmeros (Preview)",
      body: "Ambientes Efêmeros (Preview Environments) são réplicas temporárias de produção geradas sob demanda para cada Pull Request aberto e destruídas automaticamente após o merge. Utilizando orquestradores de containers e namespaces isolados, desenvolvedores, designers e gerentes de produto podem testar funcionalidades isoladamente em URLs dinâmicas sem disputar o ambiente compartilhado de Staging.",
      tip: "Configure um mecanismo de expiração com tempo de vida útil (TTL) nos ambientes efêmeros para evitar que containers fiquem rodando indefinidamente em caso de PRs abandonados.",
      code: "# Criando namespace sob demanda no Kubernetes para o PR\n- name: Subir ambiente efemero para o PR\n  run: |\n    PR_ID=\"pr-${{ github.event.pull_request.number }}\"\n    kubectl create namespace \"preview-$PR_ID\"\n    helm upgrade --install app ./chart -n \"preview-$PR_ID\" \\\n      --set ingress.host=\"$PR_ID.preview.empresa.com\""
    },
    {
      title: "Documentação Viva e Architecture Decision Records (ADRs)",
      body: "Documentações desatualizadas em wikis externas perdem relevância rapidamente. Equipes de alto desempenho tratam documentação como código ('Docs as Code'), versionando manuais e diagramas em Markdown dentro do próprio repositório. Decisões arquiteturais relevantes devem ser registradas como ADRs (Architecture Decision Records), registrando o contexto histórico, opções avaliadas e consequências da escolha técnica.",
      tip: "Antes de alterar bibliotecas críticas ou arquiteturas de infraestrutura, abra um PR com um novo arquivo ADR em 'docs/adr/' para registrar formalmente a justificativa da decisão.",
      code: "# docs/adr/003-adocao-trunk-based.md\n# ADR 003: Adoção do Trunk-Based Development\n## Status: Aceito\n## Contexto: O fluxo de Git Flow causava branches paradas e merges dolorosos.\n## Decisão: Todas as features serão integradas na main em menos de 24h via Feature Flags.\n## Consequências: Exige disciplina no uso de flags e maior investimento em testes no CI."
    }
  ],

  // Stage 30: PROJETO FINAL
  [
    {
      title: "Métricas DORA e o Retorno de Investimento em DevOps",
      body: "O impacto do DevOps nos negócios é quantificado pelas quatro métricas DORA (DevOps Research and Assessment): 1) Deployment Frequency (frequência com que o código chega em produção); 2) Lead Time for Changes (tempo decorrido do commit ao deploy); 3) Change Failure Rate (porcentagem de deploys que causam falhas); e 4) Time to Restore Service (MTTR, tempo para restabelecer o serviço).",
      tip: "Não meça produtividade por linhas de código ou horas gastas. Avalie a evolução do squad através das métricas DORA, buscando reduzir o Lead Time e diminuir o tempo de restauração em falhas.",
      code: "# Quadro de referência DORA para times de elite:\n# 1. Frequência de Deploy: Múltiplas vezes ao dia (sob demanda)\n# 2. Lead Time para Mudanças: Menos de 1 hora\n# 3. Tempo de Recuperação (MTTR): Menos de 1 hora\n# 4. Taxa de Falha em Produção: Abaixo de 15%"
    },
    {
      title: "A Próxima Fronteira: Kubernetes e GitOps",
      body: "A evolução do DevOps culmina no paradigma GitOps em conjunto com orquestradores de containers como Kubernetes. No GitOps (usando ferramentas como ArgoCD ou Flux), o cluster interno monitora ativamente o repositório Git e reconcilia o estado dos nós para coincidir com a declaração do repositório. O processo inverte a esteira de push tradicional para um modelo seguro de pull contínuo.",
      tip: "Com GitOps, os runners de CI não precisam de privilégios de administrador de cluster, pois o operador interno do cluster é quem puxa as atualizações de forma declarativa e segura.",
      code: "# Manifest de sincronizacao continua com ArgoCD (GitOps)\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: catalogo-produtos\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: 'https://github.com/empresa/gitops-manifests.git'\n    targetRevision: HEAD\n    path: k8s/producao\n  destination:\n    server: 'https://kubernetes.default.svc'\n    namespace: producao\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true"
    }
  ]
];

console.log('Total stages in devopsLessons:', devopsLessons.length);
let invalidCount = 0;
devopsLessons.forEach((stageLessons, idx) => {
  if (stageLessons.length !== 2) {
    console.error(`Stage ${idx + 1} does not have 2 lessons! Has: ${stageLessons.length}`);
    invalidCount++;
  }
  stageLessons.forEach((l, lidx) => {
    const len = l.body.length;
    if (len < 350 || len > 600) {
      console.error(`Stage ${idx + 1} Lesson ${lidx + 1} body length out of range: ${len} ("${l.title}")`);
      invalidCount++;
    }
    if (!l.tip || l.tip.length < 20) {
      console.error(`Stage ${idx + 1} Lesson ${lidx + 1} missing or too short tip`);
      invalidCount++;
    }
    if (!l.code || l.code.length < 10) {
      console.error(`Stage ${idx + 1} Lesson ${lidx + 1} missing or too short code`);
      invalidCount++;
    }
  });
});

if (invalidCount === 0) {
  console.log('ALL 30 STAGES (60 LESSONS) FOR DEVOPS ARE VALID! Character counts strictly in range 350-600.');
} else {
  console.log(`Found ${invalidCount} validation issues.`);
}
