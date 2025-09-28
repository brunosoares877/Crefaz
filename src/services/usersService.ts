import { crefazApi } from './crefazApiClient'
import { getCrefazEndpoint } from '../config/environments'
import { ENV_CONFIG } from '../config/env'
import type {
  Usuario,
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  UserRole,
  UserStatus,
  PaginatedResponse
} from '../types/crefazApi'

interface UserFilters {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  role?: UserRole[]
  status?: UserStatus[]
  departamento?: string[]
  busca?: string
}

class UsersService {
  private environment: string = ENV_CONFIG.CREFAZ_ENVIRONMENT

  constructor(environment?: string) {
    if (environment) {
      this.environment = environment
    }
  }

  // ============= CRUD BÁSICO =============

  async createUser(userData: CreateUsuarioRequest): Promise<Usuario> {
    try {
      this.validateUserData(userData)
      
      const endpoint = getCrefazEndpoint(this.environment, 'users')
      const response = await crefazApi.post<Usuario>(endpoint, userData)
      
      console.log('✅ Usuário criado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error)
      throw new Error(`Erro ao criar usuário: ${error}`)
    }
  }

  async getUserById(id: string): Promise<Usuario> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'users')}/${id}`
      const response = await crefazApi.get<Usuario>(endpoint)
      
      console.log('✅ Usuário encontrado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error)
      throw new Error(`Erro ao buscar usuário: ${error}`)
    }
  }

  async updateUser(id: string, updateData: UpdateUsuarioRequest): Promise<Usuario> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'users')}/${id}`
      const response = await crefazApi.put<Usuario>(endpoint, updateData)
      
      console.log('✅ Usuário atualizado com sucesso:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error)
      throw new Error(`Erro ao atualizar usuário: ${error}`)
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'users')}/${id}`
      await crefazApi.delete(endpoint)
      
      console.log('✅ Usuário deletado com sucesso:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error)
      throw new Error(`Erro ao deletar usuário: ${error}`)
    }
  }

  // ============= LISTAGEM E BUSCA =============

  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<Usuario>> {
    try {
      const endpoint = getCrefazEndpoint(this.environment, 'users')
      const params = this.buildFilterParams(filters)
      
      const response = await crefazApi.get<PaginatedResponse<Usuario>>(endpoint, params)
      
      console.log(`✅ ${response.data.length} usuários encontrados`)
      return response
    } catch (error) {
      console.error('❌ Erro ao listar usuários:', error)
      throw new Error(`Erro ao listar usuários: ${error}`)
    }
  }

  async getUserByEmail(email: string): Promise<Usuario | null> {
    try {
      const filters: UserFilters = {
        busca: email,
        limit: 1
      }
      
      const response = await this.getUsers(filters)
      const user = response.data.find(u => u.email === email)
      
      if (user) {
        console.log('✅ Usuário encontrado por email:', user.id)
        return user
      }
      
      return null
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por email:', error)
      throw new Error(`Erro ao buscar usuário por email: ${error}`)
    }
  }

  // ============= OPERAÇÕES ESPECÍFICAS =============

  async activateUser(id: string): Promise<Usuario> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'users')}/${id}/activate`
      const response = await crefazApi.post<Usuario>(endpoint)
      
      console.log('✅ Usuário ativado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao ativar usuário:', error)
      throw new Error(`Erro ao ativar usuário: ${error}`)
    }
  }

  async deactivateUser(id: string): Promise<Usuario> {
    try {
      const endpoint = `${getCrefazEndpoint(this.environment, 'users')}/${id}/deactivate`
      const response = await crefazApi.post<Usuario>(endpoint)
      
      console.log('✅ Usuário desativado:', response.id)
      return response
    } catch (error) {
      console.error('❌ Erro ao desativar usuário:', error)
      throw new Error(`Erro ao desativar usuário: ${error}`)
    }
  }

  // ============= UTILITÁRIOS =============

  private buildFilterParams(filters?: UserFilters): any {
    if (!filters) return {}

    const params: any = {}

    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder
    if (filters.role?.length) params.role = filters.role.join(',')
    if (filters.status?.length) params.status = filters.status.join(',')
    if (filters.departamento?.length) params.departamento = filters.departamento.join(',')
    if (filters.busca) params.busca = filters.busca

    return params
  }

  private validateUserData(userData: CreateUsuarioRequest): void {
    if (!userData.nome?.trim()) {
      throw new Error('Nome é obrigatório')
    }

    if (!userData.email?.trim()) {
      throw new Error('Email é obrigatório')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      throw new Error('Email deve ter formato válido')
    }

    if (!userData.password || userData.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres')
    }

    if (!userData.role) {
      throw new Error('Role é obrigatório')
    }
  }

  getUserRoles(): { value: UserRole; label: string }[] {
    return [
      { value: 'admin', label: 'Administrador' },
      { value: 'manager', label: 'Gerente' },
      { value: 'agent', label: 'Agente' },
      { value: 'viewer', label: 'Visualizador' }
    ]
  }

  setEnvironment(environment: string): void {
    this.environment = environment
    crefazApi.setEnvironment(environment)
    console.log(`Ambiente do UsersService alterado para: ${environment}`)
  }
}

export const usersService = new UsersService()
export { UsersService }
