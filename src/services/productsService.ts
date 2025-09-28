import { crefazApi } from './crefazApiClient'
import { getCrefazEndpoint } from '../config/environments'
import { ENV_CONFIG } from '../config/env'
import type {
  Produto,
  ProdutoType,
  ProdutoStatus,
  PaginatedResponse
} from '../types/crefazApi'

interface ProductFilters {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  tipo?: ProdutoType[]
  status?: ProdutoStatus[]
  categoria?: string[]
  carteiraId?: string
  instituicaoId?: string
  valorMinimo?: number
  valorMaximo?: number
  busca?: string
}

class ProductsService {
  private environment: string = ENV_CONFIG.CREFAZ_ENVIRONMENT

  constructor(environment?: string) {
    if (environment) {
      this.environment = environment
    }
  }

  // ============= LISTAGEM E BUSCA =============

  /**
   * Listar produtos com filtros
   */
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Produto>> {
    try {
      const endpoint = getCrefazEndpoint(this.environment, 'products')
      const params = this.buildFilterParams(filters)
      
      const response = await crefazApi.get<PaginatedResponse<Produto>>(endpoint, params)
      
      console.log(`✅ ${response.data.length} produtos encontrados`)
      return response
    } catch (error) {
      console.error('❌ Erro ao listar produtos:', error)
      throw new Error(`Erro ao listar produtos: ${error}`)
    }
  }

  /**
   * Buscar produto por ID
   */
  async getProductById(id: string): Promise<Produto> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'products')}/${id}`
      const response = await crefazApi.get<Produto>(endpoint)
      
      console.log('✅ Produto encontrado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar produto:', error)
      throw new Error(`Erro ao buscar produto: ${error}`)
    }
  }

  /**
   * Buscar produtos por tipo
   */
  async getProductsByType(tipo: ProdutoType): Promise<Produto[]> {
    try {
      const filters: ProductFilters = {
        tipo: [tipo],
        status: ['ativo'],
        limit: 100
      }
      
      const response = await this.getProducts(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar produtos por tipo:', error)
      throw new Error(`Erro ao buscar produtos por tipo: ${error}`)
    }
  }

  /**
   * Buscar produtos ativos
   */
  async getActiveProducts(): Promise<Produto[]> {
    try {
      const filters: ProductFilters = {
        status: ['ativo'],
        sortBy: 'nome',
        sortOrder: 'asc',
        limit: 100
      }
      
      const response = await this.getProducts(filters)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar produtos ativos:', error)
      throw new Error(`Erro ao buscar produtos ativos: ${error}`)
    }
  }

  // ============= SIMULAÇÕES =============

  /**
   * Simular financiamento
   */
  async simulateFinancing(
    produtoId: string,
    valor: number,
    prazoMeses: number
  ): Promise<{
    valorFinanciado: number
    valorParcela: number
    valorTotal: number
    taxaJuros: number
    custoEfetivoTotal: number
  }> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'products')}/${produtoId}/simulate`
      const response = await crefazApi.post(endpoint, { valor, prazoMeses })
      
      console.log('✅ Simulação realizada para produto:', produtoId)
      return response
    } catch (error) {
      console.error('❌ Erro na simulação:', error)
      throw new Error(`Erro na simulação: ${error}`)
    }
  }

  // ============= UTILITÁRIOS =============

  private buildFilterParams(filters?: ProductFilters): any {
    if (!filters) return {}

    const params: any = {}

    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder
    if (filters.tipo?.length) params.tipo = filters.tipo.join(',')
    if (filters.status?.length) params.status = filters.status.join(',')
    if (filters.categoria?.length) params.categoria = filters.categoria.join(',')
    if (filters.carteiraId) params.carteiraId = filters.carteiraId
    if (filters.instituicaoId) params.instituicaoId = filters.instituicaoId
    if (filters.valorMinimo) params.valorMinimo = filters.valorMinimo
    if (filters.valorMaximo) params.valorMaximo = filters.valorMaximo
    if (filters.busca) params.busca = filters.busca

    return params
  }

  /**
   * Obter tipos de produto disponíveis
   */
  getProductTypes(): { value: ProdutoType; label: string }[] {
    return [
      { value: 'credito_pessoal', label: 'Crédito Pessoal' },
      { value: 'credito_consignado', label: 'Crédito Consignado' },
      { value: 'financiamento', label: 'Financiamento' },
      { value: 'cartao_credito', label: 'Cartão de Crédito' },
      { value: 'outros', label: 'Outros' }
    ]
  }

  setEnvironment(environment: string): void {
    this.environment = environment
    crefazApi.setEnvironment(environment)
    console.log(`Ambiente do ProductsService alterado para: ${environment}`)
  }
}

export const productsService = new ProductsService()
export { ProductsService }
