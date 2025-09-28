import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { getCrefazApiConfig, getCrefazEndpoint } from '../config/environments'
import { ENV_CONFIG, getCurrentCredentials } from '../config/env'

// Interface para resposta de erro da API
interface ApiErrorResponse {
  message: string
  error?: string
  statusCode?: number
  timestamp?: string
  path?: string
}

// Interface para resposta de sucesso genérica
interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  timestamp?: string
}

// Interface para token de autenticação
interface AuthToken {
  access_token: string
  token_type: string
  expires_in: number
  scope?: string
  created_at?: number
}

class CrefazApiClient {
  private axiosInstance: AxiosInstance
  private accessToken: string | null = null
  private tokenExpiration: number = 0
  private environment: string = ENV_CONFIG.CREFAZ_ENVIRONMENT

  constructor(environment: string = 'staging') {
    this.environment = environment
    const config = getCrefazApiConfig(environment)
    
    // Criar instância do axios
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        ...ENV_CONFIG.DEFAULT_HEADERS,
      },
    })

    // Configurar interceptors
    this.setupInterceptors()
  }

  // Configurar interceptors de request e response
  private setupInterceptors(): void {
    // Interceptor de Request - adicionar token de autorização
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Verificar se precisa de autenticação (exceto para endpoint de auth)
        if (!config.url?.includes('/oauth/token')) {
          await this.ensureValidToken()
          if (this.accessToken) {
            config.headers.Authorization = `Bearer ${this.accessToken}`
          }
        }

        // Log da requisição (apenas em desenvolvimento)
        if (getCrefazApiConfig(this.environment).enableLogs) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
          if (config.data) {
            console.log('📤 Request Data:', config.data)
          }
        }

        return config
      },
      (error) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Interceptor de Response - tratar respostas e erros
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log da resposta (apenas em desenvolvimento)
        if (getCrefazApiConfig(this.environment).enableLogs) {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`)
          console.log('📥 Response Data:', response.data)
        }

        return response
      },
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // Log do erro
        if (getCrefazApiConfig(this.environment).enableLogs) {
          console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`)
          console.error('Error Data:', error.response?.data)
        }

        // Tratar erro 401 - Token expirado
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            // Tentar renovar o token
            await this.authenticate()
            
            // Repetir a requisição original com o novo token
            if (originalRequest && this.accessToken) {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${this.accessToken}`
              }
              return this.axiosInstance(originalRequest)
            }
          } catch (authError) {
            console.error('Erro ao renovar token:', authError)
            // Limpar token inválido
            this.clearToken()
            return Promise.reject(authError)
          }
        }

        // Tratar outros erros
        const errorMessage = this.formatErrorMessage(error)
        return Promise.reject(new Error(errorMessage))
      }
    )
  }

  // Garantir que o token é válido
  private async ensureValidToken(): Promise<void> {
    const now = Date.now()
    
    // Se não tem token ou está expirado, autenticar
    if (!this.accessToken || now >= this.tokenExpiration) {
      await this.authenticate()
    }
  }

  // Autenticar na API e obter token
  private async authenticate(): Promise<void> {
    try {
      const credentials = getCurrentCredentials()
      
      if (!credentials.clientId) {
        throw new Error('Client ID não configurado para o ambiente atual')
      }

      const authData = {
        grant_type: 'client_credentials',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret || ''
      }

      const response = await this.axiosInstance.post<AuthToken>(
        getCrefazEndpoint(this.environment, 'auth'),
        authData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      const token = response.data
      this.accessToken = token.access_token
      
      // Calcular expiração (com margem de segurança de 5 minutos)
      const expiresInMs = (token.expires_in - 300) * 1000
      this.tokenExpiration = Date.now() + expiresInMs

      console.log('✅ Autenticação realizada com sucesso')
      
    } catch (error) {
      console.error('❌ Erro na autenticação:', error)
      this.clearToken()
      throw error
    }
  }

  // Limpar token
  private clearToken(): void {
    this.accessToken = null
    this.tokenExpiration = 0
  }

  // Formatar mensagem de erro
  private formatErrorMessage(error: AxiosError<ApiErrorResponse>): string {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error.response?.statusText) {
      return `Erro ${error.response.status}: ${error.response.statusText}`
    }
    
    if (error.message) {
      return error.message
    }
    
    return 'Erro desconhecido na API'
  }

  // Métodos públicos para fazer requisições

  // GET
  async get<T = any>(endpoint: string, params?: any): Promise<T> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, { params })
    return response.data.data || response.data
  }

  // POST
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data)
    return response.data.data || response.data
  }

  // PUT
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data)
    return response.data.data || response.data
  }

  // DELETE
  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint)
    return response.data.data || response.data
  }

  // Método para alterar ambiente
  setEnvironment(environment: string): void {
    this.environment = environment
    const config = getCrefazApiConfig(environment)
    
    // Atualizar baseURL
    this.axiosInstance.defaults.baseURL = config.baseUrl
    this.axiosInstance.defaults.timeout = config.timeout
    
    // Limpar token atual (será renovado na próxima requisição)
    this.clearToken()
    
    console.log(`Ambiente da API alterado para: ${environment}`)
  }

  // Método para obter status da conexão
  async healthCheck(): Promise<boolean> {
    try {
      await this.axiosInstance.get('/health')
      return true
    } catch (error) {
      console.error('Health check falhou:', error)
      return false
    }
  }

  // Método para obter informações do token atual
  getTokenInfo(): { hasToken: boolean; expiresAt: number; isValid: boolean } {
    const now = Date.now()
    return {
      hasToken: !!this.accessToken,
      expiresAt: this.tokenExpiration,
      isValid: !!this.accessToken && now < this.tokenExpiration
    }
  }
}

// Instância singleton para staging
export const crefazApiStaging = new CrefazApiClient('staging')

// Instância singleton para production  
export const crefazApiProduction = new CrefazApiClient('production')

// Instância padrão (staging)
export const crefazApi = crefazApiStaging

// Exportar classe para criar instâncias customizadas
export { CrefazApiClient }

// Exportar tipos
export type { ApiResponse, ApiErrorResponse, AuthToken }
