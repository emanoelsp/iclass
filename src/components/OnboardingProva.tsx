'use client'

import { useState } from 'react'
import { Prova } from '@/types'
import { IntroProvaData } from '@/data/introProvas'

interface Props {
  prova: Prova
  intro: IntroProvaData
  onIniciar: () => void
  iniciando: boolean
}

function BlocoCodigoIntro({ codigo, linguagem }: { codigo: string; linguagem: string }) {
  const [copiado, setCopiado] = useState(false)

  function copiar() {
    navigator.clipboard.writeText(codigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1500)
  }

  return (
    <div className="relative mt-3 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between bg-gray-800 px-3 py-1.5">
        <span className="text-xs text-gray-400 font-mono">{linguagem}</span>
        <button
          onClick={copiar}
          className="text-xs text-gray-400 hover:text-white transition"
        >
          {copiado ? '✓ copiado' : 'copiar'}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 text-xs font-mono p-4 overflow-x-auto leading-relaxed whitespace-pre">
        {codigo}
      </pre>
    </div>
  )
}

export default function OnboardingProva({ prova, intro, onIniciar, iniciando }: Props) {
  const [topicosExpandidos, setTopicosExpandidos] = useState<Set<number>>(new Set([0]))

  function toggleTopico(i: number) {
    setTopicosExpandidos(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function expandirTodos() {
    setTopicosExpandidos(new Set(intro.topicos.map((_, i) => i)))
  }

  function recolherTodos() {
    setTopicosExpandidos(new Set())
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-gray-900">

      {/* Hero */}
      <div className="px-6 pt-12 pb-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-800/60 border border-indigo-600/40 text-indigo-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <span>📚</span> Revisão de Conteúdo
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
          {prova.titulo}
        </h1>
        <p className="text-indigo-300 text-sm sm:text-base mb-6">{intro.subtitulo}</p>

        <div className="flex items-center justify-center gap-6 text-sm text-indigo-300 mb-8">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            {prova.questoes.length} questões
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            {prova.totalPontos} pontos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            {intro.topicos.length} tópicos para revisar
          </span>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl px-5 py-4 text-left">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">💡 Dica do professor</p>
          <p className="text-amber-100 text-sm leading-relaxed">{intro.dica}</p>
        </div>
      </div>

      {/* Topicos */}
      <div className="max-w-3xl mx-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Tópicos de Revisão</h2>
          <div className="flex gap-3 text-xs">
            <button onClick={expandirTodos} className="text-indigo-300 hover:text-white transition">
              expandir todos
            </button>
            <span className="text-indigo-600">·</span>
            <button onClick={recolherTodos} className="text-indigo-300 hover:text-white transition">
              recolher
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {intro.topicos.map((topico, i) => {
            const aberto = topicosExpandidos.has(i)
            return (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleTopico(i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{topico.icone}</span>
                    <span className="text-white font-medium text-sm">{topico.titulo}</span>
                  </div>
                  <span className={`text-indigo-400 text-xs transition-transform ${aberto ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>

                {aberto && (
                  <div className="px-5 pb-5 border-t border-white/10">
                    <p className="text-indigo-200 text-sm leading-relaxed mt-4 mb-4">
                      {topico.descricao}
                    </p>

                    {topico.pontos.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {topico.pontos.map((ponto, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-gray-300">
                            <span className="text-indigo-400 mt-0.5 shrink-0">›</span>
                            {ponto}
                          </li>
                        ))}
                      </ul>
                    )}

                    {topico.exemplo && (
                      <div>
                        <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
                          Exemplo de sintaxe
                        </p>
                        <BlocoCodigoIntro
                          codigo={topico.exemplo.codigo}
                          linguagem={topico.exemplo.linguagem}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-8 pb-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            Revise os tópicos acima antes de começar.
            <br className="hidden sm:block" />
            <span className="text-gray-500">Após iniciar, o cronômetro começa.</span>
          </p>
          <button
            onClick={onIniciar}
            disabled={iniciando}
            className="shrink-0 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-base transition shadow-lg shadow-indigo-900/50 flex items-center gap-3"
          >
            {iniciando ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Iniciando...
              </>
            ) : (
              <>
                Começar Prova
                <span className="text-lg">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
