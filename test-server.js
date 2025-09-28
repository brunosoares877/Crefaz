import express from 'express'

const app = express()
const PORT = 3001

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  
  next()
})

app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Endpoint da API Crefaz
app.post('/api/crefaz/proposta', async (req, res) => {
  try {
    const { propostaData, token } = req.body
    
    console.log('🔄 Recebido proposta para enviar à API Crefaz:', propostaData?.cliente?.nome || 'Nome não encontrado')
    console.log('📋 ID da Proposta:', propostaData?.id)
    
    // Importar fetch dinamicamente (para Node.js)
    const fetch = (await import('node-fetch')).default
    
    // Enviar para API Crefaz real
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
      console.log('✅ Proposta enviada para API Crefaz com sucesso!')
      console.log('📄 Resposta da API:', responseData)
      
      res.json({
        success: true,
        message: 'Proposta enviada para API Crefaz com sucesso!',
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

// Rota 404
app.use('*', (req, res) => {
  console.log(`❌ Endpoint não encontrado: ${req.method} ${req.path}`)
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de teste rodando na porta ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`API Crefaz: http://localhost:${PORT}/api/crefaz/proposta`)
})
