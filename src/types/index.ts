import { Timestamp } from 'firebase/firestore'

export type UserRole = 'professor' | 'aluno'

export interface UserProfile {
  uid: string
  nome: string
  email: string
  role: UserRole
  criadoEm: Timestamp
}

// ─── Question Types ────────────────────────────────────────────────────────

export type QuestionType =
  | 'fill-blank'
  | 'code-completion'
  | 'match-columns'
  | 'drag-order'
  | 'scenario-trace'
  | 'error-detection'
  | 'multiple-choice'

export interface QuestionBase {
  id: string
  type: QuestionType
  enunciado: string
  dica?: string
  pontos: number
}

export interface FillBlankQuestion extends QuestionBase {
  type: 'fill-blank'
  template: string // texto com {{blank_N}} como placeholders
  blanks: { id: string; answer: string; caseSensitive?: boolean }[]
}

export interface CodeCompletionQuestion extends QuestionBase {
  type: 'code-completion'
  language: 'sql' | 'typescript' | 'javascript' | 'bash'
  codeLines: (string | CodeGap)[]
}

export interface CodeGap {
  id: string
  answer: string
  width: number // em caracteres para dimensionar o input
  hint?: string
}

export interface MatchColumnsQuestion extends QuestionBase {
  type: 'match-columns'
  columnALabel: string
  columnBLabel: string
  columnA: { id: string; text: string }[]
  columnB: { id: string; text: string }[]
  correctMatches: Record<string, string> // A.id → B.id
}

export interface DragOrderQuestion extends QuestionBase {
  type: 'drag-order'
  items: { id: string; text: string; isCode?: boolean }[]
  correctOrder: string[] // ids na ordem correta
}

export interface ScenarioTraceQuestion extends QuestionBase {
  type: 'scenario-trace'
  contexto: string // código SQL/TS mostrado antes das perguntas
  language: 'sql' | 'typescript'
  subQuestions: {
    id: string
    label: string
    answer: string
    tipo: 'text' | 'number'
    hint?: string
  }[]
}

export interface ErrorDetectionQuestion extends QuestionBase {
  type: 'error-detection'
  language: 'sql' | 'typescript'
  codeLines: string[]
  errorLineIndex: number
  options: { id: string; text: string; correct: boolean }[]
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple-choice'
  options: { id: string; text: string; correct: boolean }[]
  multiSelect?: boolean
}

export type Question =
  | FillBlankQuestion
  | CodeCompletionQuestion
  | MatchColumnsQuestion
  | DragOrderQuestion
  | ScenarioTraceQuestion
  | ErrorDetectionQuestion
  | MultipleChoiceQuestion

// ─── Answer Types ──────────────────────────────────────────────────────────

export type AnswerValue =
  | Record<string, string>    // fill-blank, code-completion, match-columns, scenario-trace
  | string[]                   // drag-order, multiple-choice

export interface QuestionAnswer {
  questionId: string
  value: AnswerValue
  correct?: boolean
  pontosObtidos?: number
}

// ─── Domain Types ──────────────────────────────────────────────────────────

export interface Turma {
  id: string
  nome: string
  codigo: string
  descricao?: string
  professorId: string
  professorNome: string
  ativa: boolean
  alunosIds: string[]
  criadaEm: Timestamp
}

export interface Prova {
  id: string
  titulo: string
  descricao: string
  assunto: string
  professorId: string
  questoes: Question[]
  totalPontos: number
  criadaEm: Timestamp
}

export interface TurmaProva {
  id: string
  turmaId: string
  provaId: string
  provaTitulo: string
  liberada: boolean
  dataLiberacao?: Timestamp
  dataEncerramento?: Timestamp
  tempoLimiteMinutos?: number
  criadaEm: Timestamp
}

export interface Submissao {
  id: string
  alunoId: string
  alunoNome: string
  provaId: string
  provaTitulo: string
  turmaId: string
  respostas: QuestionAnswer[]
  nota: number | null
  notaMaxima: number
  percentual: number | null
  status: 'em_andamento' | 'submetida' | 'corrigida'
  iniciadaEm: Timestamp
  submetidaEm?: Timestamp
}

// ─── UI Helpers ────────────────────────────────────────────────────────────

export interface NotaAluno {
  alunoId: string
  alunoNome: string
  alunoEmail: string
  submissao: Submissao | null
  status: 'pendente' | 'em_andamento' | 'submetida' | 'corrigida'
}
