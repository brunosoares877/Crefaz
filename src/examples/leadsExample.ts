// Exemplo de uso do serviço de leads da API Crefaz On
import { leadsService } from '../services/leadsService'
import { crefazApi } from '../services/crefazApiClient'
import type { CreateLeadRequest, UpdateLeadRequest, LeadFilters } from '../types/crefazApi'

/**
 * Exemplos de uso da API de Leads
 * Este arquivo demonstra como usar o serviço de leads integrado com a API Crefaz On
 */
export class LeadsExamples {
  
  /**
   * Exemplo 1: Criar um novo lead
   */
  static async exemploCreateLead() {
    console.log('\n🔄 Exemplo 1: Criando novo lead...')
    
    try {
      const novoLead: CreateLeadRequest = {
        nome: 'João Silva Santos',
        cpf: '12345678901',
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-9999',
        whatsapp: '(11) 99999-9999',
        dataNascimento: '1985-03-15',
        endereco: {
          cep: '01310-100',
          logradouro: 'Av. Paulista',
          numero: '1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP'
        },
        rendaMensal: 5000,
        profissao: 'Analista de Sistemas',
        empresa: 'Tech Solutions Ltda',
        origem: 'SITE_WEB',
        observacoes: 'Lead interessado em crédito consignado',
        responsavel: 'vendedor@empresa.com',
        tags: ['crédito-consignado', 'alta-renda', 'tech']
      }

      const leadCriado = await leadsService.createLead(novoLead)
      console.log('✅ Lead criado:', leadCriado)
      return leadCriado
      
    } catch (error) {
      console.error('❌ Erro ao criar lead:', error)
      throw error
    }
  }

  /**
   * Exemplo 2: Buscar leads com filtros
   */
  static async exemploSearchLeads() {
    console.log('\n🔄 Exemplo 2: Buscando leads com filtros...')
    
    try {
      const filtros: LeadFilters = {
        status: ['novo', 'contatado'],
        origem: ['SITE_WEB', 'FACEBOOK'],
        dataInicio: '2024-01-01',
        dataFim: '2024-12-31',
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }

      const resultado = await leadsService.getLeads(filtros)
      console.log(`✅ Encontrados ${resultado.data.length} leads`)
      console.log('Paginação:', resultado.pagination)
      
      return resultado
      
    } catch (error) {
      console.error('❌ Erro ao buscar leads:', error)
      throw error
    }
  }

  /**
   * Exemplo 3: Atualizar status do lead
   */
  static async exemploUpdateLeadStatus(leadId: string) {
    console.log('\n🔄 Exemplo 3: Atualizando status do lead...')
    
    try {
      const leadAtualizado = await leadsService.updateLeadStatus(
        leadId,
        'contatado',
        'Primeiro contato realizado via WhatsApp'
      )
      
      console.log('✅ Status atualizado:', leadAtualizado.status)
      return leadAtualizado
      
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error)
      throw error
    }
  }

  /**
   * Exemplo 4: Converter lead em cliente
   */
  static async exemploConvertLead(leadId: string) {
    console.log('\n🔄 Exemplo 4: Convertendo lead em cliente...')
    
    try {
      const dadosCliente = {
        observacoes: 'Lead convertido - documentos aprovados',
        responsavel: 'vendedor@empresa.com'
      }

      const leadConvertido = await leadsService.convertLead(leadId, dadosCliente)
      console.log('✅ Lead convertido:', leadConvertido.status)
      return leadConvertido
      
    } catch (error) {
      console.error('❌ Erro ao converter lead:', error)
      throw error
    }
  }

  /**
   * Exemplo 5: Buscar lead por CPF
   */
  static async exemploFindByCpf(cpf: string) {
    console.log('\n🔄 Exemplo 5: Buscando lead por CPF...')
    
    try {
      const lead = await leadsService.getLeadByCpf(cpf)
      
      if (lead) {
        console.log('✅ Lead encontrado:', lead.nome)
        return lead
      } else {
        console.log('ℹ️ Nenhum lead encontrado com este CPF')
        return null
      }
      
    } catch (error) {
      console.error('❌ Erro ao buscar por CPF:', error)
      throw error
    }
  }

  /**
   * Exemplo 6: Obter leads para contato hoje
   */
  static async exemploLeadsContactToday() {
    console.log('\n🔄 Exemplo 6: Buscando leads para contato hoje...')
    
    try {
      const leads = await leadsService.getLeadsForContactToday()
      console.log(`✅ ${leads.length} leads para contato hoje`)
      
      // Mostrar informações dos leads
      leads.forEach(lead => {
        console.log(`- ${lead.nome} (${lead.telefone}) - Status: ${lead.status}`)
      })
      
      return leads
      
    } catch (error) {
      console.error('❌ Erro ao buscar leads para contato:', error)
      throw error
    }
  }

  /**
   * Exemplo 7: Gerenciar tags do lead
   */
  static async exemploManageTags(leadId: string) {
    console.log('\n🔄 Exemplo 7: Gerenciando tags do lead...')
    
    try {
      // Adicionar tags
      let leadAtualizado = await leadsService.addTagsToLead(
        leadId,
        ['vip', 'urgente', 'follow-up']
      )
      console.log('✅ Tags adicionadas:', leadAtualizado.tags)

      // Remover uma tag
      leadAtualizado = await leadsService.removeTagsFromLead(
        leadId,
        ['urgente']
      )
      console.log('✅ Tag removida, tags atuais:', leadAtualizado.tags)
      
      return leadAtualizado
      
    } catch (error) {
      console.error('❌ Erro ao gerenciar tags:', error)
      throw error
    }
  }

  /**
   * Exemplo 8: Obter métricas de leads
   */
  static async exemploLeadsMetrics() {
    console.log('\n🔄 Exemplo 8: Obtendo métricas de leads...')
    
    try {
      const dataInicio = '2024-01-01'
      const dataFim = '2024-12-31'
      
      const metricas = await leadsService.getLeadsMetrics(dataInicio, dataFim)
      console.log('✅ Métricas obtidas:', metricas)
      
      return metricas
      
    } catch (error) {
      console.error('❌ Erro ao obter métricas:', error)
      throw error
    }
  }

  /**
   * Exemplo completo: Fluxo de trabalho com lead
   */
  static async exemploCompleteWorkflow() {
    console.log('\n🔄 Exemplo Completo: Fluxo completo de trabalho com lead...')
    
    try {
      // 1. Criar lead
      const novoLead = await this.exemploCreateLead()
      const leadId = novoLead.id

      // 2. Buscar o lead criado
      const leadEncontrado = await leadsService.getLeadById(leadId)
      console.log('Lead encontrado:', leadEncontrado.nome)

      // 3. Adicionar tags
      await leadsService.addTagsToLead(leadId, ['workflow-exemplo', 'teste'])

      // 4. Atualizar para "contatado"
      await leadsService.updateLeadStatus(leadId, 'contatado', 'Primeiro contato realizado')

      // 5. Agendar próximo contato
      const proximoContato = new Date()
      proximoContato.setDate(proximoContato.getDate() + 3)
      
      await leadsService.scheduleNextContact(
        leadId,
        proximoContato.toISOString(),
        'Reagendar para apresentação de proposta'
      )

      // 6. Atualizar para "interessado"
      await leadsService.updateLeadStatus(leadId, 'interessado', 'Cliente demonstrou interesse')

      // 7. Buscar lead final
      const leadFinal = await leadsService.getLeadById(leadId)
      
      console.log('✅ Fluxo completo finalizado!')
      console.log('Status final:', leadFinal.status)
      console.log('Tags:', leadFinal.tags)
      console.log('Próximo contato:', leadFinal.proximoContato)
      
      return leadFinal
      
    } catch (error) {
      console.error('❌ Erro no fluxo completo:', error)
      throw error
    }
  }

  /**
   * Testar conexão com a API
   */
  static async testarConexao() {
    console.log('\n🔄 Testando conexão com API Crefaz On...')
    
    try {
      // Verificar health check
      const isHealthy = await crefazApi.healthCheck()
      
      if (isHealthy) {
        console.log('✅ Conexão com API está funcionando')
      } else {
        console.log('⚠️ Problema na conexão com API')
      }

      // Verificar informações do token
      const tokenInfo = crefazApi.getTokenInfo()
      console.log('Token info:', tokenInfo)
      
      return isHealthy
      
    } catch (error) {
      console.error('❌ Erro ao testar conexão:', error)
      return false
    }
  }
}

/**
 * Função para executar todos os exemplos
 */
export async function executarExemplos() {
  console.log('🚀 Iniciando exemplos da API Crefaz On - Leads')
  console.log('=' .repeat(50))
  
  try {
    // Testar conexão primeiro
    const conexaoOk = await LeadsExamples.testarConexao()
    
    if (!conexaoOk) {
      console.log('❌ Não foi possível conectar à API. Verifique as configurações.')
      return
    }

    // Executar exemplos
    await LeadsExamples.exemploSearchLeads()
    await LeadsExamples.exemploLeadsContactToday()
    await LeadsExamples.exemploLeadsMetrics()
    
    // Exemplo completo (comentado para não criar dados de teste)
    // await LeadsExamples.exemploCompleteWorkflow()
    
    console.log('\n✅ Todos os exemplos foram executados com sucesso!')
    
  } catch (error) {
    console.error('\n❌ Erro ao executar exemplos:', error)
  }
}

// Executar exemplos se este arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  executarExemplos()
}
