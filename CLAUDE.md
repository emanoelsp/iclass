# Quiz Platform - Next.js, Firebase & Vitest

## Contexto do Projeto
Este projeto é uma plataforma modular de aplicação e correção de provas interativas para turmas acadêmicas. O sistema é dividido em duas visões principais (Professor/Admin e Aluno) e utiliza a stack Next.js (App Router), Tailwind CSS, Firebase (Auth, Firestore, Rules) e testes com Vitest [11].

## Comandos de Desenvolvimento [9]
- **Instalar dependências**: `npm install` ou `bun install`
- **Executar servidor de desenvolvimento**: `npm run dev`
- **Executar testes automatizados (Vitest)**: `npm run test` ou `npx vitest`
- **Executar testes em modo watch**: `npx vitest watch`
- **Linter/Formatador**: `npm run lint` ou `npm run format`

## Diretrizes de Arquitetura e SOLID [9]
- **Modularização de Serviços (S.O.L.ID.)**:
  - **Single Responsibility (SRP)**: Isolar a camada de comunicação do Firebase em serviços puros de infraestrutura (`src/services/firebase/`) e a lógica de negócios em hooks customizados (`src/hooks/`).
  - **Dependency Inversion (DIP)**: Componentes React nunca devem instanciar o SDK do Firebase diretamente. Utilize injeção de dependências ou adapte serviços por meio de contratos/interfaces de TypeScript.
- **Camada de Provas (Extensível - OCP)**:
  - Componentes de questões (Preencher campos, completar código, relacionar colunas) devem herdar de uma interface comum de renderização `QuestionProps` e emitir o estado da resposta por meio de um callback padronizado `onAnswerChange`.

## Regras de Deploy (Vercel) [9]
- Mantenha a configuração padrão do Next.js sem dependências globais.
- Utilize variáveis de ambiente estritas do Firebase no Vercel (Auth, API Key, Project ID).
- Sempre rode a suíte de testes do Vitest e o build antes de confirmar uma entrega ou pull request [11].
