const fs = require('fs');

const mlLessons = [
  // Stage 1: FUNDAMENTOS DE ML
  [
    {
      title: "Tipos de Aprendizado: Supervisionado, Não-Supervisionado e Reforço",
      body: "Machine Learning estrutura-se em três paradigmas matemáticos fundamentais. No Aprendizado Supervisionado, o modelo recebe pares de entrada e saída rotulada (X, y) para aprender uma função de aproximação f(X) ≈ y. No Aprendizado Não-Supervisionado, não existem rótulos; o algoritmo busca estruturas ocultas, agrupamentos e distribuições de probabilidade intrínsecas nos dados P(X). Já no Aprendizado por Reforço, um agente aprende a tomar decisões sequenciais em um ambiente para maximizar recompensas cumulativas.",
      tip: "Defina claramente a pergunta de negócio antes de escolher o algoritmo: se você possui o resultado histórico que deseja prever, trata-se de um problema supervisionado de classificação ou regressão.",
      code: "import numpy as np\n# Exemplo: dados de treino com features X e rótulos supervisionados y\nX = np.array([[1.5, 2.0], [2.1, 3.5], [3.0, 4.2]])\ny = np.array([0, 1, 1]) # Rótulos conhecidos\nprint(f\"Dimensões da matriz de entrada: {X.shape}, Rótulos: {y.shape}\")"
    },
    {
      title: "Features, Labels e Matrizes de Dados",
      body: "Na modelagem matemática, os dados de entrada são organizados como uma matriz de design bidimensional X ∈ R^(n × d), onde 'n' representa a quantidade de amostras e 'd' é o número de atributos independentes (features). O vetor de saída 'y' contém as variáveis dependentes (labels) que o modelo busca estimar. Em tarefas de regressão, 'y' assume valores contínuos reais; em problemas de classificação, 'y' assume classes discretas. Tratar e estruturar essa matriz é o primeiro passo de qualquer projeto.",
      tip: "Sempre inspecione o formato das matrizes com X.shape e y.shape antes do treinamento para evitar erros comuns de incompatibilidade dimensional nas operações de álgebra linear.",
      code: "import pandas as pd\ndf = pd.DataFrame({\n    'idade': [22, 38, 26, 35],\n    'renda': [2500.0, 8500.0, 3200.0, 7100.0],\n    'inadimplente': [0, 0, 0, 1] # Label binário\n})\nX = df[['idade', 'renda']] # Matriz de Features (4x2)\ny = df['inadimplente']      # Vetor de Labels (4,)"
    }
  ],

  // Stage 2: FUNDAMENTOS DE ML
  [
    {
      title: "O Que É um Modelo Matemático de Machine Learning?",
      body: "Um modelo de Machine Learning é uma função hipótese parametrizada h_θ(x) que mapeia entradas em predições. O processo de treinamento consiste em encontrar computacionalmente o vetor de parâmetros ótimo θ* que minimiza uma função de custo J(θ) calculada sobre as amostras observadas. Diferente da programação tradicional onde humanos escrevem regras condicionais 'se-então', no aprendizado de máquina o algoritmo infere os parâmetros matemáticos diretamente a partir dos padrões estatísticos dos dados.",
      tip: "Lembre-se: modelos estatísticos aprendem correlações numéricas nos dados fornecidos, e não relações de causa e efeito. Nunca confunda correlação estatística com causalidade real.",
      code: "# Conceito: Predição linear parametrizada h_theta(x) = theta0 + theta1 * x\ndef prever_valor(x, theta0, theta1):\n    return theta0 + (theta1 * x)\n\n# Parâmetros aprendidos pelo algoritmo via otimização\ntheta_intercepto = 120.5\ntheta_inclinacao = 15.2\npredicao = prever_valor(10, theta_intercepto, theta_inclinacao)\nprint(f\"Predição do modelo: {predicao}\")"
    },
    {
      title: "Divisão de Dados: Treino, Validação e Teste",
      body: "Avaliar o desempenho de um modelo nos mesmos dados em que ele foi treinado produz uma estimativa perigosamente otimista (vazamento de dados). Por essa razão, particiona-se o conjunto original em três subconjuntos estritamente isolados: Treino (utilizado para otimizar os parâmetros do modelo), Validação (usado para ajustar hiperparâmetros e selecionar a melhor arquitetura) e Teste (reservado exclusivamente para estimar a capacidade real de generalização em produção).",
      tip: "Nunca utilize o conjunto de teste durante o ajuste de hiperparâmetros. O conjunto de teste deve ser tocado apenas uma vez ao final do projeto para atestar o desempenho final do modelo.",
      code: "from sklearn.model_selection import train_test_split\n# Divisão canônica: 80% treino e 20% teste\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\nprint(f\"Treino: {X_train.shape[0]} amostras | Teste: {X_test.shape[0]} amostras\")"
    }
  ],

  // Stage 3: FUNDAMENTOS DE ML
  [
    {
      title: "Overfitting vs Underfitting e o Dilema Bias-Variance",
      body: "O erro total de predição decompõe-se matematicamente em três componentes: Bias ao quadrado (Viés), Variância e Ruído Irredutível. Underfitting (Alto Viés) ocorre quando a hipótese é simples demais para capturar as relações reais dos dados, gerando erros altos tanto no treino quanto no teste. Overfitting (Alta Variância) ocorre quando o modelo decora o ruído e peculiaridades do treino, obtendo erro quase nulo no treino, mas falhando miseravelmente ao prever dados novos do teste.",
      tip: "Se a acurácia de treino for de 99% mas a de validação for de apenas 65%, seu modelo sofreu overfitting severo. Reduza a complexidade do modelo, adicione regularização ou colete mais dados.",
      code: "# Diagnóstico prático de overfitting vs underfitting\nerro_treino = 0.02 # Erro quase zero no treino\nerro_val = 0.38    # Erro alto na validação\n\nif erro_treino < 0.05 and erro_val > 0.20:\n    print(\"ALERTA: Overfitting detectado! O modelo decorou as amostras de treino.\")\nelif erro_treino > 0.25 and erro_val > 0.25:\n    print(\"ALERTA: Underfitting detectado! O modelo é incapaz de aprender o padrão.\")"
    },
    {
      title: "A Centralidade dos Dados e a Abordagem Data-Centric",
      body: "A máxima 'Garbage In, Garbage Out' rege a ciência de dados. A qualidade, representatividade e consistência dos dados estabelecem o limite superior do desempenho de qualquer modelo matemático. Na abordagem contemporânea de IA Centrada em Dados (Data-Centric AI), investir esforços em corrigir anotações ruidosas, remover inconsistências de medição e balancear classes gera ganhos de acurácia muito mais expressivos do que tentar otimizar hiperparâmetros de algoritmos sobre dados corrompidos.",
      tip: "Passe 80% do seu tempo de projeto explorando, limpando e entendendo os dados. Nenhum algoritmo moderno de Deep Learning consegue compensar dados de treino incorretos ou tendenciosos.",
      code: "import pandas as pd\n# Auditoria inicial de qualidade dos dados\nprint(\"Valores nulos por coluna:\\n\", df.isnull().sum())\nprint(\"\\nDistribuição estatística das variáveis:\\n\", df.describe())"
    }
  ],

  // Stage 4: PREPARAÇÃO DE DADOS
  [
    {
      title: "Tratamento de Valores Ausentes (Imputação de Dados)",
      body: "Dados do mundo real frequentemente contêm valores ausentes (NaN) decorrentes de falhas de sensores ou formulários não preenchidos. Descartar linhas arbitrariamente reduz o tamanho da amostra e introduz viés de seleção. Técnicas de imputação substituem valores faltantes por métricas estatísticas: a média ou mediana para variáveis numéricas contínuas (a mediana sendo robusta contra outliers extremos), a moda para dados categóricos, ou algoritmos iterativos como KNN Imputer.",
      tip: "Sempre calcule a média ou mediana exclusivamente sobre o conjunto de treino e aplique esse mesmo valor fixo para imputar o conjunto de teste, prevenindo vazamento de dados (Data Leakage).",
      code: "from sklearn.impute import SimpleImputer\nimport numpy as np\n\n# Imputando valores numéricos ausentes com a mediana\nimputador = SimpleImputer(strategy='median')\nX_treino_limpo = imputador.fit_transform(X_train)\nX_teste_limpo = imputador.transform(X_test) # Apenas transform no teste!"
    },
    {
      title: "Normalização (Min-Max) vs Padronização (Z-Score)",
      body: "Algoritmos baseados em distâncias euclidianas (KNN, K-Means, SVM) e otimizadores por gradiente são sensíveis à escala das features: uma variável com valores na casa dos milhões dominará arbitrariamente variáveis em decimais. A Normalização Min-Max comprime os dados para o intervalo [0, 1] via (x - x_min)/(x_max - x_min). A Padronização Z-score reescala os dados para média 0 e desvio padrão 1 via z = (x - μ)/σ, sendo menos vulnerável a outliers extremos.",
      tip: "Use StandardScaler (Padronização) como escolha padrão para regressões lineares, redes neurais e SVMs. Use MinMaxScaler quando seus dados precisarem estritamente de limites [0, 1].",
      code: "from sklearn.preprocessing import StandardScaler\n\nscaler = StandardScaler()\n# Ajusta a média e desvio padrão apenas no treino\nX_train_scaled = scaler.fit_transform(X_train)\nX_test_scaled = scaler.transform(X_test)\nprint(f\"Média: {X_train_scaled.mean(axis=0).round(2)}, Desvio: {X_train_scaled.std(axis=0)}\")"
    }
  ],

  // Stage 5: PREPARAÇÃO DE DADOS
  [
    {
      title: "Codificação Categórica com One-Hot Encoding",
      body: "Modelos matemáticos exigem entradas numéricas e são incapazes de processar texto ou categorias brutas diretamente. Variáveis categóricas nominais (como cores, países ou marcas) não possuem hierarquia ou ordem matemática intrínseca. A técnica de One-Hot Encoding converte cada categoria única em uma nova coluna binária (0 ou 1), preservando a independência vetorial das categorias sem impor ordenações falsas.",
      tip: "Utilize o argumento 'drop=\"first\"' no One-Hot Encoding em regressões lineares para evitar a chamada armadilha da multicolinearidade perfeita (Dummy Variable Trap).",
      code: "from sklearn.preprocessing import OneHotEncoder\nimport pandas as pd\n\ndf_cidades = pd.DataFrame({'cidade': ['SP', 'RJ', 'BH', 'SP']})\nohe = OneHotEncoder(sparse_output=False, drop='first')\nencoded = ohe.fit_transform(df_cidades[['cidade']])\nprint(\"Colunas geradas:\\n\", ohe.get_feature_names_out(), \"\\nValores:\\n\", encoded)"
    },
    {
      title: "Label Encoding e Variáveis Ordinais",
      body: "Diferente de variáveis nominais, variáveis ordinais possuem uma relação de escala e ordem inerente (como nível de escolaridade: fundamental=1, médio=2, superior=3; ou faixas de avaliação: ruim=0, regular=1, bom=2). O Ordinal Encoding (ou Label Encoding) mapeia cada categoria para um número inteiro ordenado, permitindo que o modelo capture e utilize essa gradação matemática diretamente no cálculo dos pesos.",
      tip: "Nunca aplique Label Encoding em variáveis nominais sem ordem (como estados civis ou nomes de produtos), pois o modelo interpretará erroneamente que a categoria 3 vale o triplo da categoria 1.",
      code: "from sklearn.preprocessing import OrdinalEncoder\n\ndf_escolaridade = pd.DataFrame({'nivel': ['Médio', 'Fundamental', 'Superior']})\nordem_categorias = [['Fundamental', 'Médio', 'Superior']]\nencoder = OrdinalEncoder(categories=ordem_categorias)\ndf_escolaridade['nivel_codificado'] = encoder.fit_transform(df_escolaridade[['nivel']])\nprint(df_escolaridade)"
    }
  ],

  // Stage 6: PREPARAÇÃO DE DADOS
  [
    {
      title: "Divisão Estratificada de Dados (Stratified Splitting)",
      body: "Em problemas de classificação com classes fortemente desbalanceadas (como detecção de fraudes com 99% de transações legítimas e 1% de golpes), uma divisão aleatória padrão corre o sério risco de alocar poucas ou nenhuma amostra da classe minoritária no conjunto de teste. A amostragem estratificada (Stratified Splitting) preserva a proporção exata de cada classe em todos os subconjuntos divididos.",
      tip: "Sempre passe o argumento 'stratify=y' no train_test_split para qualquer tarefa de classificação, garantindo representatividade idêntica das classes nos dados de treino e teste.",
      code: "from sklearn.model_selection import train_test_split\nimport numpy as np\n\ny_desbalanceado = np.array([0]*90 + [1]*10) # 90 da classe 0, 10 da classe 1\nX_dummy = np.zeros((100, 2))\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X_dummy, y_desbalanceado, test_size=0.2, stratify=y_desbalanceado, random_state=42\n)\nprint(f\"Proporção classe 1 no teste: {np.mean(y_test):.1%}\")"
    },
    {
      title: "Engenharia de Atributos (Feature Engineering) e Seleção",
      body: "Engenharia de atributos é a arte de criar novas variáveis explicativas combinando ou transformando dados brutos para facilitar a separação matemática das classes (ex: razões financeiras, interações polinomiais e extração de dias da semana de datas). Simultaneamente, a seleção de atributos remove variáveis redundantes, ruídos e colineares, combatendo a Maldição da Dimensionalidade e reduzindo custos de computação.",
      tip: "Monitore a correlação entre as features de entrada: se duas variáveis possuírem correlação linear próxima de 1.0, descarte uma delas para evitar redundância e instabilidade no modelo.",
      code: "import pandas as pd\ndf_vendas = pd.DataFrame({\n    'data': pd.to_datetime(['2026-09-01', '2026-09-06']),\n    'preco': [100.0, 200.0],\n    'custo': [60.0, 110.0]\n})\n# Criação de features derivadas ricas\ndf_vendas['margem_lucro'] = (df_vendas['preco'] - df_vendas['custo']) / df_vendas['preco']\ndf_vendas['eh_fim_de_semana'] = df_vendas['data'].dt.dayofweek >= 5\nprint(df_vendas)"
    }
  ],

  // Stage 7: REGRESSÃO
  [
    {
      title: "Regressão Linear Simples e Mínimos Quadrados (OLS)",
      body: "A Regressão Linear Simples modela a relação entre uma variável explicativa x e uma variável resposta contínua y através da equação da reta: ŷ = β₀ + β₁x. O Método dos Mínimos Quadrados Ordinários (OLS) encontra os coeficientes analíticos que minimizam a soma dos quadrados dos resíduos (erros entre o valor real e a reta). O coeficiente angular β₁ representa a taxa marginal de variação de y para cada unidade incrementada em x.",
      tip: "Verifique visualmente através de um gráfico de dispersão se a relação entre as variáveis é aproximadamente linear antes de adotar regressão linear; para curvas, use termos polinomiais.",
      code: "from sklearn.linear_model import LinearRegression\nimport numpy as np\n\nX_horas = np.array([[1], [2], [3], [4], [5]]) # Horas de estudo\ny_nota = np.array([50, 60, 70, 80, 90])         # Nota final\n\nmodelo = LinearRegression()\nmodelo.fit(X_horas, y_nota)\nprint(f\"Reta: y = {modelo.intercept_:.1f} + {modelo.coef_[0]:.1f} * x\")"
    },
    {
      title: "Métricas de Regressão: MSE, RMSE, MAE e R²",
      body: "Avaliar modelos de regressão requer métricas que mensurem a distância entre valores reais e previstos. O Erro Médio Absoluto (MAE) calcula a média das distâncias |y - ŷ| e é intuitivo e robusto a outliers. O Erro Quadrático Médio (MSE) eleva os erros ao quadrado, penalizando desvios grandes severamente. O RMSE é a raiz quadrada do MSE, devolvendo o erro à unidade original da métrica. Já o coeficiente R² indica a proporção de variância explicada pelo modelo.",
      tip: "Sempre compare o RMSE com o MAE: se o RMSE for expressivamente maior que o MAE, indica que seu modelo está cometendo erros pontuais muito grandes (outliers graves de predição).",
      code: "from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score\nimport numpy as np\n\ny_real = [100, 150, 200, 250]\ny_pred = [105, 148, 190, 270]\n\nmae = mean_absolute_error(y_real, y_pred)\nrmse = np.sqrt(mean_squared_error(y_real, y_pred))\nr2 = r2_score(y_real, y_pred)\nprint(f\"MAE: {mae:.2f} | RMSE: {rmse:.2f} | R²: {r2:.3f}\")"
    }
  ],

  // Stage 8: REGRESSÃO
  [
    {
      title: "Otimização por Gradiente Descendente (Gradient Descent)",
      body: "Quando o volume de dados ou número de features é gigante, calcular a solução analítica exata de matrizes torna-se proibitivamente custoso. O Gradiente Descendente é um algoritmo iterativo de otimização que encontra o mínimo da função de custo calculando suas derivadas parciais (o gradiente). A cada iteração, os pesos são atualizados na direção oposta ao gradiente: θ := θ - α∇J(θ), onde α é a taxa de aprendizado (learning rate).",
      tip: "Ajuste a taxa de aprendizado com cuidado: um valor muito alto fará o algoritmo divergir e saltar para o infinito; um valor muito baixo tornará o treinamento extremamente lento e demorado.",
      code: "import numpy as np\n# Simulação conceitual de gradiente descendente em 1D\ntheta = 10.0 # Ponto de partida inicial arbitrário\ntaxa_aprendizado = 0.1\n\nfor epoca in range(20):\n    gradiente = 2 * theta # Derivada de f(theta) = theta^2\n    theta = theta - taxa_aprendizado * gradiente\nprint(f\"Valor de theta convergido para o mínimo: {theta:.4f}\")"
    },
    {
      title: "Regressão Linear Múltipla e a Equação Normal",
      body: "A Regressão Linear Múltipla estende o conceito para múltiplos atributos: ŷ = θ₀ + θ₁x₁ + ... + θ_d x_d = Xθ. Matematicamente, a solução analítica exata que zera o gradiente da soma dos resíduos quadráticos é dada pela Equação Normal: θ = (XᵀX)⁻¹Xᵀy. No entanto, se duas features forem colineares, a matriz XᵀX torna-se não invertível ou instável, gerando coeficientes com variância absurdamente inflada.",
      tip: "Utilize a Equação Normal ou OLS para conjuntos com menos de 50.000 amostras. Para volumes massivos de dados, utilize SGDRegressor (Gradiente Descendente Estocástico).",
      code: "from sklearn.linear_model import SGDRegressor\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\n# Regressão linear escalável via gradiente descendente estocástico\nmodelo_sgd = make_pipeline(StandardScaler(), SGDRegressor(max_iter=1000, eta0=0.01))\nmodelo_sgd.fit(X, y)\nprint(\"Modelo treinado com sucesso via SGD!\")"
    }
  ],

  // Stage 9: REGRESSÃO
  [
    {
      title: "Regressão Logística e a Função Sigmoide",
      body: "Apesar do nome 'Regressão', a Regressão Logística é um dos algoritmos mais populares para tarefas de Classificação Binária. Ela mapeia uma combinação linear dos atributos para uma probabilidade no intervalo contínuo entre 0 e 1 através da Função Sigmoide: σ(z) = 1 / (1 + e^(-z)). Se a probabilidade resultante ultrapassar o limiar de decisão (usualmente 0.5), o modelo prevê a classe positiva (1); caso contrário, a classe negativa (0).",
      tip: "Você pode calibrar o limiar de decisão (threshold): para diagnósticos médicos onde não se pode perder casos positivos, diminua o corte de 0.5 para 0.2 para maximizar a sensibilidade (Recall).",
      code: "from sklearn.linear_model import LogisticRegression\nimport numpy as np\n\nclf = LogisticRegression()\nclf.fit(X_train, y_train)\n# Obtendo a probabilidade contínua estimada [P(y=0), P(y=1)]\nprobabilidades = clf.predict_proba(X_test)\nprint(\"Probabilidade da primeira amostra ser classe 1:\", probabilidades[0][1].round(4))"
    },
    {
      title: "Regularização L1 (Lasso) e L2 (Ridge)",
      body: "Técnicas de regularização impõem penalidades matemáticas sobre a magnitude dos coeficientes para combater o overfitting. A Regularização Ridge (L2) adiciona à função de perda o termo λ∑θⱼ², encolhendo os pesos suavemente em direção a zero sem eliminá-los completamente. A Regularização Lasso (L1) adiciona o termo λ∑|θⱼ|, cuja geometria de otimização zera completamente os pesos de features inúteis, realizando seleção automática de atributos.",
      tip: "Use ElasticNet se você tiver dezenas de variáveis altamente correlacionadas: ele combina o melhor de L1 e L2, evitando que o Lasso descarte variáveis importantes arbitrariamente.",
      code: "from sklearn.linear_model import Ridge, Lasso\n\n# Ridge comprime os coeficientes suavemente\nridge = Ridge(alpha=1.0).fit(X_train, y_train)\n# Lasso zera features irrelevantes (gera esparsidade)\nlasso = Lasso(alpha=0.1).fit(X_train, y_train)\nprint(f\"Pesos no Ridge: {ridge.coef_}\\nPesos no Lasso: {lasso.coef_}\")"
    }
  ],

  // Stage 10: CLASSIFICAÇÃO
  [
    {
      title: "O Algoritmo K-Nearest Neighbors (KNN)",
      body: "O K-Nearest Neighbors é um algoritmo não-paramétrico baseado em instâncias (lazy learning): ele não possui fase explícita de treinamento nem coeficientes aprendidos. Para classificar uma nova amostra, o KNN calcula a distância matemática (como a distância Euclidiana) entre essa nova amostra e todos os pontos do conjunto de treino, identifica os 'k' vizinhos mais próximos e atribui a classe mais frequente por votação majoritária.",
      tip: "Nunca execute o KNN sem antes padronizar ou normalizar as features com StandardScaler. Como o KNN calcula distâncias geométricas brutas, features com escalas maiores distorcem o resultado.",
      code: "from sklearn.neighbors import KNeighborsClassifier\n\n# Instancia o KNN com k=5 vizinhos e peso uniforme\nknn = KNeighborsClassifier(n_neighbors=5, metric='euclidean')\nknn.fit(X_train_scaled, y_train)\npredicoes = knn.predict(X_test_scaled)\nprint(f\"Acurácia do KNN: {knn.score(X_test_scaled, y_test):.2%}\")"
    },
    {
      title: "Árvores de Decisão e Critérios de Divisão (Gini e Entropia)",
      body: "Árvores de Decisão particionam o espaço de dados recursivamente através de testes em nós de decisão, gerando regras 'se-então' legíveis e interpretáveis. A cada divisão, o algoritmo escolhe o atributo e ponto de corte que maximizam o ganho de pureza das amostras. Os critérios mais comuns são o Índice Gini (probabilidade de classificação incorreta) e a Entropia de Shannon (baseada na teoria da informação e incerteza).",
      tip: "Árvores de decisão sem restrições crescem até memorizar todo o ruído de treino. Limite sempre o hiperparâmetro 'max_depth' ou 'min_samples_leaf' para controlar o overfitting.",
      code: "from sklearn.tree import DecisionTreeClassifier\n\n# Árvore podada para evitar memorização excessiva\narvore = DecisionTreeClassifier(max_depth=4, criterion='gini', random_state=42)\narvore.fit(X_train, y_train)\nprint(\"Importância de cada feature calculada pela árvore:\", arvore.feature_importances_)"
    }
  ],

  // Stage 11: CLASSIFICAÇÃO
  [
    {
      title: "Support Vector Machines (SVM) e Margem Máxima",
      body: "O Support Vector Machines busca encontrar o hiperplano separador ideal que maximize a margem geométrica de separação entre as classes de dados. A distância entre os pontos mais próximos de cada classe (chamados de Vetores de Suporte) e a fronteira de decisão é maximizada matematicamente através de otimização convexa quadrática, o que confere ao SVM fortes garantias teóricas de capacidade de generalização.",
      tip: "O hiperparâmetro 'C' no SVM equilibra a largura da margem e a tolerância a erros: valores baixos de C buscam margem mais larga tolerando ruídos; valores altos exigem classificação estrita.",
      code: "from sklearn.svm import SVC\n\n# SVM linear com penalidade de margem C\nsvm_linear = SVC(kernel='linear', C=1.0)\nsvm_linear.fit(X_train_scaled, y_train)\nprint(f\"Total de vetores de suporte identificados: {svm_linear.n_support_}\")"
    },
    {
      title: "O Truque do Kernel (Kernel Trick) no SVM",
      body: "Quando os dados não são linearmente separáveis no espaço dimensional original, o Truque do Kernel projeta implicitamente os dados para um espaço de dimensão superior (espaço de Hilbert) onde as classes se tornam linearmente separáveis por um hiperplano. O Kernel RBF (Radial Basis Function / Gaussiano) e o Kernel Polinomial realizam esse mapeamento calculando apenas produtos escalares, sem o custo astronômico de transformar vetores explicitamente.",
      tip: "Para a grande maioria dos problemas não-lineares, utilize o kernel padrão 'rbf'. Ajuste o hiperparâmetro 'gamma' em conjunto com 'C' para dosar o raio de curvatura da fronteira.",
      code: "from sklearn.svm import SVC\n\n# SVM não-linear com Kernel Gaussiano RBF\nsvm_rbf = SVC(kernel='rbf', C=1.0, gamma='scale')\nsvm_rbf.fit(X_train_scaled, y_train)\nprint(f\"Acurácia do SVM RBF: {svm_rbf.score(X_test_scaled, y_test):.2%}\")"
    }
  ],

  // Stage 12: CLASSIFICAÇÃO
  [
    {
      title: "Ensembles por Bagging: Random Forest",
      body: "Modelos Ensemble combinam múltiplos estimadores para produzir predições superiores às de qualquer modelo individual. O Random Forest utiliza Bagging (Bootstrap Aggregating): treina centenas de árvores de decisão em paralelo sobre amostras aleatórias geradas com reposição. Além disso, a cada nó ele sorteia um subconjunto aleatório de features, descorrelacionando os erros das árvores individuais e reduzindo drasticamente a variância do modelo.",
      tip: "Random Forest é um dos melhores algoritmos 'out-of-the-box' para dados tabulares: ele não exige padronização de features, é robusto a outliers e oferece métricas de feature importance nativas.",
      code: "from sklearn.ensemble import RandomForestClassifier\n\nrf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)\nrf.fit(X_train, y_train)\nprint(f\"Acurácia da Floresta Aleatória no teste: {rf.score(X_test, y_test):.2%}\")"
    },
    {
      title: "Ensembles por Boosting: Gradient Boosting e XGBoost",
      body: "Diferente do Bagging que constrói árvores em paralelo, o Boosting constrói estimadores fracos de forma estritamente sequencial. Cada nova árvore de decisão é treinada para prever e corrigir os resíduos (erros residuais) deixados pela árvore anterior, minimizando a função de perda via gradiente descendente. Implementações consagradas como XGBoost, LightGBM e CatBoost dominam competições de dados tabulares devido a podas agressivas e regularização.",
      tip: "Ajuste a taxa de aprendizado ('learning_rate') em conjunto com o número de árvores ('n_estimators'): taxas menores (0.01 - 0.05) com mais árvores e parada antecipada (early stopping) evitam overfitting.",
      code: "from sklearn.ensemble import GradientBoostingClassifier\n\ngb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3)\ngb.fit(X_train, y_train)\nprint(f\"Score Gradient Boosting: {gb.score(X_test, y_test):.2%}\")"
    }
  ],

  // Stage 13: CLUSTERING
  [
    {
      title: "O Algoritmo K-Means de Agrupamento",
      body: "O K-Means é o algoritmo de agrupamento não-supervisionado mais amplamente adotado. Ele particiona 'n' observações em 'k' clusters pré-definidos minimizando a variância interna de cada grupo. O algoritmo itera em dois passos matemáticos alternados: 1) Associação: cada amostra é atribuída ao centroide mais próximo por distância euclidiana; 2) Atualização: a posição de cada centroide é recalculada como a média aritmética de todas as amostras a ele atribuídas.",
      tip: "Utilize a inicialização 'k-means++' (padrão no scikit-learn). Ela distribui os centroides iniciais de forma probabilística distante entre si, evitando que o algoritmo fique preso em mínimos locais ruins.",
      code: "from sklearn.cluster import KMeans\n\n# Agrupamento não-supervisionado com k=3 grupos\nkmeans = KMeans(n_clusters=3, init='k-means++', random_state=42)\nlabels_clusters = kmeans.fit_predict(X_scaled)\nprint(f\"Centroides calculados (shape): {kmeans.cluster_centers_.shape}\")"
    },
    {
      title: "Inércia, WCSS e o Método do Cotovelo (Elbow Method)",
      body: "A Inércia (ou WCSS - Within-Cluster Sum of Squares) quantifica a coerência interna dos clusters somando as distâncias quadráticas entre cada ponto e seu respectivo centroide. Conforme aumentamos o número k de clusters, a inércia inevitavelmente decresce. O Método do Cotovelo plota o gráfico da inércia em função de k; o valor ótimo de clusters situa-se no 'cotovelo' da curva, ponto a partir do qual ganhos adicionais em redução de erro tornam-se marginais.",
      tip: "Combine a análise do Método do Cotovelo com o cálculo do Silhouette Score para confirmar matematicamente a quantidade ótima de clusters sem depender apenas da inspeção visual da curva.",
      code: "inercias = []\nvalores_k = range(1, 8)\nfor k in valores_k:\n    km = KMeans(n_clusters=k, random_state=42).fit(X_scaled)\n    inercias.append(km.inertia_)\n# No ponto de inflexão da curva de inércias encontra-se o k ideal\nprint(\"Valores de inércia para k de 1 a 7:\", [round(i, 1) for i in inercias])"
    }
  ],

  // Stage 14: CLUSTERING
  [
    {
      title: "Clustering Baseado em Densidade: DBSCAN",
      body: "O DBSCAN (Density-Based Spatial Clustering of Applications with Noise) descobre agrupamentos conectando regiões de alta densidade espacial separadas por áreas esparsas. Ele utiliza dois hiperparâmetros: 'eps' (o raio máximo de vizinhança) e 'min_samples' (número mínimo de pontos para formar um núcleo denso). Diferente do K-Means, o DBSCAN não exige pré-definir a quantidade de clusters e identifica automaticamente ruídos e outliers (rótulo -1).",
      tip: "DBSCAN é imbatível para detectar anomalias e identificar clusters com formas geométricas complexas ou sinuosas que o K-Means é incapaz de segmentar.",
      code: "from sklearn.cluster import DBSCAN\n\ndbscan = DBSCAN(eps=0.5, min_samples=5)\nclusters_dbscan = dbscan.fit_predict(X_scaled)\nquantidade_outliers = (clusters_dbscan == -1).sum()\nprint(f\"Clusters encontrados: {set(clusters_dbscan) - {-1}} | Outliers: {quantidade_outliers}\")"
    },
    {
      title: "Agrupamento Hierárquico e Dendrogramas",
      body: "O Agrupamento Hierárquico (Hierarchical Clustering) constrói uma árvore contínua de grupos sem necessidade de pré-especificar o número de clusters. A abordagem Aglomerativa inicia com cada amostra como um cluster unitário e sucessivamente funde os pares mais próximos com base em critérios de ligação (Linkage: Ward, Complete ou Average). Essa hierarquia de fusão é visualizada através de um diagrama em árvore denominado Dendrograma.",
      tip: "Use o critério de ligação 'ward': ele minimiza o aumento da variância total dentro dos clusters a cada passo de fusão, gerando grupos muito mais homogêneos e balanceados.",
      code: "from sklearn.cluster import AgglomerativeClustering\n\nhierarquico = AgglomerativeClustering(n_clusters=3, linkage='ward')\npred_grupos = hierarquico.fit_predict(X_scaled)\nprint(f\"Contagem por cluster hierárquico: {pd.Series(pred_grupos).value_counts().to_dict()}\")"
    }
  ],

  // Stage 15: CLUSTERING
  [
    {
      title: "Redução de Dimensionalidade com PCA",
      body: "A Análise de Componentes Principais (PCA) é uma técnica de álgebra linear não-supervisionada que projeta dados de alta dimensionalidade em direções ortogonais de máxima variância chamadas de Componentes Principais. Matematicamente, o PCA calcula os autovetores e autovalores da matriz de covariância dos dados centralizados. Os primeiros autovetores capturam a maior parte da informação original, permitindo comprimir centenas de variáveis em poucas dimensões.",
      tip: "Sempre padronize os dados com StandardScaler antes de rodar o PCA. Variáveis com variância bruta gigante artificialmente dominariam o cálculo dos autovetores sem agregar informação real.",
      code: "from sklearn.decomposition import PCA\n\npca = PCA(n_components=2)\nX_projetado = pca.fit_transform(X_scaled)\nprint(f\"Variância explicada por cada componente: {pca.explained_variance_ratio_.round(3)}\")"
    },
    {
      title: "Avaliação de Agrupamento: Silhouette Score",
      body: "Avaliar modelos de clustering é desafiador pela ausência de respostas corretas (ground truth). O Coeficiente de Silhueta (Silhouette Score) quantifica a qualidade do agrupamento avaliando simultaneamente a coesão interna do cluster 'a' (distância média intra-cluster) e a separação 'b' em relação ao cluster vizinho mais próximo: s = (b - a) / max(a, b). Os valores variam de -1 a +1; quanto mais próximo de +1, melhor delimitado e separado está o cluster.",
      tip: "Scores de Silhueta acima de 0.5 indicam estrutura de agrupamento sólida e confiável. Valores próximos de zero apontam clusters sobrepostos ou indefinição de fronteiras nos dados.",
      code: "from sklearn.metrics import silhouette_score\n\nscore = silhouette_score(X_scaled, labels_clusters)\nprint(f\"Silhouette Score médio do agrupamento: {score:.3f}\")"
    }
  ],

  // Stage 16: AVALIAÇÃO DE MODELOS
  [
    {
      title: "Matriz de Confusão e Tipos de Erro",
      body: "Em tarefas de classificação, a acurácia global é enganosa quando as classes são desbalanceadas. A Matriz de Confusão cruza as predições do modelo com a realidade das amostras, decompondo os resultados em quatro quadrantes matemáticos fundamentais: Verdadeiros Positivos (TP), Verdadeiros Negativos (TN), Falsos Positivos (FP - Erro Tipo I) e Falsos Negativos (FN - Erro Tipo II). Compreender qual erro custa mais caro é essencial para calibrar o modelo.",
      tip: "Na área médica ou bancária, um Falso Negativo (deixar de diagnosticar uma doença ou liberar uma fraude) é infinitamente mais perigoso do que um Falso Positivo (pedir confirmação ao cliente).",
      code: "from sklearn.metrics import confusion_matrix\n\ncm = confusion_matrix(y_test, predicoes)\n# [TN, FP]\n# [FN, TP]\nprint(\"Matriz de Confusão:\\n\", cm)"
    },
    {
      title: "Acurácia, Precisão (Precision) e Revocação (Recall)",
      body: "Métricas especializadas medem aspectos complementares da classificação. Acurácia é a taxa geral de acertos: (TP + TN) / Total. Precisão afere a confiabilidade do alerta positivo: Precision = TP / (TP + FP) (quando o modelo diz que é positivo, qual a probabilidade de realmente ser?). Já a Revocação (Recall ou Sensibilidade) afere a cobertura do modelo: Recall = TP / (TP + FN) (de todos os positivos reais existentes, quantos o modelo conseguiu detectar?).",
      tip: "Existe um dilema inerente (trade-off) entre Precisão e Revocação: aumentar o Recall para capturar todos os casos positivos quase sempre acarreta aumentar os Falsos Positivos, derrubando a Precisão.",
      code: "from sklearn.metrics import precision_score, recall_score, accuracy_score\n\nacc = accuracy_score(y_test, predicoes)\nprec = precision_score(y_test, predicoes)\nrec = recall_score(y_test, predicoes)\nprint(f\"Acurácia: {acc:.2%} | Precisão: {prec:.2%} | Recall: {rec:.2%}\")"
    }
  ],

  // Stage 17: AVALIAÇÃO DE MODELOS
  [
    {
      title: "F1-Score e o Balanço Harmônico das Métricas",
      body: "O F1-Score sintetiza Precisão e Recall em uma única métrica através da média harmônica: F1 = 2 * (Precision * Recall) / (Precision + Recall). A média harmônica penaliza severamente valores extremos: se a Precisão for 99% mas o Recall for de apenas 2%, o F1-Score despenca para perto de 4%, revelando que o modelo é ineficiente na prática. Em problemas multiclasse, avaliam-se o Macro-F1 (média simples entre classes) e o Weighted-F1 (ponderado pelo suporte).",
      tip: "Utilize a função 'classification_report' do scikit-learn para visualizar simultaneamente Precision, Recall e F1-Score para todas as classes do seu problema em uma tabela formatada.",
      code: "from sklearn.metrics import classification_report, f1_score\n\nf1 = f1_score(y_test, predicoes)\nprint(f\"F1-Score Binário: {f1:.3f}\\n\")\nprint(classification_report(y_test, predicoes))"
    },
    {
      title: "Curva ROC e a Métrica AUC (Area Under Curve)",
      body: "A Curva ROC (Receiver Operating Characteristic) plota a Taxa de Verdadeiros Positivos (TPR/Recall) em função da Taxa de Falsos Positivos (FPR) conforme variamos o limiar de probabilidade de corte de 0 a 1. A métrica AUC (Área Sob a Curva ROC) quantifica a capacidade do modelo de ordenar probabilidades corretamente: uma AUC de 0.5 equivale a um palpite puramente aleatório, enquanto 1.0 representa uma separação perfeita de classes.",
      tip: "A métrica ROC-AUC é invariante ao limiar de decisão e às proporções das classes, sendo uma das melhores métricas globais para comparar algoritmos concorrentes de classificação binária.",
      code: "from sklearn.metrics import roc_auc_score, roc_curve\n\nauc = roc_auc_score(y_test, probabilidades[:, 1])\nfpr, tpr, thresholds = roc_curve(y_test, probabilidades[:, 1])\nprint(f\"Métrica ROC-AUC do modelo avaliado: {auc:.4f}\")"
    }
  ],

  // Stage 18: AVALIAÇÃO DE MODELOS
  [
    {
      title: "Validação Cruzada K-Fold (Cross-Validation)",
      body: "Uma única divisão estática de treino e teste pode gerar estimativas enviesadas caso a amostra de teste selecione por coincidência casos muito fáceis ou difíceis. A Validação Cruzada K-Fold divide os dados em K partições iguais. O modelo é treinado em K-1 partes e testado na partição restante, repetindo esse processo K vezes de modo que cada amostra sirva para teste exatamente uma vez. A média e o desvio padrão das K rodadas fornecem uma avaliação estatística robusta.",
      tip: "Adote K=5 ou K=10 com StratifiedKFold para tarefas de classificação; isso estabiliza a variância da estimativa e garante que cada dobra respeite as proporções das classes originais.",
      code: "from sklearn.model_selection import cross_val_score, StratifiedKFold\n\nskf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nscores = cross_val_score(clf, X, y, cv=skf, scoring='f1')\nprint(f\"F1 Médio K-Fold: {scores.mean():.3f} (+/- {scores.std():.3f})\")"
    },
    {
      title: "Busca de Hiperparâmetros: Grid Search vs Random Search",
      body: "Hiperparâmetros são configurações externas do algoritmo (como profundidade de árvores ou regularização C) que não são aprendidas pelo gradiente e precisam ser ajustadas pelo desenvolvedor. O Grid Search avalia exaustivamente todas as combinações de uma grade pré-definida, tornando-se lento em espaços amplos. O Random Search sorteia combinações aleatórias a partir de distribuições estatísticas, encontrando parâmetros excelentes com fração do custo computacional.",
      tip: "Inicie experimentos usando RandomizedSearchCV com muitas iterações para mapear as regiões promissoras de hiperparâmetros; em seguida, use GridSearchCV apenas na região refinada.",
      code: "from sklearn.model_selection import RandomizedSearchCV\nfrom scipy.stats import randint\n\nparam_dist = {'n_estimators': randint(50, 200), 'max_depth': randint(3, 10)}\nsearch = RandomizedSearchCV(rf, param_distributions=param_dist, n_iter=10, cv=3, random_state=42)\nsearch.fit(X_train, y_train)\nprint(\"Melhores hiperparâmetros:\", search.best_params_)"
    }
  ],

  // Stage 19: REDES NEURAIS
  [
    {
      title: "O Neurônio Artificial (Perceptron de Rosenblatt)",
      body: "O Perceptron é a unidade computacional básica das redes neurais. Ele calcula a soma ponderada de seus sinais de entrada multiplicados por seus respectivos pesos sinápticos e adiciona um termo independente de viés (bias): z = ∑(wᵢxᵢ) + b = wᵀx + b. O valor escalar z passa por uma função de ativação que define a saída final. Historicamente, o Perceptron simples de uma camada resolvia apenas problemas linearmente separáveis, falhando na porta lógica XOR.",
      tip: "O termo de viés (bias) atua como o intercepto da regressão: ele desloca a curva de ativação para a esquerda ou direita, permitindo ao neurônio ativar mesmo quando todas as entradas forem zero.",
      code: "import numpy as np\n# Operação matemática interna do neurônio artificial\nentradas = np.array([0.5, 0.8])\npesos = np.array([1.2, -0.7])\nbias = 0.1\n\nz = np.dot(entradas, pesos) + bias # z = 0.5*1.2 + 0.8*(-0.7) + 0.1 = 0.14\nsaida = 1 if z >= 0 else 0         # Função degrau simples\nprint(f\"Combinação linear z: {z:.2f} | Saída do neurônio: {saida}\")"
    },
    {
      title: "Perceptron Multicamadas (MLP) e Aproximação Universal",
      body: "O Perceptron Multicamadas (MLP) supera as limitações de separabilidade linear encadeando neurônios em camadas sucessivas: Camada de Entrada, uma ou mais Camadas Ocultas e Camada de Saída. O célebre Teorema da Aproximação Universal prova que uma rede neural feedforward com uma única camada oculta e neurônios com ativações não-lineares é capaz de aproximar qualquer função contínua em espaços compactos com precisão arbitrária.",
      tip: "Mais camadas (arquiteturas profundas) aprendem representações hierárquicas de dados complexos com exponencialmente menos parâmetros do que uma única camada oculta excessivamente larga.",
      code: "from sklearn.neural_network import MLPClassifier\n\n# MLP com duas camadas ocultas de 64 e 32 neurônios com ativação ReLU\nmlp = MLPClassifier(hidden_layer_sizes=(64, 32), activation='relu', max_iter=200)\nmlp.fit(X_train_scaled, y_train)\nprint(f\"Acurácia da rede neural MLP: {mlp.score(X_test_scaled, y_test):.2%}\")"
    }
  ],

  // Stage 20: REDES NEURAIS
  [
    {
      title: "Funções de Ativação Não-Lineares: ReLU, Sigmoid e Softmax",
      body: "Sem funções de ativação não-lineares entre as camadas, qualquer rede neural profunda, independentemente de quantas camadas possua, colapsa matematicamente em uma simples regressão linear f(x) = Wx. A ReLU (Rectified Linear Unit: f(z) = max(0, z)) tornou-se o padrão em camadas ocultas por computar rápido e mitigar o sumiço do gradiente. A função Softmax é aplicada na camada final de problemas multiclasse para transformar logits em probabilidades somando 1.0.",
      tip: "Evite utilizar funções Sigmoid ou Tanh nas camadas ocultas de redes profundas, pois suas derivadas saturam nas extremidades e causam o temido desaparecimento do gradiente.",
      code: "import numpy as np\n# Funções de ativação essenciais implementadas em NumPy\ndef relu(z): return np.maximum(0, z)\ndef softmax(z):\n    exp_z = np.exp(z - np.max(z)) # Subtrai max para estabilidade numérica\n    return exp_z / exp_z.sum()\n\nlogits = np.array([2.0, 1.0, 0.1])\nprint(\"Probabilidades após Softmax:\", softmax(logits).round(3))"
    },
    {
      title: "Funções de Custo: MSE vs Cross-Entropy Loss",
      body: "A função de perda (Loss Function) mensura o erro entre as predições da rede neural e os valores reais das amostras. Para tarefas de regressão contínua, adota-se o Erro Quadrático Médio (MSE). Para classificação, utiliza-se a Entropia Cruzada (Cross-Entropy / Negative Log-Likelihood: L = -∑yᵢ log(ŷᵢ)). Derivada da teoria da informação e da máxima verossimilhança, a Cross-Entropy penaliza predições errôneas feitas com alta confiança com gradientes íngremes.",
      tip: "Se a sua loss estagnar ou subir durante o treino, verifique se a função de perda escolhida corresponde exatamente à ativação da camada de saída (ex: Softmax com Categorical Cross-Entropy).",
      code: "import numpy as np\n# Cálculo da Binary Cross-Entropy Loss para uma amostra\ny_verdadeiro = 1.0\ny_pred_prob = 0.85 # Modelo previu 85% de chance de ser classe 1\n\nloss = -(y_verdadeiro * np.log(y_pred_prob) + (1 - y_verdadeiro) * np.log(1 - y_pred_prob))\nprint(f\"Custo (Loss) da predição: {loss:.4f}\")"
    }
  ],

  // Stage 21: REDES NEURAIS
  [
    {
      title: "O Algoritmo de Backpropagation e a Regra da Cadeia",
      body: "O Backpropagation é o algoritmo que viabilizou o treinamento prático de redes neurais profundas. Utilizando a Regra da Cadeia do cálculo diferencial, ele propaga o erro cometido na camada de saída de volta por todas as camadas ocultas, calculando analiticamente a derivada parcial da função de custo em relação a cada peso sináptico individual: ∂L/∂w. Esses gradientes indicam exatamente em qual direção os pesos devem ser ajustados para diminuir o erro.",
      tip: "O cálculo do gradiente em frameworks modernos (PyTorch/TensorFlow) ocorre de forma automática via Diferenciação Automática (Autograd), dispensando a dedução manual de matrizes jacobianas.",
      code: "# Conceito da Regra da Cadeia no Backpropagation: dL/dw = (dL/dy_pred) * (dy_pred/dz) * (dz/dw)\ndef gradiente_peso(x, z, y_pred, y_real):\n    dL_dy = 2 * (y_pred - y_real) # Derivada do erro quadrático\n    dy_dz = 1.0                    # Derivada da função linear\n    dz_dw = x                      # Derivada da entrada ponderada\n    return dL_dy * dy_dz * dz_dw\n\nprint(\"Gradiente calculado para o peso:\", gradiente_peso(2.0, 1.0, 4.0, 5.0))"
    },
    {
      title: "Épocas, Tamanho do Batch e Otimizadores (Adam e SGD)",
      body: "O ciclo de treinamento opera em Épocas (passadas completas pelo conjunto de dados). O Batch Size dita quantas amostras são processadas antes de atualizar os pesos: lotes pequenos introduzem ruído benéfico que escapa de mínimos locais rasos, enquanto lotes médios (32 a 128) aproveitam paralelismo em GPUs. Otimizadores como o Adam (Adaptive Moment Estimation) aceleram a convergência adaptando a taxa de aprendizado para cada parâmetro individualmente.",
      tip: "O otimizador Adam com learning rate inicial de 0.001 é o padrão da indústria para iniciar experimentos em Deep Learning, oferecendo convergência rápida e estável na maioria das redes.",
      code: "# Configuração típica de treinamento de rede neural\nconfiguracao_treino = {\n    'epocas': 50,\n    'batch_size': 32,\n    'otimizador': 'adam',\n    'learning_rate': 0.001,\n    'loss': 'categorical_crossentropy'\n}\nprint(\"Hiperparâmetros do treinamento configurados:\", configuracao_treino)"
    }
  ],

  // Stage 22: DEEP LEARNING
  [
    {
      title: "Fundamentos de Deep Learning e Representações Hierárquicas",
      body: "Deep Learning refere-se ao treinamento de redes neurais profundas compostas por dezenas ou centenas de camadas. Ao contrário do aprendizado clássico que dependia de especialistas desenharem manualmente atributos matemáticos (Handcrafted Features), redes profundas realizam Representação de Recursos Automática: camadas superficiais detectam bordas e texturas simples, enquanto camadas profundas combinam esses traços em conceitos abstratos complexos.",
      tip: "Deep Learning só se justifica com volumes massivos de dados e poder computacional (GPUs). Para pequenos conjuntos tabulares (menos de 50 mil linhas), Random Forest e XGBoost superam redes neurais.",
      code: "# Arquitetura conceitual de rede profunda: progressão de representação\n# Camada 1: Detecção de bordas e gradientes de luminosidade\n# Camada 2: Detecção de formas geométricas e cantos\n# Camada 3: Detecção de partes de objetos (olhos, rodas, textos)\n# Camada 4: Identificação do objeto semântico completo (carro, pedestre)"
    },
    {
      title: "Redes Neurais Convolucionais (CNNs) e Filtros Espaciais",
      body: "Redes densas tradicionais falham no processamento de imagens devido à explosão combinatória de parâmetros e à perda de relações espaciais 2D. As Redes Neurais Convolucionais (CNNs) resolvem esse problema aplicando Convoluções 2D com pequenos filtros ou kernels deslizantes (ex: matrizes 3x3). Esses filtros compartilham pesos ao longo de toda a imagem, preservando a invariância a translações e extraindo mapas de características locais eficientes.",
      tip: "Usar filtros pequenos como 3x3 empilhados em múltiplas camadas convolucionais produz um campo receptivo equivalente a filtros grandes (como 7x7), porém com muito menos parâmetros e mais não-linearidades.",
      code: "import numpy as np\n# Simulação simplificada de uma convolução 2D sobre uma matriz de pixels\nimagem_3x3 = np.array([[10, 20, 10], [20, 80, 20], [10, 20, 10]])\nfiltro_2x2 = np.array([[1, 0], [0, -1]])\n\n# Produto escalar da sub-região superior esquerda com o filtro\nresultado_convolucao = np.sum(imagem_3x3[0:2, 0:2] * filtro_2x2)\nprint(f\"Ativação calculada pelo filtro convolucional: {resultado_convolucao}\")"
    }
  ],

  // Stage 23: DEEP LEARNING
  [
    {
      title: "Operações de Pooling e Flattening em CNNs",
      body: "Após a extração de features pelas camadas de convolução e ativação ReLU, aplicam-se camadas de Pooling (como Max Pooling 2x2). O pooling reduz a dimensionalidade espacial (altura e largura) dos mapas de características selecionando o valor máximo de cada janela, o que confere invariância a pequenas rotações e reduz o custo computacional. A camada de Flattening achata o tensor 3D resultante em um vetor 1D que alimenta as camadas densas finais.",
      tip: "Max Pooling com janela 2x2 e stride 2 reduz pela metade a altura e a largura do mapa de features, diminuindo a quantidade de dados espaciais em 75% e prevenindo overfitting.",
      code: "import numpy as np\n# Exemplo de operação Max Pooling 2x2 em um bloco\nmapa_ativacao = np.array([[1.2, 3.4], [0.8, 2.1]])\nvalor_maximo_pooled = np.max(mapa_ativacao)\nprint(f\"Resultado do Max Pooling 2x2: {valor_maximo_pooled}\")"
    },
    {
      title: "Redes Neurais Recorrentes (RNNs, LSTMs e GRUs)",
      body: "Redes neurais padrão tratam cada dado de forma independente, sendo inadequadas para dados sequenciais onde a ordem temporal importa (como séries financeiras, áudios e textos). As Redes Neurais Recorrentes (RNNs) possuem conexões com loops internos que mantêm um estado oculto (memória). Arquiteturas avançadas como LSTM (Long Short-Term Memory) utilizam portas lógicas internas para resolver o desaparecimento do gradiente em sequências longas.",
      tip: "Utilize GRU (Gated Recurrent Unit) como uma alternativa moderna ao LSTM: a GRU possui menos portas e parâmetros internos, treinando de forma mais rápida com desempenhos semelhantes.",
      code: "# Estrutura vetorial de uma célula recorrente simples (RNN)\n# h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b_h)\nimport numpy as np\nx_t = np.array([1.0, 0.5])   # Entrada no instante t\nh_anterior = np.array([0.0]) # Memória do instante anterior\nprint(\"Processamento sequencial passo a passo através do tempo\")"
    }
  ],

  // Stage 24: DEEP LEARNING
  [
    {
      title: "Transfer Learning e Modelos Pré-treinados",
      body: "Treinar redes neurais profundas a partir do zero exige semanas de computação em supercomputadores e milhões de imagens anotadas. O Transfer Learning aproveita pesos sinápticos já treinados em bases astronômicas (como ImageNet ou modelos de linguagem fundacionais). A base convolucional congelada é reaproveitada como um extrator universal de recursos, e apenas a camada final de classificação é substituída e ajustada para a tarefa específica.",
      tip: "Ao aplicar Transfer Learning, congele as camadas iniciais do modelo pré-treinado e use uma taxa de aprendizado minúscula (ex: 1e-5) no Fine-Tuning para não destruir os pesos pré-aprendidos.",
      code: "# Conceito de Transfer Learning com modelo pré-treinado\n# 1. Carregar backbone (ex: ResNet50 pré-treinada no ImageNet)\n# 2. Congelar pesos: layer.trainable = False\n# 3. Adicionar camada de classificação customizada para suas classes\n# 4. Treinar apenas o classificador final em poucas épocas"
    },
    {
      title: "Comparativo de Frameworks: PyTorch vs TensorFlow/Keras",
      body: "PyTorch e TensorFlow são os pilares da moderna revolução de inteligência artificial. O PyTorch, desenvolvido pela Meta, conquistou o ecossistema acadêmico e de pesquisa graças ao seu modelo de grafo computacional dinâmico (Eager Execution), código pythônico intuitivo e facilidade para depuração de tensores com print e debuggers padrão. O TensorFlow/Keras, do Google, oferece excelentes ecossistemas de compilação estática e deploy de ponta a ponta.",
      tip: "Para prototipagem rápida, projetos de pesquisa e modelos de ponta baseados em Transformers (Hugging Face), utilize PyTorch como seu ecossistema de desenvolvimento padrão.",
      code: "# Sintaxe limpa em PyTorch com autograd nativo\n# import torch\n# x = torch.tensor([2.0], requires_grad=True)\n# y = x ** 3\n# y.backward() # Computa automaticamente dy/dx = 3*(x^2) = 12.0\n# print(f\"Gradiente computado via autograd: {x.grad.item()}\")"
    }
  ],

  // Stage 25: ML NA PRÁTICA
  [
    {
      title: "Pandas para Análise Exploratória de Dados (EDA)",
      body: "A Análise Exploratória de Dados (EDA) é o processo investigativo inicial que revela distribuições de variáveis, correlações estatísticas, anomalias e padrões antes de qualquer etapa de modelagem. A biblioteca Pandas fornece estruturas de alto desempenho como DataFrames e Series. Funções essenciais como 'info()', 'describe()', 'value_counts()' e matrizes de correlação com 'corr()' permitem diagnosticar a higienização dos dados.",
      tip: "Verifique sempre a matriz de correlação com 'df.corr(numeric_only=True)' para identificar previamente se existem atributos com correlação linear direta com a variável alvo a ser prevista.",
      code: "import pandas as pd\n\ndados = {'idade': [25, 45, 30, 50], 'salario': [3000, 8000, 4000, 9500]}\ndf_eda = pd.DataFrame(dados)\nprint(\"Correlação entre variáveis numéricas:\\n\", df_eda.corr())"
    },
    {
      title: "NumPy e Álgebra Linear Vetorizada",
      body: "A biblioteca NumPy é a base computacional de todo o ecossistema científico e de Machine Learning em Python. Seus arrays multidimensionais ('ndarray') armazenam dados em blocos contíguos de memória em baixo nível na linguagem C, viabilizando operações vetorizadas que aproveitam instruções SIMD do processador. Essas operações eliminam os laços de repetição lentos do Python tradicional, executando produtos de matrizes até centenas de vezes mais rápido.",
      tip: "Evite utilizar laços 'for' em Python para iterar sobre linhas de dados numéricos. Prefira operações vetorizadas nativas do NumPy como np.dot, np.sum e broadcasting de dimensões.",
      code: "import numpy as np\n# Operação vetorizada sem loop for\nvetor_a = np.array([1.0, 2.0, 3.0])\nvetor_b = np.array([4.0, 5.0, 6.0])\nproduto_escalar = np.dot(vetor_a, vetor_b) # 1*4 + 2*5 + 3*6 = 32\nprint(f\"Produto escalar vetorizado: {produto_escalar}\")"
    }
  ],

  // Stage 26: ML NA PRÁTICA
  [
    {
      title: "Visualização Gráfica com Matplotlib e Seaborn",
      body: "A visualização de dados revela aspectos estatísticos que médias e resumos tabulares mascaram (como no clássico Quarteto de Anscombe). O Matplotlib oferece controle de baixo nível sobre eixos, figuras e linhas. O Seaborn constrói sobre o Matplotlib uma camada estatística avançada, facilitando a plotagem de distribuições com KDE, diagramas de caixa (Boxplots para identificar outliers) e mapas de calor (Heatmaps) de correlação.",
      tip: "Gere sempre um Heatmap com a matriz de correlação das features utilizando 'sns.heatmap(df.corr(), annot=True, cmap=\"coolwarm\")' para apresentar visualmente os dados à equipe.",
      code: "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\n\n# Configuração de gráfico de dispersão com linha de tendência\ndata = pd.DataFrame({'x': [1, 2, 3, 4], 'y': [2.2, 3.9, 6.1, 7.8]})\nsns.regplot(data=data, x='x', y='y')\nplt.title(\"Dispersão com Linha de Ajuste Linear\")\n# plt.show()"
    },
    {
      title: "Construindo Scikit-Learn Pipelines Completos",
      body: "Vazamento de dados (Data Leakage) ocorre frequentemente quando engenheiros aplicam transformadores (como StandardScaler ou imputadores) sobre toda a base antes da divisão em treino e teste. O 'Pipeline' do Scikit-Learn encapsula todas as etapas de pré-processamento e o estimador final em um único fluxo unificado, garantindo que o método 'fit' execute estritamente nos dados de treino durante validações cruzadas.",
      tip: "Empacote sempre pré-processamento e algoritmo em um Pipeline do scikit-learn; isso impede vazamentos de dados e viabiliza a exportação de um artefato limpo para servir em produção.",
      code: "from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\n# Pipeline blindado contra Data Leakage\npipeline = Pipeline([\n    ('scaler', StandardScaler()),\n    ('modelo', LogisticRegression())\n])\npipeline.fit(X_train, y_train)\nprint(f\"Acurácia via pipeline: {pipeline.score(X_test, y_test):.2%}\")"
    }
  ],

  // Stage 27: ML NA PRÁTICA
  [
    {
      title: "Exportando Modelos Treinados com Joblib e Pickle",
      body: "Após o treinamento e validação do melhor modelo, é necessário salvá-lo em disco para que ele possa ser carregado e execute inferências em servidores de produção sem precisar ser treinado novamente. A biblioteca 'joblib' é a escolha ideal para serializar estimadores do scikit-learn que contêm grandes matrizes NumPy em arquivos binários compactos (.joblib), superando o 'pickle' padrão em velocidade e uso de memória.",
      tip: "Sempre versione o arquivo do modelo serializado juntamente com o arquivo contendo a lista e ordem exatas dos nomes das colunas de entrada (features) utilizadas no treinamento.",
      code: "import joblib\n\n# Serializando o pipeline treinado para arquivo binário\njoblib.dump(pipeline, 'modelo_final_v1.joblib')\n\n# Carregando o modelo salvo em ambiente de produção\nmodelo_carregado = joblib.load('modelo_final_v1.joblib')\nprint(\"Modelo carregado e pronto para inferência!\")"
    },
    {
      title: "Servindo Modelos de ML em Produção via APIs REST",
      body: "Colocar Machine Learning em produção envolve expor o modelo serializado através de uma API web de baixa latência. Frameworks assíncronos modernos em Python como FastAPI e Flask recebem requisições HTTP POST com payloads JSON contendo as variáveis do cliente, validam os dados via esquemas Pydantic, executam o método 'predict()' do pipeline e retornam as estimativas em tempo real.",
      tip: "Utilize FastAPI em vez de Flask para servir modelos: a tipagem assíncrona do FastAPI e validação automática com Pydantic garantem alta vazão e documentação Swagger automática.",
      code: "# Exemplo conceitual de endpoint de inferência com FastAPI\n# from fastapi import FastAPI\n# app = FastAPI()\n# @app.post(\"/prever\")\n# def prever(features: list):\n#     pred = modelo_carregado.predict([features])\n#     return {\"predicao\": int(pred[0])}"
    }
  ],

  // Stage 28: PROJETO FINAL
  [
    {
      title: "Definição do Problema de Negócio e Formulação em ML",
      body: "O erro mais comum em projetos de inteligência artificial é aplicar algoritmos sofisticados para responder à pergunta errada. Um projeto bem-sucedido inicia traduzindo dores de negócio vagas (como 'reduzir a perda de clientes') em tarefas matemáticas formais de Machine Learning (como uma classificação binária supervisionada que estima a probabilidade de churn nos próximos 30 dias), estabelecendo métricas alinhadas ao retorno financeiro.",
      tip: "Nunca inicie codificando modelos. Converse com especialistas da área de negócio para entender o custo real de cada tipo de erro (Falso Positivo vs Falso Negativo) antes de definir sua métrica alvo.",
      code: "# Alinhando métrica técnica ao impacto de negócio financeiro\ncusto_falso_positivo = 50.0   # Custo de ligar para um cliente satisfeito\ncusto_falso_negativo = 1200.0 # Custo de perder um cliente que cancelou\necho = f\"Impacto ponderado de erros definido para guiar a função de custo.\""
    },
    {
      title: "Pipelines de Extração, Transformação e Carga (ETL)",
      body: "Modelos em produção dependem de fluxos constantes de dados confiáveis e higienizados. Pipelines de ETL (Extract, Transform, Load) conectam-se a bancos relacionais, filas de eventos Kafka e data lakes para extrair dados brutos, aplicar transformações determinísticas e carregar os dados tratados em Feature Stores estruturadas. Orquestradores de tarefas como o Apache Airflow gerenciam dependências em grafos acíclicos dirigidos (DAGs).",
      tip: "Utilize Feature Stores (como Feast) para centralizar a definição e cálculo de variáveis analíticas, garantindo que o cálculo de features seja rigorosamente idêntico no treino e na inferência.",
      code: "# DAG conceitual de pipeline de dados com Airflow / Prefect\n# extrair_dados_postgres >> sanitizar_campos_nulos >> calcular_features >> carregar_feature_store"
    }
  ],

  // Stage 29: PROJETO FINAL
  [
    {
      title: "Princípios de MLOps e Versionamento Triplo",
      body: "Diferente do desenvolvimento de software tradicional onde apenas o código-fonte é versionado no Git, sistemas de Machine Learning exigem o Versionamento Triplo: Código (Git), Dados (DVC) e Modelos/Métricas (MLflow ou Weights & Biases). MLOps é a união de DevOps com Machine Learning que automatiza testes, governança, rastreabilidade de experimentos e empacotamento de modelos em pipelines reproduzíveis.",
      tip: "Adote o MLflow para registrar hiperparâmetros, curvas de loss e artefatos de cada treino; isso garante reprodutibilidade total e permite comparar experimentos facilmente.",
      code: "# Rastreamento de experimento com MLflow\n# import mlflow\n# with mlflow.start_run():\n#     mlflow.log_param(\"max_depth\", 5)\n#     mlflow.log_metric(\"f1_score\", 0.88)\n#     mlflow.sklearn.log_model(rf, \"modelo_rf\")"
    },
    {
      title: "Monitoramento Contínuo: Data Drift e Concept Drift",
      body: "Após o deploy, o desempenho de modelos tende a degradar com o tempo devido a mudanças dinâmicas no mundo real. O Data Drift (Covariate Shift) ocorre quando a distribuição estatística das entradas P(X) muda (ex: o perfil demográfico dos usuários alterou-se). O Concept Drift ocorre quando a relação matemática entre as entradas e a saída P(y|X) muda (ex: comportamento de consumo alterado após uma crise econômica).",
      tip: "Monitore a distribuição das predições em produção com testes de hipóteses estatísticas (como Kolmogorov-Smirnov) para disparar retreinamentos automáticos antes que o modelo colapse.",
      code: "# Detecção conceitual de Data Drift\n# from scipy.stats import ks_2samp\n# stat, p_valor = ks_2samp(distribuicao_treino, distribuicao_producao)\n# if p_valor < 0.05: print(\"Alerta crítico: Data Drift detectado nas features!\")"
    }
  ],

  // Stage 30: PROJETO FINAL
  [
    {
      title: "O Ciclo de Vida Completo do Modelo (Metodologia CRISP-DM)",
      body: "A metodologia CRISP-DM (Cross-Industry Standard Process for Data Mining) estrutura o ciclo de vida analítico em seis fases iterativas interconectadas: 1) Compreensão do Negócio; 2) Compreensão dos Dados; 3) Preparação dos Dados; 4) Modelagem Matemática; 5) Avaliação Crítica de Resultados; e 6) Implantação e Monitoramento. O ciclo não é linear: descobertas na avaliação frequentemente retroalimentam hipóteses na preparação dos dados.",
      tip: "Encare projetos de Machine Learning como processos científicos iterativos, e não como desenvolvimento em cascata; falhas rápidas de hipóteses poupam meses de esforço desnecessário.",
      code: "# Fases iterativas do CRISP-DM:\n# [Negócio] <--> [Dados] --> [Preparação] --> [Modelagem] --> [Avaliação] --> [Deploy]\n#                               ^---------------------------------|"
    },
    {
      title: "Ética em IA, Viés Algorítmico (Bias) e Explicabilidade",
      body: "Modelos treinados em dados históricos tendem a reproduzir e amplificar preconceitos e discriminações sistêmicas em decisões críticas (crédito, contratações, segurança pública). Práticas de IA Responsável exigem auditorias de paridade demográfica e o uso de técnicas de Inteligência Artificial Explicável (XAI), como valores SHAP (Shapley Additive exPlanations) e LIME, que traduzem e justificam as decisões matemáticas do modelo para humanos.",
      tip: "Para setores regulados, utilize bibliotecas como SHAP para auditar e explicar individualmente o motivo de cada recusa de crédito aos clientes e aos órgãos reguladores.",
      code: "# Explicabilidade com SHAP em modelos de árvore\n# import shap\n# explainer = shap.TreeExplainer(rf)\n# shap_values = explainer.shap_values(X_test)\n# shap.summary_plot(shap_values, X_test)"
    }
  ]
];

console.log('Total stages in mlLessons:', mlLessons.length);
let invalidCount = 0;
mlLessons.forEach((stageLessons, idx) => {
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
  console.log('ALL 30 STAGES (60 LESSONS) FOR ML ARE VALID! Character counts strictly in range 350-600.');
} else {
  console.log(`Found ${invalidCount} validation issues.`);
}
