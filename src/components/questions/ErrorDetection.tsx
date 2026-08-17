'use client'

import { useState, useEffect } from 'react'
import { ErrorDetectionQuestion } from '@/types'

interface Props {
  question: ErrorDetectionQuestion
  onAnswer: (value: Record<string, string>) => void
  readonly?: boolean
  respostas?: Record<string, string>
  gabarito?: Record<string, string>
}

export default function ErrorDetection({ question, onAnswer, readonly, respostas, gabarito }: Props) {
  const [selected, setSelected] = useState<string>(respostas?.selected ?? '')
  const [highlighted, setHighlighted] = useState<number | null>(null)

  useEffect(() => {
    if (respostas?.selected) setSelected(respostas.selected)
  }, [respostas])

  function handleSelect(optionId: string) {
    if (readonly) return
    setSelected(optionId)
    onAnswer({ selected: optionId })
  }

  const correctOption = question.options.find(o => o.correct)

  return (
    <div className="space-y-5">
      <p className="text-gray-700 font-medium">{question.enunciado}</p>

      {/* Code with line numbers, clickable */}
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-blue-300 font-mono">{question.language}</span>
          {!readonly && <span className="ml-2 text-xs text-gray-400">— clique na linha suspeita (opcional)</span>}
        </div>
        <div className="bg-gray-900 p-4 font-mono text-sm">
          {question.codeLines.map((line, i) => {
            const isError = i === question.errorLineIndex
            const isHovered = highlighted === i

            return (
              <div
                key={i}
                onClick={() => !readonly && setHighlighted(i === highlighted ? null : i)}
                className={`
                  flex items-center gap-2 min-h-[28px] rounded px-2 -mx-2 cursor-default transition-colors
                  ${!readonly ? 'hover:bg-gray-800 cursor-pointer' : ''}
                  ${isHovered && !readonly ? 'bg-yellow-900/40' : ''}
                  ${readonly && isError ? 'bg-red-900/30' : ''}
                `}
              >
                <span className={`select-none w-6 text-right text-xs shrink-0 ${readonly && isError ? 'text-red-400 font-bold' : 'text-gray-600'}`}>
                  {i + 1}
                </span>
                {line === '' ? (
                  <span className="text-gray-100">&nbsp;</span>
                ) : (
                  <span className={`${readonly && isError ? 'text-red-300' : 'text-gray-100'} whitespace-pre`}>
                    {line}
                  </span>
                )}
                {readonly && isError && (
                  <span className="ml-2 text-xs text-red-400 bg-red-900/50 rounded px-1">← erro aqui</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Qual é o problema?</p>
        {question.options.map((opt) => {
          const isSelected = selected === opt.id
          const showResult = readonly && isSelected

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={readonly}
              className={`
                w-full text-left rounded-lg border px-4 py-3 text-sm transition-all
                ${isSelected && !readonly ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : ''}
                ${showResult && opt.correct ? 'border-green-500 bg-green-50 text-green-800' : ''}
                ${showResult && !opt.correct ? 'border-red-400 bg-red-50 text-red-700' : ''}
                ${readonly && !isSelected && opt.correct ? 'border-green-400 bg-green-50 text-green-700' : ''}
                ${!isSelected && (!readonly || !opt.correct) ? 'border-gray-200 bg-white hover:border-indigo-300' : ''}
                disabled:cursor-not-allowed
              `}
            >
              <span className="flex items-start gap-3">
                <span className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold
                  ${isSelected && !readonly ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-400'}
                  ${showResult && opt.correct ? 'border-green-500 bg-green-500 text-white' : ''}
                  ${showResult && !opt.correct ? 'border-red-400 bg-red-400 text-white' : ''}
                `}>
                  {opt.id.toUpperCase()}
                </span>
                <span>{opt.text}</span>
              </span>
            </button>
          )
        })}
      </div>

      {readonly && selected && !question.options.find(o => o.id === selected)?.correct && correctOption && (
        <div className="border border-green-300 bg-green-50 rounded-lg px-4 py-3 text-sm text-green-800">
          <strong>Resposta correta:</strong> {correctOption.text}
        </div>
      )}
    </div>
  )
}
