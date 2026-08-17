'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { listarProvasProfessor, salvarProvaComId } from '@/services/firebase/firestore'
import { Prova } from '@/types'
import { questoesProva1, prova1Meta } from '@/data/prova1'
import { questoesProva2, prova2Meta } from '@/data/prova2'
import { questoesProva3, prova3Meta } from '@/data/prova3'
import { questoesProva4, prova4Meta } from '@/data/prova4'

const PROVAS_PREDEFINIDAS = [
  { meta: prova1Meta, questoes: questoesProva1 },
  { meta: prova2Meta, questoes: questoesProva2 },
  { meta: prova3Meta, questoes: questoesProva3 },
  { meta: prova4Meta, questoes: questoesProva4 },
]

export default function ProvasPage() {
  const { perfil } = useAuth()
  const [minhasProvas, setMinhasProvas] = useState<Prova[]>([])
  const [carregando, setCarregando] = useState(true)
  const [importando, setImportando] = useState<string | null>(null)

  useEffect(() => {
    if (!perfil) return
    listarProvasProfessor(perfil.uid)
      .then(setMinhasProvas)
      .finally(() => setCarregando(false))
  }, [perfil])

  async function handleImportar(index: number) {
    if (!perfil) return
    const p = PROVAS_PREDEFINIDAS[index]
    const totalPontos = p.questoes.reduce((s, q) => s + q.pontos, 0)
    setImportando(p.meta.id)
    await salvarProvaComId({
      id: p.meta.id,
      titulo: p.meta.titulo,
      descricao: p.meta.descricao,
      assunto: p.meta.assunto,
      professorId: perfil.uid,
      questoes: p.questoes,
      totalPontos,
    })
    const provas = await listarProvasProfessor(perfil.uid)
    setMinhasProvas(provas)
    setImportando(null)
  }

  const jaImportadas = new Set(minhasProvas.map(p => p.id))

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Banco de Provas</h1>
        <p className="text-gray-500 mt-1">Importe as provas pré-configuradas e associe-as às suas turmas</p>
      </div>

      {/* Predefined provas */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Provas Disponíveis</h2>
        <div className="grid grid-cols-1 gap-4">
          {PROVAS_PREDEFINIDAS.map((p, i) => {
            const jaImportada = jaImportadas.has(p.meta.id)
            const totalPts = p.questoes.reduce((s, q) => s + q.pontos, 0)
            return (
              <div key={p.meta.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-800">{p.meta.titulo}</h3>
                      {jaImportada && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Importada</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{p.meta.descricao}</p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>📝 {p.questoes.length} questões</span>
                      <span>⭐ {totalPts} pontos</span>
                      <span>🏷️ {p.meta.assunto}</span>
                    </div>
                    {/* Question type breakdown */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {[...new Set(p.questoes.map(q => q.type))].map(type => {
                        const count = p.questoes.filter(q => q.type === type).length
                        const colors: Record<string, string> = {
                          'fill-blank': 'bg-violet-50 text-violet-600',
                          'code-completion': 'bg-gray-100 text-gray-600',
                          'match-columns': 'bg-teal-50 text-teal-600',
                          'drag-order': 'bg-orange-50 text-orange-600',
                          'scenario-trace': 'bg-blue-50 text-blue-600',
                          'error-detection': 'bg-red-50 text-red-600',
                        }
                        return (
                          <span key={type} className={`text-xs px-2 py-0.5 rounded-full ${colors[type] ?? 'bg-gray-100 text-gray-500'}`}>
                            {count}× {type.replace('-', ' ')}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleImportar(i)}
                    disabled={importando === p.meta.id}
                    className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition
                      ${jaImportada
                        ? 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      } disabled:opacity-60`}
                  >
                    {importando === p.meta.id ? 'Importando...' : jaImportada ? 'Reimportar' : 'Importar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* My provas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Minhas Provas Importadas</h2>
        {carregando ? (
          <div className="flex justify-center py-8">
            <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : minhasProvas.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
            <p>Nenhuma prova importada ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {minhasProvas.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{p.titulo}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.questoes.length} questões · {p.totalPontos} pontos</p>
                </div>
                <span className="text-xs text-gray-400">Associe às turmas em Turmas → Gerenciar</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
