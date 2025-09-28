import { crefazApi } from './crefazApiClient'
import { getCrefazEndpoint } from '../config/environments'
import { ENV_CONFIG } from '../config/env'
import type {
  Contrato,
  CreateContratoRequest,
  UpdateContratoRequest,
  ContratoStatus,
  ContratoFilters,
  Parcela,
  ParcelaStatus,
  PaginatedResponse,
  ApiResponse
} from '../types/crefazApi'

class ContractsService {
  private environment: string = ENV_CONFIG.CREFAZ_ENVIRONMENT

  constructor(environment?: string) {
    if (environment) {
      this.environment = environment
    }
  }

  // ============= CRUD BÁSICO =============

  /**
   * Criar um novo contrato
   */
  async createContract(contractData: CreateContratoRequest): Promise<Contrato> {
    try {
      // Validar dados antes de criar
      this.validateContractData(contractData)
      
      const endpoint = getCrefazEndpoint(this.environment, 'contracts')
      const response = await crefazApi.post<Contrato>(endpoint, contractData)
      
      console.log('✅ Contrato criado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao criar contrato:', error)
      throw new Error(`Erro ao criar contrato: ${error}`)
    }
  }

  /**
   * Buscar contrato por ID
   */
  async getContractById(id: string): Promise<Contrato> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}`
      const response = await crefazApi.get<Contrato>(endpoint)
      
      console.log('✅ Contrato encontrado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar contrato:', error)
      throw new Error(`Erro ao buscar contrato: ${error}`)
    }
  }

  /**
   * Atualizar contrato
   */
  async updateContract(id: string, updateData: UpdateContratoRequest): Promise<Contrato> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}`
      const response = await crefazApi.put<Contrato>(endpoint, updateData)
      
      console.log('✅ Contrato atualizado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao atualizar contrato:', error)
      throw new Error(`Erro ao atualizar contrato: ${error}`)
    }
  }

  /**
   * Deletar contrato (soft delete)
   */
  async deleteContract(id: string): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}`
      await crefazApi.delete(endpoint)
      
      console.log('✅ Contrato deletado com sucesso:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao deletar contrato:', error)
      throw new Error(`Erro ao deletar contrato: ${error}`)
    }
  }

  // ============= LISTAGEM E BUSCA =============

  /**
   * Listar contratos com filtros e paginação
   */
  async getContracts(filters?: ContratoFilters): Promise<PaginatedResponse<Contrato>> {
    try {
      const endpoint = getCrefazEndpoint(this.environment, 'contracts')
      const params = this.buildFilterParams(filters)
      
      const response = await crefazApi.get<PaginatedResponse<Contrato>>(endpoint, params)
      
      console.log(`✅ ${response.data.length} contratos encontrados`)
      return response
    } catch (error) {
      console.error('❌ Erro ao listar contratos:', error)
      throw new Error(`Erro ao listar contratos: ${error}`)
    }
  }

  /**
   * Buscar contratos por cliente
   */
  async getContractsByClient(clienteId: string): Promise<Contrato[]> {
    try {
      const filters: ContratoFilters = {
        clienteId,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      const response = await this.getContracts(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar contratos do cliente:', error)
      throw new Error(`Erro ao buscar contratos do cliente: ${error}`)
    }
  }

  /**
   * Buscar contratos por proposta
   */
  async getContractsByProposal(propostaId: string): Promise<Contrato[]> {
    try {
      const filters: ContratoFilters = {
        propostaId,
        limit: 100
      }
      
      const response = await this.getContracts(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar contratos da proposta:', error)
      throw new Error(`Erro ao buscar contratos da proposta: ${error}`)
    }
  }

  /**
   * Buscar contratos por status
   */
  async getContractsByStatus(status: ContratoStatus): Promise<Contrato[]> {
    try {
      const filters: ContratoFilters = {
        status: [status],
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      const response = await this.getContracts(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar contratos por status:', error)
      throw new Error(`Erro ao buscar contratos por status: ${error}`)
    }
  }

  /**
   * Buscar contrato por número
   */
  async getContractByNumber(numero: string): Promise<Contrato | null> {
    try {
      const filters: ContratoFilters = {
        busca: numero,
        limit: 1
      }
      
      const response = await this.getContracts(filters)
      const contract = response.data.find(c => c.numero === numero)
      
      if (contract) {
        console.log('✅ Contrato encontrado por número:', contract.id)
        return contract
      }
      
      console.log('ℹ️ Nenhum contrato encontrado com o número:', numero)
      return null
    } catch (error) {
      console.error('❌ Erro ao buscar contrato por número:', error)
      throw new Error(`Erro ao buscar contrato por número: ${error}`)
    }
  }

  // ============= OPERAÇÕES ESPECÍFICAS =============

  /**
   * Ativar contrato
   */
  async activateContract(id: string, dataAssinatura?: string): Promise<Contrato> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}/activate`
      const response = await crefazApi.post<Contrato>(endpoint, { 
        dataAssinatura: dataAssinatura || new Date().toISOString() 
      })
      
      console.log('✅ Contrato ativado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao ativar contrato:', error)
      throw new Error(`Erro ao ativar contrato: ${error}`)
    }
  }

  /**
   * Suspender contrato
   */
  async suspendContract(id: string, motivo: string): Promise<Contrato> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}/suspend`
      const response = await crefazApi.post<Contrato>(endpoint, { motivo })
      
      console.log('✅ Contrato suspenso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao suspender contrato:', error)
      throw new Error(`Erro ao suspender contrato: ${error}`)
    }
  }

  /**
   * Reativar contrato suspenso
   */
  async reactivateContract(id: string): Promise<Contrato> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}/reactivate`
      const response = await crefazApi.post<Contrato>(endpoint)
      
      console.log('✅ Contrato reativado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao reativar contrato:', error)
      throw new Error(`Erro ao reativar contrato: ${error}`)
    }
  }

  /**
   * Cancelar contrato
   */
  async cancelContract(id: string, motivo: string): Promise<Contrato> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}/cancel`
      const response = await crefazApi.post<Contrato>(endpoint, { motivo })
      
      console.log('✅ Contrato cancelado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao cancelar contrato:', error)
      throw new Error(`Erro ao cancelar contrato: ${error}`)
    }
  }

  /**
   * Finalizar contrato (quitação)
   */
  async finalizeContract(id: string, dataQuitacao?: string): Promise<Contrato> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}/finalize`
      const response = await crefazApi.post<Contrato>(endpoint, { 
        dataQuitacao: dataQuitacao || new Date().toISOString() 
      })
      
      console.log('✅ Contrato finalizado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao finalizar contrato:', error)
      throw new Error(`Erro ao finalizar contrato: ${error}`)
    }
  }

  // ============= GESTÃO DE PARCELAS =============

  /**
   * Obter parcelas do contrato
   */
  async getContractInstallments(id: string): Promise<Parcela[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}/installments`
      const response = await crefazApi.get<Parcela[]>(endpoint)
      
      console.log(`✅ ${response.length} parcelas encontradas para o contrato`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar parcelas:', error)
      throw new Error(`Erro ao buscar parcelas: ${error}`)
    }
  }

  /**
   * Registrar pagamento de parcela
   */
  async payInstallment(
    contractId: string, 
    installmentId: string, 
    paymentData: {
      valorPago: number
      dataPagamento: string
      observacoes?: string
    }
  ): Promise<Parcela> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${contractId}/installments/${installmentId}/pay`
      const response = await crefazApi.post<Parcela>(endpoint, paymentData)
      
      console.log('✅ Pagamento de parcela registrado:', installmentId)
      return response
    } catch (error) {
      console.error('❌ Erro ao registrar pagamento:', error)
      throw new Error(`Erro ao registrar pagamento: ${error}`)
    }
  }

  /**
   * Marcar parcela como atrasada
   */
  async markInstallmentOverdue(contractId: string, installmentId: string): Promise<Parcela> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${contractId}/installments/${installmentId}/overdue`
      const response = await crefazApi.post<Parcela>(endpoint)
      
      console.log('✅ Parcela marcada como atrasada:', installmentId)
      return response
    } catch (error) {
      console.error('❌ Erro ao marcar parcela como atrasada:', error)
      throw new Error(`Erro ao marcar parcela como atrasada: ${error}`)
    }
  }

  /**
   * Obter parcelas em atraso
   */
  async getOverdueInstallments(diasAtraso?: number): Promise<{
    contrato: Contrato
    parcelas: Parcela[]
    totalAtrasado: number
  }[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/overdue-installments`
      const params: any = {}
      
      if (diasAtraso) params.diasAtraso = diasAtraso
      
      const response = await crefazApi.get(endpoint, params)
      
      console.log(`✅ Parcelas em atraso encontradas`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar parcelas em atraso:', error)
      throw new Error(`Erro ao buscar parcelas em atraso: ${error}`)
    }
  }

  /**
   * Obter parcelas vencendo
   */
  async getUpcomingInstallments(diasAntecedencia: number = 7): Promise<{
    contrato: Contrato
    parcelas: Parcela[]
  }[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/upcoming-installments`
      const params = { dias: diasAntecedencia }
      
      const response = await crefazApi.get(endpoint, params)
      
      console.log(`✅ Parcelas vencendo em ${diasAntecedencia} dias encontradas`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar parcelas vencendo:', error)
      throw new Error(`Erro ao buscar parcelas vencendo: ${error}`)
    }
  }

  // ============= DOCUMENTOS E RELATÓRIOS =============

  /**
   * Gerar boleto de parcela
   */
  async generateInstallmentBoleto(contractId: string, installmentId: string): Promise<{ url: string; boletoId: string }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${contractId}/installments/${installmentId}/boleto`
      const response = await crefazApi.post<{ url: string; boletoId: string }>(endpoint)
      
      console.log('✅ Boleto gerado para parcela:', installmentId)
      return response
    } catch (error) {
      console.error('❌ Erro ao gerar boleto:', error)
      throw new Error(`Erro ao gerar boleto: ${error}`)
    }
  }

  /**
   * Gerar extrato do contrato
   */
  async generateContractStatement(id: string, dataInicio?: string, dataFim?: string): Promise<{ url: string }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}/statement`
      const params: any = {}
      
      if (dataInicio) params.dataInicio = dataInicio
      if (dataFim) params.dataFim = dataFim
      
      const response = await crefazApi.post<{ url: string }>(endpoint, params)
      
      console.log('✅ Extrato do contrato gerado:', id)
      return response
    } catch (error) {
      console.error('❌ Erro ao gerar extrato:', error)
      throw new Error(`Erro ao gerar extrato: ${error}`)
    }
  }

  /**
   * Gerar termo de quitação
   */
  async generateQuitationTerm(id: string): Promise<{ url: string }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${id}/quitation-term`
      const response = await crefazApi.post<{ url: string }>(endpoint)
      
      console.log('✅ Termo de quitação gerado:', id)
      return response
    } catch (error) {
      console.error('❌ Erro ao gerar termo de quitação:', error)
      throw new Error(`Erro ao gerar termo de quitação: ${error}`)
    }
  }

  // ============= RELATÓRIOS E MÉTRICAS =============

  /**
   * Obter métricas de contratos
   */
  async getContractsMetrics(dataInicio?: string, dataFim?: string): Promise<{
    total: number
    ativos: number
    suspensos: number
    cancelados: number
    finalizados: number
    inadimplentes: number
    valorTotalContratos: number
    valorTotalPago: number
    valorTotalAtrasado: number
    taxaInadimplencia: number
    ticketMedio: number
  }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/metrics`
      const params: any = {}
      
      if (dataInicio) params.dataInicio = dataInicio
      if (dataFim) params.dataFim = dataFim
      
      const response = await crefazApi.get(endpoint, params)
      
      console.log('✅ Métricas de contratos obtidas')
      return response
    } catch (error) {
      console.error('❌ Erro ao obter métricas:', error)
      throw new Error(`Erro ao obter métricas: ${error}`)
    }
  }

  /**
   * Obter contratos inadimplentes
   */
  async getDefaultContracts(diasAtraso: number = 30): Promise<Contrato[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/defaults`
      const params = { diasAtraso }
      
      const response = await crefazApi.get<Contrato[]>(endpoint, params)
      
      console.log(`✅ ${response.length} contratos inadimplentes encontrados`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar contratos inadimplentes:', error)
      throw new Error(`Erro ao buscar contratos inadimplentes: ${error}`)
    }
  }

  /**
   * Obter contratos próximos ao vencimento
   */
  async getExpiringContracts(diasAntecedencia: number = 30): Promise<Contrato[]> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/expiring`
      const params = { dias: diasAntecedencia }
      
      const response = await crefazApi.get<Contrato[]>(endpoint, params)
      
      console.log(`✅ ${response.length} contratos próximos ao vencimento`)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar contratos expirando:', error)
      throw new Error(`Erro ao buscar contratos expirando: ${error}`)
    }
  }

  // ============= COMUNICAÇÃO E COBRANÇA =============

  /**
   * Enviar lembrete de vencimento
   */
  async sendPaymentReminder(contractId: string, installmentId: string, channel: 'sms' | 'email' | 'whatsapp'): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${contractId}/installments/${installmentId}/reminder`
      await crefazApi.post(endpoint, { channel })
      
      console.log(`✅ Lembrete enviado via ${channel} para parcela:`, installmentId)
      return true
    } catch (error) {
      console.error('❌ Erro ao enviar lembrete:', error)
      throw new Error(`Erro ao enviar lembrete: ${error}`)
    }
  }

  /**
   * Enviar notificação de atraso
   */
  async sendOverdueNotification(contractId: string, installmentId: string, diasAtraso: number): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'contracts')}/${contractId}/installments/${installmentId}/overdue-notification`
      await crefazApi.post(endpoint, { diasAtraso })
      
      console.log('✅ Notificação de atraso enviada para parcela:', installmentId)
      return true
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de atraso:', error)
      throw new Error(`Erro ao enviar notificação de atraso: ${error}`)
    }
  }

  // ============= UTILITÁRIOS =============

  /**
   * Construir parâmetros de filtro
   */
  private buildFilterParams(filters?: ContratoFilters): any {
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
    if (filters.propostaId) params.propostaId = filters.propostaId
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
   * Validar dados do contrato
   */
  private validateContractData(contractData: CreateContratoRequest): void {
    if (!contractData.propostaId?.trim()) {
      throw new Error('ID da proposta é obrigatório')
    }

    if (!contractData.dataVencimento) {
      throw new Error('Data de vencimento é obrigatória')
    }

    // Validar data de vencimento (não pode ser no passado)
    const dataVencimento = new Date(contractData.dataVencimento)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    if (dataVencimento < hoje) {
      throw new Error('Data de vencimento não pode ser no passado')
    }
  }

  /**
   * Calcular saldo devedor do contrato
   */
  calculateOutstandingBalance(contract: Contrato): number {
    if (!contract.parcelas) return contract.valorTotal

    const paidAmount = contract.parcelas
      .filter(p => p.status === 'paga')
      .reduce((sum, p) => sum + (p.valorPago || 0), 0)

    return contract.valorTotal - paidAmount
  }

  /**
   * Calcular percentual pago do contrato
   */
  calculatePaidPercentage(contract: Contrato): number {
    if (!contract.parcelas || contract.valorTotal === 0) return 0

    const paidAmount = contract.parcelas
      .filter(p => p.status === 'paga')
      .reduce((sum, p) => sum + (p.valorPago || 0), 0)

    return (paidAmount / contract.valorTotal) * 100
  }

  /**
   * Obter próxima parcela vencendo
   */
  getNextInstallment(contract: Contrato): Parcela | null {
    if (!contract.parcelas) return null

    const pendingInstallments = contract.parcelas
      .filter(p => p.status === 'pendente')
      .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())

    return pendingInstallments[0] || null
  }

  /**
   * Obter status de contrato disponíveis
   */
  getContractStatuses(): { value: ContratoStatus; label: string; color: string }[] {
    return [
      { value: 'rascunho', label: 'Rascunho', color: 'gray' },
      { value: 'ativo', label: 'Ativo', color: 'green' },
      { value: 'suspenso', label: 'Suspenso', color: 'yellow' },
      { value: 'cancelado', label: 'Cancelado', color: 'red' },
      { value: 'finalizado', label: 'Finalizado', color: 'blue' },
      { value: 'inadimplente', label: 'Inadimplente', color: 'red' }
    ]
  }

  /**
   * Obter status de parcela disponíveis
   */
  getInstallmentStatuses(): { value: ParcelaStatus; label: string; color: string }[] {
    return [
      { value: 'pendente', label: 'Pendente', color: 'gray' },
      { value: 'paga', label: 'Paga', color: 'green' },
      { value: 'atrasada', label: 'Atrasada', color: 'red' },
      { value: 'cancelada', label: 'Cancelada', color: 'gray' }
    ]
  }

  /**
   * Alterar ambiente do serviço
   */
  setEnvironment(environment: string): void {
    this.environment = environment
    crefazApi.setEnvironment(environment)
    console.log(`Ambiente do ContractsService alterado para: ${environment}`)
  }
}

// Instância singleton
export const contractsService = new ContractsService()

// Exportar classe para criar instâncias customizadas
export { ContractsService }
