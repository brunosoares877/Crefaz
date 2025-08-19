// Script de teste para a API
const testData = {
  nome: "João Silva",
  whatsapp: "(11) 99999-9999",
  cpf: "123.456.789-00",
  dataNascimento: "15/03/1985",
  companhiaEnergia: "Enel SP"
}

async function testAPI() {
  try {
    console.log('🧪 Testando API...')
    
    // Teste 1: Health Check
    console.log('\n1️⃣ Testando Health Check...')
    const healthResponse = await fetch('http://localhost:3001/health')
    const healthData = await healthResponse.json()
    console.log('✅ Health Check:', healthData)
    
    // Teste 2: Cadastrar Lead
    console.log('\n2️⃣ Testando Cadastro de Lead...')
    const leadResponse = await fetch('http://localhost:3001/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    const leadData = await leadResponse.json()
    console.log('✅ Lead Cadastrado:', leadData)
    
    // Teste 3: Listar Leads
    console.log('\n3️⃣ Testando Listagem de Leads...')
    const listResponse = await fetch('http://localhost:3001/api/leads')
    const listData = await listResponse.json()
    console.log('✅ Leads Listados:', listData)
    
    console.log('\n🎉 Todos os testes passaram!')
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error)
  }
}

testAPI()
