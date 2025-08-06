import React, { useState } from 'react'
import { colors, typography, borderRadius, shadows } from '../../styles/design-tokens'

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dados do formulário:', formData)
    // Aqui você pode adicionar a lógica de envio
  }

  const companhiasEnergia = [
    'Selecione',
    'Enel',
    'Eletrobras',
    'CPFL',
    'Cemig',
    'Copel',
    'Celesc',
    'Cemar',
    'Eletroacre',
    'Eletronorte',
    'Outras'
  ]

  return (
    <div style={{
      backgroundColor: colors.white,
      borderRadius: borderRadius['2xl'],
      padding: '2.5rem',
      boxShadow: shadows['2xl'],
      width: '100%',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
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
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {/* Nome */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: typography.fontSize.sm,
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
                padding: '1rem',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </div>

          {/* CPF */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: typography.fontSize.sm,
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
                padding: '1rem',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </div>

          {/* Data de Nascimento */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: typography.fontSize.sm,
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
                padding: '1rem',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}>
              <span>WhatsApp</span>
              <span style={{ color: colors.info, fontSize: '0.75rem' }}>ⓘ</span>
            </label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </div>

          {/* Companhia de Energia */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: typography.fontSize.sm,
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
                padding: '1rem',
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                fontFamily: typography.fontFamily.primary,
                backgroundColor: colors.white,
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
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
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '1.25rem 2rem',
            background: `linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%)`,
            border: 'none',
            borderRadius: borderRadius.xl,
            color: colors.white,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            marginBottom: '1.5rem',
            fontFamily: typography.fontFamily.primary,
            boxShadow: shadows.lg,
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = shadows['2xl']
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = shadows.lg
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>
            📱 Simular Valor Liberado
          </span>
        </button>

        {/* Texto de aviso */}
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: colors.gray[50],
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <p style={{
            fontSize: typography.fontSize.sm,
            color: colors.gray[600],
            margin: 0,
            fontFamily: typography.fontFamily.primary,
            fontWeight: typography.fontWeight.medium,
          }}>
            🔒 Somente o titular de fatura consegue contratar o empréstimo!
          </p>
        </div>
      </form>
    </div>
  )
} 