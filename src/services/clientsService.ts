import { crefazApi } from './crefazApiClient'
import { getCrefazEndpoint } from '../config/environments'
import { ENV_CONFIG } from '../config/env'
import type {
  Cliente,
  CreateClienteRequest,
  UpdateClienteRequest,
  ClienteStatus,
  ClienteFilters,
  EstadoCivil,
  PaginatedResponse,
  ApiResponse
} from '../types/crefazApi'

class ClientsService {
  private environment: string = ENV_CONFIG.CREFAZ_ENVIRONMENT

  constructor(environment?: string) {
    if (environment) {
      this.environment = environment
    }
  }

  // ============= CRUD BÁSICO =============

  /**
   * Criar um novo cliente
   */
  async createClient(clientData: CreateClienteRequest): Promise<Cliente> {
    try {
      // Validar dados antes de criar
      this.validateClientData(clientData)
      
      const endpoint = getCrefazEndpoint(this.environment, 'clients')
      const response = await crefazApi.post<Cliente>(endpoint, clientData)
      
      console.log('✅ Cliente criado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error)
      throw new Error(`Erro ao criar cliente: ${error}`)
    }
  }

  /**
   * Buscar cliente por ID
   */
  async getClientById(id: string): Promise<Cliente> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}`
      const response = await crefazApi.get<Cliente>(endpoint)
      
      console.log('✅ Cliente encontrado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar cliente:', error)
      throw new Error(`Erro ao buscar cliente: ${error}`)
    }
  }

  /**
   * Atualizar cliente
   */
  async updateClient(id: string, updateData: UpdateClienteRequest): Promise<Cliente> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}`
      const response = await crefazApi.put<Cliente>(endpoint, updateData)
      
      console.log('✅ Cliente atualizado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error)
      throw new Error(`Erro ao atualizar cliente: ${error}`)
    }
  }

  /**
   * Deletar cliente (soft delete)
   */
  async deleteClient(id: string): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}`
      await crefazApi.delete(endpoint)
      
      console.log('✅ Cliente deletado com sucesso:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao deletar cliente:', error)
      throw new Error(`Erro ao deletar cliente: ${error}`)
    }
  }

  // ============= LISTAGEM E BUSCA =============

  /**
   * Listar clientes com filtros e paginação
   */
  async getClients(filters?: ClienteFilters): Promise<PaginatedResponse<Cliente>> {
    try {
      const endpoint = getCrefazEndpoint(this.environment, 'clients')
      const params = this.buildFilterParams(filters)
      
      const response = await crefazApi.get<PaginatedResponse<Cliente>>(endpoint, params)
      
      console.log(`✅ ${response.data.length} clientes encontrados`)
      return response
    } catch (error) {
      console.error('❌ Erro ao listar clientes:', error)
      throw new Error(`Erro ao listar clientes: ${error}`)
    }
  }

  /**
   * Buscar cliente por CPF
   */
  async getClientByCpf(cpf: string): Promise<Cliente | null> {
    try {
      const filters: ClienteFilters = {
        busca: cpf,
        limit: 1
      }
      
      const response = await this.getClients(filters)
      
      // Procurar por CPF exato nos resultados
      const client = response.data.find(c => c.cpf === cpf)
      
      if (client) {
        console.log('✅ Cliente encontrado por CPF:', client.id)
        return client
      }
      
      console.log('ℹ️ Nenhum cliente encontrado com o CPF:', cpf)
      return null
    } catch (error) {
      console.error('❌ Erro ao buscar cliente por CPF:', error)
      throw new Error(`Erro ao buscar cliente por CPF: ${error}`)
    }
  }

  /**
   * Buscar cliente por email
   */
  async getClientByEmail(email: string): Promise<Cliente | null> {
    try {
      const filters: ClienteFilters = {
        busca: email,
        limit: 1
      }
      
      const response = await this.getClients(filters)
      
      // Procurar por email exato nos resultados
      const client = response.data.find(c => c.email === email)
      
      if (client) {
        console.log('✅ Cliente encontrado por email:', client.id)
        return client
      }
      
      console.log('ℹ️ Nenhum cliente encontrado com o email:', email)
      return null
    } catch (error) {
      console.error('❌ Erro ao buscar cliente por email:', error)
      throw new Error(`Erro ao buscar cliente por email: ${error}`)
    }
  }

  /**
   * Buscar clientes por status
   */
  async getClientsByStatus(status: ClienteStatus): Promise<Cliente[]> {
    try {
      const filters: ClienteFilters = {
        status: [status],
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      const response = await this.getClients(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar clientes por status:', error)
      throw new Error(`Erro ao buscar clientes por status: ${error}`)
    }
  }

  /**
   * Buscar clientes por responsável
   */
  async getClientsByResponsible(responsavel: string): Promise<Cliente[]> {
    try {
      const filters: ClienteFilters = {
        responsavel: [responsavel],
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      const response = await this.getClients(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar clientes por responsável:', error)
      throw new Error(`Erro ao buscar clientes por responsável: ${error}`)
    }
  }

  // ============= OPERAÇÕES ESPECÍFICAS =============

  /**
   * Atualizar status do cliente
   */
  async updateClientStatus(id: string, status: ClienteStatus, observacoes?: string): Promise<Cliente> {
    try {
      const updateData: UpdateClienteRequest = {
        status,
        observacoes
      }
      
      return await this.updateClient(id, updateData)
    } catch (error) {
      console.error('❌ Erro ao atualizar status do cliente:', error)
      throw new Error(`Erro ao atualizar status do cliente: ${error}`)
    }
  }

  /**
   * Ativar cliente
   */
  async activateClient(id: string): Promise<Cliente> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/activate`
      const response = await crefazApi.post<Cliente>(endpoint)
      
      console.log('✅ Cliente ativado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao ativar cliente:', error)
      throw new Error(`Erro ao ativar cliente: ${error}`)
    }
  }

  /**
   * Desativar cliente
   */
  async deactivateClient(id: string, motivo?: string): Promise<Cliente> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/deactivate`
      const response = await crefazApi.post<Cliente>(endpoint, { motivo })
      
      console.log('✅ Cliente desativado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao desativar cliente:', error)
      throw new Error(`Erro ao desativar cliente: ${error}`)
    }
  }

  /**
   * Bloquear cliente
   */
  async blockClient(id: string, motivo: string): Promise<Cliente> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/block`
      const response = await crefazApi.post<Cliente>(endpoint, { motivo })
      
      console.log('✅ Cliente bloqueado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao bloquear cliente:', error)
      throw new Error(`Erro ao bloquear cliente: ${error}`)
    }
  }

  /**
   * Desbloquear cliente
   */
  async unblockClient(id: string): Promise<Cliente> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/unblock`
      const response = await crefazApi.post<Cliente>(endpoint)
      
      console.log('✅ Cliente desbloqueado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao desbloquear cliente:', error)
      throw new Error(`Erro ao desbloquear cliente: ${error}`)
    }
  }

  // ============= HISTÓRICO E RELACIONAMENTOS =============

  /**
   * Obter histórico completo do cliente
   */
  async getClientHistory(id: string): Promise<{
    cliente: Cliente
    leads: any[]
    propostas: any[]
    contratos: any[]
    documentos: any[]
    atividades: any[]
  }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/history`
      const response = await crefazApi.get(endpoint)
      
      console.log('✅ Histórico do cliente obtido:', id)
      return response
    } catch (error) {
      console.error('❌ Erro ao obter histórico:', error)
      throw new Error(`Erro ao obter histórico: ${error}`)
    }
  }

  /**
   * Obter propostas do cliente
   */
  async getClientProposals(id: string): Promise<any[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/proposals`
      const response = await crefazApi.get<any[]>(endpoint)
      
      console.log(`✅ ${response.length} propostas encontradas para o cliente`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar propostas do cliente:', error)
      throw new Error(`Erro ao buscar propostas do cliente: ${error}`)
    }
  }

  /**
   * Obter contratos do cliente
   */
  async getClientContracts(id: string): Promise<any[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/contracts`
      const response = await crefazApi.get<any[]>(endpoint)
      
      console.log(`✅ ${response.length} contratos encontrados para o cliente`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar contratos do cliente:', error)
      throw new Error(`Erro ao buscar contratos do cliente: ${error}`)
    }
  }

  /**
   * Obter documentos do cliente
   */
  async getClientDocuments(id: string): Promise<any[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/documents`
      const response = await crefazApi.get<any[]>(endpoint)
      
      console.log(`✅ ${response.length} documentos encontrados para o cliente`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar documentos do cliente:', error)
      throw new Error(`Erro ao buscar documentos do cliente: ${error}`)
    }
  }

  // ============= ANÁLISE DE CRÉDITO =============

  /**
   * Analisar score de crédito do cliente
   */
  async analyzeCreditScore(id: string): Promise<{
    score: number
    classificacao: 'A' | 'B' | 'C' | 'D' | 'E'
    limiteCredito: number
    observacoes: string
    dataAnalise: string
  }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/credit-score`
      const response = await crefazApi.post(endpoint)
      
      console.log('✅ Score de crédito analisado:', id)
      return response
    } catch (error) {
      console.error('❌ Erro ao analisar score:', error)
      throw new Error(`Erro ao analisar score: ${error}`)
    }
  }

  /**
   * Verificar capacidade de pagamento
   */
  async checkPaymentCapacity(id: string, valorSolicitado: number): Promise<{
    aprovado: boolean
    valorMaximo: number
    comprometimentoRenda: number
    observacoes: string
  }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/payment-capacity`
      const response = await crefazApi.post(endpoint, { valorSolicitado })
      
      console.log('✅ Capacidade de pagamento verificada:', id)
      return response
    } catch (error) {
      console.error('❌ Erro ao verificar capacidade de pagamento:', error)
      throw new Error(`Erro ao verificar capacidade de pagamento: ${error}`)
    }
  }

  // ============= COMUNICAÇÃO =============

  /**
   * Enviar SMS para cliente
   */
  async sendSMS(id: string, mensagem: string): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/send-sms`
      await crefazApi.post(endpoint, { mensagem })
      
      console.log('✅ SMS enviado para cliente:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao enviar SMS:', error)
      throw new Error(`Erro ao enviar SMS: ${error}`)
    }
  }

  /**
   * Enviar email para cliente
   */
  async sendEmail(id: string, assunto: string, conteudo: string): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/${id}/send-email`
      await crefazApi.post(endpoint, { assunto, conteudo })
      
      console.log('✅ Email enviado para cliente:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error)
      throw new Error(`Erro ao enviar email: ${error}`)
    }
  }

  // ============= RELATÓRIOS E MÉTRICAS =============

  /**
   * Obter métricas de clientes
   */
  async getClientsMetrics(dataInicio?: string, dataFim?: string): Promise<{
    total: number
    ativos: number
    inativos: number
    bloqueados: number
    suspensos: number
    novosClientes: number
    rendaMediaMensal: number
    idadeMedia: number
    distribuicaoPorEstado: any[]
  }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/metrics`
      const params: any = {}
      
      if (dataInicio) params.dataInicio = dataInicio
      if (dataFim) params.dataFim = dataFim
      
      const response = await crefazApi.get(endpoint, params)
      
      console.log('✅ Métricas de clientes obtidas')
      return response
    } catch (error) {
      console.error('❌ Erro ao obter métricas:', error)
      throw new Error(`Erro ao obter métricas: ${error}`)
    }
  }

  /**
   * Obter aniversariantes do mês
   */
  async getBirthdayClients(mes?: number, ano?: number): Promise<Cliente[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'clients')}/birthdays`
      const params: any = {}
      
      if (mes) params.mes = mes
      if (ano) params.ano = ano
      
      const response = await crefazApi.get<Cliente[]>(endpoint, params)
      
      console.log(`✅ ${response.length} aniversariantes encontrados`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar aniversariantes:', error)
      throw new Error(`Erro ao buscar aniversariantes: ${error}`)
    }
  }

  // ============= UTILITÁRIOS =============

  /**
   * Construir parâmetros de filtro
   */
  private buildFilterParams(filters?: ClienteFilters): any {
    if (!filters) return {}

    const params: any = {}

    // Paginação
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder

    // Filtros específicos
    if (filters.status?.length) params.status = filters.status.join(',')
    if (filters.responsavel?.length) params.responsavel = filters.responsavel.join(',')
    
    // Renda
    if (filters.rendaMinima) params.rendaMinima = filters.rendaMinima
    if (filters.rendaMaxima) params.rendaMaxima = filters.rendaMaxima
    
    // Datas
    if (filters.dataInicio) params.dataInicio = filters.dataInicio
    if (filters.dataFim) params.dataFim = filters.dataFim
    
    // Busca
    if (filters.busca) params.busca = filters.busca

    return params
  }

  /**
   * Validar dados do cliente
   */
  private validateClientData(clientData: CreateClienteRequest): void {
    if (!clientData.nome?.trim()) {
      throw new Error('Nome é obrigatório')
    }

    if (!clientData.cpf?.trim()) {
      throw new Error('CPF é obrigatório')
    }

    // Validar CPF (formato básico)
    const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if (!cpfRegex.test(clientData.cpf)) {
      throw new Error('CPF deve ter formato válido (11 dígitos ou XXX.XXX.XXX-XX)')
    }

    // Validar email se fornecido
    if (clientData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(clientData.email)) {
        throw new Error('Email deve ter formato válido')
      }
    }

    // Validar telefone se fornecido
    if (clientData.telefone) {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/
      if (!phoneRegex.test(clientData.telefone)) {
        throw new Error('Telefone deve ter formato válido')
      }
    }

    // Validar data de nascimento se fornecida
    if (clientData.dataNascimento) {
      const birthDate = new Date(clientData.dataNascimento)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (age < 18 || age > 120) {
        throw new Error('Cliente deve ter entre 18 e 120 anos')
      }
    }

    // Validar renda se fornecida
    if (clientData.rendaMensal && clientData.rendaMensal < 0) {
      throw new Error('Renda mensal não pode ser negativa')
    }
  }

  /**
   * Obter estados civis disponíveis
   */
  getMaritalStatuses(): { value: EstadoCivil; label: string }[] {
    return [
      { value: 'solteiro', label: 'Solteiro(a)' },
      { value: 'casado', label: 'Casado(a)' },
      { value: 'divorciado', label: 'Divorciado(a)' },
      { value: 'viuvo', label: 'Viúvo(a)' },
      { value: 'uniao_estavel', label: 'União Estável' }
    ]
  }

  /**
   * Obter status de cliente disponíveis
   */
  getClientStatuses(): { value: ClienteStatus; label: string; color: string }[] {
    return [
      { value: 'ativo', label: 'Ativo', color: 'green' },
      { value: 'inativo', label: 'Inativo', color: 'gray' },
      { value: 'bloqueado', label: 'Bloqueado', color: 'red' },
      { value: 'suspenso', label: 'Suspenso', color: 'yellow' }
    ]
  }

  /**
   * Formatar CPF
   */
  formatCpf(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '')
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  /**
   * Formatar telefone
   */
  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return phone
  }

  /**
   * Calcular idade
   */
  calculateAge(birthDate: string): number {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  /**
   * Alterar ambiente do serviço
   */
  setEnvironment(environment: string): void {
    this.environment = environment
    crefazApi.setEnvironment(environment)
    console.log(`Ambiente do ClientsService alterado para: ${environment}`)
  }
}

// Instância singleton
export const clientsService = new ClientsService()

// Exportar classe para criar instâncias customizadas
export { ClientsService }
