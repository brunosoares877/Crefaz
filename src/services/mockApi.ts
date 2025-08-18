import { FormData, ApiResponse } from './api'

// Mock da API para testes
export const mockApi = {
  // Simular delay de rede
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock do cadastro de lead
  async cadastrarLead(data: FormData): Promise<ApiResponse> {
    // Simular delay de 1 segundo
    await this.delay(1000)

    // Simular validações
    if (!data.nome || !data.cpf || !data.whatsapp) {
      throw new Error('Dados obrigatórios não preenchidos')
    }

    // Simular CPF duplicado
    if (data.cpf === '017.102.264-55') {
      return {
        success: false,
        message: 'CPF já cadastrado no sistema'
      }
    }

    // Simular sucesso
    return {
      success: true,
      message: 'Lead cadastrado com sucesso! Entraremos em contato em breve.',
      data: {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        ...data
      }
    }
  },

  // Mock da validação de CPF
  async validarCPF(cpf: string): Promise<ApiResponse> {
    await this.delay(500)
    
    const cpfLimpo = cpf.replace(/\D/g, '')
    
    if (cpfLimpo.length !== 11) {
      return {
        success: false,
        message: 'CPF inválido'
      }
    }

    return {
      success: true,
      message: 'CPF válido',
      data: {
        isValid: true
      }
    }
  },

  // Mock do health check
  async healthCheck(): Promise<ApiResponse> {
    await this.delay(200)
    
    return {
      success: true,
      message: 'API funcionando normalmente',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString()
      }
    }
  }
}
