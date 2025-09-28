// Configurações dos ambientes
export interface EnvironmentConfig {
  name: string
  url: string
  apiKey?: string
  timeout: number
  enableLogs: boolean
  endpoints: {
    leads: string
    health: string
  }
}

// Configuração específica para API Crefaz On
export interface CrefazApiConfig {
  name: string
  baseUrl: string
  clientId: string
  clientSecret?: string
  timeout: number
  enableLogs: boolean
  endpoints: {
    auth: string
    leads: string
    documents: string
    proposals: string
    clients: string
    contracts: string
    users: string
    products: string
    wallets: string
    institutions: string
  }
}

export const ENVIRONMENTS: Record<string, EnvironmentConfig> = {
  local: {
    name: 'Local',
    url: 'http://localhost:3001',
    timeout: 10000,
    enableLogs: true,
    endpoints: {
      leads: '/api/leads',
      health: '/health'
    }
  },
  staging: {
    name: 'Staging',
    url: 'https://8f2cf2e0-f3f6-472f-808e-e9006a830090.mock.pstmn.io',
    timeout: 15000,
    enableLogs: true,
    endpoints: {
      leads: '/leads',
      health: '/health'
    }
  },
  production: {
    name: 'Production',
    url: 'https://86feaeec-b8ca-4c9c-acb4-bb301e4165f1.mock.pstmn.io',
    timeout: 20000,
    enableLogs: false,
    endpoints: {
      leads: '/leads',
      health: '/health'
    }
  }
}

// Função para obter configuração do ambiente atual
export const getEnvironmentConfig = (env: string = 'local'): EnvironmentConfig => {
  return ENVIRONMENTS[env] || ENVIRONMENTS.local
}

// Função para obter URL base do ambiente
export const getApiUrl = (env: string = 'local'): string => {
  const config = getEnvironmentConfig(env)
  return config.url
}

// Função para obter endpoint completo
export const getEndpoint = (env: string, endpointKey: keyof EnvironmentConfig['endpoints']): string => {
  const config = getEnvironmentConfig(env)
  const baseUrl = config.url
  const endpoint = config.endpoints[endpointKey]
  return `${baseUrl}${endpoint}`
}

// Função para alternar ambiente
export const switchEnvironment = (env: string): EnvironmentConfig => {
  const config = getEnvironmentConfig(env)
      console.log(`Ambiente alterado para: ${config.name}`)
      console.log(`URL: ${config.url}`)
  return config
}

// Função para verificar se ambiente é local
export const isLocalEnvironment = (env: string): boolean => {
  return env === 'local'
}

// Função para verificar se ambiente é produção
export const isProductionEnvironment = (env: string): boolean => {
  return env === 'production'
}

// Função para obter ambiente atual
export const getCurrentEnvironment = (): string => {
  return 'local' // Por padrão, sempre local
}

// Função para verificar se ambiente é desenvolvimento
export const isDevelopment = (env: string): boolean => {
  return env === 'local'
}

// Função para verificar se ambiente é staging
export const isStaging = (env: string): boolean => {
  return env === 'staging'
}

// Função para verificar se ambiente é produção
export const isProduction = (env: string): boolean => {
  return env === 'production'
}

// Configurações da API Crefaz On
export const CREFAZ_API_CONFIG: Record<string, CrefazApiConfig> = {
  staging: {
    name: 'Crefaz On - Staging',
    baseUrl: 'https://api.crefaz.com.br',
    clientId: '8f2cf2e0-f3f6-472f-808e-e9006a830090',
    timeout: 30000,
    enableLogs: true,
    endpoints: {
      auth: '/oauth/token',
      leads: '/leads',
      documents: '/documents',
      proposals: '/proposals',
      clients: '/clients',
      contracts: '/contracts',
      users: '/users',
      products: '/products',
      wallets: '/wallets',
      institutions: '/institutions'
    }
  },
  production: {
    name: 'Crefaz On - Production',
    baseUrl: 'https://api.crefaz.com.br',
    clientId: '86feaeec-b8ca-4c9c-acb4-bb301e4165f1',
    timeout: 30000,
    enableLogs: false,
    endpoints: {
      auth: '/oauth/token',
      leads: '/leads',
      documents: '/documents',
      proposals: '/proposals',
      clients: '/clients',
      contracts: '/contracts',
      users: '/users',
      products: '/products',
      wallets: '/wallets',
      institutions: '/institutions'
    }
  }
}

// Função para obter configuração da API Crefaz On
export const getCrefazApiConfig = (env: string = 'staging'): CrefazApiConfig => {
  return CREFAZ_API_CONFIG[env] || CREFAZ_API_CONFIG.staging
}

// Função para obter URL completa de um endpoint da API Crefaz On
export const getCrefazEndpoint = (env: string, endpointKey: keyof CrefazApiConfig['endpoints']): string => {
  const config = getCrefazApiConfig(env)
  const baseUrl = config.baseUrl
  const endpoint = config.endpoints[endpointKey]
  return `${baseUrl}${endpoint}`
}
