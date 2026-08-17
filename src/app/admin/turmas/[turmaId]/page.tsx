'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  listarProvasDaTurma, listarProvasProfessor,
  associarProvaATurma, alterarLiberacaoProva,
  removerProvaDeturma, listarSubmissoesDaTurma,
  buscarProva,
} from '@/services/firebase/firestore'
import { TurmaProva, Prova, Submissao } from '@/types'
import { db } from '@/lib/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { Turma } from '@/types'
import Link from 'next/link'

export default function TurmaDetalhePage() {
  const params = useParams()
  const turmaId = params.turmaId as string
  const { perfil } = useAuth()

  const [turma, setTurma] = useState<Turma | null>(null)
  const [turmaProvas, setTurmaProvas] = useState<TurmaProva[]>([])
  const [minhasProvas, setMinhasProvas] = useState<Prova[]>([])
  const [submissoesPorProva, setSubmissoesPorProva] = useState<Record<string, Submissao[]>>({})
  const [carregando, setCarregando] = useState(true)
  const [adicionando, setAdicionando] = useState(false)
  const [provaIdSelecionada, setProvaIdSelecionada] = useState('')
  const [tempoLimite, setTempoLimite] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState<'provas' | 'notas'>('provas')

  const carregar = useCallback(async () => {
    if (!perfil) return
    const [snap, tps, mps] = await Promise.all([
      getDoc(doc(db, 'turmas', turmaId)),
      listarProvasDaTurma(turmaId),
      listarProvasProfessor(perfil.uid),
    ])
    setTurma(snap.exists() ? { id: snap.id, ...snap.data() } as Turma : null)
    setTurmaProvas(tps)
    setMinhasProvas(mps)

    const subs: Record<string, Submissao[]> = {}
    await Promise.all(tps.map(async tp => {
      subs[tp.provaId] = await listarSubmissoesDaTurma(turmaId, tp.provaId)
    }))
    setSubmissoesPorProva(subs)
    setCarregando(false)
  }, [turmaId, perfil])

  useEffect(() => { carregar() }, [carregar])

  async function handleAssociar(e: React.FormEvent) {
    e.preventDefault()
    if (!provaIdSelecionada) return
    setSalvando(true)
    const prova = minhasProvas.find(p => p.id === provaIdSelecionada)!
    await associarProvaATurma(turmaId, provaIdSelecionada, prova.titulo, tempoLimite ? Number(tempoLimite) : undefined)
    await carregar()
    setAdicionando(false)
    setProvaIdSelecionada('')
    setTempoLimite('')
    setSalvando(false)
  }

  async function toggleLiberacao(tp: TurmaProva) {
    await alterarLiberacaoProva(tp.id, !tp.liberada)
    setTurmaProvas(prev => prev.map(p => p.id === tp.id ? { ...p, liberada: !tp.liberada } : p))
  }

  async function handleRemover(tpId: string) {
    if (!confirm('Remover esta prova da turma?')) return
    await removerProvaDeturma(tpId)
    setTurmaProvas(prev => prev.filter(p => p.id !== tpId))
  }

  const provasJaAssociadas = new Set(turmaProvas.map(tp => tp.provaId))
  const provasDisponiveis = minhasProvas.filter(p => !provasJaAssociadas.has(p.id))

  if (carregando) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!turma) return <div className="p-8 text-gray-500">Turma não encontrada.</div>

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/turmas" className="text-sm text-indigo-600 hover:underline">← Turmas</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{turma.nome}</h1>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
          {turma.descricao && <span>{turma.descricao}</span>}
          <span>👥 {turma.alunosIds.length} aluno(s)</span>
          <span>Código: <span className="font-mono font-bold text-indigo-600">{turma.codigo}</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {(['provas', 'notas'] as const).map(aba => (
          <button key={aba} onClick={() => setAbaAtiva(aba)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition capitalize
              ${abaAtiva === aba ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {aba === 'provas' ? '📋 Provas' : '📊 Notas'}
          </button>
        ))}
      </div>

      {abaAtiva === 'provas' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setAdicionando(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition">
              + Adicionar Prova
            </button>
          </div>

          {adicionando && (
            <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Associar Prova à Turma</h3>
              <form onSubmit={handleAssociar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prova</label>
                  <select value={provaIdSelecionada} onChange={e => setProvaIdSelecionada(e.target.value)} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500">
                    <option value="">— selecione uma prova —</option>
                    {provasDisponiveis.map(p => (
                      <option key={p.id} value={p.id}>{p.titulo}</option>
                    ))}
                  </select>
                  {provasDisponiveis.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">Todas as provas já foram adicionadas. Crie novas em <Link href="/admin/provas" className="underline">Banco de Provas</Link>.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tempo limite (minutos) — opcional</label>
                  <input type="number" value={tempoLimite} onChange={e => setTempoLimite(e.target.value)} min={5}
                    placeholder="Ex: 60"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 max-w-xs" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={salvando || !provaIdSelecionada}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-5 py-2 rounded-lg text-sm transition">
                    {salvando ? 'Adicionando...' : 'Adicionar'}
                  </button>
                  <button type="button" onClick={() => setAdicionando(false)}
                    className="border border-gray-300 px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {turmaProvas.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p>Nenhuma prova associada ainda</p>
            </div>
          ) : (
            turmaProvas.map(tp => {
              const subs = submissoesPorProva[tp.provaId] ?? []
              return (
                <div key={tp.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{tp.provaTitulo}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{subs.length} submissão(ões)</span>
                        {tp.tempoLimiteMinutos && <span>⏱ {tp.tempoLimiteMinutos} min</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLiberacao(tp)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                          ${tp.liberada ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                      >
                        {tp.liberada ? '🔒 Bloquear' : '🔓 Liberar'}
                      </button>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${tp.liberada ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {tp.liberada ? 'Liberada' : 'Bloqueada'}
                      </span>
                      <button onClick={() => handleRemover(tp.id)}
                        className="text-gray-400 hover:text-red-500 transition text-sm">✕</button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {abaAtiva === 'notas' && (
        <div className="space-y-6">
          {turmaProvas.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p>Adicione provas à turma para ver as notas</p>
            </div>
          ) : (
            turmaProvas.map(tp => {
              const subs = submissoesPorProva[tp.provaId] ?? []
              const media = subs.length > 0
                ? (subs.reduce((s, sub) => s + (sub.percentual ?? 0), 0) / subs.length).toFixed(0)
                : null
              return (
                <div key={tp.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-800">{tp.provaTitulo}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{subs.length} submissão(ões)</span>
                      {media && <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">Média: {media}%</span>}
                    </div>
                  </div>
                  {subs.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-gray-400">Nenhuma submissão ainda.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-5 py-3 text-left text-gray-600 font-medium">Aluno</th>
                          <th className="px-5 py-3 text-right text-gray-600 font-medium">Nota</th>
                          <th className="px-5 py-3 text-right text-gray-600 font-medium">%</th>
                          <th className="px-5 py-3 text-right text-gray-600 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subs.sort((a, b) => (b.percentual ?? 0) - (a.percentual ?? 0)).map(sub => (
                          <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="px-5 py-3 font-medium text-gray-800">{sub.alunoNome}</td>
                            <td className="px-5 py-3 text-right text-gray-700">
                              {sub.nota !== null ? `${sub.nota} / ${sub.notaMaxima}` : '—'}
                            </td>
                            <td className="px-5 py-3 text-right">
                              {sub.percentual !== null ? (
                                <span className={`font-semibold ${sub.percentual >= 60 ? 'text-green-600' : 'text-red-500'}`}>
                                  {sub.percentual}%
                                </span>
                              ) : '—'}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium
                                ${sub.status === 'submetida' || sub.status === 'corrigida' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {sub.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
