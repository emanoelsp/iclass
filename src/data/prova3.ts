import { Question } from '@/types'

export const questoesProva3: Question[] = [

  // ── Q1: Drag Order — 5 passos setup Firebase Console ──────────────────────
  {
    id: 'p3_q1',
    type: 'drag-order',
    pontos: 3,
    enunciado:
      'Ordene corretamente os 5 passos para configurar o Firebase Console antes de começar a desenvolver.',
    items: [
      { id: 'i1', text: 'Criar um novo projeto no Firebase Console (console.firebase.google.com)' },
      { id: 'i2', text: 'Adicionar um App Web ao projeto e copiar as chaves de configuração (apiKey, authDomain, etc.)' },
      { id: 'i3', text: 'Criar um banco de dados Firestore em modo de teste ou produção' },
      { id: 'i4', text: 'Alterar as regras de segurança do Firestore para allow read, write: if true (modo de desenvolvimento)' },
      { id: 'i5', text: 'Ativar o método de autenticação desejado (Email/Senha) em Authentication → Sign-in method' },
    ],
    correctOrder: ['i1', 'i2', 'i3', 'i5', 'i4'],
  },

  // ── Q2: Code Completion — firebaseConfig.ts ──────────────────────────────
  {
    id: 'p3_q2',
    type: 'code-completion',
    pontos: 5,
    enunciado:
      'Complete o arquivo firebaseConfig.ts que inicializa o Firebase e exporta os serviços de autenticação e banco de dados.',
    language: 'typescript',
    codeLines: [
      { id: 'g1', answer: "import { initializeApp } from 'firebase/app'", width: 44, hint: "Importação principal do Firebase" },
      "import { getAuth } from 'firebase/auth'",
      { id: 'g2', answer: "import { getFirestore } from 'firebase/firestore'", width: 46, hint: "Importação do banco de dados" },
      '',
      'const firebaseConfig = {',
      { id: 'g3', answer: '  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,', width: 50, hint: 'Chave da API via variável de ambiente' },
      '  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,',
      '  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,',
      '}',
      '',
      { id: 'g4', answer: 'const app = initializeApp(firebaseConfig)', width: 42, hint: 'Inicializa o app Firebase' },
      '',
      { id: 'g5', answer: 'export const auth = getAuth(app)', width: 32, hint: 'Exporta o serviço de autenticação' },
      'export const db = getFirestore(app)',
      'export default app',
    ],
  },

  // ── Q3: Fill Blank — .env.local ───────────────────────────────────────────
  {
    id: 'p3_q3',
    type: 'fill-blank',
    pontos: 3,
    enunciado:
      'Complete o arquivo .env.local com o prefixo correto do Next.js para expor variáveis ao cliente e os nomes exatos das chaves Firebase.',
    template: `{{blank_1}}_FIREBASE_API_KEY=AIzaSy...sua_chave
{{blank_2}}_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
{{blank_3}}_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.{{blank_4}}
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123`,
    blanks: [
      { id: 'blank_1', answer: 'NEXT_PUBLIC', caseSensitive: true },
      { id: 'blank_2', answer: 'NEXT_PUBLIC', caseSensitive: true },
      { id: 'blank_3', answer: 'NEXT_PUBLIC', caseSensitive: true },
      { id: 'blank_4', answer: 'appspot.com', caseSensitive: false },
    ],
  },

  // ── Q4: Code Completion — service getDocs ────────────────────────────────
  {
    id: 'p3_q4',
    type: 'code-completion',
    pontos: 4,
    enunciado:
      'Complete o serviço listarProdutos.ts que busca todos os documentos da coleção "produtos" no Firestore.',
    language: 'typescript',
    codeLines: [
      "import { collection, getDocs } from 'firebase/firestore'",
      "import { db } from '@/lib/firebaseConfig'",
      "import { Produto } from './types'",
      '',
      'export async function listarProdutos(): Promise<Produto[]> {',
      { id: 'g1', answer: "  const ref = collection(db, 'produtos')", width: 42, hint: "Referência à coleção 'produtos'" },
      { id: 'g2', answer: '  const snapshot = await getDocs(ref)', width: 38, hint: 'Busca todos os documentos' },
      '  const produtos: Produto[] = snapshot.docs.map(doc => ({',
      { id: 'g3', answer: '    id: doc.id,', width: 14, hint: 'ID do documento Firestore' },
      { id: 'g4', answer: '    ...doc.data() as Produto,', width: 28, hint: 'Spread dos campos do documento' },
      '  }))',
      { id: 'g5', answer: '  return produtos', width: 16 },
      '}',
    ],
  },

  // ── Q5: Fill Blank — types.ts ─────────────────────────────────────────────
  {
    id: 'p3_q5',
    type: 'fill-blank',
    pontos: 3,
    enunciado:
      'Complete a interface TypeScript para a entidade Produto, que será usada como tipo no Firestore.',
    template: `{{blank_1}} Produto {
  id: {{blank_2}};
  nome: string;
  preco: {{blank_3}};
  estoque: number;
  categoria: {{blank_4}};
  ativo: {{blank_5}};
}`,
    blanks: [
      { id: 'blank_1', answer: 'interface', caseSensitive: false },
      { id: 'blank_2', answer: 'string', caseSensitive: false },
      { id: 'blank_3', answer: 'number', caseSensitive: false },
      { id: 'blank_4', answer: 'string', caseSensitive: false },
      { id: 'blank_5', answer: 'boolean', caseSensitive: false },
    ],
  },

  // ── Q6: Code Completion — addDoc service ─────────────────────────────────
  {
    id: 'p3_q6',
    type: 'code-completion',
    pontos: 4,
    enunciado:
      'Complete o serviço cadastrarProduto.ts que insere um novo produto na coleção "produtos".',
    language: 'typescript',
    codeLines: [
      "import { collection, addDoc, Timestamp } from 'firebase/firestore'",
      "import { db } from '@/lib/firebaseConfig'",
      "import { Produto } from './types'",
      '',
      'export async function cadastrarProduto(',
      '  dados: Omit<Produto, "id">',
      '): Promise<string> {',
      { id: 'g1', answer: "  const ref = collection(db, 'produtos')", width: 42 },
      '  const docRef = await addDoc(ref, {',
      '    ...dados,',
      { id: 'g2', answer: '    criadoEm: Timestamp.now(),', width: 30, hint: 'Adiciona timestamp de criação' },
      '  })',
      { id: 'g3', answer: '  return docRef.id', width: 18, hint: 'Retorna o ID gerado pelo Firestore' },
      '}',
    ],
  },

  // ── Q7: Match Columns — métodos Firestore ────────────────────────────────
  {
    id: 'p3_q7',
    type: 'match-columns',
    pontos: 5,
    enunciado: 'Relacione cada método do Firestore com sua operação correspondente.',
    columnALabel: 'Método',
    columnBLabel: 'Operação',
    columnA: [
      { id: 'a1', text: 'getDocs(query)' },
      { id: 'a2', text: 'getDoc(docRef)' },
      { id: 'a3', text: 'addDoc(colRef, data)' },
      { id: 'a4', text: 'setDoc(docRef, data)' },
      { id: 'a5', text: 'collection(db, "nome")' },
    ],
    columnB: [
      { id: 'b1', text: 'Busca múltiplos documentos de uma coleção ou query' },
      { id: 'b2', text: 'Busca um único documento por referência direta' },
      { id: 'b3', text: 'Insere documento com ID gerado automaticamente' },
      { id: 'b4', text: 'Cria ou substitui documento com ID definido manualmente' },
      { id: 'b5', text: 'Retorna uma referência para uma coleção do Firestore' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b3', a4: 'b4', a5: 'b5' },
  },

  // ── Q8: Error Detection — config errado ──────────────────────────────────
  {
    id: 'p3_q8',
    type: 'error-detection',
    pontos: 3,
    enunciado:
      'Este código de configuração Firebase tem um erro que impede que a variável de ambiente seja lida pelo browser no Next.js. Identifique o problema.',
    language: 'typescript',
    codeLines: [
      'const firebaseConfig = {',
      '  apiKey: process.env.FIREBASE_API_KEY,',
      '  authDomain: process.env.FIREBASE_AUTH_DOMAIN,',
      '  projectId: process.env.FIREBASE_PROJECT_ID,',
      '}',
      "const app = initializeApp(firebaseConfig)",
      "export const db = getFirestore(app)",
    ],
    errorLineIndex: 1,
    options: [
      { id: 'a', text: 'Variáveis sem o prefixo NEXT_PUBLIC_ são visíveis apenas no servidor — o browser receberá undefined', correct: true },
      { id: 'b', text: 'Falta importar getFirestore antes de usá-lo', correct: false },
      { id: 'c', text: 'initializeApp deve receber uma string JSON, não um objeto', correct: false },
      { id: 'd', text: 'process.env não está disponível no Next.js App Router', correct: false },
    ],
  },

  // ── Q9: Code Completion — query() com where() e orderBy() ────────────────
  {
    id: 'p3_q9',
    type: 'code-completion',
    pontos: 4,
    enunciado:
      'Complete o serviço buscarProdutosPorCategoria.ts que filtra produtos por categoria e ordena pelo preço crescente.',
    language: 'typescript',
    codeLines: [
      "import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'",
      "import { db } from '@/lib/firebaseConfig'",
      "import { Produto } from './types'",
      '',
      'export async function buscarPorCategoria(categoria: string): Promise<Produto[]> {',
      '  const ref = collection(db, \'produtos\')',
      '  const q = query(',
      '    ref,',
      { id: 'g1', answer: "    where('categoria', '==', categoria),", width: 42, hint: "Filtra documentos onde o campo 'categoria' seja igual ao parâmetro" },
      { id: 'g2', answer: "    orderBy('preco', 'asc')", width: 26, hint: "Ordena pelo campo 'preco' de forma crescente" },
      '  )',
      { id: 'g3', answer: '  const snap = await getDocs(q)', width: 30, hint: 'Executa a query filtrada' },
      '  return snap.docs.map(d => ({ id: d.id, ...d.data() as Produto }))',
      '}',
    ],
  },

  // ── Q10: Fill Blank — onSnapshot (listener em tempo real) ────────────────
  {
    id: 'p3_q10',
    type: 'fill-blank',
    pontos: 3,
    enunciado:
      'Complete o hook useProdutosTempoReal.ts que usa onSnapshot para escutar mudanças na coleção em tempo real.',
    template: `import { useEffect, useState } from 'react'
import { collection, {{blank_1}}, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { Produto } from '@/types'

export function useProdutosTempoReal() {
  const [produtos, setProdutos] = useState<Produto[]>([])

  useEffect(() => {
    const q = query(collection(db, 'produtos'), orderBy('nome'))
    const {{blank_2}} = onSnapshot(q, (snap) => {
      const lista = snap.docs.map(d => ({ id: d.id, ...d.data() as Produto }))
      {{blank_3}}(lista)
    })
    return () => {{blank_4}}() // cancela o listener ao desmontar
  }, [])

  return produtos
}`,
    blanks: [
      { id: 'blank_1', answer: 'onSnapshot', caseSensitive: false },
      { id: 'blank_2', answer: 'unsubscribe', caseSensitive: false },
      { id: 'blank_3', answer: 'setProdutos', caseSensitive: false },
      { id: 'blank_4', answer: 'unsubscribe', caseSensitive: false },
    ],
  },

  // ── Q11: Match Columns — Firestore vs SQL (estrutura de dados) ────────────
  {
    id: 'p3_q11',
    type: 'match-columns',
    pontos: 4,
    enunciado: 'Relacione cada conceito do Firestore com seu equivalente mais próximo no banco de dados relacional.',
    columnALabel: 'Firestore (NoSQL)',
    columnBLabel: 'SQL (Relacional)',
    columnA: [
      { id: 'a1', text: 'Collection (ex: /produtos)' },
      { id: 'a2', text: 'Document (ex: /produtos/abc123)' },
      { id: 'a3', text: 'Document field (ex: nome, preco)' },
      { id: 'a4', text: 'Sub-collection (ex: /produtos/abc123/avaliacoes)' },
    ],
    columnB: [
      { id: 'b1', text: 'Tabela (TABLE)' },
      { id: 'b2', text: 'Linha / Registro (ROW)' },
      { id: 'b3', text: 'Coluna (COLUMN)' },
      { id: 'b4', text: 'Tabela relacionada com chave estrangeira (FK)' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b3', a4: 'b4' },
  },

  // ── Q12: Scenario Trace — doc() vs collection() ───────────────────────────
  {
    id: 'p3_q12',
    type: 'scenario-trace',
    pontos: 3,
    enunciado:
      'Analise os dois trechos de código abaixo e responda as perguntas sobre a diferença entre doc() e collection() no Firestore.',
    language: 'typescript',
    contexto: `// Trecho A
import { doc, getDoc } from 'firebase/firestore'
const refA = doc(db, 'produtos', 'abc123')
const snapA = await getDoc(refA)
// snapA.data() → { nome: 'Notebook', preco: 3500 }

// Trecho B
import { collection, getDocs } from 'firebase/firestore'
const refB = collection(db, 'produtos')
const snapB = await getDocs(refB)
// snapB.docs.length → 47`,
    subQuestions: [
      { id: 'sq1', label: 'O Trecho A busca quantos documentos?', answer: '1', tipo: 'number' },
      { id: 'sq2', label: 'O Trecho B busca quantos documentos?', answer: '47', tipo: 'number' },
      { id: 'sq3', label: 'Para buscar um único documento pelo ID, qual função usar: doc() ou collection()?', answer: 'doc()', tipo: 'text' },
      { id: 'sq4', label: 'O método getDoc() ou getDocs() é usado para buscar múltiplos documentos?', answer: 'getDocs()', tipo: 'text' },
    ],
  },

  // ── Q13: Drag Order — Fluxo completo de uma página Next.js com Firebase ───
  {
    id: 'p3_q13',
    type: 'drag-order',
    pontos: 3,
    enunciado:
      'Ordene corretamente as etapas de implementação de uma página /produtos/page.tsx que lista produtos do Firestore.',
    items: [
      { id: 'i1', text: "Criar tipos em types.ts: interface Produto { id: string; nome: string; preco: number }" },
      { id: 'i2', text: "Configurar firebaseConfig.ts com initializeApp e exportar db = getFirestore(app)" },
      { id: 'i3', text: "Criar serviceProdutos.ts com função listarProdutos() usando getDocs(collection(db, 'produtos'))" },
      { id: 'i4', text: "Em page.tsx: importar listarProdutos(), chamar no useEffect e exibir via map() no JSX" },
      { id: 'i5', text: "Preencher .env.local com NEXT_PUBLIC_FIREBASE_API_KEY e as demais chaves do Console Firebase" },
    ],
    correctOrder: ['i5', 'i2', 'i1', 'i3', 'i4'],
  },
]

export const prova3Meta = {
  id: 'prova-firebase-nextjs-basico',
  titulo: 'Prova 3 — Integração Next.js com Firebase Firestore (Básico)',
  descricao: 'Configuração do projeto Firebase, firebaseConfig.ts, serviços de leitura e escrita com getDocs e addDoc.',
  assunto: 'Next.js + Firebase Firestore — Configuração e CRUD Básico',
}
