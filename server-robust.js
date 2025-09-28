import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
})
const PORT = 3001

// Middleware CORS para permitir requisições do frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  
  // Responder ao preflight request
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  
  next()
})

app.use(express.json())

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Rota para enviar proposta para API Crefaz (contorna CORS)
app.post('/api/crefaz/proposta', async (req, res) => {
  try {
    const { propostaData, token } = req.body
    
    console.log('🔄 Recebido proposta para enviar à API Crefaz:', propostaData.cliente.nome)
    
    // Importar fetch dinamicamente (para Node.js)
    const fetch = (await import('node-fetch')).default
    
    // Enviar para API Crefaz usando endpoint correto
    const crefazResponse = await fetch(`https://app2-crefaz-api-external-stag.azurewebsites.net/api/Proposta/${propostaData.id}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(propostaData)
    })

    if (crefazResponse.ok) {
      const responseData = await crefazResponse.json()
      console.log('✅ Proposta enviada para API Crefaz com sucesso via backend')
      
      res.json({
        success: true,
        message: 'Proposta enviada para API Crefaz com sucesso',
        crefazId: propostaData.id,
        data: responseData
      })
    } else {
      const errorText = await crefazResponse.text()
      console.error('❌ Erro da API Crefaz:', crefazResponse.status, errorText)
      
      res.status(400).json({
        success: false,
        message: `Erro da API Crefaz: ${crefazResponse.status}`,
        error: errorText
      })
    }
    
  } catch (error) {
    console.error('❌ Erro ao enviar para API Crefaz:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno ao enviar para API Crefaz',
      error: error.message
    })
  }
})

// Rota para cadastrar leads
app.post('/api/leads', async (req, res) => {
  try {
    const { nome, whatsapp, cpf, dataNascimento, companhiaEnergia } = req.body

    // Validação básica
    if (!nome || !whatsapp || !cpf || !dataNascimento || !companhiaEnergia) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      })
    }

    // Verificar se CPF já existe
    const leadExistente = await prisma.lead.findUnique({
      where: { cpf: cpf.replace(/\D/g, '') }
    })

    if (leadExistente) {
      return res.status(409).json({
        success: false,
        message: 'CPF já cadastrado no sistema'
      })
    }

    // Salvar no banco
    const novoLead = await prisma.lead.create({
      data: {
        nome: nome.trim(),
        whatsapp: whatsapp.replace(/\D/g, ''),
        cpf: cpf.replace(/\D/g, ''),
        dataNascimento,
        companhiaEnergia,
        source: 'FORMULARIO_WEB'
      }
    })

    console.log(`Novo lead cadastrado: ${nome} (${cpf})`)

    res.status(201).json({
      success: true,
      message: 'Lead cadastrado com sucesso!',
      data: {
        id: novoLead.id,
        nome: novoLead.nome,
        status: novoLead.status
      }
    })

  } catch (error) {
    console.error('Erro ao cadastrar lead:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// Rota para listar leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      data: leads,
      total: leads.length
    })

  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// Rota para atualizar status do lead
app.patch('/api/leads/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const statusValidos = ['PENDENTE', 'CONTATADO', 'CONVERTIDO', 'DESCARTADO']
    
    if (!statusValidos.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      })
    }

    const leadAtualizado = await prisma.lead.update({
      where: { id },
      data: { status }
    })

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: leadAtualizado
    })

  } catch (error) {
    console.error('Erro ao atualizar status:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// Rota 404 - deve ser a última
app.use('*', (req, res) => {
  console.log(`❌ Endpoint não encontrado: ${req.method} ${req.path}`)
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  })
})

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
      console.error('Erro não tratado:', error)
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  })
})

// Inicializar servidor
async function startServer() {
  try {
    await prisma.$connect()
    console.log('Conectado ao banco de dados')

    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
      console.log(`API Leads: http://localhost:${PORT}/api/leads`)
      console.log(`Servidor iniciado com sucesso!`)
    })

    // Tratamento de erros do servidor
    server.on('error', (error) => {
      console.error('Erro no servidor:', error)
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nDesligando servidor...')
      server.close(async () => {
        await prisma.$disconnect()
        console.log('Servidor desligado com sucesso')
        process.exit(0)
      })
    })

    process.on('SIGTERM', async () => {
      console.log('\nDesligando servidor...')
      server.close(async () => {
        await prisma.$disconnect()
        console.log('Servidor desligado com sucesso')
        process.exit(0)
      })
    })

    // Prevenir crashes
    process.on('uncaughtException', (error) => {
      console.error('Erro não capturado:', error)
    })

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Promise rejeitada não tratada:', reason)
    })

  } catch (error) {
    console.error('Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

// Iniciar servidor
console.log('Iniciando servidor...')
startServer()
