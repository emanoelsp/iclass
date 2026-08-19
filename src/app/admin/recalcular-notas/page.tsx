'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  listarTodasSubmissoesEntregues,
  buscarProva,
  atualizarNotaSubmissao,
} from '@/services/firebase/firestore'
import { Question, QuestionAnswer } from '@/types'

// ── Mesma lógica de calcularNota da página de prova ─────────────────────────

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
      const gaps = q.codeLines.filter(
        (l): l is import('@/types').CodeGap => typeof l === 'object'
      )
      const vals = resp.value as Record<string, string>
      const certas = gaps.filter(
        g =>
          normalizeTexto(vals[g.id] ?? '').toLowerCase() ===
          normalizeTexto(g.answer).toLowerCase()
      )
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
      const certas = q.subQuestions.filter(
        sq =>
          normalizeTexto(vals[sq.id] ?? '').toLowerCase() ===
          normalizeTexto(sq.answer).toLowerCase()
      )
      total += (certas.length / q.subQuestions.length) * q.pontos
    } else if (q.type === 'error-detection') {
      const vals = resp.value as Record<string, string>
      const correta = q.options.find(o => o.correct)
      if (correta && vals.selected === correta.id) total += q.pontos
    }
  }
  return Math.round(total * 10) / 10
}

// ── Tipos de resultado ───────────────────────────────────────────────────────

type Alteracao = {
  alunoNome: string
  provaTitulo: string
  notaAntiga: number
  notaNova: number
  notaMaxima: number
}

type Estado = 'idle' | 'rodando' | 'concluido' | 'erro'

// ── Página ───────────────────────────────────────────────────────────────────

export default function RecalcularNotasPage() {
  const router = useRouter()
  const [estado, setEstado] = useState<Estado>('idle')
  const [progresso, setProgresso] = useState({ atual: 0, total: 0 })
  const [alteracoes, setAlteracoes] = useState<Alteracao[]>([])
  const [semAlteracao, setSemAlteracao] = useState(0)
  const [erros, setErros] = useState(0)
  const [mensagemErro, setMensagemErro] = useState('')

  async function rodar() {
    setEstado('rodando')
    setAlteracoes([])
    setSemAlteracao(0)
    setErros(0)

    try {
      const submissoes = await listarTodasSubmissoesEntregues()
      setProgresso({ atual: 0, total: submissoes.length })

      const provaCache: Record<string, Awaited<ReturnType<typeof buscarProva>>> = {}
      const novasAlteracoes: Alteracao[] = []
      let countSemAlteracao = 0
      let countErros = 0

      for (let i = 0; i < submissoes.length; i++) {
        const sub = submissoes[i]
        setProgresso({ atual: i + 1, total: submissoes.length })

        try {
          if (!provaCache[sub.provaId]) {
            provaCache[sub.provaId] = await buscarProva(sub.provaId)
          }
          const prova = provaCache[sub.provaId]
          if (!prova) { countErros++; continue }

          const notaAntiga = sub.nota ?? 0
          const notaNova = calcularNota(prova.questoes, sub.respostas ?? [])

          if (Math.abs(notaNova - notaAntiga) < 0.05) {
            countSemAlteracao++
          } else {
            await atualizarNotaSubmissao(sub.id, notaNova, sub.notaMaxima)
            novasAlteracoes.push({
              alunoNome: sub.alunoNome,
              provaTitulo: sub.provaTitulo,
              notaAntiga,
              notaNova,
              notaMaxima: sub.notaMaxima,
            })
          }
        } catch {
          countErros++
        }
      }

      setAlteracoes(novasAlteracoes)
      setSemAlteracao(countSemAlteracao)
      setErros(countErros)
      setEstado('concluido')
    } catch (e) {
      setMensagemErro(String(e))
      setEstado('erro')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <button
        onClick={() => router.push('/admin')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
      >
        ← Voltar ao painel
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Recalcular Notas</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Recalcula todas as notas já entregues aplicando a nova lógica de tolerância de espaços.
        Apenas as notas que mudarem serão atualizadas.
      </p>

      {/* Aviso */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
        <strong>Atenção:</strong> Esta operação atualiza as notas diretamente no banco de dados.
        Execute apenas uma vez.
      </div>

      {/* Botão */}
      {estado === 'idle' && (
        <button
          onClick={rodar}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition"
        >
          Iniciar Recálculo
        </button>
      )}

      {/* Progresso */}
      {estado === 'rodando' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700 font-medium">
              Processando {progresso.atual} de {progresso.total} submissões...
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: progresso.total ? `${(progresso.atual / progresso.total) * 100}%` : '0%' }}
            />
          </div>
        </div>
      )}

      {/* Resultado */}
      {estado === 'concluido' && (
        <div className="space-y-6">
          {/* Resumo */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{alteracoes.length}</p>
              <p className="text-sm text-green-600">Notas atualizadas</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-700">{semAlteracao}</p>
              <p className="text-sm text-gray-500">Sem alteração</p>
            </div>
            <div className={`${erros > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${erros > 0 ? 'text-red-700' : 'text-gray-700'}`}>{erros}</p>
              <p className="text-sm text-gray-500">Erros</p>
            </div>
          </div>

          {/* Lista de alterações */}
          {alteracoes.length > 0 ? (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3">Notas corrigidas</h2>
              <div className="space-y-2">
                {alteracoes.map((a, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{a.alunoNome}</p>
                      <p className="text-sm text-gray-500">{a.provaTitulo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 line-through">{a.notaAntiga}/{a.notaMaxima}</p>
                      <p className="font-bold text-green-700">{a.notaNova}/{a.notaMaxima}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma nota precisou ser ajustada.</p>
          )}
        </div>
      )}

      {/* Erro geral */}
      {estado === 'erro' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          <strong>Erro:</strong> {mensagemErro}
        </div>
      )}
    </div>
  )
}
