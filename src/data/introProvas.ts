export interface ExemploCodigoIntro {
  codigo: string
  linguagem: 'sql' | 'typescript' | 'text'
}

export interface TopicoIntro {
  icone: string
  titulo: string
  descricao: string
  pontos: string[]
  exemplo?: ExemploCodigoIntro
}

export interface IntroProvaData {
  subtitulo: string
  dica: string
  topicos: TopicoIntro[]
}

export const introsProvas: Record<string, IntroProvaData> = {

  // ─────────────────────────────────────────────────────────────
  // PROVA 1 — DTL e Rotinas MySQL
  // ─────────────────────────────────────────────────────────────
  'prova-dtl-mysql': {
    subtitulo: 'Triggers, Stored Procedures, Functions e Views',
    dica: 'Atenção especial para quando NEW e OLD estão disponíveis em cada tipo de trigger, e a diferença fundamental entre PROCEDURE (executa ação) e FUNCTION (retorna valor).',
    topicos: [
      {
        icone: '🔔',
        titulo: 'Triggers',
        descricao: 'Executados automaticamente quando uma operação DML ocorre em uma tabela. Podem ser BEFORE ou AFTER o evento, e referenciam os valores via NEW e OLD.',
        pontos: [
          'BEFORE: executa antes da operação ser confirmada',
          'AFTER: executa depois da operação ser persistida',
          'NEW.campo → valor que está sendo inserido ou atualizado',
          'OLD.campo → valor anterior (disponível em UPDATE e DELETE)',
          'Em triggers de INSERT, OLD não existe — referenciá-lo gera erro',
          'FOR EACH ROW é obrigatório em triggers de nível de linha',
        ],
        exemplo: {
          linguagem: 'sql',
          codigo:
`DELIMITER $$
CREATE TRIGGER nome_trigger
AFTER INSERT ON tabela
FOR EACH ROW
BEGIN
  -- NEW.campo disponível; OLD.campo não existe aqui
  UPDATE outra_tabela
    SET coluna = coluna + NEW.valor
  WHERE id = NEW.referencia_id;
END$$
DELIMITER ;`,
        },
      },
      {
        icone: '🔧',
        titulo: 'Stored Procedures',
        descricao: 'Blocos de código SQL armazenados no banco e chamados com CALL. Podem receber e devolver parâmetros, mas não retornam valor diretamente como uma função.',
        pontos: [
          'Chamadas com: CALL nome_procedure(args)',
          'Parâmetro IN: valor passado para dentro da procedure',
          'Parâmetro OUT: valor devolvido pela procedure para a sessão',
          'Parâmetro INOUT: entrada e saída combinados',
          'Diferente de Function: procedures executam ações, não retornam valor',
          'Variáveis de sessão: SET @var = valor; SELECT @var;',
        ],
        exemplo: {
          linguagem: 'sql',
          codigo:
`DELIMITER $$
CREATE PROCEDURE calcula_desconto(
  IN preco DECIMAL(10,2),
  IN pct   DECIMAL(5,2),
  OUT valor_final DECIMAL(10,2)
)
BEGIN
  SET valor_final = preco - (preco * pct / 100);
END$$
DELIMITER ;

-- Chamada:
CALL calcula_desconto(250.00, 10, @resultado);
SELECT @resultado;  -- 225.00`,
        },
      },
      {
        icone: '📐',
        titulo: 'Functions',
        descricao: 'Retornam exatamente um valor e podem ser usadas diretamente em expressões SQL (SELECT, WHERE, SET). Diferem das procedures por possuir retorno explícito.',
        pontos: [
          'RETURNS declara o tipo do valor retornado',
          'RETURN dentro do corpo define o valor de saída',
          'DETERMINISTIC: mesmo input sempre gera mesmo output',
          'Usadas em SELECT, WHERE, SET e qualquer expressão SQL',
          'Não podem ter parâmetros OUT — o retorno é via RETURN',
          'Não executam DML por padrão sem declaração explícita',
        ],
        exemplo: {
          linguagem: 'sql',
          codigo:
`DELIMITER $$
CREATE FUNCTION aplica_juros(
  valor   DECIMAL(10,2),
  taxa    DECIMAL(5,2)
) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  RETURN valor + (valor * taxa / 100);
END$$
DELIMITER ;

-- Uso direto em query:
SELECT produto, aplica_juros(preco, 5.5) AS preco_com_juros
FROM produtos;`,
        },
      },
      {
        icone: '👁️',
        titulo: 'Views',
        descricao: 'Tabelas virtuais que encapsulam uma query SELECT. Não armazenam dados — executam a query toda vez que são acessadas. Simplificam queries complexas e permitem controle de acesso.',
        pontos: [
          'CREATE VIEW nome AS SELECT ... — cria a view',
          'CREATE OR REPLACE VIEW — atualiza sem precisar fazer DROP',
          'Acesso igual a uma tabela: SELECT * FROM vw_nome',
          'Não armazenam dados próprios — são aliases de queries',
          'Views simples podem suportar INSERT/UPDATE/DELETE',
          'DESCRIBE vw_nome mostra a estrutura da view',
        ],
        exemplo: {
          linguagem: 'sql',
          codigo:
`-- Criação
CREATE VIEW vw_resumo_pedidos AS
  SELECT c.nome AS cliente,
         COUNT(p.id) AS total_pedidos,
         SUM(p.valor) AS valor_total
  FROM clientes c
  JOIN pedidos p ON c.id = p.cliente_id
  GROUP BY c.id, c.nome;

-- Uso
SELECT * FROM vw_resumo_pedidos WHERE total_pedidos > 3;

-- Atualização sem DROP
CREATE OR REPLACE VIEW vw_resumo_pedidos AS
  SELECT c.nome, c.email, COUNT(p.id) AS qtd
  FROM clientes c JOIN pedidos p ON c.id = p.cliente_id
  GROUP BY c.id, c.nome, c.email;`,
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PROVA 2 — Novos Paradigmas de Bancos de Dados
  // ─────────────────────────────────────────────────────────────
  'prova-novos-paradigmas-nosql': {
    subtitulo: 'Data Warehouse, Data Lake, NoSQL, CAP, BASE vs ACID e mais',
    dica: 'Foque em quando usar cada paradigma e seus trade-offs. Para o Teorema CAP, lembre-se: é impossível garantir os três simultaneamente — você sempre sacrifica um.',
    topicos: [
      {
        icone: '🏢',
        titulo: 'Data Warehouse',
        descricao: 'Repositório centralizado para dados estruturados e históricos, otimizado para análise (OLAP). Usa modelos dimensionais como estrela e floco de neve.',
        pontos: [
          'OLAP: análise multidimensional de grandes volumes históricos',
          'Schema-on-write: estrutura definida antes de inserir dados',
          'Modelo estrela: tabela fato + tabelas dimensão',
          'Alta latência de escrita, altíssima performance de leitura analítica',
          'Exemplos: Snowflake, Google BigQuery, Amazon Redshift',
        ],
      },
      {
        icone: '🌊',
        titulo: 'Data Lake',
        descricao: 'Armazena dados brutos em qualquer formato — sem transformação prévia. Ideal para Big Data, ML e análises exploratórias.',
        pontos: [
          'Schema-on-read: estrutura interpretada no momento da leitura',
          'Aceita qualquer formato: JSON, CSV, Parquet, imagens, vídeos',
          'Custo muito baixo (armazenamento em objeto: S3, GCS, ADLS)',
          'Risco de "pântano de dados" sem governança adequada',
          'Complementa o Data Warehouse: raw → processado → analítico',
        ],
      },
      {
        icone: '📄',
        titulo: 'Bancos de Documentos',
        descricao: 'Armazenam dados como documentos JSON/BSON. Schema flexível permite que documentos na mesma coleção tenham estruturas diferentes.',
        pontos: [
          'Unidade de armazenamento: documento (objeto JSON/BSON)',
          'Coleções agrupam documentos sem schema rígido',
          'Suportam índices secundários e queries complexas',
          'Ideal para catálogos, perfis, conteúdo variado',
          'Exemplos: MongoDB, Firestore, CouchDB',
        ],
        exemplo: {
          linguagem: 'text',
          codigo:
`// Documentos na mesma coleção com estruturas diferentes
{ "id": "u1", "nome": "Ana", "plano": "pro" }
{ "id": "u2", "nome": "Bruno", "empresa": "XPTO", "cnpj": "00.000.000/0001-00" }`,
        },
      },
      {
        icone: '🔑',
        titulo: 'Bancos Key-Value',
        descricao: 'A estrutura mais simples do NoSQL: uma chave única mapeia para um valor (string, JSON, lista, etc.). Alta performance para leituras e escritas pontuais.',
        pontos: [
          'Operações: GET chave, SET chave valor, DEL chave',
          'Ideal para cache, sessões, filas, contadores',
          'Sem suporte a queries complexas — só busca por chave exata',
          'Latência sub-milissegundo (dados em memória)',
          'Exemplos: Redis, Memcached, DynamoDB (modo KV)',
        ],
      },
      {
        icone: '📊',
        titulo: 'Bancos de Colunas (Wide Column)',
        descricao: 'Organizam dados em famílias de colunas em vez de linhas. Projetados para escalabilidade horizontal massiva e denormalização intencional.',
        pontos: [
          'Linhas têm partition key (define nó de armazenamento)',
          'Cada linha pode ter colunas diferentes',
          'Denormalização proposital para evitar JOINs',
          'Write-heavy: excelente para ingestão de alto volume',
          'Exemplos: Apache Cassandra, HBase, Google Bigtable',
        ],
      },
      {
        icone: '🕸️',
        titulo: 'Bancos de Grafos',
        descricao: 'Modelam dados como nós (entidades), arestas (relacionamentos) e propriedades. Quando os relacionamentos são tão importantes quanto os dados.',
        pontos: [
          'Nós: entidades (Pessoa, Produto, Página)',
          'Arestas: relacionamentos com direção e propriedades',
          'Ideal para redes sociais, fraude, recomendações, knowledge graphs',
          'Traversal eficiente: encontrar "amigos de amigos" em profundidade',
          'Exemplos: Neo4j (Cypher), Amazon Neptune, ArangoDB',
        ],
        exemplo: {
          linguagem: 'text',
          codigo:
`// Cypher (Neo4j) — amigos em comum entre Ana e Carlos
MATCH (a:Pessoa {nome: "Ana"})-[:AMIGO]->(comum)<-[:AMIGO]-(c:Pessoa {nome: "Carlos"})
RETURN comum.nome`,
        },
      },
      {
        icone: '🔢',
        titulo: 'Bancos Vetoriais',
        descricao: 'Armazenam embeddings (vetores de alta dimensão) gerados por modelos de ML. Buscam por similaridade semântica, não igualdade exata.',
        pontos: [
          'Embedding: representação numérica de texto, imagem ou áudio',
          'Busca por similaridade: cosine similarity, distância euclidiana',
          'Casos de uso: busca semântica, RAG, recomendações por IA',
          'Indexação ANN (Approximate Nearest Neighbor) para performance',
          'Exemplos: Pinecone, Weaviate, pgvector (PostgreSQL)',
        ],
      },
      {
        icone: '⛓️',
        titulo: 'Blockchain como Banco de Dados',
        descricao: 'Estrutura de dados imutável, distribuída e descentralizada. Cada bloco referencia o anterior via hash — alterações retroativas são detectáveis.',
        pontos: [
          'Append-only: não existe UPDATE ou DELETE — só INSERT',
          'Cada bloco contém: dados + hash do bloco anterior + timestamp',
          'Consenso distribuído: múltiplos nós validam cada transação',
          'Ideal para auditoria, contratos inteligentes, rastreabilidade',
          'Trade-off: performance muito baixa em troca de imutabilidade',
        ],
      },
      {
        icone: '🔺',
        titulo: 'Teorema CAP',
        descricao: 'Afirma que um sistema distribuído não pode garantir simultaneamente Consistência, Disponibilidade e Tolerância a Partição — apenas dois dos três.',
        pontos: [
          'Consistency (C): todos os nós retornam o dado mais recente',
          'Availability (A): o sistema sempre responde (pode ser dado desatualizado)',
          'Partition Tolerance (P): funciona mesmo com falha de rede entre nós',
          'CP: sacrifica disponibilidade → HBase, Zookeeper',
          'AP: sacrifica consistência forte → Cassandra, CouchDB, DynamoDB',
          'CA: só existe sem particionamento → bancos relacionais tradicionais',
        ],
      },
      {
        icone: '💫',
        titulo: 'BASE vs ACID',
        descricao: 'ACID garante transações rígidas; BASE aceita inconsistência temporária em troca de escalabilidade e performance.',
        pontos: [
          'ACID: Atomicity, Consistency, Isolation, Durability',
          'BASE: Basically Available, Soft-state, Eventually Consistent',
          'ACID: tudo ou nada — a transação completa ou não altera nada',
          'BASE: dado pode estar temporariamente desatualizado entre réplicas',
          'Consistência eventual: em algum momento todos os nós convergem',
          'Bancos NoSQL em geral adotam BASE; NewSQL busca ACID com escala',
        ],
      },
      {
        icone: '🆕',
        titulo: 'NewSQL',
        descricao: 'Combina as garantias ACID dos bancos relacionais com a escalabilidade horizontal característica dos sistemas NoSQL.',
        pontos: [
          'Transações ACID distribuídas com escala horizontal',
          'SQL padrão — compatível com aplicações relacionais existentes',
          'Particionamento automático (sharding) transparente ao desenvolvedor',
          'Exemplos: CockroachDB, Google Spanner, TiDB, YugabyteDB',
          'Trade-off: maior latência em escritas multi-nó que KV stores',
        ],
      },
      {
        icone: '🌐',
        titulo: 'Bancos Multi-model',
        descricao: 'Um único sistema de banco de dados suporta múltiplos paradigmas de dados (documentos, grafos, chave-valor, colunar) com a mesma interface.',
        pontos: [
          'Elimina a necessidade de múltiplos bancos especializados',
          'Consultas que cruzam paradigmas com uma única query',
          'Simplifica arquitetura e operação (um cluster, não quatro)',
          'Trade-off: raramente o melhor em qualquer paradigma isolado',
          'Exemplos: ArangoDB, Azure Cosmos DB, OrientDB',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PROVA 3 — Firebase + Next.js Básico
  // ─────────────────────────────────────────────────────────────
  'prova-firebase-nextjs-basico': {
    subtitulo: 'Configuração do Firebase SDK, CRUD básico com Firestore e Auth',
    dica: 'A diferença entre addDoc (ID gerado automaticamente) e setDoc (ID controlado por você) é fundamental. No Next.js App Router, sempre que usar hooks do React ou Firebase no frontend, adicione "use client" no topo do arquivo.',
    topicos: [
      {
        icone: '⚙️',
        titulo: 'Configuração do Firebase SDK',
        descricao: 'O ponto de entrada de toda aplicação Firebase. As chaves de configuração ficam no Project Settings do Firebase Console.',
        pontos: [
          'initializeApp(config) inicializa o app — chamar apenas uma vez',
          'getApps().length === 0 evita re-inicialização em HMR do Next.js',
          'getFirestore(app) → instância do Firestore',
          'getAuth(app) → instância do Authentication',
          'Variáveis sensíveis ficam em .env.local (NEXT_PUBLIC_ para frontend)',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const db = getFirestore(app)
export const auth = getAuth(app)`,
        },
      },
      {
        icone: '📖',
        titulo: 'Leitura de Dados (Firestore)',
        descricao: 'Firestore organiza dados em coleções e documentos. Para ler, você usa getDocs (coleção) ou getDoc (documento único).',
        pontos: [
          'collection(db, "nome") → referência à coleção',
          'doc(db, "nome", "id") → referência ao documento',
          'getDocs(query) → retorna um QuerySnapshot',
          'getDoc(ref) → retorna um DocumentSnapshot',
          'snap.exists() → verifica se o documento existe',
          'snap.data() → retorna os campos do documento',
          'snap.docs.map(d => ({ id: d.id, ...d.data() })) → array tipado',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

// Buscar coleção inteira
const snap = await getDocs(collection(db, 'produtos'))
const produtos = snap.docs.map(d => ({ id: d.id, ...d.data() }))

// Buscar documento único
const ref = doc(db, 'usuarios', 'uid-do-usuario')
const docSnap = await getDoc(ref)
if (docSnap.exists()) {
  const usuario = { id: docSnap.id, ...docSnap.data() }
}`,
        },
      },
      {
        icone: '✏️',
        titulo: 'Escrita de Dados (Firestore)',
        descricao: 'Quatro operações principais: addDoc (criar com ID automático), setDoc (criar com ID específico), updateDoc (atualizar campos) e deleteDoc (excluir).',
        pontos: [
          'addDoc: gera ID aleatório → usa quando o ID não importa',
          'setDoc: você define o ID → usa para users, configs, dados com ID conhecido',
          'updateDoc: mescla com documento existente — não apaga outros campos',
          'setDoc sem merge: SUBSTITUI o documento inteiro',
          'deleteDoc: remove o documento permanentemente',
          'Timestamp.now() → timestamp no fuso do cliente',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`import { addDoc, setDoc, updateDoc, deleteDoc, collection, doc } from 'firebase/firestore'

// Criar com ID automático
const ref = await addDoc(collection(db, 'tarefas'), { titulo: 'Estudar', feita: false })
console.log(ref.id)  // ID gerado automaticamente

// Criar com ID controlado (ex: usuários pelo UID do Auth)
await setDoc(doc(db, 'usuarios', user.uid), { nome: 'Ana', role: 'aluno' })

// Atualizar campos específicos (não apaga os outros)
await updateDoc(doc(db, 'tarefas', ref.id), { feita: true })

// Excluir
await deleteDoc(doc(db, 'tarefas', ref.id))`,
        },
      },
      {
        icone: '🔐',
        titulo: 'Firebase Authentication',
        descricao: 'Gerencia login, registro e sessão de usuários. O estado de autenticação persiste automaticamente entre sessões.',
        pontos: [
          'createUserWithEmailAndPassword: cria conta e já faz login',
          'signInWithEmailAndPassword: faz login com conta existente',
          'signOut(auth): encerra a sessão',
          'onAuthStateChanged: listener que dispara a cada mudança de estado',
          'user.uid: ID único do usuário (usar como chave no Firestore)',
          'user.email, user.displayName, user.photoURL: dados do perfil',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`import { createUserWithEmailAndPassword, signInWithEmailAndPassword,
         signOut, onAuthStateChanged } from 'firebase/auth'

// Registro
const { user } = await createUserWithEmailAndPassword(auth, email, senha)

// Login
const { user } = await signInWithEmailAndPassword(auth, email, senha)

// Logout
await signOut(auth)

// Observar estado de autenticação (ideal em um Context/Provider)
const unsubscribe = onAuthStateChanged(auth, (user) => {
  if (user) { /* usuário logado */ }
  else      { /* usuário deslogado */ }
})`,
        },
      },
      {
        icone: '⚛️',
        titulo: 'Next.js App Router',
        descricao: 'O App Router do Next.js 13+ usa Server Components por padrão. Para usar hooks React e Firebase no frontend, adicione "use client" no topo do arquivo.',
        pontos: [
          '"use client" → componente executa no browser (pode usar hooks)',
          'Sem "use client" → Server Component (sem useState, useEffect, Firebase Auth)',
          'useEffect + useState: buscar dados do Firestore após montar',
          'layout.tsx: envoltório compartilhado (bom lugar para AuthProvider)',
          'page.tsx: componente raiz de cada rota',
          'Pastas com [] → rotas dinâmicas: [id]/page.tsx captura /qualquer-id',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`'use client'
import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    getDocs(collection(db, 'produtos'))
      .then(snap => setProdutos(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])

  return <ul>{produtos.map(p => <li key={p.id}>{p.nome}</li>)}</ul>
}`,
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PROVA 4 — CRUD Avançado, Auth e Security Rules
  // ─────────────────────────────────────────────────────────────
  'prova-nextjs-firestore-crud-auth': {
    subtitulo: 'Batch writes, Transactions, Google Auth, Security Rules e arquitetura',
    dica: 'No Security Rules: resource.data é o documento ATUAL (antes da escrita) e request.resource.data é o que SERÁ salvo. Use request.auth != null para checar autenticação e request.auth.uid para verificar propriedade do recurso.',
    topicos: [
      {
        icone: '🔄',
        titulo: 'CRUD Avançado',
        descricao: 'Além das operações básicas, Firestore oferece merge parcial, arrays dinâmicos e timestamps do servidor para dados mais consistentes.',
        pontos: [
          'updateDoc: atualiza campos específicos sem tocar nos outros',
          'setDoc + { merge: true }: equivalente ao updateDoc, mas cria se não existir',
          'setDoc sem merge: APAGA o documento e recria — cuidado!',
          'arrayUnion(val): adiciona ao array sem duplicatas',
          'arrayRemove(val): remove todas as ocorrências do valor',
          'serverTimestamp(): timestamp gerado pelo servidor (evita dessincronias de fuso)',
          'increment(n): incrementa campo numérico atomicamente',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`import { updateDoc, doc, arrayUnion, arrayRemove, serverTimestamp, increment } from 'firebase/firestore'

const ref = doc(db, 'turmas', turmaId)

// Adicionar aluno ao array (sem duplicatas)
await updateDoc(ref, { alunosIds: arrayUnion(alunoId) })

// Remover aluno
await updateDoc(ref, { alunosIds: arrayRemove(alunoId) })

// Timestamp do servidor + incrementar contador
await updateDoc(ref, {
  atualizadoEm: serverTimestamp(),
  totalSubmissoes: increment(1),
})`,
        },
      },
      {
        icone: '📦',
        titulo: 'Batch Writes',
        descricao: 'Executa múltiplas operações de escrita de forma atômica — todas ocorrem ou nenhuma ocorre. Não suporta leituras intermediárias.',
        pontos: [
          'writeBatch(db) cria o batch',
          'batch.set(ref, dados) → criar/substituir documento',
          'batch.update(ref, campos) → atualizar campos',
          'batch.delete(ref) → remover documento',
          'batch.commit() → envia todas as operações ao Firestore',
          'Limite: até 500 operações por batch',
          'Se uma operação falhar, nenhuma é aplicada',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`import { writeBatch, doc } from 'firebase/firestore'

const batch = writeBatch(db)

// Múltiplas operações atômicas
batch.set(doc(db, 'pedidos', 'p1'), { status: 'aprovado' })
batch.update(doc(db, 'estoque', 'prod-xyz'), { quantidade: 98 })
batch.delete(doc(db, 'carrinho', 'usuario-123'))

// Tudo ou nada
await batch.commit()`,
        },
      },
      {
        icone: '🔁',
        titulo: 'Transactions',
        descricao: 'Permitem ler e depois escrever de forma atômica. Usadas quando a nova escrita depende do valor atual do documento (ex: somar ao saldo).',
        pontos: [
          'runTransaction(db, fn) garante consistência em ambiente concorrente',
          'Dentro da transaction: t.get(ref), t.set(), t.update(), t.delete()',
          'Se outro cliente modificar o doc durante a transaction, ela é retentada',
          'Diferença do batch: transaction pode LER antes de escrever',
          'Máximo de 500 documentos lidos/escritos por transaction',
          'Ideal para saldo bancário, contador, reserva de recursos',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`import { runTransaction, doc } from 'firebase/firestore'

await runTransaction(db, async (t) => {
  const ref = doc(db, 'contas', contaId)
  const snap = await t.get(ref)          // 1. Lê o valor atual
  const saldoAtual = snap.data()?.saldo

  if (saldoAtual < valorSaque) {
    throw new Error('Saldo insuficiente') // 2. Valida
  }

  t.update(ref, { saldo: saldoAtual - valorSaque }) // 3. Escreve
})`,
        },
      },
      {
        icone: '🔑',
        titulo: 'Firebase Auth — Google OAuth',
        descricao: 'Além do email/senha, o Firebase Auth suporta provedores sociais como Google. O fluxo com popup é o mais comum em aplicações web.',
        pontos: [
          'GoogleAuthProvider() configura o provedor',
          'signInWithPopup(auth, provider) abre janela de seleção de conta',
          'signInWithRedirect: alternativa sem popup (mobile-friendly)',
          'user.providerData: lista de provedores vinculados à conta',
          'Vincular múltiplos provedores: linkWithPopup()',
          'onAuthStateChanged persiste entre páginas e abas',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

async function loginComGoogle() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  const { user } = await signInWithPopup(auth, provider)
  // user.uid, user.email, user.displayName, user.photoURL disponíveis
  return user
}`,
        },
      },
      {
        icone: '🛡️',
        titulo: 'Firestore Security Rules',
        descricao: 'Definem quem pode ler e escrever cada documento. Executam no servidor — não podem ser burladas pelo cliente.',
        pontos: [
          'request.auth → usuário autenticado (null se não logado)',
          'request.auth.uid → ID único do usuário autenticado',
          'resource.data → campos do documento EXISTENTE no banco',
          'request.resource.data → campos que SERÃO salvos (na escrita)',
          'allow read: if condition → controla GET e LIST',
          'allow write: if condition → controla CREATE, UPDATE, DELETE',
          'get(/databases/$(database)/documents/users/$(uid)) → busca outro documento nas rules',
        ],
        exemplo: {
          linguagem: 'text',
          codigo:
`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Só usuário autenticado pode ler; só o próprio dono pode escrever
    match /perfis/{uid} {
      allow read:  if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    // Posts: leitura pública; edição só pelo autor
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if resource.data.autorId == request.auth.uid;
    }
  }
}`,
        },
      },
      {
        icone: '🏗️',
        titulo: 'Arquitetura SOLID no Next.js + Firebase',
        descricao: 'Boas práticas para manter o código organizado, testável e desacoplado do Firebase SDK.',
        pontos: [
          'Serviços em src/services/firebase/ isolam chamadas ao SDK',
          'Componentes React nunca importam firebase/firestore diretamente',
          'Hooks (useAuth, useTurmas) encapsulam estado e lógica de negócio',
          'Interfaces TypeScript definem contratos entre camadas',
          'Dependency Inversion: componentes dependem de contratos, não de Firebase',
          'Testes unitários mockam os serviços, não o SDK do Firebase',
        ],
        exemplo: {
          linguagem: 'typescript',
          codigo:
`// ✅ CORRETO: serviço isola o Firebase
// src/services/firebase/turmas.ts
export async function listarTurmas(professorId: string): Promise<Turma[]> {
  const q = query(collection(db, 'turmas'), where('professorId', '==', professorId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Turma))
}

// ✅ CORRETO: componente usa apenas o serviço
import { listarTurmas } from '@/services/firebase/turmas'
const turmas = await listarTurmas(perfil.uid)

// ❌ ERRADO: Firebase SDK direto no componente
import { getDocs, collection } from 'firebase/firestore'  // no componente`,
        },
      },
    ],
  },
}
