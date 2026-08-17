'use client'

import { useState, useEffect, useCallback } from 'react'
import { FillBlankQuestion } from '@/types'

interface Props {
  question: FillBlankQuestion
  onAnswer: (value: Record<string, string>) => void
  readonly?: boolean
  respostas?: Record<string, string>
  gabarito?: Record<string, string>
}

export default function FillBlank({ question, onAnswer, readonly, respostas, gabarito }: Props) {
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

  const parts = question.template.split(/({{blank_\d+}})/)

  return (
    <div className="space-y-4">
      <p className="text-gray-700 font-medium">{question.enunciado}</p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm leading-loose whitespace-pre-wrap">
        {parts.map((part, i) => {
          const match = part.match(/{{(blank_\d+)}}/)
          if (!match) return <span key={i}>{part}</span>

          const blankId = match[1]
          const blank = question.blanks.find(b => b.id === blankId)
          const current = values[blankId] ?? ''
          const correct = gabarito?.[blankId]
          const isCorrect = correct ? current.toLowerCase().trim() === correct.toLowerCase().trim() : undefined

          return (
            <span key={i} className="inline-block mx-1 align-middle">
              <input
                type="text"
                value={current}
                disabled={readonly}
                onChange={e => handleChange(blankId, e.target.value)}
                placeholder="______"
                className={`
                  border-b-2 bg-transparent text-center text-sm outline-none px-1 min-w-[80px]
                  ${readonly && isCorrect === true ? 'border-green-500 text-green-700' : ''}
                  ${readonly && isCorrect === false ? 'border-red-500 text-red-600' : ''}
                  ${!readonly ? 'border-indigo-400 focus:border-indigo-600' : ''}
                `}
                style={{ width: `${Math.max(80, (blank?.answer.length ?? 8) * 9)}px` }}
              />
              {readonly && isCorrect === false && correct && (
                <span className="ml-1 text-xs text-green-600 font-semibold">({correct})</span>
              )}
            </span>
          )
        })}
      </div>
      {question.dica && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          💡 {question.dica}
        </p>
      )}
    </div>
  )
}
