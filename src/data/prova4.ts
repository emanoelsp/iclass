import { Question } from '@/types'

export const questoesProva4: Question[] = [

  // ── Q1: Match Columns — HTTP Verbs × Firestore ops ───────────────────────
  {
    id: 'p4_q1',
    type: 'match-columns',
    pontos: 4,
    enunciado: 'Relacione os verbos HTTP conceituais às operações correspondentes no Firestore.',
    columnALabel: 'Verbo HTTP',
    columnBLabel: 'Método Firestore',
    columnA: [
      { id: 'a1', text: 'POST — Criar novo recurso' },
      { id: 'a2', text: 'GET — Ler recurso(s)' },
      { id: 'a3', text: 'PUT — Substituir recurso completamente' },
      { id: 'a4', text: 'PATCH — Atualizar campos parcialmente' },
      { id: 'a5', text: 'DELETE — Remover recurso' },
    ],
    columnB: [
      { id: 'b1', text: 'addDoc() / setDoc() com ID' },
      { id: 'b2', text: 'getDoc() / getDocs()' },
      { id: 'b3', text: 'setDoc() — sobrescreve o documento inteiro' },
      { id: 'b4', text: 'updateDoc() — atualiza apenas os campos informados' },
      { id: 'b5', text: 'deleteDoc()' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b3', a4: 'b4', a5: 'b5' },
  },

  // ── Q2: Code Completion — updateDoc ──────────────────────────────────────
  {
    id: 'p4_q2',
    type: 'code-completion',
    pontos: 4,
    enunciado:
      'Complete o serviço atualizarProduto.ts que atualiza apenas o preço e a categoria de um produto existente sem sobrescrever os outros campos.',
    language: 'typescript',
    codeLines: [
      "import { doc, updateDoc } from 'firebase/firestore'",
      "import { db } from '@/lib/firebaseConfig'",
      '',
      'export async function atualizarProduto(',
      '  id: string,',
      '  campos: Partial<{ preco: number; categoria: string }>',
      '): Promise<void> {',
      { id: 'g1', answer: "  const ref = doc(db, 'produtos', id)", width: 38, hint: "Referência ao documento específico" },
      { id: 'g2', answer: '  await updateDoc(ref, campos)', width: 30, hint: 'Atualiza apenas os campos informados' },
      '}',
    ],
  },

  // ── Q3: Code Completion — deleteDoc ──────────────────────────────────────
  {
    id: 'p4_q3',
    type: 'code-completion',
    pontos: 3,
    enunciado:
      'Complete o serviço excluirProduto.ts que remove um documento do Firestore pelo ID.',
    language: 'typescript',
    codeLines: [
      { id: 'g1', answer: "import { doc, deleteDoc } from 'firebase/firestore'", width: 50, hint: 'Importar doc e deleteDoc' },
      "import { db } from '@/lib/firebaseConfig'",
      '',
      'export async function excluirProduto(id: string): Promise<void> {',
      { id: 'g2', answer: "  const ref = doc(db, 'produtos', id)", width: 38 },
      { id: 'g3', answer: '  await deleteDoc(ref)', width: 22, hint: 'Executa a exclusão do documento' },
      '}',
    ],
  },

  // ── Q4: Code Completion — Firestore Security Rules ───────────────────────
  {
    id: 'p4_q4',
    type: 'code-completion',
    pontos: 5,
    enunciado:
      'Complete as Firestore Security Rules que garantem: (1) usuário autenticado pode ler qualquer documento, (2) apenas o autor (campo "uid") pode atualizar ou excluir o próprio documento.',
    language: 'javascript',
    codeLines: [
      "rules_version = '2';",
      'service cloud.firestore {',
      '  match /databases/{database}/documents {',
      '    match /posts/{postId} {',
      { id: 'g1', answer: '      allow read: if request.auth != null;', width: 42, hint: 'Qualquer usuário autenticado pode ler' },
      '      allow create: if request.auth != null',
      { id: 'g2', answer: '        && request.resource.data.uid == request.auth.uid;', width: 56, hint: 'O campo uid deve ser o uid do criador' },
      '      allow update, delete: if request.auth != null',
      { id: 'g3', answer: '        && resource.data.uid == request.auth.uid;', width: 50, hint: 'Apenas o autor pode modificar/excluir' },
      '    }',
      '  }',
      '}',
    ],
  },

  // ── Q5: Scenario Trace — Cálculo de custo Firebase ───────────────────────
  {
    id: 'p4_q5',
    type: 'scenario-trace',
    pontos: 4,
    enunciado:
      'Calcule o custo mensal do Firebase Firestore (plano Blaze) para o cenário de uso abaixo. Use: Leituras $0,06/100k | Escritas $0,18/100k | Exclusões $0,02/100k. Free tier: 50k leituras/dia, 20k escritas/dia, 20k exclusões/dia.',
    language: 'sql',
    contexto: `-- Cenário: 100.000 usuários ativos diários
-- Por usuário por dia:
--   5 leituras de documentos
--   2 atualizações (escritas)
--   1 exclusão de registro

-- Cálculo mensal (30 dias):
-- Total leituras/dia  = 100.000 × 5  = 500.000
-- Total escritas/dia  = 100.000 × 2  = 200.000
-- Total exclusões/dia = 100.000 × 1  = 100.000

-- Free tier diário:
--   Leituras gratuitas/dia:  50.000
--   Escritas gratuitas/dia:  20.000
--   Exclusões gratuitas/dia: 20.000`,
    subQuestions: [
      { id: 'sq1', label: 'Total de leituras pagas por dia (acima do free tier)?', answer: '450000', tipo: 'number' },
      { id: 'sq2', label: 'Total de escritas pagas por mês (30 dias, descontando free tier)?', answer: '5400000', tipo: 'number', hint: '(200.000 - 20.000) × 30' },
      { id: 'sq3', label: 'Custo estimado de leituras por mês em USD? (arredondar para 2 casas)', answer: '81.00', tipo: 'number', hint: '450.000 × 30 / 100.000 × $0.06' },
    ],
  },

  // ── Q6: Fill Blank — Firebase Auth flow ──────────────────────────────────
  {
    id: 'p4_q6',
    type: 'fill-blank',
    pontos: 4,
    enunciado:
      'Complete o código de autenticação com Firebase Auth que registra um usuário e salva o perfil no Firestore.',
    template: `import { createUserWithEmailAndPassword } from '{{blank_1}}';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';

async function registrar(email: string, senha: string, nome: string) {
  const credencial = await {{blank_2}}(auth, email, senha);
  const uid = credencial.{{blank_3}}.uid;

  await setDoc(doc(db, '{{blank_4}}', uid), {
    uid,
    nome,
    email,
    role: 'aluno',
  });
}`,
    blanks: [
      { id: 'blank_1', answer: 'firebase/auth', caseSensitive: false },
      { id: 'blank_2', answer: 'createUserWithEmailAndPassword', caseSensitive: false },
      { id: 'blank_3', answer: 'user', caseSensitive: false },
      { id: 'blank_4', answer: 'users', caseSensitive: false },
    ],
  },

  // ── Q7: Drag Order — Auth + CRUD seguro ──────────────────────────────────
  {
    id: 'p4_q7',
    type: 'drag-order',
    pontos: 3,
    enunciado:
      'Ordene o fluxo correto para uma operação de exclusão segura com Firebase Auth + Firestore Rules.',
    items: [
      { id: 'i1', text: 'Usuário clica em "Excluir" na interface Next.js' },
      { id: 'i2', text: 'Firebase SDK verifica se o usuário está autenticado (onAuthStateChanged)' },
      { id: 'i3', text: 'Chamada deleteDoc(ref) é enviada ao Firestore com token JWT do usuário' },
      { id: 'i4', text: 'Firestore Security Rules comparam resource.data.uid com request.auth.uid' },
      { id: 'i5', text: 'Se a regra permitir, o documento é excluído; caso contrário, erro PERMISSION_DENIED' },
    ],
    correctOrder: ['i1', 'i2', 'i3', 'i4', 'i5'],
  },

  // ── Q8: Match Columns — Anomalias de atualização NoSQL ───────────────────
  {
    id: 'p4_q8',
    type: 'match-columns',
    pontos: 3,
    enunciado:
      'Relacione cada conceito de consistência de dados ao seu efeito prático em bancos NoSQL desnormalizados (como Firestore).',
    columnALabel: 'Conceito',
    columnBLabel: 'Efeito Prático no Firestore',
    columnA: [
      { id: 'a1', text: 'Desnormalização de dados' },
      { id: 'a2', text: 'Consistência eventual' },
      { id: 'a3', text: 'Anomalia de atualização' },
      { id: 'a4', text: 'Transação atômica (writeBatch)' },
    ],
    columnB: [
      { id: 'b1', text: 'Dados duplicados em vários documentos para evitar JOINs, mas exigem atualização em múltiplos lugares' },
      { id: 'b2', text: 'Leituras podem retornar dados desatualizados por um curto período após uma escrita' },
      { id: 'b3', text: 'Ao renomear o autor de um post, todos os comentários que duplicaram esse nome ficam desatualizados' },
      { id: 'b4', text: 'Garante que múltiplas escritas em documentos diferentes sejam atômicas (tudo ou nada)' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b3', a4: 'b4' },
  },

  // ── Q9: Error Detection — updateDoc vs setDoc ────────────────────────────
  {
    id: 'p4_q9',
    type: 'error-detection',
    pontos: 3,
    enunciado:
      'O código abaixo tenta atualizar apenas o preço de um produto, mas tem um erro grave que apaga outros dados. Identifique o problema.',
    language: 'typescript',
    codeLines: [
      "import { doc, setDoc } from 'firebase/firestore'",
      "import { db } from '@/lib/firebaseConfig'",
      '',
      'async function atualizarPreco(id: string, novoPreco: number) {',
      "  const ref = doc(db, 'produtos', id)",
      '  await setDoc(ref, { preco: novoPreco })',
      '}',
    ],
    errorLineIndex: 5,
    options: [
      { id: 'a', text: 'setDoc() sobrescreve o documento inteiro — os campos nome, estoque e categoria serão apagados. Use updateDoc()', correct: true },
      { id: 'b', text: 'setDoc() não aceita objetos parciais, precisa passar o documento completo com merge: true obrigatório', correct: false },
      { id: 'c', text: 'doc() não aceita o ID como terceiro argumento', correct: false },
      { id: 'd', text: 'Falta await antes de doc()', correct: false },
    ],
  },

  // ── Q10: Fill Blank — Estrutura de pastas Next.js + Firebase ─────────────
  {
    id: 'p4_q10',
    type: 'fill-blank',
    pontos: 3,
    enunciado:
      'Complete a estrutura de pastas recomendada para um projeto Next.js com Firebase seguindo princípios SOLID.',
    template: `src/
├── {{blank_1}}/              ← Configuração do Firebase (firebaseConfig.ts)
├── {{blank_2}}/              ← Interfaces e types TypeScript (Produto, Usuario...)
├── {{blank_3}}/firebase/     ← Serviços isolados (auth.ts, firestore.ts)
├── hooks/                    ← Custom hooks (useAuth, useProdutos...)
└── app/
    ├── {{blank_4}}/page.tsx  ← Rota de login
    └── produtos/
        └── {{blank_5}}.tsx   ← Componente de página de produtos`,
    blanks: [
      { id: 'blank_1', answer: 'lib', caseSensitive: false },
      { id: 'blank_2', answer: 'types', caseSensitive: false },
      { id: 'blank_3', answer: 'services', caseSensitive: false },
      { id: 'blank_4', answer: 'login', caseSensitive: false },
      { id: 'blank_5', answer: 'page', caseSensitive: false },
    ],
  },

  // ── Q11: Code Completion — writeBatch (operações atômicas) ───────────────
  {
    id: 'p4_q11',
    type: 'code-completion',
    pontos: 4,
    enunciado:
      'Complete o serviço que usa writeBatch para transferir um produto de uma categoria para outra de forma ATÔMICA — se uma operação falhar, nenhuma é confirmada.',
    language: 'typescript',
    codeLines: [
      "import { writeBatch, doc, updateDoc } from 'firebase/firestore'",
      "import { db } from '@/lib/firebaseConfig'",
      '',
      'export async function transferirProduto(produtoId: string, novaCategoria: string, novoPontoDeVenda: string) {',
      { id: 'g1', answer: '  const batch = writeBatch(db)', width: 30, hint: 'Cria um batch de operações atômicas' },
      '',
      '  const produtoRef = doc(db, \'produtos\', produtoId)',
      { id: 'g2', answer: "  batch.update(produtoRef, { categoria: novaCategoria })", width: 56, hint: 'Usa batch.update() — não updateDoc() diretamente' },
      '',
      '  const logRef = doc(db, \'logs_transferencia\', `${produtoId}_${Date.now()}`)',
      { id: 'g3', answer: "  batch.set(logRef, { produtoId, novaCategoria, novoPontoDeVenda, criadoEm: new Date() })", width: 88, hint: 'Adiciona um log no mesmo batch com batch.set()' },
      '',
      { id: 'g4', answer: '  await batch.commit()', width: 22, hint: 'Confirma TODAS as operações do batch de uma vez' },
      '}',
    ],
  },

  // ── Q12: Fill Blank — query com where, orderBy e limit ────────────────────
  {
    id: 'p4_q12',
    type: 'fill-blank',
    pontos: 3,
    enunciado:
      'Complete a query Firestore que busca os 5 produtos mais caros da categoria "eletrônicos" em ordem decrescente de preço.',
    template: `import { collection, query, {{blank_1}}, {{blank_2}}, {{blank_3}} } from 'firebase/firestore'

const q = query(
  collection(db, 'produtos'),
  where('categoria', '==', 'eletrônicos'),
  orderBy('preco', '{{blank_4}}'),
  limit({{blank_5}})
)`,
    blanks: [
      { id: 'blank_1', answer: 'where', caseSensitive: false },
      { id: 'blank_2', answer: 'orderBy', caseSensitive: false },
      { id: 'blank_3', answer: 'limit', caseSensitive: false },
      { id: 'blank_4', answer: 'desc', caseSensitive: false },
      { id: 'blank_5', answer: '5', caseSensitive: false },
    ],
  },

  // ── Q13: Scenario Trace — Consistência eventual + anomalia de atualização ─
  {
    id: 'p4_q13',
    type: 'scenario-trace',
    pontos: 3,
    enunciado:
      'Analise o cenário de desnormalização no Firestore abaixo e responda as perguntas sobre o risco de anomalia de atualização.',
    language: 'typescript',
    contexto: `// Estrutura desnormalizada no Firestore:
// /posts/{postId} → { titulo: "...", autorNome: "João Silva", autorId: "u123" }
// /comentarios/{comentId} → { texto: "...", autorNome: "João Silva", autorId: "u123" }
// /curtidas/{curtidaId} → { autorNome: "João Silva", autorId: "u123" }

// O usuário João Silva muda seu nome para "João S. Silva":
async function atualizarNomeUsuario(uid: string, novoNome: string) {
  // Atualiza apenas o documento do usuário
  await updateDoc(doc(db, 'users', uid), { nome: novoNome })
  // ⚠️ posts, comentarios e curtidas ainda têm "João Silva"
}`,
    subQuestions: [
      { id: 'sq1', label: 'Quantas coleções precisam ser atualizadas para corrigir o nome completamente? (além de /users)', answer: '3', tipo: 'number', hint: 'posts, comentarios e curtidas' },
      { id: 'sq2', label: 'Como se chama o problema quando dados duplicados ficam desatualizados após uma mudança? (em pt-br)', answer: 'anomalia de atualização', tipo: 'text' },
      { id: 'sq3', label: 'Qual método Firestore garante que a atualização em múltiplos documentos seja atômica?', answer: 'writeBatch', tipo: 'text' },
    ],
  },

  // ── Q14: Match Columns — Firestore Security Rules × Regra aplicada ────────
  {
    id: 'p4_q14',
    type: 'match-columns',
    pontos: 4,
    enunciado: 'Relacione cada trecho de Firestore Security Rule com o que ela efetivamente permite ou nega.',
    columnALabel: 'Regra',
    columnBLabel: 'O que ela faz',
    columnA: [
      { id: 'a1', text: 'allow read: if true;' },
      { id: 'a2', text: 'allow write: if request.auth != null;' },
      { id: 'a3', text: 'allow delete: if request.auth.uid == resource.data.autorId;' },
      { id: 'a4', text: 'allow read, write: if false;' },
    ],
    columnB: [
      { id: 'b1', text: 'Qualquer pessoa (mesmo não autenticada) pode LER os documentos' },
      { id: 'b2', text: 'Apenas usuários autenticados podem ESCREVER (criar/atualizar/deletar)' },
      { id: 'b3', text: 'Apenas o autor do documento pode DELETAR — outros usuários são bloqueados' },
      { id: 'b4', text: 'Ninguém pode ler ou escrever — coleção completamente bloqueada' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b3', a4: 'b4' },
  },

  // ── Q15: Code Completion — Rota protegida Next.js com Firebase Auth ───────
  {
    id: 'p4_q15',
    type: 'code-completion',
    pontos: 4,
    enunciado:
      'Complete o hook useProtectedRoute que redireciona para /login caso o usuário não esteja autenticado — padrão comum em dashboards Next.js + Firebase.',
    language: 'typescript',
    codeLines: [
      "'use client'",
      "import { useEffect } from 'react'",
      "import { useRouter } from 'next/navigation'",
      { id: 'g1', answer: "import { onAuthStateChanged } from 'firebase/auth'", width: 48, hint: 'Importar o listener de estado de autenticação' },
      "import { auth } from '@/lib/firebaseConfig'",
      '',
      'export function useProtectedRoute() {',
      '  const router = useRouter()',
      '',
      '  useEffect(() => {',
      { id: 'g2', answer: '    const unsub = onAuthStateChanged(auth, (user) => {', width: 52, hint: 'Escutar mudanças no estado de autenticação' },
      { id: 'g3', answer: "      if (!user) router.replace('/login')", width: 42, hint: 'Redirecionar se não houver usuário autenticado' },
      '    })',
      { id: 'g4', answer: '    return unsub', width: 16, hint: 'Retornar a função de cleanup para cancelar o listener' },
      '  }, [router])',
      '}',
    ],
  },
]

export const prova4Meta = {
  id: 'prova-nextjs-firestore-crud-auth',
  titulo: 'Prova 4 — Next.js com Firestore CRUD Completo, Auth e Segurança',
  descricao: 'CRUD avançado (updateDoc, deleteDoc), Firebase Auth, Firestore Security Rules e arquitetura de aplicação.',
  assunto: 'Next.js + Firebase — CRUD Avançado, Auth e Segurança',
}
