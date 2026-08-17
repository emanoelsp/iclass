# Estrutura de Código SOLID Esperada (Arquitetura)

## Camada de Serviços (Services)

Separe os métodos do Firebase em arquivos puramente lógicos e tipados:

- `src/services/firebase/auth.ts`: Lógica de autenticação e escopo de sessões.
- `src/services/firebase/firestore.ts`: Abstração de CRUD de turmas, provas e notas.

## Camada de Componentes de Questões

Utilize herança de interfaces typescript para garantir o comportamento padrão.
Sempre crie testes unitários para a lógica de validação de cada tipo de questão utilizando o Vitest (`vitest.config.ts`).

---

## 5. Checklist de Verificação de Qualidade (Definição de Pronto)

Antes de declarar uma tarefa concluída, confirme:

- Os serviços Firebase estão totalmente isolados e desacoplados do JSX?
- Todos os tipos de questões foram validados com testes unitários em Vitest (`npm run test`)?
- As regras de segurança (`firestore.rules`) cobrem o cenário onde Alunos só leem provas de suas turmas e não editam notas?
- A responsividade da UI (Tailwind) está adaptada para mobile e desktop?

---

## Como usar a Skill no seu Fluxo de Trabalho Diário

Uma vez criada a estrutura de arquivos nas pastas do seu projeto, você poderá utilizar o Claude Code de forma totalmente otimizada:

1. **Abra o terminal do seu projeto** e inicie o Claude Code:
   ```bash
   claude
   ```

2. Execute um comando explícito ou use linguagem natural para delegar a criação do projeto base:
   ```
   "Claude, inicialize a estrutura base da nossa plataforma de provas Next.js + Firebase usando as regras da nossa skill customizada e do CLAUDE.md"
   ```

3. O Claude irá:
   - Ler o arquivo de contexto `CLAUDE.md`
   - Identificar a skill `quiz-platform-builder` por meio da descrição no YAML
   - Carregar as diretrizes de código limpo de forma sob demanda
   - Criar os arquivos de serviços modulares e testes necessários
