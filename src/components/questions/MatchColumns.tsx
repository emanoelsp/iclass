'use client'

import { useState, useEffect } from 'react'
import { MatchColumnsQuestion } from '@/types'

interface Props {
  question: MatchColumnsQuestion
  onAnswer: (value: Record<string, string>) => void
  readonly?: boolean
  respostas?: Record<string, string>
  gabarito?: Record<string, string>
}

export default function MatchColumns({ question, onAnswer, readonly, respostas, gabarito }: Props) {
  const [matches, setMatches] = useState<Record<string, string>>(respostas ?? {})

  useEffect(() => {
    if (respostas) setMatches(respostas)
  }, [respostas])

  function handleSelect(aId: string, bId: string) {
    const next = { ...matches, [aId]: bId }
    setMatches(next)
    onAnswer(next)
  }

  const bOptions = question.columnB

  return (
    <div className="space-y-4">
      <p className="text-gray-700 font-medium">{question.enunciado}</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="bg-indigo-50 border border-indigo-200 px-4 py-2 text-left text-indigo-800 font-semibold w-1/2">
                {question.columnALabel}
              </th>
              <th className="bg-indigo-50 border border-indigo-200 px-4 py-2 text-left text-indigo-800 font-semibold w-1/2">
                Correspondência
              </th>
            </tr>
          </thead>
          <tbody>
            {question.columnA.map((a) => {
              const selected = matches[a.id] ?? ''
              const correct = gabarito?.[a.id]
              const isCorrect = correct ? selected === correct : undefined
              const correctItem = correct ? bOptions.find(b => b.id === correct) : null

              return (
                <tr key={a.id} className={`
                  border-b border-gray-200 transition-colors
                  ${readonly && isCorrect === true ? 'bg-green-50' : ''}
                  ${readonly && isCorrect === false ? 'bg-red-50' : ''}
                  ${!readonly ? 'hover:bg-gray-50' : ''}
                `}>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <div className="flex items-start gap-2">
                      {readonly && (
                        <span className={`mt-0.5 text-sm ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                      )}
                      <span className="text-gray-800">{a.text}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <select
                        value={selected}
                        disabled={readonly}
                        onChange={e => handleSelect(a.id, e.target.value)}
                        className={`
                          w-full border rounded-md px-3 py-2 text-sm bg-white outline-none
                          ${readonly && isCorrect === true ? 'border-green-400 text-green-800' : ''}
                          ${readonly && isCorrect === false ? 'border-red-400 text-red-700' : ''}
                          ${!readonly ? 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : ''}
                          disabled:bg-gray-50 disabled:cursor-not-allowed
                        `}
                      >
                        <option value="">— selecione —</option>
                        {bOptions.map(b => (
                          <option key={b.id} value={b.id}>{b.text}</option>
                        ))}
                      </select>
                      {readonly && isCorrect === false && correctItem && (
                        <p className="text-xs text-green-700 bg-green-50 rounded px-2 py-1">
                          Correto: {correctItem.text}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">{question.columnBLabel} — opções disponíveis:</p>
        <ul className="space-y-1">
          {question.columnB.map(b => (
            <li key={b.id} className="text-xs text-gray-700 flex gap-2">
              <span className="font-mono text-indigo-600 font-bold shrink-0">[{b.id}]</span>
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
