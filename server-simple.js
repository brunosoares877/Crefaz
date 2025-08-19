import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
})
const PORT = 3001

app.use(express.json())

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
    console.error('❌ Erro ao buscar leads:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// Inicializar servidor
async function startServer() {
  try {
    await prisma.$connect()
    console.log('✅ Conectado ao banco de dados')

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

startServer()
