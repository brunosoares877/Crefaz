import { crefazApi } from './crefazApiClient'
import { getCrefazEndpoint } from '../config/environments'
import { ENV_CONFIG } from '../config/env'
import type {
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadFilters,
  PaginatedResponse,
  ApiResponse
} from '../types/crefazApi'

class LeadsService {
  private environment: string = ENV_CONFIG.CREFAZ_ENVIRONMENT

  constructor(environment?: string) {
    if (environment) {
      this.environment = environment
    }
  }

  // ============= CRUD BÁSICO =============

  /**
   * Criar um novo lead
   */
  async createLead(leadData: CreateLeadRequest): Promise<Lead> {
    try {
      const endpoint = getCrefazEndpoint(this.environment, 'leads')
      const response = await crefazApi.post<Lead>(endpoint, leadData)
      
      console.log('✅ Lead criado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao criar lead:', error)
      throw new Error(`Erro ao criar lead: ${error}`)
    }
  }

  /**
   * Buscar lead por ID
   */
  async getLeadById(id: string): Promise<Lead> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'leads')}/${id}`
      const response = await crefazApi.get<Lead>(endpoint)
      
      console.log('✅ Lead encontrado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar lead:', error)
      throw new Error(`Erro ao buscar lead: ${error}`)
    }
  }

  /**
   * Atualizar lead
   */
  async updateLead(id: string, updateData: UpdateLeadRequest): Promise<Lead> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'leads')}/${id}`
      const response = await crefazApi.put<Lead>(endpoint, updateData)
      
      console.log('✅ Lead atualizado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao atualizar lead:', error)
      throw new Error(`Erro ao atualizar lead: ${error}`)
    }
  }

  /**
   * Deletar lead
   */
  async deleteLead(id: string): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'leads')}/${id}`
      await crefazApi.delete(endpoint)
      
      console.log('✅ Lead deletado com sucesso:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao deletar lead:', error)
      throw new Error(`Erro ao deletar lead: ${error}`)
    }
  }

  // ============= LISTAGEM E BUSCA =============

  /**
   * Listar todos os leads com paginação e filtros
   */
  async getLeads(filters?: LeadFilters): Promise<PaginatedResponse<Lead>> {
    try {
      const endpoint = getCrefazEndpoint(this.environment, 'leads')
      const params = this.buildFilterParams(filters)
      
      const response = await crefazApi.get<PaginatedResponse<Lead>>(endpoint, params)
      
      console.log(`✅ ${response.data.length} leads encontrados`)
      return response
    } catch (error) {
      console.error('❌ Erro ao listar leads:', error)
      throw new Error(`Erro ao listar leads: ${error}`)
    }
  }

  /**
   * Buscar leads por texto
   */
  async searchLeads(searchTerm: string, filters?: Omit<LeadFilters, 'busca'>): Promise<PaginatedResponse<Lead>> {
    try {
      const searchFilters: LeadFilters = {
        ...filters,
        busca: searchTerm
      }
      
      return await this.getLeads(searchFilters)
    } catch (error) {
      console.error('❌ Erro ao buscar leads:', error)
      throw new Error(`Erro ao buscar leads: ${error}`)
    }
  }

  /**
   * Buscar lead por CPF
   */
  async getLeadByCpf(cpf: string): Promise<Lead | null> {
    try {
      const response = await this.searchLeads(cpf)
      
      // Procurar por CPF exato nos resultados
      const lead = response.data.find(l => l.cpf === cpf)
      
      if (lead) {
        console.log('✅ Lead encontrado por CPF:', lead.id)
        return lead
      }
      
      console.log('ℹ️ Nenhum lead encontrado com o CPF:', cpf)
      return null
    } catch (error) {
      console.error('❌ Erro ao buscar lead por CPF:', error)
      throw new Error(`Erro ao buscar lead por CPF: ${error}`)
    }
  }

  // ============= OPERAÇÕES ESPECÍFICAS =============

  /**
   * Converter lead em cliente
   */
  async convertLead(id: string, clientData?: any): Promise<Lead> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'leads')}/${id}/convert`
      const response = await crefazApi.post<Lead>(endpoint, clientData || {})
      
      console.log('✅ Lead convertido com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao converter lead:', error)
      throw new Error(`Erro ao converter lead: ${error}`)
    }
  }

  /**
   * Atualizar status do lead
   */
  async updateLeadStatus(id: string, status: Lead['status'], observacoes?: string): Promise<Lead> {
    try {
      const updateData: UpdateLeadRequest = {
        status,
        observacoes,
        dataContato: new Date().toISOString()
      }
      
      return await this.updateLead(id, updateData)
    } catch (error) {
      console.error('❌ Erro ao atualizar status do lead:', error)
      throw new Error(`Erro ao atualizar status do lead: ${error}`)
    }
  }

  /**
   * Agendar próximo contato
   */
  async scheduleNextContact(id: string, proximoContato: string, observacoes?: string): Promise<Lead> {
    try {
      const updateData: UpdateLeadRequest = {
        proximoContato,
        observacoes
      }
      
      return await this.updateLead(id, updateData)
    } catch (error) {
      console.error('❌ Erro ao agendar próximo contato:', error)
      throw new Error(`Erro ao agendar próximo contato: ${error}`)
    }
  }

  /**
   * Adicionar tags ao lead
   */
  async addTagsToLead(id: string, newTags: string[]): Promise<Lead> {
    try {
      // Buscar lead atual para obter tags existentes
      const currentLead = await this.getLeadById(id)
      const existingTags = currentLead.tags || []
      
      // Combinar tags existentes com novas (sem duplicatas)
      const allTags = [...new Set([...existingTags, ...newTags])]
      
      const updateData: UpdateLeadRequest = {
        tags: allTags
      }
      
      return await this.updateLead(id, updateData)
    } catch (error) {
      console.error('❌ Erro ao adicionar tags ao lead:', error)
      throw new Error(`Erro ao adicionar tags ao lead: ${error}`)
    }
  }

  /**
   * Remover tags do lead
   */
  async removeTagsFromLead(id: string, tagsToRemove: string[]): Promise<Lead> {
    try {
      // Buscar lead atual para obter tags existentes
      const currentLead = await this.getLeadById(id)
      const existingTags = currentLead.tags || []
      
      // Filtrar tags removendo as especificadas
      const filteredTags = existingTags.filter(tag => !tagsToRemove.includes(tag))
      
      const updateData: UpdateLeadRequest = {
        tags: filteredTags
      }
      
      return await this.updateLead(id, updateData)
    } catch (error) {
      console.error('❌ Erro ao remover tags do lead:', error)
      throw new Error(`Erro ao remover tags do lead: ${error}`)
    }
  }

  // ============= RELATÓRIOS E MÉTRICAS =============

  /**
   * Obter métricas de leads
   */
  async getLeadsMetrics(dataInicio?: string, dataFim?: string): Promise<any> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'leads')}/metrics`
      const params: any = {}
      
      if (dataInicio) params.dataInicio = dataInicio
      if (dataFim) params.dataFim = dataFim
      
      const response = await crefazApi.get(endpoint, params)
      
      console.log('✅ Métricas de leads obtidas com sucesso')
      return response
    } catch (error) {
      console.error('❌ Erro ao obter métricas de leads:', error)
      throw new Error(`Erro ao obter métricas de leads: ${error}`)
    }
  }

  /**
   * Obter leads por status
   */
  async getLeadsByStatus(status: Lead['status'], limit?: number): Promise<Lead[]> {
    try {
      const filters: LeadFilters = {
        status: [status],
        limit: limit || 50
      }
      
      const response = await this.getLeads(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar leads por status:', error)
      throw new Error(`Erro ao buscar leads por status: ${error}`)
    }
  }

  /**
   * Obter leads para contato hoje
   */
  async getLeadsForContactToday(): Promise<Lead[]> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const endpoint = `${getCrefazEndpoint(this.environment, 'leads')}/contact-today`
      const params = { data: today }
      
      const response = await crefazApi.get<Lead[]>(endpoint, params)
      
      console.log(`✅ ${response.length} leads para contato hoje`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar leads para contato:', error)
      throw new Error(`Erro ao buscar leads para contato: ${error}`)
    }
  }

  // ============= UTILITÁRIOS =============

  /**
   * Construir parâmetros de filtro para a API
   */
  private buildFilterParams(filters?: LeadFilters): any {
    if (!filters) return {}

    const params: any = {}

    // Paginação
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder

    // Filtros específicos
    if (filters.status?.length) params.status = filters.status.join(',')
    if (filters.origem?.length) params.origem = filters.origem.join(',')
    if (filters.responsavel?.length) params.responsavel = filters.responsavel.join(',')
    if (filters.tags?.length) params.tags = filters.tags.join(',')
    
    // Datas
    if (filters.dataInicio) params.dataInicio = filters.dataInicio
    if (filters.dataFim) params.dataFim = filters.dataFim
    
    // Busca
    if (filters.busca) params.busca = filters.busca

    return params
  }

  /**
   * Validar dados do lead antes de criar/atualizar
   */
  private validateLeadData(leadData: CreateLeadRequest | UpdateLeadRequest): void {
    // Validar CPF (formato básico)
    if ('cpf' in leadData && leadData.cpf) {
      const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/
      if (!cpfRegex.test(leadData.cpf)) {
        throw new Error('CPF deve ter formato válido (11 dígitos ou XXX.XXX.XXX-XX)')
      }
    }

    // Validar email
    if ('email' in leadData && leadData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(leadData.email)) {
        throw new Error('Email deve ter formato válido')
      }
    }

    // Validar telefone/WhatsApp
    if ('telefone' in leadData && leadData.telefone) {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/
      if (!phoneRegex.test(leadData.telefone)) {
        throw new Error('Telefone deve ter formato válido')
      }
    }

    if ('whatsapp' in leadData && leadData.whatsapp) {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/
      if (!phoneRegex.test(leadData.whatsapp)) {
        throw new Error('WhatsApp deve ter formato válido')
      }
    }
  }

  /**
   * Alterar ambiente do serviço
   */
  setEnvironment(environment: string): void {
    this.environment = environment
    crefazApi.setEnvironment(environment)
    console.log(`Ambiente do LeadsService alterado para: ${environment}`)
  }
}

// Instância singleton
export const leadsService = new LeadsService()

// Exportar classe para criar instâncias customizadas
export { LeadsService }
