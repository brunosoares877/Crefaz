import { crefazApi } from './crefazApiClient'
import { getCrefazEndpoint } from '../config/environments'
import { ENV_CONFIG } from '../config/env'
import type {
  Proposta,
  CreatePropostaRequest,
  UpdatePropostaRequest,
  PropostaStatus,
  PropostaFilters,
  PaginatedResponse,
  ApiResponse
} from '../types/crefazApi'

class ProposalsService {
  private environment: string = ENV_CONFIG.CREFAZ_ENVIRONMENT

  constructor(environment?: string) {
    if (environment) {
      this.environment = environment
    }
  }

  // ============= CRUD BÁSICO =============

  /**
   * Criar uma nova proposta
   */
  async createProposal(proposalData: CreatePropostaRequest): Promise<Proposta> {
    try {
      // Validar dados antes de criar
      this.validateProposalData(proposalData)
      
      const endpoint = getCrefazEndpoint(this.environment, 'proposals')
      const response = await crefazApi.post<Proposta>(endpoint, proposalData)
      
      console.log('✅ Proposta criada com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao criar proposta:', error)
      throw new Error(`Erro ao criar proposta: ${error}`)
    }
  }

  /**
   * Buscar proposta por ID
   */
  async getProposalById(id: string): Promise<Proposta> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}`
      const response = await crefazApi.get<Proposta>(endpoint)
      
      console.log('✅ Proposta encontrada:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar proposta:', error)
      throw new Error(`Erro ao buscar proposta: ${error}`)
    }
  }

  /**
   * Atualizar proposta
   */
  async updateProposal(id: string, updateData: UpdatePropostaRequest): Promise<Proposta> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}`
      const response = await crefazApi.put<Proposta>(endpoint, updateData)
      
      console.log('✅ Proposta atualizada com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao atualizar proposta:', error)
      throw new Error(`Erro ao atualizar proposta: ${error}`)
    }
  }

  /**
   * Deletar proposta
   */
  async deleteProposal(id: string): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}`
      await crefazApi.delete(endpoint)
      
      console.log('✅ Proposta deletada com sucesso:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao deletar proposta:', error)
      throw new Error(`Erro ao deletar proposta: ${error}`)
    }
  }

  // ============= LISTAGEM E BUSCA =============

  /**
   * Listar propostas com filtros e paginação
   */
  async getProposals(filters?: PropostaFilters): Promise<PaginatedResponse<Proposta>> {
    try {
      const endpoint = getCrefazEndpoint(this.environment, 'proposals')
      const params = this.buildFilterParams(filters)
      
      const response = await crefazApi.get<PaginatedResponse<Proposta>>(endpoint, params)
      
      console.log(`✅ ${response.data.length} propostas encontradas`)
      return response
    } catch (error) {
      console.error('❌ Erro ao listar propostas:', error)
      throw new Error(`Erro ao listar propostas: ${error}`)
    }
  }

  /**
   * Buscar propostas por cliente
   */
  async getProposalsByClient(clienteId: string): Promise<Proposta[]> {
    try {
      const filters: PropostaFilters = {
        clienteId,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      const response = await this.getProposals(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar propostas do cliente:', error)
      throw new Error(`Erro ao buscar propostas do cliente: ${error}`)
    }
  }

  /**
   * Buscar propostas por produto
   */
  async getProposalsByProduct(produtoId: string): Promise<Proposta[]> {
    try {
      const filters: PropostaFilters = {
        produtoId,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      const response = await this.getProposals(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar propostas do produto:', error)
      throw new Error(`Erro ao buscar propostas do produto: ${error}`)
    }
  }

  /**
   * Buscar propostas por status
   */
  async getProposalsByStatus(status: PropostaStatus): Promise<Proposta[]> {
    try {
      const filters: PropostaFilters = {
        status: [status],
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      const response = await this.getProposals(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar propostas por status:', error)
      throw new Error(`Erro ao buscar propostas por status: ${error}`)
    }
  }

  // ============= OPERAÇÕES ESPECÍFICAS =============

  /**
   * Enviar proposta para análise
   */
  async submitProposal(id: string): Promise<Proposta> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}/submit`
      const response = await crefazApi.post<Proposta>(endpoint)
      
      console.log('✅ Proposta enviada para análise:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao enviar proposta:', error)
      throw new Error(`Erro ao enviar proposta: ${error}`)
    }
  }

  /**
   * Aprovar proposta
   */
  async approveProposal(
    id: string, 
    approvalData: {
      valorAprovado: number
      taxaJuros: number
      observacoes?: string
    }
  ): Promise<Proposta> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}/approve`
      const response = await crefazApi.post<Proposta>(endpoint, approvalData)
      
      console.log('✅ Proposta aprovada:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao aprovar proposta:', error)
      throw new Error(`Erro ao aprovar proposta: ${error}`)
    }
  }

  /**
   * Rejeitar proposta
   */
  async rejectProposal(id: string, motivo: string): Promise<Proposta> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}/reject`
      const response = await crefazApi.post<Proposta>(endpoint, { motivo })
      
      console.log('✅ Proposta rejeitada:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao rejeitar proposta:', error)
      throw new Error(`Erro ao rejeitar proposta: ${error}`)
    }
  }

  /**
   * Cancelar proposta
   */
  async cancelProposal(id: string, motivo?: string): Promise<Proposta> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}/cancel`
      const response = await crefazApi.post<Proposta>(endpoint, { motivo })
      
      console.log('✅ Proposta cancelada:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao cancelar proposta:', error)
      throw new Error(`Erro ao cancelar proposta: ${error}`)
    }
  }

  /**
   * Renovar proposta expirada
   */
  async renewProposal(id: string, novaDataVencimento: string): Promise<Proposta> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}/renew`
      const response = await crefazApi.post<Proposta>(endpoint, { 
        dataVencimento: novaDataVencimento 
      })
      
      console.log('✅ Proposta renovada:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao renovar proposta:', error)
      throw new Error(`Erro ao renovar proposta: ${error}`)
    }
  }

  // ============= SIMULAÇÕES E CÁLCULOS =============

  /**
   * Simular proposta (calcular valores sem criar)
   */
  async simulateProposal(simulationData: {
    produtoId: string
    valorSolicitado: number
    prazoMeses: number
    taxaJuros?: number
  }): Promise<{
    valorSolicitado: number
    valorParcela: number
    valorTotal: number
    taxaJuros: number
    prazoMeses: number
    custoEfetivoTotal: number
  }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/simulate`
      const response = await crefazApi.post(endpoint, simulationData)
      
      console.log('✅ Simulação de proposta realizada')
      return response
    } catch (error) {
      console.error('❌ Erro na simulação:', error)
      throw new Error(`Erro na simulação: ${error}`)
    }
  }

  /**
   * Recalcular valores da proposta
   */
  async recalculateProposal(id: string, newData: {
    valorSolicitado?: number
    prazoMeses?: number
    taxaJuros?: number
  }): Promise<Proposta> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}/recalculate`
      const response = await crefazApi.post<Proposta>(endpoint, newData)
      
      console.log('✅ Proposta recalculada:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao recalcular proposta:', error)
      throw new Error(`Erro ao recalcular proposta: ${error}`)
    }
  }

  // ============= DOCUMENTOS DA PROPOSTA =============

  /**
   * Gerar contrato da proposta (PDF)
   */
  async generateContract(id: string): Promise<{ url: string; contractId: string }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}/generate-contract`
      const response = await crefazApi.post<{ url: string; contractId: string }>(endpoint)
      
      console.log('✅ Contrato gerado para proposta:', id)
      return response
    } catch (error) {
      console.error('❌ Erro ao gerar contrato:', error)
      throw new Error(`Erro ao gerar contrato: ${error}`)
    }
  }

  /**
   * Gerar proposta em PDF
   */
  async generateProposalPDF(id: string): Promise<{ url: string }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/${id}/generate-pdf`
      const response = await crefazApi.post<{ url: string }>(endpoint)
      
      console.log('✅ PDF da proposta gerado:', id)
      return response
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error)
      throw new Error(`Erro ao gerar PDF: ${error}`)
    }
  }

  // ============= RELATÓRIOS E MÉTRICAS =============

  /**
   * Obter métricas de propostas
   */
  async getProposalsMetrics(dataInicio?: string, dataFim?: string): Promise<{
    total: number
    enviadas: number
    aprovadas: number
    rejeitadas: number
    expiradas: number
    taxaAprovacao: number
    valorTotalSolicitado: number
    valorTotalAprovado: number
  }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/metrics`
      const params: any = {}
      
      if (dataInicio) params.dataInicio = dataInicio
      if (dataFim) params.dataFim = dataFim
      
      const response = await crefazApi.get(endpoint, params)
      
      console.log('✅ Métricas de propostas obtidas')
      return response
    } catch (error) {
      console.error('❌ Erro ao obter métricas:', error)
      throw new Error(`Erro ao obter métricas: ${error}`)
    }
  }

  /**
   * Obter propostas próximas ao vencimento
   */
  async getExpiringProposals(diasAntecedencia: number = 7): Promise<Proposta[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'proposals')}/expiring`
      const params = { dias: diasAntecedencia }
      
      const response = await crefazApi.get<Proposta[]>(endpoint, params)
      
      console.log(`✅ ${response.length} propostas próximas ao vencimento`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar propostas expirando:', error)
      throw new Error(`Erro ao buscar propostas expirando: ${error}`)
    }
  }

  /**
   * Obter propostas pendentes de análise
   */
  async getPendingProposals(): Promise<Proposta[]> {
    try {
      return await this.getProposalsByStatus('em_analise')
    } catch (error) {
      console.error('❌ Erro ao buscar propostas pendentes:', error)
      throw new Error(`Erro ao buscar propostas pendentes: ${error}`)
    }
  }

  // ============= UTILITÁRIOS =============

  /**
   * Construir parâmetros de filtro
   */
  private buildFilterParams(filters?: PropostaFilters): any {
    if (!filters) return {}

    const params: any = {}

    // Paginação
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder

    // Filtros específicos
    if (filters.status?.length) params.status = filters.status.join(',')
    if (filters.clienteId) params.clienteId = filters.clienteId
    if (filters.produtoId) params.produtoId = filters.produtoId
    if (filters.responsavel?.length) params.responsavel = filters.responsavel.join(',')
    
    // Valores
    if (filters.valorMinimo) params.valorMinimo = filters.valorMinimo
    if (filters.valorMaximo) params.valorMaximo = filters.valorMaximo
    
    // Datas
    if (filters.dataInicio) params.dataInicio = filters.dataInicio
    if (filters.dataFim) params.dataFim = filters.dataFim
    
    // Busca
    if (filters.busca) params.busca = filters.busca

    return params
  }

  /**
   * Validar dados da proposta
   */
  private validateProposalData(proposalData: CreatePropostaRequest): void {
    if (!proposalData.clienteId?.trim()) {
      throw new Error('ID do cliente é obrigatório')
    }

    if (!proposalData.produtoId?.trim()) {
      throw new Error('ID do produto é obrigatório')
    }

    if (!proposalData.valorSolicitado || proposalData.valorSolicitado <= 0) {
      throw new Error('Valor solicitado deve ser maior que zero')
    }

    if (!proposalData.prazoMeses || proposalData.prazoMeses <= 0) {
      throw new Error('Prazo em meses deve ser maior que zero')
    }

    if (!proposalData.dataVencimento) {
      throw new Error('Data de vencimento é obrigatória')
    }

    // Validar data de vencimento (não pode ser no passado)
    const dataVencimento = new Date(proposalData.dataVencimento)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    if (dataVencimento < hoje) {
      throw new Error('Data de vencimento não pode ser no passado')
    }
  }

  /**
   * Calcular valor da parcela (Price)
   */
  calculateInstallment(principal: number, monthlyRate: number, months: number): number {
    if (monthlyRate === 0) {
      return principal / months
    }
    
    const factor = Math.pow(1 + monthlyRate, months)
    return principal * (monthlyRate * factor) / (factor - 1)
  }

  /**
   * Obter status de proposta disponíveis
   */
  getProposalStatuses(): { value: PropostaStatus; label: string; color: string }[] {
    return [
      { value: 'rascunho', label: 'Rascunho', color: 'gray' },
      { value: 'enviada', label: 'Enviada', color: 'blue' },
      { value: 'em_analise', label: 'Em Análise', color: 'yellow' },
      { value: 'aprovada', label: 'Aprovada', color: 'green' },
      { value: 'rejeitada', label: 'Rejeitada', color: 'red' },
      { value: 'expirada', label: 'Expirada', color: 'orange' },
      { value: 'cancelada', label: 'Cancelada', color: 'gray' }
    ]
  }

  /**
   * Alterar ambiente do serviço
   */
  setEnvironment(environment: string): void {
    this.environment = environment
    crefazApi.setEnvironment(environment)
    console.log(`Ambiente do ProposalsService alterado para: ${environment}`)
  }
}

// Instância singleton
export const proposalsService = new ProposalsService()

// Exportar classe para criar instâncias customizadas
export { ProposalsService }
