'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { listarTurmasProfessor } from '@/services/firebase/firestore'
import { Turma } from '@/types'
import Link from 'next/link'

export default function AdminDashboard() {
  const { perfil } = useAuth()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!perfil) return
    listarTurmasProfessor(perfil.uid)
      .then(setTurmas)
      .finally(() => setCarregando(false))
  }, [perfil])

  const totalAlunos = turmas.reduce((s, t) => s + t.alunosIds.length, 0)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {perfil?.nome?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Bem-vindo ao painel do professor</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Turmas', value: turmas.length, color: 'bg-indigo-100 text-indigo-700', icon: '🏫' },
          { label: 'Alunos totais', value: totalAlunos, color: 'bg-teal-100 text-teal-700', icon: '👨‍🎓' },
          { label: 'Turmas ativas', value: turmas.filter(t => t.ativa).length, color: 'bg-green-100 text-green-700', icon: '✅' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.color}`}>
              {stat.icon}
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{carregando ? '—' : stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link href="/admin/turmas" className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-400 hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition">🏫</span>
            <div>
              <p className="font-semibold text-gray-800">Gerenciar Turmas</p>
              <p className="text-sm text-gray-500">Criar, editar e gerenciar suas turmas</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/provas" className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-400 hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-2xl group-hover:bg-violet-100 transition">📋</span>
            <div>
              <p className="font-semibold text-gray-800">Banco de Provas</p>
              <p className="text-sm text-gray-500">Ver e importar provas disponíveis</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent turmas */}
      {turmas.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Suas Turmas</h2>
          <div className="space-y-3">
            {turmas.map(t => (
              <Link
                key={t.id}
                href={`/admin/turmas/${t.id}`}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-4 hover:border-indigo-300 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm">
                    {t.nome.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.nome}</p>
                    <p className="text-sm text-gray-500">{t.alunosIds.length} alunos · Código: <span className="font-mono font-bold text-indigo-600">{t.codigo}</span></p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">Ver detalhes →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
