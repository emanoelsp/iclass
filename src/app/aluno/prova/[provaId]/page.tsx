'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { buscarProva, buscarSubmissaoAtiva, iniciarSubmissao, submeterProva } from '@/services/firebase/firestore'
import { Prova, QuestionAnswer, Question, AnswerValue } from '@/types'
import QuestionRenderer from '@/components/questions/QuestionRenderer'
import OnboardingProva from '@/components/OnboardingProva'
import { introsProvas } from '@/data/introProvas'

const GABARITO_DURACAO_MS = 3 * 60 * 1000

function normalizeTexto(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

function calcularNota(questoes: Question[], respostas: QuestionAnswer[]): number {
  let total = 0
  for (const q of questoes) {
    const resp = respostas.find(r => r.questionId === q.id)
    if (!resp) continue

    if (q.type === 'fill-blank') {
      const vals = resp.value as Record<string, string>
      const certas = q.blanks.filter(b => {
        const v = normalizeTexto(vals[b.id] ?? '')
        const a = normalizeTexto(b.answer)
        return b.caseSensitive ? v === a : v.toLowerCase() === a.toLowerCase()
      })
      total += (certas.length / q.blanks.length) * q.pontos
    } else if (q.type === 'code-completion') {
      const gaps = q.codeLines.filter((l): l is import('@/types').CodeGap => typeof l === 'object')
      const vals = resp.value as Record<string, string>
      const certas = gaps.filter(g => normalizeTexto(vals[g.id] ?? '').toLowerCase() === normalizeTexto(g.answer).toLowerCase())
      total += (certas.length / gaps.length) * q.pontos
    } else if (q.type === 'match-columns') {
      const vals = resp.value as Record<string, string>
      const certas = Object.entries(q.correctMatches).filter(([aId, bId]) => vals[aId] === bId)
      total += (certas.length / q.columnA.length) * q.pontos
    } else if (q.type === 'drag-order') {
      const order = resp.value as string[]
      const certas = q.correctOrder.filter((id, i) => order[i] === id)
      total += (certas.length / q.correctOrder.length) * q.pontos
    } else if (q.type === 'scenario-trace') {
      const vals = resp.value as Record<string, string>
      const certas = q.subQuestions.filter(sq => normalizeTexto(vals[sq.id] ?? '').toLowerCase() === normalizeTexto(sq.answer).toLowerCase())
      total += (certas.length / q.subQuestions.length) * q.pontos
    } else if (q.type === 'error-detection') {
      const vals = resp.value as Record<string, string>
      const correta = q.options.find(o => o.correct)
      if (correta && vals.selected === correta.id) total += q.pontos
    }
  }
  return Math.round(total * 10) / 10
}

type Fase = 'carregando' | 'intro' | 'prova' | 'resultado'

export default function ProvaPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { perfil } = useAuth()

  const provaId = params.provaId as string
  const turmaId = searchParams.get('turma') ?? ''
  const modoResultado = searchParams.get('resultado') === '1'

  const [prova, setProva] = useState<Prova | null>(null)
  const [submissaoId, setSubmissaoId] = useState<string | null>(null)
  const [respostas, setRespostas] = useState<QuestionAnswer[]>([])
  const [fase, setFase] = useState<Fase>('carregando')
  const [submetendo, setSubmetendo] = useState(false)
  const [notaFinal, setNotaFinal] = useState<number | null>(null)
  const [iniciando, setIniciando] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [gabaritoExpiraEm, setGabaritoExpiraEm] = useState<number | null>(null)
  const [agora, setAgora] = useState(() => Date.now())

  useEffect(() => {
    if (!perfil) return
    async function init() {
      const [p, sub] = await Promise.all([
        buscarProva(provaId),
        buscarSubmissaoAtiva(perfil!.uid, provaId, turmaId),
      ])
      if (!p) { setFase('prova'); return }
      setProva(p)

      if (sub) {
        setSubmissaoId(sub.id)
        setRespostas(sub.respostas ?? [])
        if (sub.status === 'submetida' || sub.status === 'corrigida') {
          setNotaFinal(sub.nota)
          setFase('resultado')
          if (sub.submetidaEm) {
            const expira = sub.submetidaEm.toMillis() + GABARITO_DURACAO_MS
            if (Date.now() < expira) setGabaritoExpiraEm(expira)
          }
        } else {
          setFase('prova') // retomar prova em andamento — pula intro
        }
      } else if (modoResultado) {
        setFase('resultado')
      } else {
        setFase('intro') // primeira vez — mostrar revisão
      }
    }
    init()
  }, [perfil, provaId, turmaId, modoResultado])

  useEffect(() => {
    if (!gabaritoExpiraEm) return
    const id = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [gabaritoExpiraEm])

  async function handleIniciarProva() {
    if (!prova || !perfil) return
    setIniciando(true)
    const nova = await iniciarSubmissao(perfil.uid, perfil.nome, provaId, prova.titulo, turmaId, prova.totalPontos)
    setSubmissaoId(nova.id)
    setFase('prova')
    setIniciando(false)
    window.scrollTo({ top: 0 })
  }

  const handleAnswer = useCallback((answer: QuestionAnswer) => {
    setRespostas(prev => {
      const next = prev.filter(r => r.questionId !== answer.questionId)
      return [...next, answer]
    })
  }, [])

  async function handleSubmeter() {
    if (!prova || !submissaoId || !perfil) return
    if (!confirm('Tem certeza que deseja submeter a prova? Esta ação não pode ser desfeita.')) return
    setSubmetendo(true)
    const nota = calcularNota(prova.questoes, respostas)
    await submeterProva(submissaoId, respostas, nota, prova.totalPontos)
    setNotaFinal(nota)
    setFase('resultado')
    setGabaritoExpiraEm(Date.now() + GABARITO_DURACAO_MS)
    setSubmetendo(false)
    window.scrollTo({ top: 0 })
  }

  // ── Carregando ───────────────────────────────────────────────
  if (fase === 'carregando') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!prova) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Prova não encontrada.</div>
  }

  // ── Intro / Onboarding ───────────────────────────────────────
  if (fase === 'intro') {
    const intro = introsProvas[provaId]
    if (intro) {
      return (
        <OnboardingProva
          prova={prova}
          intro={intro}
          onIniciar={handleIniciarProva}
          iniciando={iniciando}
        />
      )
    }
    // Prova sem intro cadastrada — inicia direto
    handleIniciarProva()
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Prova e Resultado ────────────────────────────────────────
  const submetida = fase === 'resultado'
  const percentual = notaFinal !== null ? Math.round((notaFinal / prova.totalPontos) * 100) : null
  const respondidas = respostas.length
  const showGabarito = gabaritoExpiraEm !== null && agora < gabaritoExpiraEm
  const tempoGabaritoSeg = gabaritoExpiraEm ? Math.max(0, Math.ceil((gabaritoExpiraEm - agora) / 1000)) : 0
  const tempoGabaritoStr = `${String(Math.floor(tempoGabaritoSeg / 60)).padStart(2, '0')}:${String(tempoGabaritoSeg % 60).padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`sticky top-0 z-20 border-b ${submetida ? 'bg-green-600' : 'bg-indigo-700'} text-white`}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg">{prova.titulo}</h1>
            <p className="text-sm opacity-80">{prova.questoes.length} questões · {prova.totalPontos} pontos</p>
          </div>
          {!submetida && (
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-80">{respondidas}/{prova.questoes.length} respondidas</span>
              <button
                onClick={handleSubmeter}
                disabled={submetendo}
                className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-indigo-50 transition disabled:opacity-60"
              >
                {submetendo ? 'Enviando...' : 'Submeter Prova'}
              </button>
            </div>
          )}
          {submetida && notaFinal !== null && (
            <div className="text-right">
              <p className="text-2xl font-bold">{notaFinal} <span className="text-base font-normal opacity-80">/ {prova.totalPontos}</span></p>
              <p className="text-sm opacity-80">{percentual}% de acerto</p>
            </div>
          )}
        </div>
      </header>

      {/* Resultado banner */}
      {submetida && notaFinal !== null && (
        <div className={`${(percentual ?? 0) >= 60 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-b px-6 py-4`}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                {(percentual ?? 0) >= 60 ? '🎉 Aprovado!' : '📚 Estude mais!'} Você acertou {percentual}%
              </p>
              {showGabarito ? (
                <p className="text-sm text-gray-600 mt-0.5">
                  Gabarito disponível por <span className="font-mono font-semibold text-indigo-700">{tempoGabaritoStr}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-0.5">Tempo de revisão encerrado.</p>
              )}
            </div>
            <button onClick={() => router.push(`/aluno/turma/${turmaId}`)}
              className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Voltar à Turma
            </button>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {prova.questoes.map((q, i) => (
          <QuestionRenderer
            key={q.id}
            question={q}
            index={i}
            onAnswer={handleAnswer}
            readonly={submetida}
            previousAnswer={respostas.find(r => r.questionId === q.id)}
            showGabarito={showGabarito}
          />
        ))}

        {!submetida && (
          <div className="pt-4 text-center">
            <button
              onClick={handleSubmeter}
              disabled={submetendo}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-10 py-4 rounded-xl text-base transition shadow-lg"
            >
              {submetendo ? 'Enviando...' : '✓ Submeter Prova'}
            </button>
            <p className="text-xs text-gray-400 mt-3">Você pode submeter mesmo sem responder todas as questões</p>
          </div>
        )}
      </div>
    </div>
  )
}
