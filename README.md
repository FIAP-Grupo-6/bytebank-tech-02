# ByteBank — Fase 2

Aplicação de gerenciamento financeiro com arquitetura de **microfrontends**, deploy em cloud e autenticação real via JWT.

> FIAP Pós-Tech · Front-End Engineering · Grupo 6

---

## Visão geral da arquitetura

```
bytebank-fase2/
├── apps/
│   ├── host/           → Shell principal (porta 3002)
│   │                     Login, Cadastro, Dashboard (SSR), Cartões (SSR),
│   │                     Sobre (SSG). Proxy de /transactions/* via rewrites
│   │
│   └── transactions/   → Zona independente (porta 3001, basePath /transactions)
│                         Listagem, filtros, paginação e nova transação
│                         Lê a sessão do host via cookie compartilhado
│
├── packages/
│   ├── ui/             → DESIGN SYSTEM compartilhado: tokens (preset
│   │                     Tailwind) + componentes (Button, Input, Card...)
│   ├── types/          → Interfaces TypeScript compartilhadas
│   └── api-client/     → Funções de chamada à API (centralizadas)
│
├── CHECKLIST.md        → Mapa requisito do PDF → implementação
└── docker-compose.yml  → Orquestra API + host + transactions
```

---

## Pré-requisitos

- Node.js 18+
- npm 10+
- Docker + Docker Compose (para rodar com containers)

---

## Rodando localmente (sem Docker)

### 1. Clone e instale as dependências

```bash
git clone https://github.com/SEU-ORG/bytebank-fase2.git
cd bytebank-fase2
npm install
```

### 2. Clone e suba a API

```bash
# Em outra pasta, fora do monorepo
git clone https://github.com/israelmeinert/tech-challenge-2.git
cd tech-challenge-2
npm install
npm run dev
# API disponível em http://localhost:3000
```

### 3. Configure as variáveis de ambiente

```bash
# app transactions
cp apps/transactions/.env.example apps/transactions/.env.local

# app host
cp apps/host/.env.example apps/host/.env.local
# Edite apps/host/.env.local com os valores corretos
```

Conteúdo mínimo do `apps/host/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
TRANSACTIONS_URL=http://localhost:3001
NEXTAUTH_SECRET=qualquer-string-secreta-aqui
NEXTAUTH_URL=http://localhost:3002
```

E do `apps/transactions/.env.local` — **o secret deve ser o MESMO do host**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_SECRET=qualquer-string-secreta-aqui
```

### 4. Suba os apps

Em dois terminais separados:

```bash
# Terminal 1 — microfrontend de transações (porta 3001)
npm run dev:transactions

# Terminal 2 — host shell (porta 3002)
npm run dev:host
```

Acesse: **http://localhost:3002**

---

## Rodando com Docker Compose

> Certifique-se que a pasta `api/` existe na raiz com o conteúdo do repositório `israelmeinert/tech-challenge-2`.

```bash
# Clone a API dentro do monorepo
git clone https://github.com/israelmeinert/tech-challenge-2.git api

# Suba tudo
docker-compose up --build
```

| Serviço       | URL                    |
|---------------|------------------------|
| API           | http://localhost:3000  |
| Transactions  | http://localhost:3001  |
| Host          | http://localhost:3002  |

Para parar:
```bash
docker-compose down
```

---

## Deploy na Vercel

O deploy é feito em **dois projetos separados** na Vercel, um para cada app.

### Zona `transactions` (deploy primeiro)

1. Acesse [vercel.com](https://vercel.com) → "Add New Project"
2. Importe o repositório e configure o **Root Directory**: `apps/transactions`
3. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL` → URL da sua API em produção
   - `NEXTAUTH_SECRET` → string aleatória segura (`openssl rand -base64 32`) — **guarde-a, o host usará a MESMA**
4. Após o deploy, copie a URL gerada (ex: `https://bytebank-transactions.vercel.app`)

### App `host`

1. Crie um novo projeto na Vercel com o mesmo repositório
2. Configure o **Root Directory**: `apps/host`
3. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL` → URL da API em produção
   - `TRANSACTIONS_URL` → URL do deploy da zona `transactions` acima (usada nos rewrites, server-side)
   - `NEXTAUTH_SECRET` → **exatamente o mesmo valor usado na zona transactions** (é o que permite o SSO entre as zonas)
   - `NEXTAUTH_URL` → URL do próprio host na Vercel

> Os usuários acessam tudo pela URL do **host** — a zona de transações fica "invisível" atrás do proxy. A URL direta da zona continua funcionando para testes isolados.

---

## Funcionalidades implementadas

### Autenticação
- [x] Cadastro de usuário (`POST /user`)
- [x] Login com JWT (`POST /user/auth`)
- [x] Sessão via NextAuth com Credentials Provider
- [x] Proteção de rotas — redireciona para `/login` se não autenticado
- [x] Logout com limpeza de sessão

### Dashboard (host)
- [x] Saldo atual calculado em tempo real
- [x] Total de entradas e saídas
- [x] Gráfico de barras — evolução mensal (últimos 6 meses)
- [x] Gráfico de pizza — distribuição entradas vs saídas
- [x] Últimas 5 transações com link para listagem completa

### Transações (microfrontend)
- [x] Listagem completa do extrato
- [x] Filtro por tipo (Crédito / Débito)
- [x] Filtro por período (data início e fim)
- [x] Busca textual (origem, destino, valor)
- [x] Paginação com 10 itens por página
- [x] Modal para nova transação com validação (Zod + react-hook-form)
- [x] Campos: tipo, valor, origem, destino, anexo/observação
- [x] Integrado à API real (`POST /account/transaction`)

### Cartões
- [x] Listagem dos cartões vinculados à conta
- [x] Exibição visual estilizada com número mascarado
- [x] Status de bloqueio/ativo

### Infraestrutura
- [x] Monorepo com Turborepo
- [x] Microfrontends com **Multi-Zones** (abordagem oficial do Next.js)
- [x] Gestão de estado com **Redux Toolkit** (slices, thunks, selectors memorizados)
- [x] **SSR** no dashboard e cartões (`force-dynamic`) + **SSG** na página /sobre (`force-static`)
- [x] Acessibilidade: navegação por teclado, ARIA, foco gerenciado no modal
- [x] Docker + Docker Compose para todos os serviços
- [x] Deploy-ready para Vercel

> Consulte o **CHECKLIST.md** para o mapa completo requisito → implementação.

---

## Stack

| Categoria        | Tecnologia                                         |
|------------------|----------------------------------------------------|
| Monorepo         | Turborepo + npm workspaces                         |
| Framework        | Next.js 14 + TypeScript                            |
| Estilização      | Tailwind CSS                                       |
| Design System    | `@bytebank/ui` — tokens (preset) + componentes     |
| Autenticação     | NextAuth.js v4 (Credentials + JWT)                 |
| Estado global    | Redux Toolkit (RTK) + react-redux                  |
| Gráficos         | Recharts                                           |
| Formulários      | react-hook-form + Zod                              |
| Microfrontend    | Multi-Zones (oficial do Next.js, via rewrites)     |
| Renderização     | SSR (dashboard, cartões) + SSG (página sobre)      |
| Containerização  | Docker + Docker Compose                            |
| Deploy           | Vercel                                             |

---

## Scripts disponíveis

```bash
# Raiz do monorepo
npm run dev              # Sobe todos os apps em paralelo
npm run dev:host         # Só o host (porta 3002)
npm run dev:transactions # Só o transactions (porta 3001)
npm run build            # Build de todos os apps
npm run lint             # Lint em todos os apps
```

---

## Divisão de trabalho sugerida para o grupo

| Pessoa | Responsabilidade                                      |
|--------|-------------------------------------------------------|
| 1      | App `transactions` — listagem, filtros, paginação     |
| 2      | App `transactions` — modal de nova transação, store   |
| 3      | App `host` — login, cadastro, NextAuth                |
| 4      | App `host` — dashboard, gráficos, cartões             |
| Todos  | Docker, deploy Vercel, README, vídeo demonstrativo    |

---

## Design System compartilhado — `@bytebank/ui`

Os microfrontends precisam parecer **um único produto**. Para isso, o design system vive em um pacote próprio consumido por todas as zonas — não duplicado em cada app.

```
packages/ui/
├── tailwind-preset.js   → TOKENS: cores brand/surface, fontes.
│                          Fonte única de verdade — mudou o verde da
│                          marca aqui, todas as zonas atualizam juntas.
└── src/
    ├── Button.tsx       → variantes primary/secondary/ghost/danger,
    │                      loading integrado, foco visível
    ├── Input.tsx        → label + erro com aria-describedby automáticos
    ├── Card.tsx         → superfície padrão de conteúdo
    ├── Alert.tsx        → feedback com role="alert"
    └── Logo.tsx         → marca consistente entre zonas
```

Cada zona consome os tokens no seu `tailwind.config.ts`:

```ts
import preset from '@bytebank/ui/tailwind-preset'

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}', // Tailwind escaneia o DS
  ],
}
```

E os componentes via import normal — o mesmo `<Button>` renderiza idêntico no host e na zona de transações:

```tsx
import { Button, Input, Alert } from '@bytebank/ui'
```

> **Por que um pacote e não um microfrontend de UI?** Design system compartilhado via *pacote versionado* é dependência de **build**, não acoplamento de **runtime** — cada zona decide quando atualizar. É o padrão de mercado para consistência visual entre microfrontends (a alternativa, duplicar tokens em cada app, inevitavelmente diverge).

## Arquitetura de Microfrontends — Multi-Zones

O projeto usa **Multi-Zones**, a abordagem oficial do Next.js para microfrontends — recomendada pela equipe do Tech Challenge como o caminho mais adequado para hosts em Next.js.

> **Por que não Module Federation ou Single-SPA?** O plugin `@module-federation/nextjs-mf` não suporta o App Router (issue #2157 do module-federation/core) e entrará em fim de vida. Single-SPA conflita com o roteador do Next, exigindo orquestração manual. Multi-Zones resolve o mesmo problema — apps independentes com build e deploy separados — usando recursos nativos do framework, sem plugins experimentais.

### Como funciona

```
                    Browser (uma única origem)
                              │
                              ▼
                ┌──────────── HOST (porta 3002) ────────────┐
                │  Next.js App Router                        │
                │  /login /cadastro /dashboard /cards /sobre │
                │                                            │
                │  rewrites:                                 │
                │  /transactions/* ──── proxy ────┐          │
                └─────────────────────────────────┼──────────┘
                                                  ▼
                ┌──────── ZONA TRANSACTIONS (porta 3001) ────┐
                │  Next.js independente, basePath:           │
                │  '/transactions'                           │
                │  Listagem, filtros, paginação, modal       │
                │  Build e deploy 100% separados do host     │
                └────────────────────────────────────────────┘
```

1. O usuário acessa `/transactions` — para o browser, é a mesma origem de sempre
2. O `rewrites` do host faz **proxy server-side** da request para a zona
3. A zona usa `basePath: '/transactions'`, então **páginas e assets** dela vivem sob esse prefixo — um único rewrite cobre tudo, sem conflito com o `/_next/` do host
4. Navegação **entre** zonas usa `<a>` nativo (hard navigation); navegação **dentro** de cada zona usa `<Link>` normalmente

### Comunicação entre as zonas — SSO via cookie compartilhado

```
1. Login no host → NextAuth grava cookie de sessão (JWT cifrado com NEXTAUTH_SECRET)
2. Usuário navega para /transactions → proxy preserva os cookies (mesma origem)
3. A zona usa o MESMO NEXTAUTH_SECRET para decodificar o cookie (next-auth/jwt → decode)
4. Extrai o accessToken da API e busca os dados — sem token em query string,
   sem postMessage, sem estado global compartilhado
```

A implementação está em `apps/transactions/src/lib/session.ts`. **Requisito crítico: `NEXTAUTH_SECRET` deve ser idêntico nos dois apps.**

### O que isso garante (requisitos do desafio)

- **Independência real**: cada zona tem `package.json`, build, Docker image e deploy próprios — uma equipe pode atualizar o módulo de transações sem rebuild do host
- **Roteamento entre microfrontends**: via rewrites + convenção de basePath
- **Comunicação**: sessão compartilhada com segurança (cookie httpOnly cifrado)
- **SSR nas duas zonas**: a zona de transações também renderiza no servidor

## Licença

MIT
