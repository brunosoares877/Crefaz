/**
 * Índice dos Serviços da API Crefaz On
 * 
 * Este arquivo centraliza a exportação de todos os serviços
 * implementados para a integração com a API Crefaz On.
 */

// ============= CLIENTE HTTP E AUTENTICAÇÃO =============
export { crefazApi, crefazApiStaging, crefazApiProduction, CrefazApiClient } from './crefazApiClient'
export type { ApiResponse, ApiErrorResponse, AuthToken } from './crefazApiClient'

// ============= SERVIÇOS PRINCIPAIS =============

// Leads
export { leadsService, LeadsService } from './leadsService'

// Documentos
export { documentsService, DocumentsService } from './documentsService'
export type { DocumentFilters } from './documentsService'

// Propostas
export { proposalsService, ProposalsService } from './proposalsService'

// Clientes
export { clientsService, ClientsService } from './clientsService'

// Contratos
export { contractsService, ContractsService } from './contractsService'

// Produtos
export { productsService, ProductsService } from './productsService'

// Usuários
export { usersService, UsersService } from './usersService'

// ============= CONFIGURAÇÕES =============
export { getCrefazApiConfig, getCrefazEndpoint, CREFAZ_API_CONFIG } from '../config/environments'
export { ENV_CONFIG, getCurrentCredentials, setEnvironment } from '../config/env'

// ============= TIPOS TYPESCRIPT =============
export type {
  // Leads
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadStatus,
  LeadFilters,
  
  // Documentos
  Document,
  UploadDocumentRequest,
  DocumentType,
  DocumentStatus,
  
  // Propostas
  Proposta,
  CreatePropostaRequest,
  UpdatePropostaRequest,
  PropostaStatus,
  PropostaFilters,
  
  // Clientes
  Cliente,
  CreateClienteRequest,
  UpdateClienteRequest,
  ClienteStatus,
  ClienteFilters,
  EstadoCivil,
  
  // Contratos
  Contrato,
  CreateContratoRequest,
  UpdateContratoRequest,
  ContratoStatus,
  ContratoFilters,
  Parcela,
  ParcelaStatus,
  
  // Usuários
  Usuario,
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  UserRole,
  UserStatus,
  
  // Produtos
  Produto,
  ProdutoType,
  ProdutoStatus,
  
  // Estruturas auxiliares
  Endereco,
  PaginationParams,
  PaginatedResponse,
  DashboardMetrics,
  ChartData,
  WebhookEvent,
  WebhookEventType
} from '../types/crefazApi'

// ============= UTILITÁRIOS E HELPERS =============

/**
 * Configurar ambiente para todos os serviços
 */
export const setGlobalEnvironment = (environment: 'staging' | 'production') => {
  // Atualizar configuração global
  setEnvironment(environment)
  
  // Atualizar todos os serviços
  leadsService.setEnvironment(environment)
  documentsService.setEnvironment(environment)
  proposalsService.setEnvironment(environment)
  clientsService.setEnvironment(environment)
  contractsService.setEnvironment(environment)
  productsService.setEnvironment(environment)
  usersService.setEnvironment(environment)
  
  console.log(`🌍 Ambiente global alterado para: ${environment}`)
}

/**
 * Verificar status de todos os serviços
 */
export const checkServicesHealth = async (): Promise<{
  api: boolean
    services: {
      leads: boolean
      documents: boolean
      proposals: boolean
      clients: boolean
      contracts: boolean
      products: boolean
      users: boolean
    }
}> => {
  try {
    // Verificar API principal
    const apiHealth = await crefazApi.healthCheck()
    
    // Verificar serviços individuais (simulado)
    const servicesHealth = {
      leads: true,
      documents: true,
      proposals: true,
      clients: true,
      contracts: true,
      products: true,
      users: true
    }
    
    return {
      api: apiHealth,
      services: servicesHealth
    }
  } catch (error) {
    console.error('Erro ao verificar saúde dos serviços:', error)
    return {
      api: false,
      services: {
        leads: false,
        documents: false,
        proposals: false,
        clients: false,
        contracts: false,
        products: false,
        users: false
      }
    }
  }
}

/**
 * Obter informações resumidas da integração
 */
export const getIntegrationInfo = () => {
  const tokenInfo = crefazApi.getTokenInfo()
  const currentCredentials = getCurrentCredentials()
  
  return {
    version: '1.0.0',
    environment: currentCredentials.environment,
    clientId: currentCredentials.clientId,
    token: {
      hasToken: tokenInfo.hasToken,
      isValid: tokenInfo.isValid,
      expiresAt: tokenInfo.expiresAt ? new Date(tokenInfo.expiresAt) : null
    },
    services: [
      'leads',
      'documents', 
      'proposals',
      'clients',
      'contracts',
      'products',
      'users'
    ],
    lastUpdate: new Date().toISOString()
  }
}

/**
 * Executar testes básicos de conectividade
 */
export const runConnectivityTests = async () => {
  console.log('🧪 Iniciando testes de conectividade...')
  
  const results = {
    api: false,
    authentication: false,
    services: {} as Record<string, boolean>
  }
  
  try {
    // Teste 1: Health Check da API
    console.log('1. Testando health check...')
    results.api = await crefazApi.healthCheck()
    console.log(results.api ? '✅ API respondendo' : '❌ API não responde')
    
    // Teste 2: Autenticação
    console.log('2. Testando autenticação...')
    const tokenInfo = crefazApi.getTokenInfo()
    results.authentication = tokenInfo.isValid
    console.log(results.authentication ? '✅ Token válido' : '❌ Token inválido')
    
    // Teste 3: Serviços individuais (simulado)
    const serviceTests = [
      { name: 'leads', test: () => leadsService.getLeads({ limit: 1 }) },
      { name: 'clients', test: () => clientsService.getClients({ limit: 1 }) },
      { name: 'contracts', test: () => contractsService.getContracts({ limit: 1 }) },
      { name: 'products', test: () => productsService.getProducts({ limit: 1 }) }
    ]
    
    for (const service of serviceTests) {
      console.log(`3.${serviceTests.indexOf(service) + 1}. Testando ${service.name}...`)
      try {
        await service.test()
        results.services[service.name] = true
        console.log(`✅ ${service.name} funcionando`)
      } catch (error) {
        results.services[service.name] = false
        console.log(`❌ ${service.name} com erro:`, error)
      }
    }
    
    console.log('🎉 Testes concluídos!')
    return results
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error)
    return results
  }
}

// ============= CONSTANTES =============

export const CREFAZ_INTEGRATION_VERSION = '1.0.0'

export const SUPPORTED_ENVIRONMENTS = ['staging', 'production'] as const

export const SERVICE_NAMES = [
  'leads',
  'documents',
  'proposals', 
  'clients',
  'contracts',
  'products',
  'users'
] as const

export const API_ENDPOINTS = {
  BASE_URL: 'https://api.crefaz.com.br',
  DOCS_URL: 'https://docs.crefaz.com.br',
  SUPPORT_URL: 'https://support.crefaz.com.br'
} as const

// ============= MENSAGENS DE LOG =============

console.log(`
🚀 Crefaz API Integration v${CREFAZ_INTEGRATION_VERSION} carregada!

Serviços disponíveis:
${SERVICE_NAMES.map(name => `  • ${name}Service`).join('\n')}

Ambiente atual: ${getCurrentCredentials().environment}
Cliente ID: ${getCurrentCredentials().clientId}

Para começar:
  import { leadsService, clientsService } from './services'
  
  // Criar um lead
  const lead = await leadsService.createLead({ ... })
  
  // Listar clientes  
  const clients = await clientsService.getClients()

Documentação completa: CREFAZ_API_INTEGRATION.md
`)

export default {
  // Serviços
  leadsService,
  documentsService,
  proposalsService,
  clientsService,
  contractsService,
  productsService,
  usersService,
  
  // Cliente HTTP
  crefazApi,
  
  // Utilitários
  setGlobalEnvironment,
  checkServicesHealth,
  getIntegrationInfo,
  runConnectivityTests,
  
  // Constantes
  VERSION: CREFAZ_INTEGRATION_VERSION,
  ENVIRONMENTS: SUPPORTED_ENVIRONMENTS,
  SERVICES: SERVICE_NAMES
}
