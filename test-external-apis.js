// Script de teste para as APIs externas
const testData = {
  nome: "Maria Silva",
  whatsapp: "(11) 88888-8888",
  cpf: "987.654.321-00",
  dataNascimento: "20/05/1990",
  companhiaEnergia: "CPFL"
}

async function testExternalAPIs() {
  console.log('🧪 Testando APIs Externas...\n')
  
  const apis = [
    {
      name: 'Staging',
      url: 'https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io',
      endpoint: '/leads'
    },
    {
      name: 'Production',
      url: 'https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io',
      endpoint: '/leads'
    }
  ]
  
  for (const api of apis) {
    console.log(`\n🔍 Testando ${api.name}...`)
    console.log(`🌐 URL: ${api.url}${api.endpoint}`)
    
    try {
      // Teste 1: Health Check (se disponível)
      try {
        const healthResponse = await fetch(`${api.url}/health`)
        if (healthResponse.ok) {
          const healthData = await healthResponse.json()
          console.log(`✅ Health Check: ${JSON.stringify(healthData)}`)
        } else {
          console.log(`⚠️ Health Check não disponível (${healthResponse.status})`)
        }
      } catch (error) {
        console.log(`⚠️ Health Check não disponível`)
      }
      
      // Teste 2: Cadastrar Lead
      console.log(`📝 Testando cadastro de lead...`)
      const leadResponse = await fetch(`${api.url}${api.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      })
      
      if (leadResponse.ok) {
        const leadData = await leadResponse.json()
        console.log(`✅ Lead cadastrado com sucesso!`)
        console.log(`📊 Resposta: ${JSON.stringify(leadData, null, 2)}`)
      } else {
        const errorData = await leadResponse.text()
        console.log(`❌ Erro ao cadastrar lead (${leadResponse.status}): ${errorData}`)
      }
      
      // Teste 3: Listar Leads
      console.log(`📋 Testando listagem de leads...`)
      const listResponse = await fetch(`${api.url}${api.endpoint}`)
      
      if (listResponse.ok) {
        const listData = await listResponse.json()
        console.log(`✅ Leads listados com sucesso!`)
        console.log(`📊 Total de leads: ${listData.data?.length || listData.length || 'N/A'}`)
      } else {
        const errorData = await listResponse.text()
        console.log(`❌ Erro ao listar leads (${listResponse.status}): ${errorData}`)
      }
      
    } catch (error) {
      console.error(`❌ Erro ao testar ${api.name}:`, error.message)
    }
    
    console.log(`\n${'─'.repeat(50)}`)
  }
  
  console.log('\n🎉 Teste das APIs externas concluído!')
}

// Executar teste
testExternalAPIs()
