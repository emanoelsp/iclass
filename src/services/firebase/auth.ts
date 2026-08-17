import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebaseConfig'
import { UserProfile, UserRole } from '@/types'

export async function registrar(
  nome: string,
  email: string,
  senha: string,
  role: UserRole
): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, senha)
  const profile: UserProfile = {
    uid: cred.user.uid,
    nome,
    email,
    role,
    criadoEm: Timestamp.now(),
  }
  await setDoc(doc(db, 'users', cred.user.uid), profile)
  return profile
}

export async function login(email: string, senha: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, senha)
  return cred.user
}

// Códigos de erro do Firebase que indicam que o usuário simplesmente fechou o popup
const POPUP_DISMISSED = ['popup-closed-by-user', 'popup-blocked', 'cancelled-popup-request', 'popup-timeout']

export function isPopupDismissed(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return POPUP_DISMISSED.some(code => msg.includes(code))
}

export async function loginComGoogle(): Promise<{ user: User; isNovo: boolean }> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  // Timeout de 2 minutos — evita que o app fique travado se o popup não fechar
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('popup-timeout')), 120_000)
  )

  const cred = await Promise.race([signInWithPopup(auth, provider), timeout])
  const snap = await getDoc(doc(db, 'users', cred.user.uid))
  return { user: cred.user, isNovo: !snap.exists() }
}

export async function criarPerfilGoogle(user: User, role: UserRole): Promise<UserProfile> {
  const profile: UserProfile = {
    uid: user.uid,
    nome: user.displayName ?? user.email ?? 'Usuário',
    email: user.email ?? '',
    role,
    criadoEm: Timestamp.now(),
  }
  await setDoc(doc(db, 'users', user.uid), profile)
  return profile
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export async function buscarPerfil(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
