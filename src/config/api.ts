// Configurações da API
export const API_CONFIG = {
  // URLs das APIs
  PROD_URL: 'https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io',
  STAGING_URL: 'https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io',
  LOCAL_URL: 'http://localhost:3001',
  
  // URL base da API - altere conforme sua API
  BASE_URL: import.meta.env.VITE_API_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io'
      : import.meta.env.MODE === 'staging'
      ? 'https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io'
      : 'http://localhost:3001'),
  
  // Timeout das requisições (em milissegundos)
  TIMEOUT: 10000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Endpoints da API
  ENDPOINTS: {
    LEADS: '/api/leads',
    VALIDAR_CPF: '/api/validar-cpf',
  },
}

// Função para obter a URL completa de um endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Função para verificar se a API está disponível
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`)
    return response.ok
  } catch (error) {
    console.error('API não está disponível:', error)
    return false
  }
}

// Função para alternar entre ambientes
export const switchEnvironment = (env: 'local' | 'staging' | 'production') => {
  const urls = {
    local: 'http://localhost:3001',
    staging: 'https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io',
    production: 'https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io'
  }
  
  API_CONFIG.BASE_URL = urls[env]
  console.log(`🔄 Ambiente alterado para: ${env.toUpperCase()}`)
  console.log(`🌐 URL: ${API_CONFIG.BASE_URL}`)
  
  return API_CONFIG.BASE_URL
}
