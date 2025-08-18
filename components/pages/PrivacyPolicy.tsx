import React from 'react'
import { colors, typography, borderRadius, shadows } from '../../styles/design-tokens'
import { useNavigation } from '../../src/contexts/NavigationContext'

export const PrivacyPolicy: React.FC = () => {
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
          Política de Privacidade
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
              1. Informações que Coletamos
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Coletamos as seguintes informações pessoais quando você utiliza nossos serviços:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Nome completo</li>
              <li style={{ marginBottom: '0.5rem' }}>CPF</li>
              <li style={{ marginBottom: '0.5rem' }}>Data de nascimento</li>
              <li style={{ marginBottom: '0.5rem' }}>Número de WhatsApp</li>
              <li style={{ marginBottom: '0.5rem' }}>Companhia de energia elétrica</li>
              <li style={{ marginBottom: '0.5rem' }}>Dados de navegação e cookies</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              2. Como Utilizamos suas Informações
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Utilizamos suas informações pessoais para:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Processar solicitações de empréstimo</li>
              <li style={{ marginBottom: '0.5rem' }}>Verificar sua identidade e elegibilidade</li>
              <li style={{ marginBottom: '0.5rem' }}>Comunicar sobre o status da sua solicitação</li>
              <li style={{ marginBottom: '0.5rem' }}>Cumprir obrigações legais e regulamentares</li>
              <li style={{ marginBottom: '0.5rem' }}>Melhorar nossos serviços</li>
              <li style={{ marginBottom: '0.5rem' }}>Prevenir fraudes e atividades suspeitas</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              3. Compartilhamento de Dados
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Seus dados podem ser compartilhados com:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Instituições financeiras parceiras para análise de crédito</li>
              <li style={{ marginBottom: '0.5rem' }}>Órgãos de proteção ao crédito (SPC, Serasa)</li>
              <li style={{ marginBottom: '0.5rem' }}>Autoridades competentes quando exigido por lei</li>
              <li style={{ marginBottom: '0.5rem' }}>Prestadores de serviços terceirizados (com contratos de confidencialidade)</li>
            </ul>
            <p style={{ marginBottom: '1rem', fontWeight: typography.fontWeight.semibold }}>
              Nunca vendemos ou alugamos suas informações pessoais para terceiros.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              4. Segurança dos Dados
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Criptografia SSL/TLS para transmissão de dados</li>
              <li style={{ marginBottom: '0.5rem' }}>Armazenamento seguro em servidores protegidos</li>
              <li style={{ marginBottom: '0.5rem' }}>Controle de acesso restrito aos dados</li>
              <li style={{ marginBottom: '0.5rem' }}>Monitoramento contínuo de segurança</li>
              <li style={{ marginBottom: '0.5rem' }}>Backup regular dos dados</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              5. Seus Direitos (LGPD)
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              De acordo com a Lei Geral de Proteção de Dados, você tem direito a:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Confirmação da existência de tratamento dos seus dados</li>
              <li style={{ marginBottom: '0.5rem' }}>Acesso aos seus dados pessoais</li>
              <li style={{ marginBottom: '0.5rem' }}>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li style={{ marginBottom: '0.5rem' }}>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li style={{ marginBottom: '0.5rem' }}>Portabilidade dos dados para outro fornecedor</li>
              <li style={{ marginBottom: '0.5rem' }}>Eliminação dos dados tratados com seu consentimento</li>
              <li style={{ marginBottom: '0.5rem' }}>Informações sobre compartilhamento dos dados</li>
              <li style={{ marginBottom: '0.5rem' }}>Possibilidade de não fornecer consentimento</li>
              <li style={{ marginBottom: '0.5rem' }}>Revogação do consentimento</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              6. Retenção de Dados
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Mantemos seus dados pessoais pelo tempo necessário para:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Cumprir as finalidades para as quais foram coletados</li>
              <li style={{ marginBottom: '0.5rem' }}>Atender obrigações legais e regulamentares</li>
              <li style={{ marginBottom: '0.5rem' }}>Resolver disputas e fazer cumprir acordos</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              7. Cookies e Tecnologias Similares
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Melhorar a experiência de navegação</li>
              <li style={{ marginBottom: '0.5rem' }}>Analisar o uso do site</li>
              <li style={{ marginBottom: '0.5rem' }}>Personalizar conteúdo</li>
              <li style={{ marginBottom: '0.5rem' }}>Garantir a segurança do site</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>
              Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              8. Alterações nesta Política
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através do nosso site ou por outros meios de comunicação apropriados.
            </p>
          </section>

          <section>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
              fontWeight: typography.fontWeight.bold, 
              color: colors.darkBlue, 
              marginBottom: '1rem' 
            }}>
              9. Contato
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política:
            </p>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Telefone: (84) 2030-2584</li>
              <li>WhatsApp: (84) 99461-6051</li>
              <li>Encarregado de Dados: disponível nos canais acima</li>
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
