'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { listarProvasDaTurma, buscarProva, buscarSubmissaoAtiva } from '@/services/firebase/firestore'
import { TurmaProva, Prova, Submissao } from '@/types'
import { db } from '@/lib/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { Turma } from '@/types'
import Link from 'next/link'

interface ProvaComEstado {
  tp: TurmaProva
  prova: Prova | null
  submissao: Submissao | null
}

export default function TurmaAlunoPage() {
  const params = useParams()
  const turmaId = params.turmaId as string
  const { perfil } = useAuth()

  const [turma, setTurma] = useState<Turma | null>(null)
  const [provasComEstado, setProvasComEstado] = useState<ProvaComEstado[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!perfil) return
    async function carregar() {
      const [snapTurma, tps] = await Promise.all([
        getDoc(doc(db, 'turmas', turmaId)),
        listarProvasDaTurma(turmaId),
      ])
      setTurma(snapTurma.exists() ? { id: snapTurma.id, ...snapTurma.data() } as Turma : null)

      const lista: ProvaComEstado[] = await Promise.all(
        tps.map(async tp => {
          const [prova, submissao] = await Promise.all([
            buscarProva(tp.provaId),
            perfil ? buscarSubmissaoAtiva(perfil.uid, tp.provaId, turmaId) : null,
          ])
          return { tp, prova, submissao }
        })
      )
      setProvasComEstado(lista)
      setCarregando(false)
    }
    carregar()
  }, [turmaId, perfil])

  if (carregando) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!turma) return <div className="text-gray-500">Turma não encontrada.</div>

  const liberadas = provasComEstado.filter(p => p.tp.liberada)
  const bloqueadas = provasComEstado.filter(p => !p.tp.liberada)

  return (
    <div>
      <div className="mb-6">
        <Link href="/aluno" className="text-sm text-indigo-600 hover:underline">← Minhas Turmas</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{turma.nome}</h1>
        <p className="text-gray-500 text-sm mt-1">Professor: {turma.professorNome}</p>
      </div>

      {/* Provas liberadas */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Provas Disponíveis</h2>
        {liberadas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-400">
            <p className="text-3xl mb-2">⏳</p>
            <p>Nenhuma prova liberada pelo professor ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {liberadas.map(({ tp, prova, submissao }) => {
              const concluida = submissao?.status === 'submetida' || submissao?.status === 'corrigida'
              const emAndamento = submissao?.status === 'em_andamento'
              return (
                <div key={tp.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{tp.provaTitulo}</h3>
                      {prova && (
                        <p className="text-sm text-gray-500 mt-1">{prova.descricao}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        {prova && <span>📝 {prova.questoes.length} questões</span>}
                        {prova && <span>⭐ {prova.totalPontos} pontos</span>}
                        {tp.tempoLimiteMinutos && <span>⏱ {tp.tempoLimiteMinutos} min</span>}
                      </div>
                      {concluida && submissao && (
                        <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                          <span className="text-green-700 font-semibold">
                            Nota: {submissao.nota} / {submissao.notaMaxima} ({submissao.percentual}%)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {concluida ? (
                        <Link href={`/aluno/prova/${tp.provaId}?turma=${turmaId}&resultado=1`}
                          className="inline-block px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold hover:bg-green-100 transition">
                          Ver Resultado
                        </Link>
                      ) : emAndamento ? (
                        <Link href={`/aluno/prova/${tp.provaId}?turma=${turmaId}`}
                          className="inline-block px-5 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-semibold hover:bg-amber-100 transition">
                          Continuar Prova
                        </Link>
                      ) : (
                        <Link href={`/aluno/prova/${tp.provaId}?turma=${turmaId}`}
                          className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                          Iniciar Prova
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Provas bloqueadas */}
      {bloqueadas.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-gray-400">Provas Ainda Não Liberadas</h2>
          <div className="space-y-3">
            {bloqueadas.map(({ tp }) => (
              <div key={tp.id} className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-3 opacity-60">
                <span className="text-gray-400">🔒</span>
                <span className="text-gray-500 font-medium">{tp.provaTitulo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
