// Configurações de ambiente para API Crefaz On
export const ENV_CONFIG = {
  // URL base da API
  CREFAZ_API_BASE_URL: 'https://api.crefaz.com.br',
  
  // Credenciais de Staging
  CREFAZ_STAGING_CLIENT_ID: '8f2cf2e0-f3f6-472f-808e-e9006a830090',
  CREFAZ_STAGING_CLIENT_SECRET: '', // Adicionar quando disponível
  
  // Token JWT fornecido
  CREFAZ_JWT_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpbiI6IkNDMDMwMTQ5NzQyIiwiVXNlcklkIjoiNzcyNDExIiwiUmFtYWwiOiIiLCJDYW5hbElkIjoiNSIsIkNhbmFsIjoiUHJvbW9iYW5rIiwiUGVyZmlzIjoiMTMiLCJyb2xlIjoiYXBpX3BhcmNlaXJvcyIsIm5iZiI6MTc1OTAwNTE1MCwiZXhwIjoxNzU5NjA5OTUwLCJpYXQiOjE3NTkwMDUxNTB9.Ld0zrkXzNQu-AsXc_DoICLKNKQOhL2KDjpslHENzHBM',
  
  // Credenciais de Produção
  CREFAZ_PRODUCTION_CLIENT_ID: '86feaeec-b8ca-4c9c-acb4-bb301e4165f1',
  CREFAZ_PRODUCTION_CLIENT_SECRET: '', // Adicionar quando disponível
  
  // Ambiente atual (staging ou production)
  CREFAZ_ENVIRONMENT: 'staging' as 'staging' | 'production',
  
  // Configurações gerais
  CREFAZ_API_TIMEOUT: 30000,
  CREFAZ_API_RATE_LIMIT: 1000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

// Função para obter credenciais do ambiente atual
export const getCurrentCredentials = () => {
  const env = ENV_CONFIG.CREFAZ_ENVIRONMENT
  return {
    clientId: env === 'staging' 
      ? ENV_CONFIG.CREFAZ_STAGING_CLIENT_ID 
      : ENV_CONFIG.CREFAZ_PRODUCTION_CLIENT_ID,
    clientSecret: env === 'staging' 
      ? ENV_CONFIG.CREFAZ_STAGING_CLIENT_SECRET 
      : ENV_CONFIG.CREFAZ_PRODUCTION_CLIENT_SECRET,
    environment: env
  }
}

// Função para alterar ambiente
export const setEnvironment = (env: 'staging' | 'production') => {
  ENV_CONFIG.CREFAZ_ENVIRONMENT = env
  console.log(`Ambiente Crefaz API alterado para: ${env}`)
}
