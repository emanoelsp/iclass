'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { listarTurmasAluno, buscarTurmaPorCodigo, entrarNaTurma } from '@/services/firebase/firestore'
import { Turma } from '@/types'
import Link from 'next/link'

export default function AlunoHome() {
  const { perfil } = useAuth()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [carregando, setCarregando] = useState(true)
  const [codigo, setCodigo] = useState('')
  const [entrando, setEntrando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (!perfil) return
    listarTurmasAluno(perfil.uid)
      .then(setTurmas)
      .finally(() => setCarregando(false))
  }, [perfil])

  async function handleEntrar(e: React.FormEvent) {
    e.preventDefault()
    if (!perfil) return
    setErro('')
    setSucesso('')
    setEntrando(true)
    try {
      const turma = await buscarTurmaPorCodigo(codigo.trim().toUpperCase())
      if (!turma) { setErro('Código de turma não encontrado.'); return }
      if (turma.alunosIds.includes(perfil.uid)) { setErro('Você já faz parte desta turma.'); return }
      await entrarNaTurma(turma.id, perfil.uid)
      setTurmas(prev => [...prev, { ...turma, alunosIds: [...turma.alunosIds, perfil.uid] }])
      setSucesso(`Você entrou na turma "${turma.nome}"!`)
      setCodigo('')
    } catch {
      setErro('Erro ao entrar na turma. Tente novamente.')
    } finally {
      setEntrando(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {perfil?.nome?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Suas turmas e provas disponíveis</p>
      </div>

      {/* Entrar na turma */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-1">Entrar em uma turma</h2>
        <p className="text-sm text-gray-500 mb-4">Digite o código fornecido pelo seu professor</p>

        {erro && <p className="text-red-600 text-sm mb-3 bg-red-50 rounded px-3 py-2">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm mb-3 bg-green-50 rounded px-3 py-2">{sucesso}</p>}

        <form onSubmit={handleEntrar} className="flex gap-3">
          <input
            type="text"
            value={codigo}
            onChange={e => setCodigo(e.target.value.toUpperCase())}
            placeholder="CÓDIGO"
            maxLength={6}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 w-36 tracking-widest text-center"
          />
          <button type="submit" disabled={entrando || !codigo}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">
            {entrando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      {/* Turmas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Minhas Turmas</h2>
        {carregando ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : turmas.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
            <p className="text-4xl mb-3">📚</p>
            <p className="font-medium">Nenhuma turma ainda</p>
            <p className="text-sm mt-1">Digite o código da sua turma acima para entrar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {turmas.map(t => (
              <Link key={t.id} href={`/aluno/turma/${t.id}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-400 hover:shadow-md transition group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-lg group-hover:bg-indigo-200 transition">
                    {t.nome.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition">{t.nome}</h3>
                    {t.descricao && <p className="text-sm text-gray-500 mt-0.5">{t.descricao}</p>}
                    <p className="text-xs text-gray-400 mt-2">Professor: {t.professorNome}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
