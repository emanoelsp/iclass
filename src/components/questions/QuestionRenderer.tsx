'use client'

import { Question, QuestionAnswer, AnswerValue } from '@/types'
import FillBlank from './FillBlank'
import CodeCompletion from './CodeCompletion'
import MatchColumns from './MatchColumns'
import DragOrder from './DragOrder'
import ScenarioTrace from './ScenarioTrace'
import ErrorDetection from './ErrorDetection'

interface Props {
  question: Question
  index: number
  onAnswer: (answer: QuestionAnswer) => void
  readonly?: boolean
  previousAnswer?: QuestionAnswer
  showGabarito?: boolean
}

const TYPE_LABELS: Record<string, string> = {
  'fill-blank': 'Preencher Lacunas',
  'code-completion': 'Completar Código',
  'match-columns': 'Relacionar Colunas',
  'drag-order': 'Ordenar Itens',
  'scenario-trace': 'Análise de Cenário',
  'error-detection': 'Detectar Erro',
  'multiple-choice': 'Múltipla Escolha',
}

const TYPE_COLORS: Record<string, string> = {
  'fill-blank': 'bg-violet-100 text-violet-700',
  'code-completion': 'bg-gray-800 text-gray-200',
  'match-columns': 'bg-teal-100 text-teal-700',
  'drag-order': 'bg-orange-100 text-orange-700',
  'scenario-trace': 'bg-blue-100 text-blue-700',
  'error-detection': 'bg-red-100 text-red-700',
  'multiple-choice': 'bg-indigo-100 text-indigo-700',
}

export default function QuestionRenderer({
  question, index, onAnswer, readonly, previousAnswer, showGabarito,
}: Props) {

  function handleAnswer(value: AnswerValue) {
    onAnswer({ questionId: question.id, value })
  }

  function buildGabarito(): Record<string, string> | string[] | undefined {
    if (!showGabarito) return undefined
    if (question.type === 'fill-blank') {
      return Object.fromEntries(question.blanks.map(b => [b.id, b.answer]))
    }
    if (question.type === 'code-completion') {
      const gaps = question.codeLines.filter((l): l is import('@/types').CodeGap => typeof l === 'object')
      return Object.fromEntries(gaps.map(g => [g.id, g.answer]))
    }
    if (question.type === 'match-columns') {
      return question.correctMatches
    }
    if (question.type === 'drag-order') {
      return question.correctOrder
    }
    if (question.type === 'scenario-trace') {
      return Object.fromEntries(question.subQuestions.map(sq => [sq.id, sq.answer]))
    }
    if (question.type === 'error-detection') {
      const c = question.options.find(o => o.correct)
      return c ? { selected: c.id } : undefined
    }
    return undefined
  }

  const gabarito = buildGabarito()
  const prevValue = previousAnswer?.value

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TYPE_COLORS[question.type] ?? 'bg-gray-100 text-gray-600'}`}>
            {TYPE_LABELS[question.type] ?? question.type}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{question.pontos}</span> {question.pontos === 1 ? 'ponto' : 'pontos'}
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {question.type === 'fill-blank' && (
          <FillBlank
            question={question}
            onAnswer={v => handleAnswer(v)}
            readonly={readonly}
            respostas={prevValue as Record<string, string>}
            gabarito={gabarito as Record<string, string>}
          />
        )}
        {question.type === 'code-completion' && (
          <CodeCompletion
            question={question}
            onAnswer={v => handleAnswer(v)}
            readonly={readonly}
            respostas={prevValue as Record<string, string>}
            gabarito={gabarito as Record<string, string>}
          />
        )}
        {question.type === 'match-columns' && (
          <MatchColumns
            question={question}
            onAnswer={v => handleAnswer(v)}
            readonly={readonly}
            respostas={prevValue as Record<string, string>}
            gabarito={gabarito as Record<string, string>}
          />
        )}
        {question.type === 'drag-order' && (
          <DragOrder
            question={question}
            onAnswer={v => handleAnswer(v)}
            readonly={readonly}
            respostas={prevValue as string[]}
            gabarito={gabarito as string[]}
          />
        )}
        {question.type === 'scenario-trace' && (
          <ScenarioTrace
            question={question}
            onAnswer={v => handleAnswer(v)}
            readonly={readonly}
            respostas={prevValue as Record<string, string>}
            gabarito={gabarito as Record<string, string>}
          />
        )}
        {question.type === 'error-detection' && (
          <ErrorDetection
            question={question}
            onAnswer={v => handleAnswer(v as Record<string, string>)}
            readonly={readonly}
            respostas={prevValue as Record<string, string>}
            gabarito={gabarito as Record<string, string>}
          />
        )}
      </div>
    </div>
  )
}
