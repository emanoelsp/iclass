'use client'

import { useState, useEffect } from 'react'
import { DragOrderQuestion } from '@/types'

interface Props {
  question: DragOrderQuestion
  onAnswer: (value: string[]) => void
  readonly?: boolean
  respostas?: string[]
  gabarito?: string[]
}

export default function DragOrder({ question, onAnswer, readonly, respostas, gabarito }: Props) {
  const shuffled = question.items.map(i => i.id).sort(() => Math.random() - 0.5)
  const [order, setOrder] = useState<string[]>(respostas ?? shuffled)
  const [dragging, setDragging] = useState<string | null>(null)

  useEffect(() => {
    if (respostas) setOrder(respostas)
  }, [respostas])

  function onDragStart(id: string) {
    if (readonly) return
    setDragging(id)
  }

  function onDragOver(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    if (!dragging || dragging === targetId) return
    const from = order.indexOf(dragging)
    const to = order.indexOf(targetId)
    const next = [...order]
    next.splice(from, 1)
    next.splice(to, 0, dragging)
    setOrder(next)
    onAnswer(next)
  }

  function onDragEnd() {
    setDragging(null)
  }

  const itemMap = Object.fromEntries(question.items.map(i => [i.id, i]))

  return (
    <div className="space-y-4">
      <p className="text-gray-700 font-medium">{question.enunciado}</p>
      {!readonly && (
        <p className="text-xs text-gray-500 italic">Arraste os itens para reordenar</p>
      )}

      <div className="space-y-2">
        {order.map((id, index) => {
          const item = itemMap[id]
          const correctId = gabarito?.[index]
          const isCorrect = correctId ? id === correctId : undefined

          return (
            <div
              key={id}
              draggable={!readonly}
              onDragStart={() => onDragStart(id)}
              onDragOver={(e) => onDragOver(e, id)}
              onDragEnd={onDragEnd}
              className={`
                flex items-center gap-3 rounded-lg border px-4 py-3 transition-all
                ${!readonly ? 'cursor-grab active:cursor-grabbing hover:shadow-md' : ''}
                ${dragging === id ? 'opacity-50 scale-95' : ''}
                ${readonly && isCorrect === true ? 'border-green-400 bg-green-50' : ''}
                ${readonly && isCorrect === false ? 'border-red-300 bg-red-50' : ''}
                ${!readonly || isCorrect === undefined ? 'border-gray-300 bg-white hover:border-indigo-300' : ''}
              `}
            >
              <span className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                ${readonly && isCorrect === true ? 'bg-green-500 text-white' : ''}
                ${readonly && isCorrect === false ? 'bg-red-400 text-white' : ''}
                ${!readonly || isCorrect === undefined ? 'bg-indigo-100 text-indigo-700' : ''}
              `}>
                {index + 1}
              </span>
              {!readonly && (
                <span className="text-gray-400 text-lg select-none">⠿</span>
              )}
              <span className={`flex-1 text-sm ${item.isCode ? 'font-mono bg-gray-100 rounded px-2 py-1' : 'text-gray-800'}`}>
                {item.text}
              </span>
              {readonly && isCorrect !== undefined && (
                <span className={isCorrect ? 'text-green-600' : 'text-red-500'}>
                  {isCorrect ? '✓' : '✗'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
