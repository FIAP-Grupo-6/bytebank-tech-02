/**
 * Mock da API do Tech Challenge 2 — só para desenvolvimento/avaliação local.
 * Zero dependências externas (usa apenas o módulo http do Node).
 * Dados ficam em memória: reiniciar o processo reseta tudo pro estado inicial.
 *
 * Contrato de rotas segue @bytebank/types (packages/types/src/index.ts).
 */

const http = require('http')
const crypto = require('crypto')

const PORT = process.env.PORT || 3000

// ─── Estado em memória ───────────────────────────────────────────────────────

const users = [
  { id: 'u1', username: 'joao.silva', email: 'joao@bytebank.com', password: 'senha123' },
]

const accounts = [{ id: 'acc1', type: 'Credit', userId: 'u1' }]

const cards = [
  {
    id: 'card1',
    accountId: 'acc1',
    type: 'Credit',
    is_blocked: false,
    number: '**** **** **** 4521',
    dueDate: '2029-08-01',
    functions: 'Crédito e débito',
    cvc: '***',
    paymentDate: '2026-07-10',
    name: 'João Silva',
  },
  {
    id: 'card2',
    accountId: 'acc1',
    type: 'Debit',
    is_blocked: false,
    number: '**** **** **** 7788',
    dueDate: '2028-03-01',
    functions: 'Débito',
    cvc: '***',
    paymentDate: null,
    name: 'João Silva',
  },
]

let transactions = [
  { id: 't1', accountId: 'acc1', type: 'Credit', value: 5200, from: 'Trabalho', to: 'Salário', date: '2026-07-01T09:00:00.000Z' },
  { id: 't2', accountId: 'acc1', type: 'Debit', value: -180.5, from: 'Alimentação', to: 'Supermercado', date: '2026-07-02T12:30:00.000Z' },
  { id: 't3', accountId: 'acc1', type: 'Debit', value: -45.9, from: 'Transporte', to: 'Uber/99', date: '2026-07-03T08:15:00.000Z' },
  { id: 't4', accountId: 'acc1', type: 'Debit', value: -1200, from: 'Moradia', to: 'Aluguel', date: '2026-07-05T10:00:00.000Z' },
  { id: 't5', accountId: 'acc1', type: 'Credit', value: 350, from: 'Investimentos', to: 'Dividendos', date: '2026-07-06T14:20:00.000Z' },
  { id: 't6', accountId: 'acc1', type: 'Debit', value: -89.9, from: 'Lazer', to: 'Streaming', date: '2026-06-28T20:00:00.000Z' },
  { id: 't7', accountId: 'acc1', type: 'Debit', value: -320, from: 'Saúde', to: 'Plano de saúde', date: '2026-06-20T11:00:00.000Z' },
  { id: 't8', accountId: 'acc1', type: 'Credit', value: 800, from: 'Trabalho', to: 'Freelance', date: '2026-06-15T16:45:00.000Z' },
  { id: 't9', accountId: 'acc1', type: 'Debit', value: -210, from: 'Vestuário', to: 'Roupas', date: '2026-06-10T13:10:00.000Z' },
  { id: 't10', accountId: 'acc1', type: 'Debit', value: -65.3, from: 'Transporte', to: 'Combustível', date: '2026-06-08T07:50:00.000Z' },
  { id: 't11', accountId: 'acc1', type: 'Credit', value: 5200, from: 'Trabalho', to: 'Salário', date: '2026-06-01T09:00:00.000Z' },
  { id: 't12', accountId: 'acc1', type: 'Debit', value: -150, from: 'Educação', to: 'Curso', date: '2026-05-22T18:30:00.000Z' },
  { id: 't13', accountId: 'acc1', type: 'Debit', value: -95.6, from: 'Alimentação', to: 'Restaurante', date: '2026-05-18T19:40:00.000Z' },
  { id: 't14', accountId: 'acc1', type: 'Credit', value: 120, from: 'Transferência recebida', to: 'Pix recebido', date: '2026-05-12T10:20:00.000Z' },
  { id: 't15', accountId: 'acc1', type: 'Debit', value: -1200, from: 'Moradia', to: 'Aluguel', date: '2026-05-05T10:00:00.000Z' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function base64url(input) {
  return Buffer.from(JSON.stringify(input)).toString('base64')
}

function issueToken(user) {
  const header = base64url({ alg: 'mock', typ: 'JWT' })
  const payload = base64url({ id: user.id, username: user.username, email: user.email })
  const signature = crypto.randomBytes(8).toString('hex')
  return `${header}.${payload}.${signature}`
}

function getUserFromAuthHeader(req) {
  const auth = req.headers['authorization'] || ''
  const token = auth.replace(/^Bearer\s+/i, '')
  if (!token) return null
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    return users.find((u) => u.id === payload.id) || null
  } catch {
    return null
  }
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  })
  if (body === undefined) {
    res.end()
  } else {
    res.end(JSON.stringify(body))
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => {
      if (!data) return resolve({})
      try {
        resolve(JSON.parse(data))
      } catch (err) {
        reject(err)
      }
    })
  })
}

// ─── Servidor ────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const path = url.pathname
  const method = req.method

  if (method === 'OPTIONS') return send(res, 204)

  try {
    // POST /user — cadastro
    if (method === 'POST' && path === '/user') {
      const payload = await readBody(req)
      if (!payload.email || !payload.password || !payload.username) {
        return send(res, 400, { message: 'Dados incompletos' })
      }
      if (users.some((u) => u.email === payload.email)) {
        return send(res, 409, { message: 'E-mail já cadastrado' })
      }
      const id = `u${users.length + 1}`
      users.push({ id, username: payload.username, email: payload.email, password: payload.password })
      accounts.push({ id: `acc${accounts.length + 1}`, type: 'Debit', userId: id })
      return send(res, 201, { message: 'Usuário criado com sucesso', result: { id } })
    }

    // POST /user/auth — login
    if (method === 'POST' && path === '/user/auth') {
      const payload = await readBody(req)
      const user = users.find((u) => u.email === payload.email && u.password === payload.password)
      if (!user) return send(res, 401, { message: 'E-mail ou senha inválidos' })
      return send(res, 200, { message: 'Login realizado com sucesso', result: { token: issueToken(user) } })
    }

    // GET /account — dados da conta logada
    if (method === 'GET' && path === '/account') {
      const user = getUserFromAuthHeader(req)
      if (!user) return send(res, 401, { message: 'Não autorizado' })
      const account = accounts.find((a) => a.userId === user.id)
      const accountTransactions = transactions.filter((t) => t.accountId === account.id)
      const accountCards = cards.filter((c) => c.accountId === account.id)
      return send(res, 200, {
        message: 'ok',
        result: { account: [account], transactions: accountTransactions, cards: accountCards },
      })
    }

    // GET /account/:id/statement — extrato
    const statementMatch = path.match(/^\/account\/([^/]+)\/statement$/)
    if (method === 'GET' && statementMatch) {
      const user = getUserFromAuthHeader(req)
      if (!user) return send(res, 401, { message: 'Não autorizado' })
      const accountId = statementMatch[1]
      return send(res, 200, {
        message: 'ok',
        result: { transactions: transactions.filter((t) => t.accountId === accountId) },
      })
    }

    // POST /account/transaction — criar transação
    if (method === 'POST' && path === '/account/transaction') {
      const user = getUserFromAuthHeader(req)
      if (!user) return send(res, 401, { message: 'Não autorizado' })
      const payload = await readBody(req)
      const transaction = {
        id: `t${Date.now()}`,
        accountId: payload.accountId,
        type: payload.type,
        value: payload.type === 'Debit' ? -Math.abs(payload.value) : Math.abs(payload.value),
        from: payload.from,
        to: payload.to,
        anexo: payload.anexo,
        date: new Date().toISOString(),
      }
      transactions.unshift(transaction)
      return send(res, 201, transaction)
    }

    // PUT /account/transaction/:id — editar transação
    const transactionMatch = path.match(/^\/account\/transaction\/([^/]+)$/)
    if (method === 'PUT' && transactionMatch) {
      const user = getUserFromAuthHeader(req)
      if (!user) return send(res, 401, { message: 'Não autorizado' })
      const id = transactionMatch[1]
      const index = transactions.findIndex((t) => t.id === id)
      if (index === -1) return send(res, 404, { message: 'Transação não encontrada' })
      const payload = await readBody(req)
      const value =
        payload.value !== undefined
          ? payload.type === 'Debit' || transactions[index].type === 'Debit'
            ? -Math.abs(payload.value)
            : Math.abs(payload.value)
          : transactions[index].value
      transactions[index] = { ...transactions[index], ...payload, value }
      return send(res, 200, transactions[index])
    }

    // DELETE /account/transaction/:id — excluir transação
    if (method === 'DELETE' && transactionMatch) {
      const user = getUserFromAuthHeader(req)
      if (!user) return send(res, 401, { message: 'Não autorizado' })
      const id = transactionMatch[1]
      transactions = transactions.filter((t) => t.id !== id)
      return send(res, 204)
    }

    return send(res, 404, { message: 'Rota não encontrada no mock' })
  } catch (err) {
    return send(res, 500, { message: 'Erro no mock da API', error: String(err) })
  }
})

server.listen(PORT, () => {
  console.log(`[mock-api] rodando em http://localhost:${PORT}`)
  console.log(`[mock-api] login de teste -> email: joao@bytebank.com | senha: senha123`)
})
