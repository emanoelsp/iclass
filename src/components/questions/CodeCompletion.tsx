'use client'

import { useState, useEffect, useCallback } from 'react'
import { CodeCompletionQuestion, CodeGap } from '@/types'

interface Props {
  question: CodeCompletionQuestion
  onAnswer: (value: Record<string, string>) => void
  readonly?: boolean
  respostas?: Record<string, string>
  gabarito?: Record<string, string>
}

function isGap(line: string | CodeGap): line is CodeGap {
  return typeof line === 'object'
}

const LANG_COLORS: Record<string, string> = {
  sql: 'text-blue-300',
  typescript: 'text-yellow-300',
  javascript: 'text-yellow-300',
  bash: 'text-green-300',
}

export default function CodeCompletion({ question, onAnswer, readonly, respostas, gabarito }: Props) {
  const [values, setValues] = useState<Record<string, string>>(respostas ?? {})

  useEffect(() => {
    if (respostas) setValues(respostas)
  }, [respostas])

  const handleChange = useCallback(
    (id: string, val: string) => {
      const next = { ...values, [id]: val }
      setValues(next)
      onAnswer(next)
    },
    [values, onAnswer]
  )

  const langColor = LANG_COLORS[question.language] ?? 'text-gray-300'

  return (
    <div className="space-y-4">
      <p className="text-gray-700 font-medium">{question.enunciado}</p>

      <div className="rounded-lg overflow-hidden border border-gray-700">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className={`ml-3 text-xs font-mono ${langColor}`}>{question.language}</span>
        </div>
        <div className="bg-gray-900 p-4 font-mono text-sm overflow-x-auto">
          {question.codeLines.map((line, i) => {
            if (!isGap(line)) {
              return (
                <div key={i} className="flex items-center min-h-[28px]">
                  <span className="text-gray-600 select-none w-8 text-right mr-4 text-xs">{i + 1}</span>
                  <span className="text-gray-100 whitespace-pre">{line}</span>
                </div>
              )
            }

            const current = values[line.id] ?? ''
            const correct = gabarito?.[line.id]
            const isCorrect = correct
              ? current.toLowerCase().trim() === correct.toLowerCase().trim()
              : undefined

            return (
              <div key={i} className="flex items-center min-h-[28px]">
                <span className="text-gray-600 select-none w-8 text-right mr-4 text-xs">{i + 1}</span>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={current}
                    disabled={readonly}
                    onChange={e => handleChange(line.id, e.target.value)}
                    placeholder={line.hint ? `// ${line.hint}` : '// complete aqui...'}
                    title={line.hint}
                    className={`
                      bg-gray-800 text-white font-mono text-sm rounded px-2 py-0.5 outline-none flex-1
                      border placeholder-gray-500
                      ${readonly && isCorrect === true ? 'border-green-500 bg-green-900/20' : ''}
                      ${readonly && isCorrect === false ? 'border-red-500 bg-red-900/20' : ''}
                      ${!readonly ? 'border-indigo-500 focus:border-indigo-300' : ''}
                    `}
                    style={{ minWidth: `${line.width * 8}px`, maxWidth: '100%' }}
                  />
                  {readonly && isCorrect === false && correct && (
                    <span className="text-xs text-green-400 font-mono bg-green-900/30 px-2 py-0.5 rounded">
                      ✓ {correct}
                    </span>
                  )}
                  {readonly && isCorrect === true && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {question.dica && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          💡 {question.dica}
        </p>
      )}
    </div>
  )
}
