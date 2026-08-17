'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { onAuthChange, buscarPerfil, signOut } from '@/services/firebase/auth'
import { UserProfile } from '@/types'

interface AuthContextValue {
  user: User | null
  perfil: UserProfile | null
  carregando: boolean
  sair: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  perfil: null,
  carregando: true,
  sair: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<UserProfile | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u)
      if (u) {
        const p = await buscarPerfil(u.uid)
        setPerfil(p)
      } else {
        setPerfil(null)
      }
      setCarregando(false)
    })
    return unsub
  }, [])

  async function sair() {
    await signOut()
    setUser(null)
    setPerfil(null)
  }

  return (
    <AuthContext.Provider value={{ user, perfil, carregando, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
