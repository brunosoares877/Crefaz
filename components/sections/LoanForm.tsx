import React, { useState } from 'react'
import { colors, typography, borderRadius, shadows } from '../../styles/design-tokens'
import { Button } from '../ui/Button'
import { DocumentIcon } from '../ui/DocumentIcon'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { leadService, formatarCPF, formatarTelefone, formatarData } from '../../src/services/api'
import { Notification } from '../ui/Notification'

interface FormData {
  nome: string
  whatsapp: string
  cpf: string
  dataNascimento: string
  companhiaEnergia: string
}

export const LoanForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    whatsapp: '',
    cpf: '',
    dataNascimento: '',
    companhiaEnergia: '',
  })

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
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Redirecionar para WhatsApp com mensagem personalizada
      const phoneNumber = '5584994616051' // Número do WhatsApp da empresa
      const message = `Olá, gostaria de fazer uma simulação.

*Meus dados:*
📝 Nome: ${formData.nome}
📱 WhatsApp: ${formData.whatsapp}
🆔 CPF: ${formData.cpf}
📅 Data de Nascimento: ${formData.dataNascimento}
⚡ Companhia de Energia: ${formData.companhiaEnergia}`

      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappUrl, '_blank')
      
      showNotification('Redirecionando para o WhatsApp...', 'success')
      
      // Limpar formulário após envio
      setTimeout(() => {
        setFormData({
          nome: '',
          whatsapp: '',
          cpf: '',
          dataNascimento: '',
          companhiaEnergia: '',
        })
      }, 1000)
      
    } catch (error: any) {
      console.error('Erro:', error)
      showNotification('Erro ao abrir WhatsApp. Tente novamente.', 'error')
    } finally {
      setIsLoading(false)
    }
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
      padding: 'clamp(1.5rem, 5vw, 2.5rem)',
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(1rem, 3vw, 1.5rem)',
          marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        }}>
          {/* Nome */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
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
                padding: 'clamp(0.75rem, 3vw, 1rem)',
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
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}>
              <span>CPF</span>
              <span style={{ color: colors.info, fontSize: '0.75rem' }}>ⓘ</span>
            </label>
            <input
              type="text"
              placeholder="017.102.156-55"
              value={formData.cpf}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(0.75rem, 3vw, 1rem)',
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
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}>
              <span>Data de nascimento</span>
              <span style={{ color: colors.info, fontSize: '0.75rem' }}>ⓘ</span>
            </label>
            <input
              type="text"
              placeholder="09/09/1999"
              value={formData.dataNascimento}
              onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(0.75rem, 3vw, 1rem)',
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

          {/* WhatsApp */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
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
                padding: 'clamp(0.75rem, 3vw, 1rem)',
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
              marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
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
                padding: 'clamp(0.75rem, 3vw, 1rem)',
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

        {/* Botão de Simulação */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          style={{ marginBottom: '1.5rem' }}
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
                Simular no WhatsApp
              </span>
            </>
          )}
        </Button>

        {/* Texto de conversão otimizado */}
        <p style={{
          textAlign: 'center',
          fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
          color: '#000000',
          margin: 0,
          fontFamily: typography.fontFamily.primary,
          fontWeight: typography.fontWeight.semibold,
        }}>
          ✅ Somente o titular da fatura consegue contratar o empréstimo!
        </p>
      </form>

      {/* Notificação */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
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