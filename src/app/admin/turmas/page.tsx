'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { listarTurmasProfessor, criarTurma, excluirTurma } from '@/services/firebase/firestore'
import { Turma } from '@/types'
import Link from 'next/link'

export default function TurmasPage() {
  const { perfil } = useAuth()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [carregando, setCarregando] = useState(true)
  const [criando, setCriando] = useState(false)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!perfil) return
    carregar()
  }, [perfil])

  async function carregar() {
    if (!perfil) return
    setCarregando(true)
    const ts = await listarTurmasProfessor(perfil.uid)
    setTurmas(ts)
    setCarregando(false)
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    if (!perfil) return
    setErro('')
    setSalvando(true)
    try {
      const nova = await criarTurma(nome, descricao, perfil.uid, perfil.nome)
      setTurmas(prev => [nova, ...prev])
      setNome('')
      setDescricao('')
      setCriando(false)
    } catch {
      setErro('Erro ao criar turma. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleExcluir(id: string, nomeTurma: string) {
    if (!confirm(`Excluir a turma "${nomeTurma}"? Esta ação não pode ser desfeita.`)) return
    await excluirTurma(id)
    setTurmas(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-500 mt-1">{turmas.length} turma(s) cadastrada(s)</p>
        </div>
        <button
          onClick={() => setCriando(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition"
        >
          + Nova Turma
        </button>
      </div>

      {/* Create form */}
      {criando && (
        <div className="bg-white border border-indigo-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Nova Turma</h2>
          {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}
          <form onSubmit={handleCriar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da turma *</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                placeholder="ex: BD 2025/1 - Noturno"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
              <textarea
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                rows={2}
                placeholder="Disciplina, período, observações..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={salvando}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition"
              >
                {salvando ? 'Criando...' : 'Criar Turma'}
              </button>
              <button type="button" onClick={() => { setCriando(false); setErro('') }}
                className="border border-gray-300 px-5 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {carregando ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : turmas.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🏫</p>
          <p className="font-medium">Nenhuma turma ainda</p>
          <p className="text-sm mt-1">Clique em "+ Nova Turma" para começar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {turmas.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{t.nome}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {t.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  {t.descricao && <p className="text-sm text-gray-500 mb-3">{t.descricao}</p>}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>👥 {t.alunosIds.length} aluno(s)</span>
                    <span>
                      Código: <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{t.codigo}</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/admin/turmas/${t.id}`}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                  >
                    Gerenciar
                  </Link>
                  <button
                    onClick={() => handleExcluir(t.id, t.nome)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
