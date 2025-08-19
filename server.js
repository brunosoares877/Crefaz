import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
})
const PORT = process.env.PORT || 3001

// Middleware de segurança
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
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

    // Capturar informações do cliente
    const ipAddress = req.ip || req.connection.remoteAddress
    const userAgent = req.get('User-Agent')

    // Salvar no banco
    const novoLead = await prisma.lead.create({
      data: {
        nome: nome.trim(),
        whatsapp: whatsapp.replace(/\D/g, ''),
        cpf: cpf.replace(/\D/g, ''),
        dataNascimento,
        companhiaEnergia,
        ipAddress,
        userAgent,
        source: 'FORMULARIO_WEB'
      }
    })

    console.log(`✅ Novo lead cadastrado: ${nome} (${cpf})`)

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
    console.error('❌ Erro ao cadastrar lead:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Rota para listar leads (protegida - apenas para admin)
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nome: true,
        whatsapp: true,
        cpf: true,
        dataNascimento: true,
        companhiaEnergia: true,
        status: true,
        createdAt: true,
        source: true
      }
    })

    res.json({
      success: true,
      data: leads,
      total: leads.length
    })

  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error)
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
    console.error('❌ Erro ao atualizar status:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('❌ Erro não tratado:', error)
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  })
})

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  })
})

// Inicializar servidor
async function startServer() {
  try {
    // Conectar ao banco
    await prisma.$connect()
    console.log('✅ Conectado ao banco de dados')

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`📝 API Leads: http://localhost:${PORT}/api/leads`)
    })

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Desligando servidor...')
  await prisma.$disconnect()
  process.exit(0)
})

startServer()
