'use client'

import { useState, useEffect } from 'react'
import { ScenarioTraceQuestion } from '@/types'

interface Props {
  question: ScenarioTraceQuestion
  onAnswer: (value: Record<string, string>) => void
  readonly?: boolean
  respostas?: Record<string, string>
  gabarito?: Record<string, string>
}

export default function ScenarioTrace({ question, onAnswer, readonly, respostas, gabarito }: Props) {
  const [values, setValues] = useState<Record<string, string>>(respostas ?? {})

  useEffect(() => {
    if (respostas) setValues(respostas)
  }, [respostas])

  function handleChange(id: string, val: string) {
    const next = { ...values, [id]: val }
    setValues(next)
    onAnswer(next)
  }

  return (
    <div className="space-y-5">
      <p className="text-gray-700 font-medium">{question.enunciado}</p>

      {/* Context Code Block */}
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-blue-300 font-mono">{question.language}</span>
          <span className="ml-2 text-xs text-gray-400">— contexto da questão</span>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 text-sm font-mono overflow-x-auto leading-relaxed">
          {question.contexto}
        </pre>
      </div>

      {/* Sub-questions */}
      <div className="space-y-4 border border-indigo-100 rounded-lg p-4 bg-indigo-50">
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
          Responda com base no código acima:
        </p>
        {question.subQuestions.map((sq, i) => {
          const current = values[sq.id] ?? ''
          const correct = gabarito?.[sq.id]
          const isCorrect = correct
            ? current.toLowerCase().trim() === correct.toLowerCase().trim()
            : undefined

          return (
            <div key={sq.id} className={`
              rounded-lg border p-4 bg-white transition-colors
              ${readonly && isCorrect === true ? 'border-green-400 bg-green-50' : ''}
              ${readonly && isCorrect === false ? 'border-red-300 bg-red-50' : ''}
              ${!readonly || isCorrect === undefined ? 'border-gray-200' : ''}
            `}>
              <label className="block text-sm text-gray-800 mb-2">
                <span className="font-bold text-indigo-600">{i + 1}.</span> {sq.label}
              </label>
              {sq.hint && (
                <p className="text-xs text-amber-600 mb-2">💡 {sq.hint}</p>
              )}
              <div className="flex items-center gap-3">
                <input
                  type={sq.tipo === 'number' ? 'number' : 'text'}
                  value={current}
                  disabled={readonly}
                  onChange={e => handleChange(sq.id, e.target.value)}
                  placeholder="sua resposta..."
                  step={sq.tipo === 'number' ? 'any' : undefined}
                  className={`
                    border rounded-md px-3 py-2 text-sm w-full max-w-xs outline-none
                    ${readonly && isCorrect === true ? 'border-green-400 bg-green-50 text-green-800' : ''}
                    ${readonly && isCorrect === false ? 'border-red-400 bg-red-50 text-red-700' : ''}
                    ${!readonly ? 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : ''}
                    disabled:bg-transparent disabled:cursor-not-allowed
                  `}
                />
                {readonly && isCorrect !== undefined && (
                  <span className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
                {readonly && isCorrect === false && correct && (
                  <span className="text-sm text-green-700 font-medium">
                    Resp. correta: <strong>{correct}</strong>
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
