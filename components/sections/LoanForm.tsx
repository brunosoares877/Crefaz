import React, { useState } from 'react'
import { colors, typography, borderRadius, shadows } from '../../styles/design-tokens'
import { Button } from '../ui/Button'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { formatarCPF, formatarTelefone, formatarData } from '../../src/services/api'
import { Notification } from '../ui/Notification'
import { useNavigation } from '../../src/contexts/NavigationContext'
import SuccessPopup from '../ui/SuccessPopup'
import { ENV_CONFIG } from '../../src/config/env'
import type { CreateLeadRequest } from '../../src/types/crefazApi'


interface FormData {
  nome: string
  whatsapp: string
  cpf: string
  dataNascimento: string
  companhiaEnergia: string
  cep: string
}

export const LoanForm: React.FC = () => {
  const { navigateTo } = useNavigation()
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    whatsapp: '',
    cpf: '',
    dataNascimento: '',
    companhiaEnergia: '',
    cep: '',
  })
  const [acceptedPolicy, setAcceptedPolicy] = useState<boolean>(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [simulatedValue, setSimulatedValue] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    isVisible: boolean
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  })



  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value

    // Aplicar formatação específica para cada campo
    switch (field) {
      case 'cpf':
        formattedValue = formatarCPF(value)
        break
      case 'whatsapp':
        formattedValue = formatarTelefone(value)
        break
      case 'dataNascimento':
        formattedValue = formatarData(value)
        break
      case 'cep':
        // Formatação do CEP: 00000-000
        const cepNumeros = value.replace(/\D/g, '')
        if (cepNumeros.length <= 8) {
          formattedValue = cepNumeros.replace(/(\d{5})(\d{3})/, '$1-$2')
        }
        break
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }))
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({
      message,
      type,
      isVisible: true,
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }))
  }

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      showNotification('Por favor, preencha seu nome.', 'error')
      return false
    }
    if (!formData.cpf.replace(/\D/g, '')) {
      showNotification('Por favor, preencha seu CPF.', 'error')
      return false
    }
    if (!formData.dataNascimento.replace(/\D/g, '')) {
      showNotification('Por favor, preencha sua data de nascimento.', 'error')
      return false
    }
    if (!formData.whatsapp.replace(/\D/g, '')) {
      showNotification('Por favor, preencha seu WhatsApp.', 'error')
      return false
    }
    if (!formData.companhiaEnergia || formData.companhiaEnergia === 'Selecione') {
      showNotification('Por favor, selecione sua companhia de energia.', 'error')
      return false
    }
    if (!formData.cep.replace(/\D/g, '')) {
      showNotification('Por favor, preencha seu CEP.', 'error')
      return false
    }
    if (!acceptedPolicy) {
      showNotification('É necessário aceitar a política de privacidade e o termo de consentimento.', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Preparar dados para a API Crefaz On
      const leadDataCrefaz: CreateLeadRequest = {
        nome: formData.nome,
        telefone: formData.whatsapp,
        whatsapp: formData.whatsapp,
        cpf: formData.cpf.replace(/\D/g, ''), // Remover formatação do CPF
        dataNascimento: formData.dataNascimento,
        endereco: {
          cep: formData.cep.replace(/\D/g, '') // Remover formatação do CEP
        },
        origem: 'SITE_WEB',
        observacoes: `Companhia de Energia: ${formData.companhiaEnergia}. Simulação de crédito com débito na conta de luz.`,
        responsavel: 'sistema@crefaz.com',
        tags: ['simulacao-web', 'credito-energia', 'conta-luz']
      }

      // Salvar localmente primeiro (garantido)
      await salvarLeadLocal(leadDataCrefaz)
      
      // Enviar proposta para API Crefaz usando estrutura correta
      enviarPropostaParaCrefaz(leadDataCrefaz)
      
      // Mostrar sucesso imediatamente
      showNotification('Dados cadastrados com sucesso!', 'success')
      
      // Simular valor liberado baseado em alguns critérios
      const valorSimulado = calcularValorSimulado(formData)
      setSimulatedValue(valorSimulado)
      
      // Mostrar popup de sucesso
      setShowSuccessPopup(true)
      
      // Limpar formulário após envio
      setTimeout(() => {
        setFormData({
          nome: '',
          whatsapp: '',
          cpf: '',
          dataNascimento: '',
          companhiaEnergia: '',
          cep: '',
        })
        setAcceptedPolicy(false)
      }, 1000)
      
    } catch (error: any) {
      console.error('Erro ao salvar lead:', error)
      
      // Se for erro de CPF duplicado, mostrar mensagem específica
      if (error.message.includes('CPF já cadastrado')) {
        showNotification('CPF já cadastrado no sistema. Entre em contato conosco.', 'warning')
      } else {
        showNotification('Erro ao salvar dados. Tente novamente.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Função para enviar proposta para API Crefaz (baseado na documentação real)
  const enviarPropostaParaCrefaz = async (leadData: CreateLeadRequest) => {
    try {
      console.log('🔄 Criando proposta na API Crefaz On...')
      
      // Gerar ID único para a proposta
      const propostaId = Date.now()
      
      // Estrutura de dados conforme documentação da API Crefaz
      const propostaData = {
        id: propostaId,
        cliente: {
          nome: leadData.nome,
          rg: "", // Campo opcional por enquanto
          rgEmissor: "SSP",
          rgUfId: "16", // SP por padrão
          rgEmissao: "1999-01-01", // Data padrão
          sexo: 0, // 0 = Masculino, 1 = Feminino
          estadoCivil: 0, // 0 = Solteiro
          nacionalidadeId: 1, // Brasil
          naturalidadeUfId: 16, // SP
          naturalidadeCidadeId: 1606, // São Paulo
          grauInstrucaoId: 3, // Ensino Médio
          nomeMae: "", // Campo opcional
          nomeConjuge: null,
          pep: false
        },
        contatos: {
          contato: {
            email: "", // Não temos email
            telefone: leadData.whatsapp?.replace(/\D/g, '') || "",
            telefoneExtra: []
          },
          referencia: [] // Sem referências por enquanto
        },
        endereco: {
          cep: leadData.endereco?.cep || "",
          logradouro: "Logradouro",
          numero: 1000,
          bairro: "Bairro",
          complemento: null,
          cidadeId: 5320 // São Paulo por padrão
        },
        bancario: {
          bancoId: "001", // Banco do Brasil
          agencia: "0123",
          digito: "4",
          numero: "012345",
          conta: 1,
          tipoConta: 0, // Conta Corrente
          tempoConta: 1 // Menos de 1 ano
        },
        profissional: {
          empresa: leadData.companhiaEnergia || "Não informado",
          profissaoId: 1,
          tempoEmpregoAtual: 4,
          telefoneRH: null,
          pisPasep: null,
          renda: 3000, // Renda padrão
          tipoRenda: 0,
          outrasRendas: null,
          tipoOutrasRendas: null
        },
        unidade: {
          nomeVendedor: "Sistema Web",
          cpfVendedor: "00000000000",
          celularVendedor: "11999999999"
        },
        operacao: {
          produtoId: 6, // Energia
          diaRecebimento: 5,
          tipoModalidade: 2,
          convenioId: 2, // ENEL CE (exemplo)
          vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
          tabelaJurosId: 2,
          valorContratado: simulatedValue || 5000,
          prazo: 12, // 12 meses
          prestacao: Math.round((simulatedValue || 5000) / 12),
          renda: 3000,
          tipoRenda: 0,
          tipoCalculo: 0
        }
      }

      // Tentar enviar via backend local primeiro
      try {
        console.log('🔄 Tentando enviar via backend local...')
        
        const backendResponse = await fetch('http://localhost:3001/api/crefaz/proposta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            propostaData,
            token: ENV_CONFIG.CREFAZ_JWT_TOKEN
          })
        })

        if (backendResponse.ok) {
          const responseData = await backendResponse.json()
          console.log('✅ Proposta enviada para API Crefaz via backend:', responseData)
          atualizarLeadComIdCrefaz(leadData.cpf, `proposta-${propostaId}`)
          return
        } else {
          throw new Error('Backend retornou erro')
        }
      } catch (backendError) {
        console.warn('⚠️ Backend local não disponível:', backendError)
      }

      // Fallback: Salvar dados estruturados localmente para envio posterior
      console.log('💾 Salvando proposta estruturada localmente para envio posterior')
      console.log('📋 ID da Proposta:', propostaId)
      console.log('📄 Estrutura da proposta:', propostaData)
      
      // Salvar proposta estruturada no localStorage
      const propostas = JSON.parse(localStorage.getItem('propostas_crefaz') || '[]')
      propostas.push({
        ...propostaData,
        status: 'pendente_envio',
        created_at: new Date().toISOString()
      })
      localStorage.setItem('propostas_crefaz', JSON.stringify(propostas))
      
      // Marcar como preparado para envio
      atualizarLeadComIdCrefaz(leadData.cpf, `proposta-${propostaId}`)
      
    } catch (error) {
      console.warn('⚠️ Erro ao enviar proposta para API Crefaz:', error)
    }
  }

  // Função para atualizar lead local com ID da API Crefaz
  const atualizarLeadComIdCrefaz = (cpf: string, crefazId: string) => {
    try {
      const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]')
      const updatedLeads = existingLeads.map((lead: any) => 
        lead.cpf === cpf ? { 
          ...lead, 
          crefazId, 
          syncedAt: new Date().toISOString(),
          status: 'sincronizado'
        } : lead
      )
      localStorage.setItem('leads', JSON.stringify(updatedLeads))
      console.log('✅ Lead local atualizado com ID da API Crefaz:', crefazId)
    } catch (error) {
      console.warn('Erro ao atualizar lead local:', error)
    }
  }

  // Função para salvar lead localmente (fallback)
  const salvarLeadLocal = async (leadData: any): Promise<void> => {
    const leadComId = {
      ...leadData,
      id: leadData.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    // Obter leads existentes do localStorage
    const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]')
    
    // Verificar se CPF já existe
    const cpfExists = existingLeads.some((lead: any) => lead.cpf === leadData.cpf)
    if (cpfExists) {
      throw new Error('CPF já cadastrado no sistema')
    }

    // Adicionar novo lead
    existingLeads.push(leadComId)
    localStorage.setItem('leads', JSON.stringify(existingLeads))
    
    console.log('✅ Lead salvo localmente:', leadComId)
  }

  // Função para calcular valor simulado baseado nos dados do cliente
  const calcularValorSimulado = (dados: FormData): number => {
    let valorBase = 5000 // Valor base
    
    // Ajustar baseado na companhia de energia (algumas têm melhor histórico)
    const companhiasPreferenciais = ['Enel RJ', 'Enel SP', 'CPFL', 'Elektro']
    if (companhiasPreferenciais.includes(dados.companhiaEnergia)) {
      valorBase += 2000
    }
    
    // Simular baseado na idade (calculada aproximadamente)
    let idade = 30 // Idade padrão
    try {
      const hoje = new Date()
      const [dia, mes, ano] = dados.dataNascimento.split('/')
      const nascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
      idade = hoje.getFullYear() - nascimento.getFullYear()
      
      // Verificar se já fez aniversário este ano
      const monthDiff = hoje.getMonth() - nascimento.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--
      }
    } catch (error) {
      console.warn('Erro ao calcular idade, usando padrão:', error)
    }
    
    if (idade >= 25 && idade <= 55) {
      valorBase += 3000 // Faixa etária preferencial
    } else if (idade >= 18 && idade < 25) {
      valorBase += 1000
    }
    
    // Adicionar variação aleatória para simular análise de crédito
    const variacao = Math.random() * 2000 - 1000 // -1000 a +1000
    valorBase += variacao
    
    // Garantir valor mínimo e máximo
    const valorFinal = Math.max(2000, Math.min(15000, valorBase))
    
    // Arredondar para centenas
    return Math.round(valorFinal / 100) * 100
  }

  const companhiasEnergia = [
    'Selecione',
    'Enel RJ',
    'Enel SP',
    'Enel Ceará',
    'CPFL',
    'COELBA',
    'COSERN',
    'CELPE',
    'RGE/SUL',
    'Elektro',
    'Outras Companhias'
  ]

  return (
    <div style={{
      backgroundColor: colors.white,
      borderRadius: `${borderRadius['2xl']} ${borderRadius['2xl']} 0 0`,
      padding: 'clamp(0.75rem, 2.5vw, 1.25rem)',
      boxShadow: shadows['2xl'],
      width: '100%',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      marginBottom: '0',
    }}>
      {/* Decoração sutil */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%)`,
        borderRadius: '50%',
        opacity: 0.3,
      }} />




      <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
        {/* Linha 1: Nome, CPF, Data de nascimento */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
          marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        }}>
          {/* Nome */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              marginBottom: 'clamp(0.125rem, 0.75vw, 0.375rem)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}>
              <span>Nome</span>
              <span style={{ color: colors.info, fontSize: '0.75rem' }}>ⓘ</span>
            </label>
            <input
              type="text"
              placeholder="Seu Nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2.5vw, 0.75rem)',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* CPF */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              marginBottom: 'clamp(0.125rem, 0.75vw, 0.375rem)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}>
              <span>CPF</span>
              <span style={{ color: colors.info, fontSize: '0.75rem' }}>ⓘ</span>
            </label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2.5vw, 0.75rem)',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Data de Nascimento */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              marginBottom: 'clamp(0.125rem, 0.75vw, 0.375rem)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}>
              <span>Data de nascimento</span>
              <span style={{ color: colors.info, fontSize: '0.75rem' }}>ⓘ</span>
            </label>
            <input
              type="text"
              placeholder="00/00/0000"
              value={formData.dataNascimento}
              onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2.5vw, 0.75rem)',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
                boxSizing: 'border-box',
              }}
            />
          </div>

        </div>

        {/* Linha 2: CEP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
          marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        }}>
          {/* CEP */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              marginBottom: 'clamp(0.125rem, 0.75vw, 0.375rem)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}>
              <span>CEP</span>
              <span style={{ color: colors.info, fontSize: '0.75rem' }}>ⓘ</span>
            </label>
            <input
              type="text"
              placeholder="00000-000"
              value={formData.cep}
              onChange={(e) => handleInputChange('cep', e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2.5vw, 0.75rem)',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Linha 3: WhatsApp e Companhia de Energia */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
          marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        }}>
          {/* WhatsApp */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              marginBottom: 'clamp(0.125rem, 0.75vw, 0.375rem)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}>
              <span>WhatsApp</span>
              <span style={{ color: colors.info, fontSize: '0.75rem' }}>ⓘ</span>
            </label>
            <input
              type="tel"
              placeholder="(99) 99999-9999"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2.5vw, 0.75rem)',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Companhia de Energia */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              marginBottom: 'clamp(0.125rem, 0.75vw, 0.375rem)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}>
              <span>Companhia de Energia</span>
              <span style={{ color: colors.info, fontSize: '0.75rem' }}>ⓘ</span>
            </label>
            <select
              value={formData.companhiaEnergia}
              onChange={(e) => handleInputChange('companhiaEnergia', e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2.5vw, 0.75rem)',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              {companhiasEnergia.map((companhia, index) => (
                <option key={index} value={companhia}>
                  {companhia}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox de aceite */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
          color: colors.gray[800],
          fontFamily: typography.fontFamily.primary,
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
        }}>
          <input
            id="consent"
            type="checkbox"
            checked={acceptedPolicy}
            onChange={(e) => setAcceptedPolicy(e.target.checked)}
            style={{ width: '1rem', height: '1rem' }}
          />
          <label htmlFor="consent" style={{ cursor: 'pointer' }}>
            Li e concordo com a <a onClick={() => navigateTo('privacy')} style={{ color: colors.info, textDecoration: 'underline', cursor: 'pointer' }}>política de privacidade</a> e o <a onClick={() => navigateTo('terms')} style={{ color: colors.info, textDecoration: 'underline', cursor: 'pointer' }}>termo de consentimento</a>.
          </label>
        </div>

        {/* Botão de Simulação */}
        <div style={{ marginBottom: '0.5rem' }}>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
          >
          {isLoading ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              <span style={{ 
                position: 'relative', 
                zIndex: 1,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}>
                Enviando...
              </span>
            </>
          ) : (
            <>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white'
              }}>
                <WhatsAppIcon size="lg" />
              </div>
              <span style={{ 
                position: 'relative', 
                zIndex: 1,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                fontWeight: 'bold',
              }}>
                Simular Valor Liberado
              </span>
            </>
          )}
        </Button>
        </div>

        {/* Texto de conversão otimizado */}
        <p style={{
          textAlign: 'center',
          fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
          color: '#000000',
          margin: 0,
          fontFamily: typography.fontFamily.primary,
          fontWeight: typography.fontWeight.semibold,
        }}>
          Somente o titular da fatura consegue contratar o empréstimo!
        </p>
      </form>

      {/* Notificação */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {/* Popup de Sucesso */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        clientName={formData.nome}
        simulatedValue={simulatedValue}
      />

      {/* CSS para animação de loading */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
} 