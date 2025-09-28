import { crefazApi } from './crefazApiClient'
import { getCrefazEndpoint } from '../config/environments'
import { ENV_CONFIG } from '../config/env'
import type {
  Document,
  UploadDocumentRequest,
  DocumentType,
  DocumentStatus,
  PaginatedResponse,
  ApiResponse
} from '../types/crefazApi'

interface DocumentFilters {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  tipo?: DocumentType[]
  status?: DocumentStatus[]
  clienteId?: string
  leadId?: string
  propostaId?: string
  contratoId?: string
  dataInicio?: string
  dataFim?: string
  busca?: string
}

class DocumentsService {
  private environment: string = ENV_CONFIG.CREFAZ_ENVIRONMENT

  constructor(environment?: string) {
    if (environment) {
      this.environment = environment
    }
  }

  // ============= UPLOAD E GESTÃO DE DOCUMENTOS =============

  /**
   * Fazer upload de um documento
   */
  async uploadDocument(documentData: UploadDocumentRequest): Promise<Document> {
    try {
      // Validar dados antes do upload
      this.validateDocumentData(documentData)
      
      const endpoint = getCrefazEndpoint(this.environment, 'documents')
      const response = await crefazApi.post<Document>(endpoint, documentData)
      
      console.log('✅ Documento enviado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao enviar documento:', error)
      throw new Error(`Erro ao enviar documento: ${error}`)
    }
  }

  /**
   * Buscar documento por ID
   */
  async getDocumentById(id: string): Promise<Document> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'documents')}/${id}`
      const response = await crefazApi.get<Document>(endpoint)
      
      console.log('✅ Documento encontrado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar documento:', error)
      throw new Error(`Erro ao buscar documento: ${error}`)
    }
  }

  /**
   * Atualizar documento
   */
  async updateDocument(id: string, updateData: Partial<UploadDocumentRequest>): Promise<Document> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'documents')}/${id}`
      const response = await crefazApi.put<Document>(endpoint, updateData)
      
      console.log('✅ Documento atualizado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao atualizar documento:', error)
      throw new Error(`Erro ao atualizar documento: ${error}`)
    }
  }

  /**
   * Deletar documento
   */
  async deleteDocument(id: string): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'documents')}/${id}`
      await crefazApi.delete(endpoint)
      
      console.log('✅ Documento deletado com sucesso:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao deletar documento:', error)
      throw new Error(`Erro ao deletar documento: ${error}`)
    }
  }

  // ============= LISTAGEM E BUSCA =============

  /**
   * Listar documentos com filtros
   */
  async getDocuments(filters?: DocumentFilters): Promise<PaginatedResponse<Document>> {
    try {
      const endpoint = getCrefazEndpoint(this.environment, 'documents')
      const params = this.buildFilterParams(filters)
      
      const response = await crefazApi.get<PaginatedResponse<Document>>(endpoint, params)
      
      console.log(`✅ ${response.data.length} documentos encontrados`)
      return response
    } catch (error) {
      console.error('❌ Erro ao listar documentos:', error)
      throw new Error(`Erro ao listar documentos: ${error}`)
    }
  }

  /**
   * Buscar documentos por cliente
   */
  async getDocumentsByClient(clienteId: string, tipo?: DocumentType): Promise<Document[]> {
    try {
      const filters: DocumentFilters = {
        clienteId,
        tipo: tipo ? [tipo] : undefined,
        limit: 100
      }
      
      const response = await this.getDocuments(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar documentos do cliente:', error)
      throw new Error(`Erro ao buscar documentos do cliente: ${error}`)
    }
  }

  /**
   * Buscar documentos por lead
   */
  async getDocumentsByLead(leadId: string, tipo?: DocumentType): Promise<Document[]> {
    try {
      const filters: DocumentFilters = {
        leadId,
        tipo: tipo ? [tipo] : undefined,
        limit: 100
      }
      
      const response = await this.getDocuments(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar documentos do lead:', error)
      throw new Error(`Erro ao buscar documentos do lead: ${error}`)
    }
  }

  /**
   * Buscar documentos por proposta
   */
  async getDocumentsByProposal(propostaId: string): Promise<Document[]> {
    try {
      const filters: DocumentFilters = {
        propostaId,
        limit: 100
      }
      
      const response = await this.getDocuments(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar documentos da proposta:', error)
      throw new Error(`Erro ao buscar documentos da proposta: ${error}`)
    }
  }

  /**
   * Buscar documentos por contrato
   */
  async getDocumentsByContract(contratoId: string): Promise<Document[]> {
    try {
      const filters: DocumentFilters = {
        contratoId,
        limit: 100
      }
      
      const response = await this.getDocuments(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar documentos do contrato:', error)
      throw new Error(`Erro ao buscar documentos do contrato: ${error}`)
    }
  }

  // ============= OPERAÇÕES ESPECÍFICAS =============

  /**
   * Aprovar documento
   */
  async approveDocument(id: string, observacoes?: string): Promise<Document> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'documents')}/${id}/approve`
      const response = await crefazApi.post<Document>(endpoint, { observacoes })
      
      console.log('✅ Documento aprovado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao aprovar documento:', error)
      throw new Error(`Erro ao aprovar documento: ${error}`)
    }
  }

  /**
   * Rejeitar documento
   */
  async rejectDocument(id: string, motivo: string): Promise<Document> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'documents')}/${id}/reject`
      const response = await crefazApi.post<Document>(endpoint, { motivo })
      
      console.log('✅ Documento rejeitado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao rejeitar documento:', error)
      throw new Error(`Erro ao rejeitar documento: ${error}`)
    }
  }

  /**
   * Baixar documento (obter URL de download)
   */
  async downloadDocument(id: string): Promise<string> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'documents')}/${id}/download`
      const response = await crefazApi.get<{ url: string }>(endpoint)
      
      console.log('✅ URL de download obtida para documento:', id)
      return response.url
    } catch (error) {
      console.error('❌ Erro ao obter URL de download:', error)
      throw new Error(`Erro ao obter URL de download: ${error}`)
    }
  }

  // ============= UPLOAD HELPERS =============

  /**
   * Converter arquivo para base64
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  /**
   * Upload de arquivo direto (File -> API)
   */
  async uploadFile(
    file: File,
    tipo: DocumentType,
    entityId: string,
    entityType: 'cliente' | 'lead' | 'proposta' | 'contrato'
  ): Promise<Document> {
    try {
      // Validar arquivo
      this.validateFile(file)
      
      // Converter para base64
      const base64 = await this.fileToBase64(file)
      
      // Preparar dados do documento
      const documentData: UploadDocumentRequest = {
        nome: file.name,
        tipo,
        arquivo: base64,
        mimeType: file.type,
        [`${entityType}Id`]: entityId
      }
      
      return await this.uploadDocument(documentData)
    } catch (error) {
      console.error('❌ Erro ao fazer upload do arquivo:', error)
      throw new Error(`Erro ao fazer upload do arquivo: ${error}`)
    }
  }

  /**
   * Upload múltiplo de arquivos
   */
  async uploadMultipleFiles(
    files: File[],
    tipo: DocumentType,
    entityId: string,
    entityType: 'cliente' | 'lead' | 'proposta' | 'contrato'
  ): Promise<Document[]> {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file, tipo, entityId, entityType)
      )
      
      const results = await Promise.all(uploadPromises)
      console.log(`✅ ${results.length} arquivos enviados com sucesso`)
      
      return results
    } catch (error) {
      console.error('❌ Erro no upload múltiplo:', error)
      throw new Error(`Erro no upload múltiplo: ${error}`)
    }
  }

  // ============= RELATÓRIOS E MÉTRICAS =============

  /**
   * Obter estatísticas de documentos
   */
  async getDocumentsStats(dataInicio?: string, dataFim?: string): Promise<any> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'documents')}/stats`
      const params: any = {}
      
      if (dataInicio) params.dataInicio = dataInicio
      if (dataFim) params.dataFim = dataFim
      
      const response = await crefazApi.get(endpoint, params)
      
      console.log('✅ Estatísticas de documentos obtidas')
      return response
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error)
      throw new Error(`Erro ao obter estatísticas: ${error}`)
    }
  }

  /**
   * Obter documentos pendentes de aprovação
   */
  async getPendingDocuments(): Promise<Document[]> {
    try {
      const filters: DocumentFilters = {
        status: ['pendente'],
        sortBy: 'createdAt',
        sortOrder: 'asc',
        limit: 100
      }
      
      const response = await this.getDocuments(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar documentos pendentes:', error)
      throw new Error(`Erro ao buscar documentos pendentes: ${error}`)
    }
  }

  // ============= UTILITÁRIOS =============

  /**
   * Construir parâmetros de filtro
   */
  private buildFilterParams(filters?: DocumentFilters): any {
    if (!filters) return {}

    const params: any = {}

    // Paginação
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder

    // Filtros específicos
    if (filters.tipo?.length) params.tipo = filters.tipo.join(',')
    if (filters.status?.length) params.status = filters.status.join(',')
    if (filters.clienteId) params.clienteId = filters.clienteId
    if (filters.leadId) params.leadId = filters.leadId
    if (filters.propostaId) params.propostaId = filters.propostaId
    if (filters.contratoId) params.contratoId = filters.contratoId
    
    // Datas
    if (filters.dataInicio) params.dataInicio = filters.dataInicio
    if (filters.dataFim) params.dataFim = filters.dataFim
    
    // Busca
    if (filters.busca) params.busca = filters.busca

    return params
  }

  /**
   * Validar dados do documento
   */
  private validateDocumentData(documentData: UploadDocumentRequest): void {
    if (!documentData.nome?.trim()) {
      throw new Error('Nome do documento é obrigatório')
    }

    if (!documentData.tipo) {
      throw new Error('Tipo do documento é obrigatório')
    }

    if (!documentData.arquivo) {
      throw new Error('Arquivo em base64 é obrigatório')
    }

    if (!documentData.mimeType) {
      throw new Error('Tipo MIME do arquivo é obrigatório')
    }

    // Validar base64
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (!base64Regex.test(documentData.arquivo)) {
      throw new Error('Arquivo deve estar em formato base64 válido')
    }

    // Verificar se pelo menos uma entidade está associada
    const hasEntity = documentData.clienteId || documentData.leadId || 
                      documentData.propostaId || documentData.contratoId
    
    if (!hasEntity) {
      throw new Error('Documento deve estar associado a pelo menos uma entidade (cliente, lead, proposta ou contrato)')
    }
  }

  /**
   * Validar arquivo
   */
  private validateFile(file: File): void {
    // Tamanho máximo: 10MB
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 10MB')
    }

    // Tipos permitidos
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido. Use: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF')
    }
  }

  /**
   * Obter tipos de documento disponíveis
   */
  getDocumentTypes(): { value: DocumentType; label: string }[] {
    return [
      { value: 'rg', label: 'RG - Registro Geral' },
      { value: 'cpf', label: 'CPF - Cadastro de Pessoa Física' },
      { value: 'comprovante_renda', label: 'Comprovante de Renda' },
      { value: 'comprovante_residencia', label: 'Comprovante de Residência' },
      { value: 'extrato_bancario', label: 'Extrato Bancário' },
      { value: 'contracheque', label: 'Contracheque' },
      { value: 'imposto_renda', label: 'Declaração de Imposto de Renda' },
      { value: 'outros', label: 'Outros Documentos' }
    ]
  }

  /**
   * Obter status de documento disponíveis
   */
  getDocumentStatuses(): { value: DocumentStatus; label: string; color: string }[] {
    return [
      { value: 'pendente', label: 'Pendente', color: 'yellow' },
      { value: 'processando', label: 'Processando', color: 'blue' },
      { value: 'aprovado', label: 'Aprovado', color: 'green' },
      { value: 'rejeitado', label: 'Rejeitado', color: 'red' }
    ]
  }

  /**
   * Alterar ambiente do serviço
   */
  setEnvironment(environment: string): void {
    this.environment = environment
    crefazApi.setEnvironment(environment)
    console.log(`Ambiente do DocumentsService alterado para: ${environment}`)
  }
}

// Instância singleton
export const documentsService = new DocumentsService()

// Exportar classe para criar instâncias customizadas
export { DocumentsService }

// Exportar tipos específicos do serviço
export type { DocumentFilters }
