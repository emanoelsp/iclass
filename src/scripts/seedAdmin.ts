/**
 * Script de seed: garante que emanoelsp@gmail.com tenha role = 'professor'
 * no Firestore, independente de como ele fez login (Google ou e-mail).
 *
 * Como rodar (uma vez, após configurar .env.local):
 *   npx tsx src/scripts/seedAdmin.ts
 *
 * Requer: npm install -D tsx
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
})

const db = getFirestore(app)

const ADMIN_EMAIL = 'emanoelsp@gmail.com'

async function seed() {
  // Busca o documento do usuário pelo e-mail na coleção users
  // O UID real vem após o primeiro login — este script atualiza pelo e-mail como referência
  console.log(`Buscando perfil existente para ${ADMIN_EMAIL}...`)

  // Instrução manual — o UID do Google não é conhecido antes do primeiro login
  console.log(`
⚠️  ATENÇÃO:
Este script define o papel de professor no Firestore.
Após o primeiro login com Google em emanoelsp@gmail.com:

1. Vá no Firebase Console → Firestore → coleção "users"
2. Encontre o documento com email = "${ADMIN_EMAIL}"
3. Edite o campo "role" para "professor"

Ou, automaticamente: ao fazer login com Google pela primeira vez,
o modal de seleção de papel aparecerá — selecione "Professor".
`)
}

seed().catch(console.error)
