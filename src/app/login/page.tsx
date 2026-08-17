'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, buscarPerfil, loginComGoogle, criarPerfilGoogle, isPopupDismissed } from '@/services/firebase/auth'
import { UserRole } from '@/types'
import { User } from 'firebase/auth'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

// Modal de seleção de papel para novos usuários Google
function RoleModal({
  user,
  onConfirm,
  carregando,
}: {
  user: User
  onConfirm: (role: UserRole) => void
  carregando: boolean
}) {
  const [role, setRole] = useState<UserRole>('aluno')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          {user.photoURL && (
            <img src={user.photoURL} alt="" className="w-14 h-14 rounded-full mx-auto mb-3 ring-2 ring-indigo-200" />
          )}
          <h2 className="text-lg font-bold text-gray-900">Olá, {user.displayName?.split(' ')[0]}!</h2>
          <p className="text-sm text-gray-500 mt-1">Primeira vez aqui. Qual é o seu papel?</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {(['aluno', 'professor'] as UserRole[]).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-4 rounded-xl border-2 text-sm font-semibold transition flex flex-col items-center gap-1
                ${role === r ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-indigo-300'}`}
            >
              <span className="text-2xl">{r === 'aluno' ? '👨‍🎓' : '👨‍🏫'}</span>
              <span className="capitalize">{r}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => onConfirm(role)}
          disabled={carregando}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition text-sm"
        >
          {carregando ? 'Entrando...' : 'Confirmar e entrar'}
        </button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [googleCarregando, setGoogleCarregando] = useState(false)
  const [googleUser, setGoogleUser] = useState<User | null>(null)
  const [confirmandoRole, setConfirmandoRole] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const user = await login(email, senha)
      const perfil = await buscarPerfil(user.uid)
      router.replace(perfil?.role === 'professor' ? '/admin' : '/aluno')
    } catch {
      setErro('E-mail ou senha inválidos. Verifique e tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  async function handleGoogle() {
    setErro('')
    setGoogleCarregando(true)
    try {
      const { user, isNovo } = await loginComGoogle()
      if (isNovo) {
        // Novo usuário Google — mostrar modal de seleção de papel
        setGoogleUser(user)
      } else {
        const perfil = await buscarPerfil(user.uid)
        router.replace(perfil?.role === 'professor' ? '/admin' : '/aluno')
      }
    } catch (err: unknown) {
      if (!isPopupDismissed(err)) setErro('Erro ao entrar com Google. Tente novamente.')
    } finally {
      setGoogleCarregando(false)
    }
  }

  async function handleConfirmarRole(role: UserRole) {
    if (!googleUser) return
    setConfirmandoRole(true)
    try {
      await criarPerfilGoogle(googleUser, role)
      router.replace(role === 'professor' ? '/admin' : '/aluno')
    } catch {
      setErro('Erro ao salvar perfil. Tente novamente.')
      setGoogleUser(null)
    } finally {
      setConfirmandoRole(false)
    }
  }

  return (
    <>
      {googleUser && (
        <RoleModal user={googleUser} onConfirm={handleConfirmarRole} carregando={confirmandoRole} />
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg mb-4">
              <span className="text-white text-2xl font-bold">iC</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">iClass</h1>
            <p className="text-gray-500 text-sm mt-1">Plataforma de Provas Interativas</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Entrar na sua conta</h2>

            {erro && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {erro}
              </div>
            )}

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleCarregando || carregando}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-60 mb-5"
            >
              {googleCarregando ? (
                <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {googleCarregando ? 'Aguardando Google...' : 'Continuar com Google'}
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                />
              </div>
              <button
                type="submit"
                disabled={carregando || googleCarregando}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition text-sm"
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Não tem conta?{' '}
              <Link href="/registro" className="text-indigo-600 font-semibold hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
