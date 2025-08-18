import React from 'react'
import { colors, typography, borderRadius, shadows } from '../../styles/design-tokens'
import { useNavigation } from '../../src/contexts/NavigationContext'

export const TermsOfService: React.FC = () => {
  const { navigateTo } = useNavigation()
  
  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors.darkBlue} 0%, ${colors.primary[900]} 50%, ${colors.primary[800]} 100%)`,
      minHeight: '100vh',
      padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: colors.white,
        borderRadius: borderRadius['2xl'],
        padding: 'clamp(2rem, 5vw, 3rem)',
        boxShadow: shadows['2xl'],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => navigateTo('home')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.primary[600],
              fontSize: 'clamp(1rem, 3vw, 1.125rem)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.fontWeight.semibold,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.primary[700]}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.primary[600]}
          >
            ← Voltar
          </button>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: typography.fontWeight.bold,
          color: colors.darkBlue,
          marginBottom: '2rem',
          textAlign: 'center',
          fontFamily: typography.fontFamily.primary,
        }}>
          Termos de Uso
        </h1>

        <div style={{
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          lineHeight: 1.6,
          color: colors.gray[700],
          fontFamily: typography.fontFamily.primary,
        }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              1. Aceitação dos Termos
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Ao acessar e utilizar este site, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              2. Descrição dos Serviços
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              A SOLUTION MAIS CORRESPONDENTE BANCARIO LTDA atua como correspondente bancário, oferecendo serviços de intermediação para produtos financeiros. Não somos uma instituição financeira, mas sim um facilitador entre clientes e bancos parceiros.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              3. Responsabilidades do Usuário
            </h2>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Fornecer informações verdadeiras e atualizadas</li>
              <li style={{ marginBottom: '0.5rem' }}>Ser titular da conta de energia elétrica para contratação</li>
              <li style={{ marginBottom: '0.5rem' }}>Não utilizar o serviço para atividades ilegais</li>
              <li style={{ marginBottom: '0.5rem' }}>Manter a confidencialidade de seus dados pessoais</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              4. Limitações e Responsabilidades
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              A aprovação de crédito está sujeita à análise das instituições financeiras parceiras. Não garantimos a aprovação de empréstimos. As taxas de juros e condições são definidas pelos bancos parceiros, não por nossa empresa.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              5. Política de Pagamentos
            </h2>
            <p style={{ marginBottom: '1rem', color: colors.error, fontWeight: typography.fontWeight.semibold }}>
              IMPORTANTE: Nunca solicitamos pagamentos antecipados para liberação de crédito. Qualquer cobrança prévia é fraudulenta e deve ser reportada imediatamente.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              6. Proteção de Dados
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Seus dados pessoais são tratados de acordo com a Lei Geral de Proteção de Dados (LGPD). Para mais informações, consulte nossa Política de Privacidade.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              7. Modificações dos Termos
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site.
            </p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              8. Contato
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Para dúvidas sobre estes termos, entre em contato conosco:
            </p>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Telefone: (84) 2030-2584</li>
              <li>WhatsApp: (84) 99461-6051</li>
            </ul>
          </section>

          <div style={{
            marginTop: '3rem',
            padding: '1rem',
            backgroundColor: colors.gray[50],
            borderRadius: borderRadius.lg,
            textAlign: 'center',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            color: colors.gray[600],
          }}>
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
