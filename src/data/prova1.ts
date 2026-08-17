import { Question } from '@/types'

export const questoesProva1: Question[] = [
  // ── Q1: Scenario Trace (Trigger + valores específicos do PDF) ──
  {
    id: 'p1_q1',
    type: 'scenario-trace',
    pontos: 3,
    enunciado:
      'Analise o trigger abaixo e as operações executadas na conta_corrente. Trace os valores exatos para cada campo após a execução da Operação 4 (INSERT de valor 125.25 na conta com saldo atual de 200.00).',
    language: 'sql',
    contexto: `-- Tabela conta_corrente: id, saldo_conta
-- Tabela movimentacoes: id, conta_id, valor_operacao
-- Operação 4 executada:
INSERT INTO movimentacoes (conta_id, valor_operacao) VALUES (1, 125.25);

DELIMITER $$
CREATE TRIGGER trg_atualiza_saldo
AFTER INSERT ON movimentacoes
FOR EACH ROW
BEGIN
  UPDATE conta_corrente
    SET saldo_conta = saldo_conta + NEW.valor_operacao
  WHERE id = NEW.conta_id;
END$$
DELIMITER ;`,
    subQuestions: [
      { id: 'sq1', label: 'Qual o valor de NEW.valor_operacao durante a execução do trigger?', answer: '125.25', tipo: 'number' },
      { id: 'sq2', label: 'O que retorna OLD.saldo_conta dentro de um trigger AFTER INSERT?', answer: 'null', tipo: 'text', hint: 'OLD não existe em INSERT triggers' },
      { id: 'sq3', label: 'Qual o novo saldo_conta após a Operação 4? (saldo anterior: 200.00)', answer: '325.25', tipo: 'number' },
    ],
  },

  // ── Q2: Code Completion (CREATE TRIGGER) ──
  {
    id: 'p1_q2',
    type: 'code-completion',
    pontos: 3,
    enunciado:
      'Complete o trigger que registra automaticamente em log_exclusoes cada produto deletado da tabela produtos.',
    language: 'sql',
    codeLines: [
      'DELIMITER $$',
      { id: 'g1', answer: 'CREATE TRIGGER', width: 14, hint: 'Comando para criar um trigger' },
      '  trg_log_exclusao',
      { id: 'g2', answer: 'AFTER DELETE', width: 12, hint: 'Quando o trigger dispara em relação ao DELETE' },
      '  ON produtos',
      '  FOR EACH ROW',
      'BEGIN',
      '  INSERT INTO log_exclusoes (produto_id, nome, excluido_em)',
      { id: 'g3', answer: 'VALUES (OLD.id, OLD.nome, NOW());', width: 32, hint: 'Use OLD para acessar dados do registro deletado' },
      'END$$',
      'DELIMITER ;',
    ],
  },

  // ── Q3: Error Detection (NEW em DELETE trigger) ──
  {
    id: 'p1_q3',
    type: 'error-detection',
    pontos: 2,
    enunciado:
      'Este trigger tem um erro que impede sua execução. Identifique a linha com o problema e a correção adequada.',
    language: 'sql',
    codeLines: [
      'CREATE TRIGGER trg_auditoria',
      'AFTER DELETE ON funcionarios',
      'FOR EACH ROW',
      'BEGIN',
      '  INSERT INTO auditoria (func_id, acao)',
      '  VALUES (NEW.id, "DELETADO");',
      'END;',
    ],
    errorLineIndex: 5,
    options: [
      { id: 'a', text: 'NEW.id não existe em triggers AFTER DELETE — use OLD.id', correct: true },
      { id: 'b', text: 'DELETE não suporta FOR EACH ROW', correct: false },
      { id: 'c', text: 'Falta BEGIN TRANSACTION antes do INSERT', correct: false },
      { id: 'd', text: 'AFTER DELETE deveria ser BEFORE DELETE', correct: false },
    ],
  },

  // ── Q4: Match Columns (ACID Properties) ──
  {
    id: 'p1_q4',
    type: 'match-columns',
    pontos: 4,
    enunciado: 'Relacione cada propriedade ACID com sua definição correta.',
    columnALabel: 'Propriedade',
    columnBLabel: 'Definição',
    columnA: [
      { id: 'a1', text: 'Atomicidade' },
      { id: 'a2', text: 'Consistência' },
      { id: 'a3', text: 'Isolamento' },
      { id: 'a4', text: 'Durabilidade' },
    ],
    columnB: [
      { id: 'b1', text: 'Transações simultâneas não interferem entre si' },
      { id: 'b2', text: 'Dados persistem mesmo após falha de hardware' },
      { id: 'b3', text: 'Toda a transação executa por completo ou nada é alterado' },
      { id: 'b4', text: 'O banco jamais fica em estado inválido após uma transação' },
    ],
    correctMatches: { a1: 'b3', a2: 'b4', a3: 'b1', a4: 'b2' },
  },

  // ── Q5: Drag Order (Transaction lifecycle) ──
  {
    id: 'p1_q5',
    type: 'drag-order',
    pontos: 3,
    enunciado:
      'Ordene corretamente as etapas de uma transação bancária que transfere R$500 da conta A para a conta B, garantindo consistência.',
    items: [
      { id: 'i1', text: 'START TRANSACTION;' , isCode: true },
      { id: 'i2', text: 'UPDATE contas SET saldo = saldo - 500 WHERE id = A;', isCode: true },
      { id: 'i3', text: 'UPDATE contas SET saldo = saldo + 500 WHERE id = B;', isCode: true },
      { id: 'i4', text: 'IF (SELECT saldo FROM contas WHERE id = A) < 0 THEN ROLLBACK; END IF;', isCode: true },
      { id: 'i5', text: 'COMMIT;', isCode: true },
    ],
    correctOrder: ['i1', 'i2', 'i4', 'i3', 'i5'],
  },

  // ── Q6: Fill Blank (SAVEPOINT) ──
  {
    id: 'p1_q6',
    type: 'fill-blank',
    pontos: 3,
    enunciado:
      'Complete a transação com SAVEPOINT. A operação desconto deve ser revertida individualmente se o preço final ficar abaixo de R$10.',
    template: `START TRANSACTION;
UPDATE produtos SET preco = preco * 0.9 WHERE categoria = 'eletronicos';
{{blank_1}} ponto_desconto;
UPDATE produtos SET preco = preco * 0.8 WHERE categoria = 'eletronicos';
-- Se preço < 10, reverter apenas o segundo desconto
{{blank_2}} TO ponto_desconto;
COMMIT;`,
    blanks: [
      { id: 'blank_1', answer: 'SAVEPOINT', caseSensitive: false },
      { id: 'blank_2', answer: 'ROLLBACK', caseSensitive: false },
    ],
  },

  // ── Q7: Code Completion (PROCEDURE com IN/OUT) ──
  {
    id: 'p1_q7',
    type: 'code-completion',
    pontos: 4,
    enunciado:
      'Complete a PROCEDURE que calcula o salário líquido de um funcionário (desconto de 27,5% de IRPF se salário > 4664).',
    language: 'sql',
    codeLines: [
      'DELIMITER $$',
      { id: 'g1', answer: 'CREATE PROCEDURE', width: 16 },
      '  calcular_salario_liquido(',
      '    IN salario_bruto   DECIMAL(10,2),',
      { id: 'g2', answer: 'OUT', width: 4, hint: 'Parâmetro de saída' },
      '    salario_liquido DECIMAL(10,2)',
      '  )',
      'BEGIN',
      '  IF salario_bruto > 4664 THEN',
      { id: 'g3', answer: 'SET salario_liquido = salario_bruto * 0.725;', width: 44 },
      '  ELSE',
      '    SET salario_liquido = salario_bruto;',
      '  END IF;',
      'END$$',
      'DELIMITER ;',
    ],
  },

  // ── Q8: Code Completion (CREATE FUNCTION) ──
  {
    id: 'p1_q8',
    type: 'code-completion',
    pontos: 3,
    enunciado:
      'Complete a FUNCTION que retorna a idade de um cliente com base na data de nascimento.',
    language: 'sql',
    codeLines: [
      'DELIMITER $$',
      'CREATE FUNCTION calcular_idade(data_nasc DATE)',
      { id: 'g1', answer: 'RETURNS INT', width: 11, hint: 'Tipo do valor de retorno' },
      'DETERMINISTIC',
      'BEGIN',
      '  DECLARE idade INT;',
      { id: 'g2', answer: 'SET idade = TIMESTAMPDIFF(YEAR, data_nasc, CURDATE());', width: 52 },
      { id: 'g3', answer: 'RETURN idade;', width: 13 },
      'END$$',
      'DELIMITER ;',
    ],
  },

  // ── Q9: Fill Blank (CREATE VIEW) ──
  {
    id: 'p1_q9',
    type: 'fill-blank',
    pontos: 2,
    enunciado:
      'Complete a VIEW que exibe o nome do aluno, o nome da disciplina e a nota final apenas para aprovados (nota ≥ 6).',
    template: `{{blank_1}} vw_aprovados AS
{{blank_2}} a.nome, d.nome AS disciplina, m.nota_final
FROM alunos a
JOIN matriculas m ON a.id = m.aluno_id
JOIN disciplinas d ON m.disciplina_id = d.id
{{blank_3}} m.nota_final >= 6;`,
    blanks: [
      { id: 'blank_1', answer: 'CREATE VIEW', caseSensitive: false },
      { id: 'blank_2', answer: 'SELECT', caseSensitive: false },
      { id: 'blank_3', answer: 'WHERE', caseSensitive: false },
    ],
  },

  // ── Q10: Match Columns (Comandos DTL) ──
  {
    id: 'p1_q10',
    type: 'match-columns',
    pontos: 3,
    enunciado: 'Relacione cada comando de controle de transação com seu efeito no banco de dados.',
    columnALabel: 'Comando SQL',
    columnBLabel: 'Efeito',
    columnA: [
      { id: 'c1', text: 'COMMIT' },
      { id: 'c2', text: 'ROLLBACK' },
      { id: 'c3', text: 'SAVEPOINT sp1' },
      { id: 'c4', text: 'ROLLBACK TO sp1' },
      { id: 'c5', text: 'RELEASE SAVEPOINT sp1' },
    ],
    columnB: [
      { id: 'd1', text: 'Confirma todas as alterações da transação atual permanentemente' },
      { id: 'd2', text: 'Desfaz todas as alterações desde o início da transação' },
      { id: 'd3', text: 'Cria um ponto intermediário nomeado dentro da transação' },
      { id: 'd4', text: 'Desfaz apenas as alterações após o ponto nomeado' },
      { id: 'd5', text: 'Remove o ponto intermediário sem desfazer nada' },
    ],
    correctMatches: { c1: 'd1', c2: 'd2', c3: 'd3', c4: 'd4', c5: 'd5' },
  },

  // ── Q11: Scenario Trace (BEFORE UPDATE Trigger — calcular diferença) ──────
  {
    id: 'p1_q11',
    type: 'scenario-trace',
    pontos: 3,
    enunciado:
      'Analise o trigger BEFORE UPDATE abaixo. Um funcionário com salário atual de R$3.000 recebe um UPDATE para R$4.500. Trace os valores exatos dentro do trigger.',
    language: 'sql',
    contexto: `DELIMITER $$
CREATE TRIGGER trg_auditoria_salario
BEFORE UPDATE ON funcionarios
FOR EACH ROW
BEGIN
  IF NEW.salario <> OLD.salario THEN
    INSERT INTO log_salarios (func_id, salario_anterior, salario_novo, diferenca, alterado_em)
    VALUES (OLD.id, OLD.salario, NEW.salario, NEW.salario - OLD.salario, NOW());
  END IF;
END$$
DELIMITER ;

-- Executado:
UPDATE funcionarios SET salario = 4500.00 WHERE id = 7;
-- Antes do UPDATE: funcionarios.salario = 3000.00`,
    subQuestions: [
      { id: 'sq1', label: 'Qual o valor de OLD.salario durante a execução do trigger?', answer: '3000.00', tipo: 'number' },
      { id: 'sq2', label: 'Qual o valor de NEW.salario durante a execução do trigger?', answer: '4500.00', tipo: 'number' },
      { id: 'sq3', label: 'Qual o valor da coluna "diferenca" gravada no log_salarios?', answer: '1500.00', tipo: 'number' },
      { id: 'sq4', label: 'O trigger é BEFORE ou AFTER UPDATE? Isso significa que o banco de dados ainda NÃO confirmou a alteração?', answer: 'sim', tipo: 'text', hint: 'BEFORE = executa antes de confirmar a gravação' },
    ],
  },

  // ── Q12: Code Completion (CALL procedure com OUT) ────────────────────────
  {
    id: 'p1_q12',
    type: 'code-completion',
    pontos: 3,
    enunciado:
      'Complete o código que CHAMA a procedure calcular_salario_liquido (criada anteriormente), declarando a variável de saída e exibindo o resultado.',
    language: 'sql',
    codeLines: [
      '-- Declarar variável para receber o parâmetro OUT',
      { id: 'g1', answer: 'DECLARE @resultado DECIMAL(10,2);', width: 36, hint: 'Declare uma variável do tipo DECIMAL para o parâmetro OUT' },
      '',
      '-- Chamar a procedure passando salário bruto e a variável de saída',
      { id: 'g2', answer: 'CALL calcular_salario_liquido(5500.00, @resultado);', width: 50, hint: 'Use CALL nome_procedure(param_in, @param_out)' },
      '',
      '-- Exibir o resultado',
      { id: 'g3', answer: 'SELECT @resultado AS salario_liquido;', width: 36, hint: 'SELECT para ver o valor da variável OUT' },
    ],
  },

  // ── Q13: Error Detection (FUNCTION sem RETURN) ───────────────────────────
  {
    id: 'p1_q13',
    type: 'error-detection',
    pontos: 2,
    enunciado:
      'Esta FUNCTION foi criada mas gera um erro ao ser chamada. Identifique a linha com o problema.',
    language: 'sql',
    codeLines: [
      'DELIMITER $$',
      'CREATE FUNCTION total_pedidos(cliente_id INT)',
      'RETURNS INT',
      'DETERMINISTIC',
      'BEGIN',
      '  DECLARE total INT;',
      '  SELECT COUNT(*) INTO total FROM pedidos WHERE id_cliente = cliente_id;',
      'END$$',
      'DELIMITER ;',
    ],
    errorLineIndex: 7,
    options: [
      { id: 'a', text: 'Falta a instrução RETURN total; antes de END$$ — FUNCTION sem RETURN nunca retorna valor', correct: true },
      { id: 'b', text: 'DETERMINISTIC não pode ser usado com SELECT', correct: false },
      { id: 'c', text: 'SELECT COUNT(*) INTO não é sintaxe válida no MySQL', correct: false },
      { id: 'd', text: 'Falta BEGIN TRANSACTION antes do SELECT', correct: false },
    ],
  },

  // ── Q14: Match Columns (Tipos de Trigger × Momento de disparo) ───────────
  {
    id: 'p1_q14',
    type: 'match-columns',
    pontos: 4,
    enunciado:
      'Relacione cada combinação de evento/momento de trigger com seu comportamento correto no MySQL.',
    columnALabel: 'Trigger',
    columnBLabel: 'Comportamento',
    columnA: [
      { id: 'a1', text: 'BEFORE INSERT' },
      { id: 'a2', text: 'AFTER INSERT' },
      { id: 'a3', text: 'BEFORE UPDATE' },
      { id: 'a4', text: 'AFTER DELETE' },
    ],
    columnB: [
      { id: 'b1', text: 'Executa antes da linha ser inserida — pode modificar NEW para validar ou transformar dados' },
      { id: 'b2', text: 'Executa após a inserção confirmada — ideal para sincronizar tabelas ou logs pós-criação' },
      { id: 'b3', text: 'Executa antes da atualização — permite comparar OLD e NEW e cancelar se necessário' },
      { id: 'b4', text: 'Executa após a exclusão — ideal para mover dados deletados para tabela de arquivo' },
    ],
    correctMatches: { a1: 'b1', a2: 'b2', a3: 'b3', a4: 'b4' },
  },

  // ── Q15: Drag Order (Ciclo completo: criar e usar uma VIEW com JOIN) ──────
  {
    id: 'p1_q15',
    type: 'drag-order',
    pontos: 3,
    enunciado:
      'Ordene corretamente os passos para criar e usar uma VIEW que combina dados de duas tabelas e depois a substituir com CREATE OR REPLACE VIEW.',
    items: [
      { id: 'i1', text: 'CREATE VIEW vw_pedidos_cliente AS SELECT c.nome, p.total FROM clientes c JOIN pedidos p ON c.id = p.cliente_id;', isCode: true },
      { id: 'i2', text: 'SELECT * FROM vw_pedidos_cliente WHERE total > 500;', isCode: true },
      { id: 'i3', text: 'CREATE OR REPLACE VIEW vw_pedidos_cliente AS SELECT c.nome, c.email, p.total, p.data FROM clientes c JOIN pedidos p ON c.id = p.cliente_id;', isCode: true },
      { id: 'i4', text: 'DESCRIBE vw_pedidos_cliente; -- verificar colunas da view', isCode: true },
      { id: 'i5', text: 'DROP VIEW IF EXISTS vw_pedidos_cliente; -- opcional: remover antes de recriar manualmente', isCode: true },
    ],
    correctOrder: ['i1', 'i4', 'i2', 'i3', 'i5'],
  },
]

export const prova1Meta = {
  id: 'prova-dtl-mysql',
  titulo: 'Prova 1 — DTL e Rotinas MySQL',
  descricao: 'Avaliação sobre Linguagem de Transação de Dados, Procedures, Functions, Views e Triggers no MySQL.',
  assunto: 'Banco de Dados — MySQL Avançado',
}
