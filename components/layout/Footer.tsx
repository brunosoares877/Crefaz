import React from 'react'
import { colors, typography } from '../../styles/design-tokens'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { useNavigation } from '../../src/contexts/NavigationContext'

export const Footer: React.FC = () => {
  const { navigateTo } = useNavigation()
  
  return (
    <footer style={{
      backgroundColor: colors.darkBlue,
      color: colors.white,
      padding: 'clamp(2rem, 6vw, 3rem) clamp(1rem, 4vw, 2rem)',
      marginTop: 'clamp(2rem, 8vw, 4rem)',
    }}>
      {/* Aviso legal acima de todas as colunas */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          fontSize: typography.fontSize.xs,
          lineHeight: typography.lineHeight.relaxed,
          fontFamily: typography.fontFamily.primary,
          marginBottom: '2rem',
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            A SOLUTION MAIS CORRESPONDENTE BANCARIO LTDA atua como correspondente bancário, 
            oferecendo serviços de intermediação para produtos financeiros. As taxas de juros e 
            condições são definidas pelas instituições financeiras parceiras.
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            Este site não representa uma oferta de crédito. A aprovação está sujeita à análise 
            de crédito e documentação. Consulte as condições completas antes de contratar.
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            ATENÇÃO: Não solicitamos qualquer tipo de pagamento, taxa ou depósito em nenhuma etapa do processo (antes ou depois da aprovação). 
            Desconfie de qualquer pedido de valores.
          </p>
        </div>
      </div>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(1.5rem, 5vw, 3rem)',
      }}>
        {/* Coluna 1 - Informações da Empresa */}
        <div>
          <h3 style={{
            fontSize: 'clamp(1rem, 3.5vw, 1.125rem)',
            fontWeight: typography.fontWeight.bold,
            marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
            fontFamily: typography.fontFamily.primary,
          }}>
            SOLUTION MAIS CORRESPONDENTE BANCARIO LTDA
          </h3>
          
          <p style={{
            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
            marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
            fontFamily: typography.fontFamily.primary,
          }}>
            CNPJ 29.324.455/0001-44
          </p>

          
          <p style={{
            fontSize: typography.fontSize.sm,
            marginBottom: '1rem',
            fontFamily: typography.fontFamily.primary,
          }}>
            Av Brigadeiro Everaldo Breves 152, Loja 127
          </p>
          
          <p style={{
            fontSize: typography.fontSize.sm,
            marginBottom: '1.5rem',
            fontFamily: typography.fontFamily.primary,
          }}>
            Todos os direitos reservados a Solution © 2025
          </p>
          
        </div>

        {/* Coluna 2 - Contatos */}
        <div>
          <h3 style={{
            fontSize: 'clamp(1rem, 3.5vw, 1.125rem)',
            fontWeight: typography.fontWeight.bold,
            marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
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
            <span>📧</span>
            <span>sac@solutionpromotora.com.br</span>
          </div>

          <div 
            onClick={() => {
              const phoneNumber = '5584994616051'
              const message = 'Olá, gostaria de fazer uma simulação.'
              const encodedMessage = encodeURIComponent(message)
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
              window.open(whatsappUrl, '_blank')
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              fontSize: typography.fontSize.base,
              fontFamily: typography.fontFamily.primary,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              padding: '0.5rem',
              borderRadius: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            <div style={{ color: '#25D366' }}>
              <WhatsAppIcon size="md" />
            </div>
            <span>(84) 99461-6051</span>
          </div>

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

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem',
            marginTop: '2rem'
          }}>
            {[
              { text: 'Política de Privacidade', icon: '🔒', action: () => navigateTo('privacy') },
              { text: 'Termos de Uso', icon: '📋', action: () => navigateTo('terms') },
              { text: 'Reclame Aqui', icon: '📢', action: () => window.open('https://www.reclameaqui.com.br/', '_blank') },
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.primary,
                cursor: item.action ? 'pointer' : 'default',
                transition: 'opacity 0.2s',
                opacity: item.action ? 1 : 0.7,
              }}
              onMouseEnter={(e) => {
                if (item.action) {
                  e.currentTarget.style.opacity = '0.7'
                }
              }}
              onMouseLeave={(e) => {
                if (item.action) {
                  e.currentTarget.style.opacity = '1'
                }
              }}
              onClick={item.action || undefined}
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
            fontSize: 'clamp(1rem, 3.5vw, 1.125rem)',
            fontWeight: typography.fontWeight.bold,
            marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
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