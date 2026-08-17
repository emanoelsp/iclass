'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/turmas', label: 'Turmas', icon: '🏫' },
  { href: '/admin/provas', label: 'Provas', icon: '📋' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, perfil, carregando, sair } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!carregando && (!user || perfil?.role !== 'professor')) {
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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">iC</span>
            <div>
              <p className="font-bold text-sm">iClass</p>
              <p className="text-indigo-300 text-xs">Painel do Professor</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                ${pathname === item.href ? 'bg-white/15 text-white' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}
              `}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-indigo-800">
          <div className="px-2 py-2 mb-2">
            <p className="text-xs text-indigo-300 font-medium truncate">{perfil.nome}</p>
            <p className="text-xs text-indigo-400 truncate">{perfil.email}</p>
          </div>
          <button
            onClick={sair}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-indigo-300 hover:bg-white/10 hover:text-white transition"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
