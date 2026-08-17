'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { user, perfil, carregando } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (carregando) return
    if (!user) { router.replace('/login'); return }
    if (perfil?.role === 'professor') router.replace('/admin')
    else router.replace('/aluno')
  }, [user, perfil, carregando, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-indigo-700 font-medium">Carregando iClass...</p>
      </div>
    </div>
  )
}
