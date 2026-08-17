'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  const { user, perfil, carregando, sair } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!carregando && (!user || perfil?.role !== 'aluno')) {
      router.replace('/login')
    }
  }, [user, perfil, carregando, router])

  if (carregando || !perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">iC</span>
            <span className="font-bold text-gray-800">iClass</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{perfil.nome}</p>
              <p className="text-xs text-gray-400">Aluno</p>
            </div>
            <button onClick={sair} className="text-sm text-gray-400 hover:text-red-500 transition">Sair</button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
