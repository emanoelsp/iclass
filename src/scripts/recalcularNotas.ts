/**
 * Recalcula as notas de todas as submissões já entregues,
 * aplicando normalização de espaços na comparação de respostas.
 *
 * Como rodar:
 *   npx tsx src/scripts/recalcularNotas.ts
 *
 * Pré-requisito: arquivo .env.local com as variáveis NEXT_PUBLIC_FIREBASE_*
 */
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore'
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

// ── Mesma lógica da page.tsx ──────────────────────────────────────────────────

function normalizeTexto(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

type CodeGap = { id: string; answer: string; width: number; hint?: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calcularNota(questoes: any[], respostas: any[]): number {
  let total = 0
  for (const q of questoes) {
    const resp = respostas.find((r: any) => r.questionId === q.id)
    if (!resp) continue

    if (q.type === 'fill-blank') {
      const vals = resp.value as Record<string, string>
      const certas = q.blanks.filter((b: any) => {
        const v = normalizeTexto(vals[b.id] ?? '')
        const a = normalizeTexto(b.answer)
        return b.caseSensitive ? v === a : v.toLowerCase() === a.toLowerCase()
      })
      total += (certas.length / q.blanks.length) * q.pontos
    } else if (q.type === 'code-completion') {
      const gaps = q.codeLines.filter((l: any): l is CodeGap => typeof l === 'object')
      const vals = resp.value as Record<string, string>
      const certas = gaps.filter((g: CodeGap) =>
        normalizeTexto(vals[g.id] ?? '').toLowerCase() === normalizeTexto(g.answer).toLowerCase()
      )
      total += (certas.length / gaps.length) * q.pontos
    } else if (q.type === 'match-columns') {
      const vals = resp.value as Record<string, string>
      const certas = Object.entries(q.correctMatches as Record<string, string>).filter(
        ([aId, bId]) => vals[aId] === bId
      )
      total += (certas.length / q.columnA.length) * q.pontos
    } else if (q.type === 'drag-order') {
      const order = resp.value as string[]
      const certas = (q.correctOrder as string[]).filter((id, i) => order[i] === id)
      total += (certas.length / q.correctOrder.length) * q.pontos
    } else if (q.type === 'scenario-trace') {
      const vals = resp.value as Record<string, string>
      const certas = q.subQuestions.filter((sq: any) =>
        normalizeTexto(vals[sq.id] ?? '').toLowerCase() === normalizeTexto(sq.answer).toLowerCase()
      )
      total += (certas.length / q.subQuestions.length) * q.pontos
    } else if (q.type === 'error-detection') {
      const vals = resp.value as Record<string, string>
      const correta = q.options.find((o: any) => o.correct)
      if (correta && vals.selected === correta.id) total += q.pontos
    }
  }
  return Math.round(total * 10) / 10
}

// ── Script ────────────────────────────────────────────────────────────────────

async function recalcular() {
  console.log('Buscando submissões entregues...')

  const q = query(
    collection(db, 'submissoes'),
    where('status', 'in', ['submetida', 'corrigida'])
  )
  const snap = await getDocs(q)

  if (snap.empty) {
    console.log('Nenhuma submissão encontrada.')
    return
  }

  console.log(`Encontradas ${snap.docs.length} submissões. Processando...\n`)

  const provaCache: Record<string, any> = {}
  let atualizadas = 0
  let semAlteracao = 0
  let erros = 0

  for (const docSnap of snap.docs) {
    const sub = docSnap.data()
    const subId = docSnap.id

    try {
      // Buscar prova (com cache)
      if (!provaCache[sub.provaId]) {
        const provaSnap = await getDoc(doc(db, 'provas', sub.provaId))
        if (!provaSnap.exists()) {
          console.warn(`  [AVISO] Prova ${sub.provaId} não encontrada para submissão ${subId}`)
          erros++
          continue
        }
        provaCache[sub.provaId] = provaSnap.data()
      }

      const prova = provaCache[sub.provaId]
      const notaAntiga = sub.nota ?? 0
      const notaNova = calcularNota(prova.questoes, sub.respostas ?? [])

      if (Math.abs(notaNova - notaAntiga) < 0.05) {
        semAlteracao++
        continue
      }

      const percentualNovo = Math.round((notaNova / sub.notaMaxima) * 100)

      await updateDoc(doc(db, 'submissoes', subId), {
        nota: notaNova,
        percentual: percentualNovo,
      })

      atualizadas++
      console.log(
        `  ✓ ${sub.alunoNome} — ${sub.provaTitulo}\n` +
        `    Nota antiga: ${notaAntiga}  →  Nota nova: ${notaNova} / ${sub.notaMaxima} (${percentualNovo}%)`
      )
    } catch (err) {
      console.error(`  [ERRO] Submissão ${subId}:`, err)
      erros++
    }
  }

  console.log('\n─────────────────────────────────────')
  console.log(`Atualizadas:     ${atualizadas}`)
  console.log(`Sem alteração:   ${semAlteracao}`)
  console.log(`Erros:           ${erros}`)
}

recalcular().catch(console.error)
