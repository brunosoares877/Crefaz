// Configurações de ambiente
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const

export type Environment = typeof ENVIRONMENTS[keyof typeof ENVIRONMENTS]

// URLs das APIs por ambiente
export const API_URLS = {
  [ENVIRONMENTS.DEVELOPMENT]: 'http://localhost:3000/api',
  [ENVIRONMENTS.STAGING]: 'https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io',
  [ENVIRONMENTS.PRODUCTION]: 'https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io',
} as const

// ⚠️ CONFIGURAÇÃO DAS SUAS APIs REAIS
// Substitua as URLs abaixo pelas suas APIs reais:
export const REAL_API_URLS = {
  [ENVIRONMENTS.DEVELOPMENT]: 'http://localhost:3000/api',
  [ENVIRONMENTS.STAGING]: 'https://sua-api-staging.com/api', // ⚠️ SUBSTITUIR
  [ENVIRONMENTS.PRODUCTION]: 'https://sua-api-producao.com/api', // ⚠️ SUBSTITUIR
} as const

// Função para obter o ambiente atual
export const getCurrentEnvironment = (): Environment => {
  // Forçar production para usar sua API principal
  return ENVIRONMENTS.PRODUCTION
  
  // Código original comentado:
  // const env = import.meta.env.MODE || import.meta.env.NODE_ENV || 'development'
  // if (env === 'production') return ENVIRONMENTS.PRODUCTION
  // if (env === 'staging') return ENVIRONMENTS.STAGING
  // return ENVIRONMENTS.DEVELOPMENT
}

// Função para obter a URL da API baseada no ambiente
export const getApiUrl = (): string => {
  const currentEnv = getCurrentEnvironment()
  
  // Use REAL_API_URLS para suas APIs reais
  // Use API_URLS para as APIs do Postman Mock
  return REAL_API_URLS[currentEnv] // ⚠️ MUDANÇA AQUI
}

// Função para verificar se está em produção
export const isProduction = (): boolean => {
  return getCurrentEnvironment() === ENVIRONMENTS.PRODUCTION
}

// Função para verificar se está em staging
export const isStaging = (): boolean => {
  return getCurrentEnvironment() === ENVIRONMENTS.STAGING
}

// Função para verificar se está em desenvolvimento
export const isDevelopment = (): boolean => {
  return getCurrentEnvironment() === ENVIRONMENTS.DEVELOPMENT
}

// Configurações específicas por ambiente
export const ENVIRONMENT_CONFIG = {
  [ENVIRONMENTS.DEVELOPMENT]: {
    enableLogs: true,
    enableDebug: true,
    timeout: 10000,
  },
  [ENVIRONMENTS.STAGING]: {
    enableLogs: true,
    enableDebug: false,
    timeout: 15000,
  },
  [ENVIRONMENTS.PRODUCTION]: {
    enableLogs: false,
    enableDebug: false,
    timeout: 20000,
  },
} as const

// Função para obter configurações do ambiente atual
export const getEnvironmentConfig = () => {
  const currentEnv = getCurrentEnvironment()
  return ENVIRONMENT_CONFIG[currentEnv]
}
