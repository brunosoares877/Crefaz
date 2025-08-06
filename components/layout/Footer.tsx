import React from 'react'
import { colors, typography } from '../../styles/design-tokens'

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: colors.darkBlue,
      color: colors.white,
      padding: '3rem 2rem',
      marginTop: '4rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
      }}>
        {/* Coluna 1 - Informações da Empresa */}
        <div>
          <h3 style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            marginBottom: '1rem',
            fontFamily: typography.fontFamily.primary,
          }}>
            REALLIZI COBRANCAS E INFORMACOES CADASTRAIS EIRELI
          </h3>
          
          <p style={{
            fontSize: typography.fontSize.sm,
            marginBottom: '0.5rem',
            fontFamily: typography.fontFamily.primary,
          }}>
            CNPJ 29.324.455/0001-44
          </p>
          
          <p style={{
            fontSize: typography.fontSize.sm,
            marginBottom: '1rem',
            fontFamily: typography.fontFamily.primary,
          }}>
            Av Brigadeiro Everaldo Breves 152 Loja 127
          </p>
          
          <p style={{
            fontSize: typography.fontSize.sm,
            marginBottom: '1.5rem',
            fontFamily: typography.fontFamily.primary,
          }}>
            Todos os direitos reservados a Solution © 2025
          </p>
          
          <div style={{
            fontSize: typography.fontSize.xs,
            lineHeight: typography.lineHeight.relaxed,
            fontFamily: typography.fontFamily.primary,
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              A REALLIZI COBRANCAS E INFORMACOES CADASTRAIS EIRELI atua como correspondente bancário, 
              oferecendo serviços de intermediação para produtos financeiros. As taxas de juros e 
              condições são definidas pelas instituições financeiras parceiras.
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              Este site não representa uma oferta de crédito. A aprovação está sujeita à análise 
              de crédito e documentação. Consulte as condições completas antes de contratar.
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              ATENÇÃO: Nunca solicitamos pagamentos antecipados para liberação de crédito. 
              Desconfie de propostas que pedem dinheiro antes da aprovação.
            </p>
          </div>
        </div>

        {/* Coluna 2 - Contatos */}
        <div>
          <h3 style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            marginBottom: '1rem',
            fontFamily: typography.fontFamily.primary,
          }}>
            CONTATOS
          </h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            fontSize: typography.fontSize.base,
            fontFamily: typography.fontFamily.primary,
          }}>
            <span>📞</span>
            <span>(84) 2030-2584</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { text: 'Sobre Nós', icon: '📄' },
              { text: 'Dúvidas', icon: '❓' },
              { text: 'Blog', icon: '📝' },
              { text: 'Política de Privacidade', icon: '🔒' },
              { text: 'Termo de Consentimento', icon: '📋' },
              { text: 'Reclame Aqui', icon: '📢' },
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.primary,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 3 - Redes Sociais */}
        <div>
          <h3 style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            marginBottom: '1rem',
            fontFamily: typography.fontFamily.primary,
          }}>
            ACOMPANHE NOSSAS REDES SOCIAIS
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {[
              { name: 'Facebook', icon: '📘' },
              { name: 'Instagram', icon: '📷' },
              { name: 'YouTube', icon: '📺' },
              { name: 'Google', icon: '🔍' },
              { name: 'Twitter', icon: '🐦' },
            ].map((social, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: typography.fontSize.base,
                fontFamily: typography.fontFamily.primary,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                padding: '0.5rem',
                borderRadius: '0.25rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              >
                <span style={{ fontSize: '1.25rem' }}>{social.icon}</span>
                <span>{social.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
} 