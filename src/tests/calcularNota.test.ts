import { describe, it, expect } from 'vitest'
import { FillBlankQuestion, ScenarioTraceQuestion, ErrorDetectionQuestion, QuestionAnswer } from '@/types'

function calcularNotaFillBlank(q: FillBlankQuestion, resp: Record<string, string>): number {
  const certas = q.blanks.filter(b => {
    const v = resp[b.id] ?? ''
    return b.caseSensitive ? v.trim() === b.answer.trim() : v.toLowerCase().trim() === b.answer.toLowerCase().trim()
  })
  return Math.round((certas.length / q.blanks.length) * q.pontos * 10) / 10
}

describe('Correção FillBlank', () => {
  const q: FillBlankQuestion = {
    id: 'test_q1',
    type: 'fill-blank',
    pontos: 3,
    enunciado: 'Teste',
    template: '{{blank_1}} {{blank_2}}',
    blanks: [
      { id: 'blank_1', answer: 'SAVEPOINT', caseSensitive: false },
      { id: 'blank_2', answer: 'ROLLBACK', caseSensitive: false },
    ],
  }

  it('100% correto retorna pontuação total', () => {
    expect(calcularNotaFillBlank(q, { blank_1: 'savepoint', blank_2: 'rollback' })).toBe(3)
  })

  it('50% correto retorna metade dos pontos', () => {
    expect(calcularNotaFillBlank(q, { blank_1: 'savepoint', blank_2: 'errado' })).toBe(1.5)
  })

  it('0% correto retorna 0', () => {
    expect(calcularNotaFillBlank(q, { blank_1: 'errado', blank_2: 'errado' })).toBe(0)
  })

  it('case insensitive funciona corretamente', () => {
    expect(calcularNotaFillBlank(q, { blank_1: 'SAVEPOINT', blank_2: 'rollback' })).toBe(3)
  })
})

describe('Correção ScenarioTrace', () => {
  const q: ScenarioTraceQuestion = {
    id: 'test_q2',
    type: 'scenario-trace',
    pontos: 3,
    enunciado: 'Trace o trigger',
    language: 'sql',
    contexto: 'INSERT INTO movimentacoes...',
    subQuestions: [
      { id: 'sq1', label: 'Valor de NEW.valor_operacao?', answer: '125.25', tipo: 'number' },
      { id: 'sq2', label: 'Novo saldo?', answer: '325.25', tipo: 'number' },
      { id: 'sq3', label: 'OLD existe em INSERT?', answer: 'null', tipo: 'text' },
    ],
  }

  function pontos(resp: Record<string, string>): number {
    const certas = q.subQuestions.filter(sq => resp[sq.id]?.toLowerCase().trim() === sq.answer.toLowerCase())
    return Math.round((certas.length / q.subQuestions.length) * q.pontos * 10) / 10
  }

  it('todas corretas retorna pontuação total', () => {
    expect(pontos({ sq1: '125.25', sq2: '325.25', sq3: 'null' })).toBe(3)
  })

  it('nenhuma correta retorna 0', () => {
    expect(pontos({ sq1: '200', sq2: '200', sq3: 'OLD existe' })).toBe(0)
  })
})

describe('Correção ErrorDetection', () => {
  const q: ErrorDetectionQuestion = {
    id: 'test_q3',
    type: 'error-detection',
    pontos: 2,
    enunciado: 'Encontre o erro',
    language: 'sql',
    codeLines: ['BEGIN', 'SELECT NEW.id FROM funcionarios;', 'END;'],
    errorLineIndex: 1,
    options: [
      { id: 'a', text: 'Correto', correct: true },
      { id: 'b', text: 'Errado', correct: false },
    ],
  }

  function pontos(selected: string): number {
    const correta = q.options.find(o => o.correct)
    return correta?.id === selected ? q.pontos : 0
  }

  it('opção correta recebe pontuação total', () => {
    expect(pontos('a')).toBe(2)
  })

  it('opção errada recebe 0', () => {
    expect(pontos('b')).toBe(0)
  })
})
