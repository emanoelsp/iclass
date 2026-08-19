import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { Turma, Prova, TurmaProva, Submissao, Question, QuestionAnswer } from '@/types'

// ─── Turmas ────────────────────────────────────────────────────────────────

function gerarCodigo(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function criarTurma(
  nome: string,
  descricao: string,
  professorId: string,
  professorNome: string
): Promise<Turma> {
  const data = {
    nome,
    descricao,
    codigo: gerarCodigo(),
    professorId,
    professorNome,
    ativa: true,
    alunosIds: [],
    criadaEm: Timestamp.now(),
  }
  const ref = await addDoc(collection(db, 'turmas'), data)
  return { id: ref.id, ...data }
}

export async function listarTurmasProfessor(professorId: string): Promise<Turma[]> {
  const q = query(collection(db, 'turmas'), where('professorId', '==', professorId))
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Turma))
    .sort((a, b) => b.criadaEm.toMillis() - a.criadaEm.toMillis())
}

export async function listarTurmasAluno(alunoId: string): Promise<Turma[]> {
  const q = query(collection(db, 'turmas'), where('alunosIds', 'array-contains', alunoId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Turma))
}

export async function buscarTurmaPorCodigo(codigo: string): Promise<Turma | null> {
  const q = query(collection(db, 'turmas'), where('codigo', '==', codigo))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Turma
}

export async function entrarNaTurma(turmaId: string, alunoId: string): Promise<void> {
  await updateDoc(doc(db, 'turmas', turmaId), {
    alunosIds: arrayUnion(alunoId),
  })
}

export async function removerAlunoDaTurma(turmaId: string, alunoId: string): Promise<void> {
  await updateDoc(doc(db, 'turmas', turmaId), {
    alunosIds: arrayRemove(alunoId),
  })
}

export async function excluirTurma(turmaId: string): Promise<void> {
  await deleteDoc(doc(db, 'turmas', turmaId))
}

// ─── Provas ────────────────────────────────────────────────────────────────

export async function criarProva(
  titulo: string,
  descricao: string,
  assunto: string,
  professorId: string,
  questoes: Question[]
): Promise<Prova> {
  const totalPontos = questoes.reduce((s, q) => s + q.pontos, 0)
  const data = {
    titulo,
    descricao,
    assunto,
    professorId,
    questoes,
    totalPontos,
    criadaEm: Timestamp.now(),
  }
  const ref = await addDoc(collection(db, 'provas'), data)
  return { id: ref.id, ...data }
}

export async function salvarProvaComId(prova: Omit<Prova, 'criadaEm'>): Promise<void> {
  const { id, ...data } = prova
  await setDoc(doc(db, 'provas', id), { ...data, criadaEm: Timestamp.now() })
}

export async function listarProvasProfessor(professorId: string): Promise<Prova[]> {
  const q = query(collection(db, 'provas'), where('professorId', '==', professorId))
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Prova))
    .sort((a, b) => b.criadaEm.toMillis() - a.criadaEm.toMillis())
}

export async function buscarProva(provaId: string): Promise<Prova | null> {
  const snap = await getDoc(doc(db, 'provas', provaId))
  return snap.exists() ? { id: snap.id, ...snap.data() } as Prova : null
}

// ─── TurmaProvas ───────────────────────────────────────────────────────────

export async function associarProvaATurma(
  turmaId: string,
  provaId: string,
  provaTitulo: string,
  tempoLimiteMinutos?: number
): Promise<TurmaProva> {
  const data = {
    turmaId,
    provaId,
    provaTitulo,
    liberada: false,
    tempoLimiteMinutos: tempoLimiteMinutos ?? undefined,
    criadaEm: Timestamp.now(),
  }
  const ref = await addDoc(collection(db, 'turmaProvas'), data)
  return { id: ref.id, ...data }
}

export async function listarProvasDaTurma(turmaId: string): Promise<TurmaProva[]> {
  const q = query(collection(db, 'turmaProvas'), where('turmaId', '==', turmaId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TurmaProva))
}

export async function alterarLiberacaoProva(turmaProvaId: string, liberada: boolean): Promise<void> {
  await updateDoc(doc(db, 'turmaProvas', turmaProvaId), {
    liberada,
    dataLiberacao: liberada ? Timestamp.now() : null,
  })
}

export async function removerProvaDeturma(turmaProvaId: string): Promise<void> {
  await deleteDoc(doc(db, 'turmaProvas', turmaProvaId))
}

// ─── Submissões ────────────────────────────────────────────────────────────

export async function iniciarSubmissao(
  alunoId: string,
  alunoNome: string,
  provaId: string,
  provaTitulo: string,
  turmaId: string,
  totalPontos: number
): Promise<Submissao> {
  const data = {
    alunoId,
    alunoNome,
    provaId,
    provaTitulo,
    turmaId,
    respostas: [],
    nota: null,
    notaMaxima: totalPontos,
    percentual: null,
    status: 'em_andamento' as const,
    iniciadaEm: Timestamp.now(),
  }
  const ref = await addDoc(collection(db, 'submissoes'), data)
  return { id: ref.id, ...data }
}

export async function buscarSubmissaoAtiva(
  alunoId: string,
  provaId: string,
  turmaId: string
): Promise<Submissao | null> {
  const q = query(
    collection(db, 'submissoes'),
    where('alunoId', '==', alunoId),
    where('provaId', '==', provaId),
    where('turmaId', '==', turmaId)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Submissao
}

export async function submeterProva(
  submissaoId: string,
  respostas: QuestionAnswer[],
  nota: number,
  notaMaxima: number
): Promise<void> {
  await updateDoc(doc(db, 'submissoes', submissaoId), {
    respostas,
    nota,
    notaMaxima,
    percentual: Math.round((nota / notaMaxima) * 100),
    status: 'submetida',
    submetidaEm: Timestamp.now(),
  })
}

export async function listarSubmissoesDaTurma(
  turmaId: string,
  provaId: string
): Promise<Submissao[]> {
  const q = query(
    collection(db, 'submissoes'),
    where('turmaId', '==', turmaId),
    where('provaId', '==', provaId)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Submissao))
}

export async function listarSubmissoesAluno(alunoId: string): Promise<Submissao[]> {
  const q = query(collection(db, 'submissoes'), where('alunoId', '==', alunoId))
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Submissao))
    .sort((a, b) => b.iniciadaEm.toMillis() - a.iniciadaEm.toMillis())
}

export async function listarTodasSubmissoesEntregues(): Promise<Submissao[]> {
  const q = query(
    collection(db, 'submissoes'),
    where('status', 'in', ['submetida', 'corrigida'])
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Submissao))
}

export async function atualizarNotaSubmissao(
  submissaoId: string,
  nota: number,
  notaMaxima: number
): Promise<void> {
  await updateDoc(doc(db, 'submissoes', submissaoId), {
    nota,
    percentual: Math.round((nota / notaMaxima) * 100),
  })
}
