import axios from 'axios'
import { API_CONFIG } from '../config/api'
import { getApiUrl, getEnvironmentConfig } from '../config/environments'

// Configuração base do Axios
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: getEnvironmentConfig().timeout,
  headers: API_CONFIG.DEFAULT_HEADERS,
})

// Interceptor para adicionar token de autenticação (se necessário)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const envConfig = getEnvironmentConfig()
    if (envConfig.enableLogs) {
      console.error('Erro na requisição:', error)
    }
    return Promise.reject(error)
  }
)

// Tipos para os dados do formulário
export interface FormData {
  nome: string
  whatsapp: string
  cpf: string
  dataNascimento: string
  companhiaEnergia: string
}

// Tipos para a resposta da API
export interface ApiResponse {
  success: boolean
  message: string
  data?: any
}

// Serviço para cadastro de leads
export const leadService = {
  // Cadastrar novo lead
  async cadastrarLead(data: FormData): Promise<ApiResponse> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.LEADS, data)
      return response.data
    } catch (error: any) {
      console.error('Erro na API externa:', error.message)
      throw new Error(error.response?.data?.message || 'Erro ao cadastrar lead')
    }
  },

  // Buscar leads (se necessário)
  async buscarLeads(): Promise<ApiResponse> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.LEADS)
      return response.data
    } catch (error: any) {
      console.error('Erro na API externa:', error.message)
      throw new Error(error.response?.data?.message || 'Erro ao buscar leads')
    }
  },

  // Validar CPF (se necessário)
  async validarCPF(cpf: string): Promise<ApiResponse> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.VALIDAR_CPF, { cpf })
      return response.data
    } catch (error: any) {
      console.error('Erro na API externa:', error.message)
      throw new Error(error.response?.data?.message || 'Erro ao validar CPF')
    }
  }
}

// Função helper para formatar CPF
export const formatarCPF = (cpf: string): string => {
  const cpfLimpo = cpf.replace(/\D/g, '').substring(0, 11)
  
  if (cpfLimpo.length <= 3) {
    return cpfLimpo
  } else if (cpfLimpo.length <= 6) {
    return cpfLimpo.replace(/(\d{3})(\d{0,3})/, '$1.$2')
  } else if (cpfLimpo.length <= 9) {
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
  } else {
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
  }
}

// Função helper para formatar telefone
export const formatarTelefone = (telefone: string): string => {
  const telefoneLimpo = telefone.replace(/\D/g, '').substring(0, 11)
  
  if (telefoneLimpo.length <= 2) {
    return telefoneLimpo.length > 0 ? `(${telefoneLimpo}` : telefoneLimpo
  } else if (telefoneLimpo.length <= 3) {
    return `(${telefoneLimpo.substring(0, 2)}) ${telefoneLimpo.substring(2)}`
  } else if (telefoneLimpo.length <= 7) {
    return `(${telefoneLimpo.substring(0, 2)}) ${telefoneLimpo.substring(2)}`
  } else if (telefoneLimpo.length <= 10) {
    return `(${telefoneLimpo.substring(0, 2)}) ${telefoneLimpo.substring(2, 6)}-${telefoneLimpo.substring(6)}`
  } else {
    return `(${telefoneLimpo.substring(0, 2)}) ${telefoneLimpo.substring(2, 7)}-${telefoneLimpo.substring(7)}`
  }
}

// Função helper para formatar data
export const formatarData = (data: string): string => {
  const dataLimpa = data.replace(/\D/g, '').substring(0, 8)
  
  if (dataLimpa.length <= 2) {
    return dataLimpa
  } else if (dataLimpa.length <= 4) {
    return dataLimpa.replace(/(\d{2})(\d{0,2})/, '$1/$2')
  } else {
    return dataLimpa.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3')
  }
}

export default api
