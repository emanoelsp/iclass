import { Question } from '@/types'

export const questoesProva2: Question[] = [

  // ─── TEMA 1: Data Warehouse × Data Lake ───────────────────────────────────
  {
    id: 'p2_t1_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Relacione cada característica à tecnologia correta: Data Warehouse ou Data Lake.',
    columnALabel: 'Característica',
    columnBLabel: 'Tecnologia',
    columnA: [
      { id: 'a1', text: 'Dados estruturados, schema definido antes da escrita (schema-on-write)' },
      { id: 'a2', text: 'Armazena dados brutos em formato nativo (JSON, CSV, Parquet, vídeos)' },
      { id: 'a3', text: 'Otimizado para consultas analíticas OLAP com alta performance' },
      { id: 'a4', text: 'Baixo custo de armazenamento, ideal para dados de IoT e logs' },
    ],
    columnB: [
      { id: 'b1', text: 'Data Warehouse' },
      { id: 'b2', text: 'Data Lake' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t1_q2',
    type: 'fill-blank',
    pontos: 2,
    enunciado:
      'Complete o cenário escolhendo a tecnologia adequada e justificando. Uma empresa de e-commerce precisa armazenar cliques de usuários, logs de servidor, imagens de produtos e dados de vendas — todos sem transformação prévia — para análise futura com diferentes ferramentas.',
    template: `A solução mais indicada é um {{blank_1}}, pois ele suporta dados em formato {{blank_2}} e aplica o conceito de schema-on-{{blank_3}}, permitindo que a estrutura seja definida somente no momento da consulta.`,
    blanks: [
      { id: 'blank_1', answer: 'Data Lake', caseSensitive: false },
      { id: 'blank_2', answer: 'bruto', caseSensitive: false },
      { id: 'blank_3', answer: 'read', caseSensitive: false },
    ],
  },

  // ─── TEMA 2: Séries Temporais × In-Memory ────────────────────────────────
  {
    id: 'p2_t2_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Associe o caso de uso ao tipo de banco de dados mais adequado.',
    columnALabel: 'Caso de Uso',
    columnBLabel: 'Tipo de BD',
    columnA: [
      { id: 'a1', text: 'Armazenar leituras de temperatura de sensores a cada segundo' },
      { id: 'a2', text: 'Cache de sessões de usuário para latência < 1ms' },
      { id: 'a3', text: 'Monitoramento de métricas de CPU ao longo do tempo' },
      { id: 'a4', text: 'Filas de processamento de alta velocidade em RAM' },
    ],
    columnB: [
      { id: 'b1', text: 'BD de Séries Temporais (ex: InfluxDB, TimescaleDB)' },
      { id: 'b2', text: 'In-Memory Database (ex: Redis, Memcached)' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t2_q2',
    type: 'scenario-trace',
    pontos: 2,
    enunciado:
      'Analise a query InfluxDB abaixo e responda as perguntas sobre o comportamento esperado.',
    language: 'sql',
    contexto: `-- InfluxDB Query (Flux)
from(bucket: "sensores")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "temperatura")
  |> filter(fn: (r) => r["_field"] == "celsius")
  |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
  |> yield(name: "media_5min")`,
    subQuestions: [
      { id: 'sq1', label: 'Qual o período de tempo consultado?', answer: 'última 1 hora', tipo: 'text' },
      { id: 'sq2', label: 'De quanto em quanto tempo os dados são agregados?', answer: '5 minutos', tipo: 'text' },
      { id: 'sq3', label: 'Qual função matemática é aplicada em cada janela de tempo?', answer: 'mean', tipo: 'text' },
    ],
  },

  // ─── TEMA 3: NewSQL × Banco Federado ─────────────────────────────────────
  {
    id: 'p2_t3_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Relacione as afirmações ao tipo de banco de dados correto.',
    columnALabel: 'Afirmação',
    columnBLabel: 'Tipo de BD',
    columnA: [
      { id: 'a1', text: 'Combina escalabilidade horizontal do NoSQL com garantias ACID do SQL' },
      { id: 'a2', text: 'Fornece visão unificada de múltiplos bancos heterogêneos (MySQL + MongoDB + Oracle)' },
      { id: 'a3', text: 'Exemplos: CockroachDB, Google Spanner, TiDB' },
      { id: 'a4', text: 'Consultas distribuídas entre fontes de dados independentes com um único endpoint' },
    ],
    columnB: [
      { id: 'b1', text: 'NewSQL' },
      { id: 'b2', text: 'Banco de Dados Federado' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t3_q2',
    type: 'fill-blank',
    pontos: 2,
    enunciado:
      'Complete as lacunas explicando por que uma fintech escolheria NewSQL em vez de NoSQL puro.',
    template: `Um banco NewSQL é preferível ao NoSQL puro quando a aplicação exige {{blank_1}} distribuídas (garantia de que operações financeiras sejam atômicas), pois bancos NoSQL geralmente oferecem apenas consistência {{blank_2}}. O NewSQL mantém a {{blank_3}} do SQL tradicional e adiciona escala horizontal.`,
    blanks: [
      { id: 'blank_1', answer: 'transações ACID', caseSensitive: false },
      { id: 'blank_2', answer: 'eventual', caseSensitive: false },
      { id: 'blank_3', answer: 'linguagem SQL', caseSensitive: false },
    ],
  },

  // ─── TEMA 4: Data Fabric × DataSpaces ────────────────────────────────────
  {
    id: 'p2_t4_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Associe cada característica ao conceito correto: Data Fabric ou DataSpaces.',
    columnALabel: 'Característica',
    columnBLabel: 'Conceito',
    columnA: [
      { id: 'a1', text: 'Arquitetura unificada que usa IA para integrar e recomendar dados automaticamente' },
      { id: 'a2', text: 'Espaços colaborativos onde diferentes organizações compartilham dados com soberania' },
      { id: 'a3', text: 'Foco em governança de dados, linhagem e catálogo automático' },
      { id: 'a4', text: 'Modelo europeu para troca de dados entre empresas preservando privacidade (GAIA-X)' },
    ],
    columnB: [
      { id: 'b1', text: 'Data Fabric' },
      { id: 'b2', text: 'DataSpaces' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t4_q2',
    type: 'drag-order',
    pontos: 2,
    enunciado:
      'Ordene as camadas de uma arquitetura Data Fabric, da mais baixa (dados brutos) até a mais alta (consumo).',
    items: [
      { id: 'i1', text: 'Camada de Consumo — Dashboards, APIs, Modelos de ML' },
      { id: 'i2', text: 'Camada de Ingestão — Coleta de fontes heterogêneas (BD, APIs, arquivos)' },
      { id: 'i3', text: 'Camada de Integração e Governança — Catálogo, linhagem, IA de recomendação' },
      { id: 'i4', text: 'Camada de Armazenamento — Data Lake, Data Warehouse, operational DBs' },
    ],
    correctOrder: ['i2', 'i4', 'i3', 'i1'],
  },

  // ─── TEMA 5: Multi Modelo × Persistência Poliglota ───────────────────────
  {
    id: 'p2_t5_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Relacione cada estratégia ao seu conceito.',
    columnALabel: 'Estratégia',
    columnBLabel: 'Conceito',
    columnA: [
      { id: 'a1', text: 'Um único banco suporta documentos, grafos e chave-valor simultaneamente (ex: ArangoDB)' },
      { id: 'a2', text: 'Cada microserviço usa o banco mais adequado ao seu domínio (Redis + MongoDB + PostgreSQL)' },
      { id: 'a3', text: 'Reduz a necessidade de múltiplos sistemas mantendo um único engine' },
      { id: 'a4', text: 'Complexidade operacional aumentada mas máxima aderência ao caso de uso' },
    ],
    columnB: [
      { id: 'b1', text: 'Banco de Dados Multi Modelo' },
      { id: 'b2', text: 'Persistência Poliglota' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t5_q2',
    type: 'fill-blank',
    pontos: 2,
    enunciado:
      'Complete a descrição da arquitetura de um super app que usa persistência poliglota.',
    template: `O módulo de {{blank_1}} usa Redis para sessões (baixa latência). O módulo de {{blank_2}} usa PostgreSQL para consistência ACID. O módulo de recomendações usa {{blank_3}} para modelar relações entre usuários e produtos. Cada serviço é autônomo — isso é Persistência {{blank_4}}.`,
    blanks: [
      { id: 'blank_1', answer: 'autenticação', caseSensitive: false },
      { id: 'blank_2', answer: 'pagamentos', caseSensitive: false },
      { id: 'blank_3', answer: 'banco de dados grafo', caseSensitive: false },
      { id: 'blank_4', answer: 'Poliglota', caseSensitive: false },
    ],
  },

  // ─── TEMA 6: Banco Espacial × Edge Database ───────────────────────────────
  {
    id: 'p2_t6_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Associe cada caso de uso ao tipo de banco mais adequado.',
    columnALabel: 'Caso de Uso',
    columnBLabel: 'Tipo',
    columnA: [
      { id: 'a1', text: 'Calcular a distância entre dois pontos geográficos e encontrar lojas próximas' },
      { id: 'a2', text: 'Processar dados localmente em veículos autônomos sem depender de nuvem' },
      { id: 'a3', text: 'Armazenar polígonos de zonas de entrega e verificar se um endereço está dentro' },
      { id: 'a4', text: 'Sincronizar dados de dispositivos IoT na borda com baixíssima latência' },
    ],
    columnB: [
      { id: 'b1', text: 'Banco de Dados Espacial (ex: PostGIS, SpatiaLite)' },
      { id: 'b2', text: 'Edge Database (ex: SQLite, PouchDB, Ditto)' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t6_q2',
    type: 'scenario-trace',
    pontos: 2,
    enunciado: 'Analise a query PostGIS (banco espacial) e responda as perguntas.',
    language: 'sql',
    contexto: `-- Encontrar todas as farmácias num raio de 2km de uma localização
SELECT nome, ST_Distance(
  localizacao::geography,
  ST_MakePoint(-43.1729, -22.9068)::geography
) AS distancia_metros
FROM farmacias
WHERE ST_DWithin(
  localizacao::geography,
  ST_MakePoint(-43.1729, -22.9068)::geography,
  2000
)
ORDER BY distancia_metros;`,
    subQuestions: [
      { id: 'sq1', label: 'Qual é o raio de busca em metros?', answer: '2000', tipo: 'number' },
      { id: 'sq2', label: 'Qual função verifica se um ponto está dentro do raio?', answer: 'ST_DWithin', tipo: 'text' },
      { id: 'sq3', label: 'Qual é a longitude do ponto de referência?', answer: '-43.1729', tipo: 'number' },
    ],
  },

  // ─── TEMA 7: Chave-Valor × Orientado a Documentos ────────────────────────
  {
    id: 'p2_t7_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Relacione cada característica ao modelo de banco de dados correto.',
    columnALabel: 'Característica',
    columnBLabel: 'Modelo',
    columnA: [
      { id: 'a1', text: 'Dados estruturados em JSON/BSON com campos consultáveis individualmente' },
      { id: 'a2', text: 'Acesso ultra-rápido por chave primária, sem queries complexas' },
      { id: 'a3', text: 'Ideal para perfis de usuário com campos variáveis por documento' },
      { id: 'a4', text: 'Exemplos: Redis, DynamoDB (modo simples), Memcached' },
    ],
    columnB: [
      { id: 'b1', text: 'Banco Orientado a Documentos (ex: MongoDB, Firestore)' },
      { id: 'b2', text: 'Banco Chave-Valor (ex: Redis, DynamoDB)' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t7_q2',
    type: 'error-detection',
    pontos: 2,
    enunciado:
      'Este código tenta buscar um produto pelo nome em um banco chave-valor puro. Identifique o problema conceitual.',
    language: 'typescript',
    codeLines: [
      '// Banco: Redis (chave-valor puro)',
      'const redis = require("redis");',
      'const client = redis.createClient();',
      '',
      '// Buscar produto pelo nome (campo interno)',
      'const resultado = await client.find({ nome: "Notebook" });',
      'console.log(resultado);',
    ],
    errorLineIndex: 5,
    options: [
      { id: 'a', text: 'Redis chave-valor puro não suporta consultas por campos internos do valor — apenas GET por chave exata', correct: true },
      { id: 'b', text: 'O método correto seria client.search(), disponível em todos os planos Redis', correct: false },
      { id: 'c', text: 'Falta autenticação antes de executar find()', correct: false },
      { id: 'd', text: 'O erro é a falta de await no createClient()', correct: false },
    ],
  },

  // ─── TEMA 8: Colunar × Vector Database ───────────────────────────────────
  {
    id: 'p2_t8_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Relacione cada caso de uso ao banco de dados mais adequado.',
    columnALabel: 'Caso de Uso',
    columnBLabel: 'Tipo',
    columnA: [
      { id: 'a1', text: 'Busca semântica por similaridade em embeddings de IA (ex: buscar imagens parecidas)' },
      { id: 'a2', text: 'Agregações analíticas em bilhões de linhas com consultas em colunas específicas' },
      { id: 'a3', text: 'Sistema de recomendação usando vetores de características de produtos' },
      { id: 'a4', text: 'Relatórios financeiros com SUM, AVG, COUNT em datasets massivos' },
    ],
    columnB: [
      { id: 'b1', text: 'Banco Colunar (ex: ClickHouse, Amazon Redshift, Cassandra)' },
      { id: 'b2', text: 'Vector Database (ex: Pinecone, Weaviate, pgvector)' },
    ],
    correctMatches: { a1: 'b2', a2: 'b1', a3: 'b2', a4: 'b1' },
  },
  {
    id: 'p2_t8_q2',
    type: 'fill-blank',
    pontos: 2,
    enunciado:
      'Complete a explicação sobre por que bancos colunares são mais eficientes que row-based para analytics.',
    template: `Em um banco {{blank_1}}, dados da mesma coluna ficam contíguos no disco. Ao executar SELECT {{blank_2}}(salario) FROM funcionarios, o banco lê apenas a coluna "salario", ignorando as demais. Isso reduz a {{blank_3}} de disco e melhora a {{blank_4}} de dados, tornando queries analíticas até 10x mais rápidas.`,
    blanks: [
      { id: 'blank_1', answer: 'colunar', caseSensitive: false },
      { id: 'blank_2', answer: 'AVG', caseSensitive: false },
      { id: 'blank_3', answer: 'leitura', caseSensitive: false },
      { id: 'blank_4', answer: 'compressão', caseSensitive: false },
    ],
  },

  // ─── TEMA 9: Event Store × Streaming Database ────────────────────────────
  {
    id: 'p2_t9_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Associe cada conceito ao paradigma correto.',
    columnALabel: 'Conceito',
    columnBLabel: 'Paradigma',
    columnA: [
      { id: 'a1', text: 'Armazena imutavelmente todos os eventos que mudaram o estado de um domínio' },
      { id: 'a2', text: 'Processa e consulta fluxos de dados contínuos em tempo real (Kafka Streams, Flink)' },
      { id: 'a3', text: 'O estado atual pode ser recalculado reproduzindo os eventos desde o início (replay)' },
      { id: 'a4', text: 'Janelas de tempo (tumbling window, sliding window) são conceitos centrais' },
    ],
    columnB: [
      { id: 'b1', text: 'Event Store / Event Sourcing' },
      { id: 'b2', text: 'Streaming Database (ex: ksqlDB, RisingWave)' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t9_q2',
    type: 'drag-order',
    pontos: 2,
    enunciado:
      'Ordene o fluxo correto do padrão Event Sourcing quando um usuário realiza uma compra.',
    items: [
      { id: 'i1', text: 'Evento "PedidoCriado" é persistido imutavelmente no Event Store' },
      { id: 'i2', text: 'Usuário clica em "Finalizar Compra" na interface' },
      { id: 'i3', text: 'Projeções (read models) são atualizadas a partir do evento' },
      { id: 'i4', text: 'Comando "CriarPedido" é enviado ao agregado de domínio' },
      { id: 'i5', text: 'Agregado valida o comando e emite o evento de domínio' },
    ],
    correctOrder: ['i2', 'i4', 'i5', 'i1', 'i3'],
  },

  // ─── TEMA 10: Banco Grafo × Knowledge Graph ──────────────────────────────
  {
    id: 'p2_t10_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Relacione cada afirmação ao conceito correto.',
    columnALabel: 'Afirmação',
    columnBLabel: 'Conceito',
    columnA: [
      { id: 'a1', text: 'Estrutura nós + arestas + propriedades, otimizado para consultas de relacionamento (Cypher/Gremlin)' },
      { id: 'a2', text: 'Representação semântica de conhecimento com ontologias, RDF e SPARQL' },
      { id: 'a3', text: 'Exemplos: Neo4j, Amazon Neptune, JanusGraph' },
      { id: 'a4', text: 'Usado em motores de busca (Google Knowledge Graph) e assistentes virtuais' },
    ],
    columnB: [
      { id: 'b1', text: 'Banco de Dados Grafo' },
      { id: 'b2', text: 'Knowledge Graph' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t10_q2',
    type: 'scenario-trace',
    pontos: 2,
    enunciado:
      'Analise a query Cypher (Neo4j) abaixo e responda as perguntas sobre o grafo social.',
    language: 'sql',
    contexto: `// Encontrar amigos de amigos de "Ana" que ela ainda não conhece
MATCH (ana:Pessoa {nome: "Ana"})-[:AMIGO]->(amigo)-[:AMIGO]->(sugestao)
WHERE NOT (ana)-[:AMIGO]->(sugestao)
  AND sugestao <> ana
RETURN sugestao.nome AS sugestao_de_amizade, COUNT(amigo) AS amigos_em_comum
ORDER BY amigos_em_comum DESC
LIMIT 5;`,
    subQuestions: [
      { id: 'sq1', label: 'Qual é o tipo de relacionamento usado no grafo?', answer: 'AMIGO', tipo: 'text' },
      { id: 'sq2', label: 'Quantas sugestões máximas a query retorna?', answer: '5', tipo: 'number' },
      { id: 'sq3', label: 'O que a cláusula WHERE NOT garante?', answer: 'que Ana ainda não conhece a sugestão', tipo: 'text' },
    ],
  },

  // ─── TEMA 11: Blockchain Database × Ledger Database ──────────────────────
  {
    id: 'p2_t11_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Associe cada característica ao tipo de banco de dados correto.',
    columnALabel: 'Característica',
    columnBLabel: 'Tipo',
    columnA: [
      { id: 'a1', text: 'Descentralizado, imutável, com consenso distribuído entre nós independentes' },
      { id: 'a2', text: 'Centralizado, imutável, com histórico auditável gerenciado por uma autoridade confiável (ex: QLDB)' },
      { id: 'a3', text: 'Ideal para contratos inteligentes e criptomoedas' },
      { id: 'a4', text: 'Ideal para rastreabilidade de supply chain dentro de uma empresa com conformidade regulatória' },
    ],
    columnB: [
      { id: 'b1', text: 'Blockchain Database' },
      { id: 'b2', text: 'Ledger Database (ex: Amazon QLDB)' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t11_q2',
    type: 'fill-blank',
    pontos: 2,
    enunciado:
      'Complete a comparação entre Blockchain e Ledger Database no contexto de rastreabilidade fiscal.',
    template: `Um banco {{blank_1}} (como QLDB da AWS) é mais adequado para rastreabilidade fiscal corporativa pois é {{blank_2}} por uma autoridade central, tem {{blank_3}} de transações muito menor e segue regulamentações como LGPD. Já o {{blank_4}} é preferido quando a {{blank_5}} entre partes sem confiança mútua é necessária.`,
    blanks: [
      { id: 'blank_1', answer: 'Ledger', caseSensitive: false },
      { id: 'blank_2', answer: 'controlado', caseSensitive: false },
      { id: 'blank_3', answer: 'custo', caseSensitive: false },
      { id: 'blank_4', answer: 'Blockchain', caseSensitive: false },
      { id: 'blank_5', answer: 'descentralização', caseSensitive: false },
    ],
  },

  // ─── TEMA 12: HTAP × Autonomous Database ─────────────────────────────────
  {
    id: 'p2_t12_q1',
    type: 'match-columns',
    pontos: 2,
    enunciado: 'Relacione cada afirmação ao conceito correto: HTAP ou Autonomous Database.',
    columnALabel: 'Afirmação',
    columnBLabel: 'Conceito',
    columnA: [
      { id: 'a1', text: 'Combina cargas OLTP (transacionais) e OLAP (analíticas) no mesmo sistema sem ETL' },
      { id: 'a2', text: 'Usa machine learning para autotuning, autopatch e autoscaling sem DBA humano' },
      { id: 'a3', text: 'Exemplos: TiDB, SingleStore, SAP HANA' },
      { id: 'a4', text: 'Exemplos: Oracle Autonomous Database, Amazon Aurora Serverless v2' },
    ],
    columnB: [
      { id: 'b1', text: 'HTAP (Hybrid Transactional/Analytical Processing)' },
      { id: 'b2', text: 'Autonomous Database' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b1', a4: 'b2' },
  },
  {
    id: 'p2_t12_q2',
    type: 'scenario-trace',
    pontos: 2,
    enunciado:
      'Uma empresa usa TiDB (HTAP). Calcule o impacto de eliminar o pipeline ETL no cenário abaixo.',
    language: 'sql',
    contexto: `-- Arquitetura ANTES (sem HTAP):
-- OLTP: MySQL → ETL job (30 min) → Data Warehouse → relatório
-- Latência total: operação + 30min ETL + tempo de query

-- Arquitetura DEPOIS (com HTAP/TiDB):
-- TiDB processa OLTP e OLAP simultaneamente
-- Latência total: operação + tempo de query (sem ETL)

-- Query analítica executada ENQUANTO há inserções:
SELECT DATE(criado_em) AS dia, COUNT(*) AS pedidos, SUM(valor) AS receita
FROM pedidos
WHERE criado_em >= NOW() - INTERVAL 7 DAY
GROUP BY dia ORDER BY dia;`,
    subQuestions: [
      { id: 'sq1', label: 'Qual era a latência adicional causada pelo ETL na arquitetura anterior (em minutos)?', answer: '30', tipo: 'number' },
      { id: 'sq2', label: 'A query analítica pode ser executada durante inserções OLTP no HTAP? (sim/não)', answer: 'sim', tipo: 'text' },
      { id: 'sq3', label: 'Quantos dias de dados a query analítica consulta?', answer: '7', tipo: 'number' },
    ],
  },
]

export const prova2Meta = {
  id: 'prova-novos-paradigmas-nosql',
  titulo: 'Prova 2 — Novos Paradigmas de Bancos de Dados',
  descricao: 'Avaliação sobre paradigmas modernos: Data Warehouse, Data Lake, NoSQL, Grafos, Vetores, Blockchain e mais.',
  assunto: 'Banco de Dados — Paradigmas Modernos e NoSQL',
}
