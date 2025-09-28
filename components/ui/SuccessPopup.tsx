import React from 'react'

interface SuccessPopupProps {
  isOpen: boolean
  onClose: () => void
  clientName?: string
  simulatedValue?: number
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({ 
  isOpen, 
  onClose, 
  clientName = '',
  simulatedValue = 0
}) => {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: '0',
      zIndex: 9999,
      overflowY: 'auto'
    }}>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          transition: 'opacity 0.3s'
        }}
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '28rem',
          width: '100%',
          margin: '0 auto',
          transform: 'scale(1)',
          transition: 'all 0.3s'
        }}>
          {/* Header com ícone de sucesso */}
          <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '1.5rem' }}>
            <div style={{
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '4rem',
              width: '4rem',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              marginBottom: '1rem'
            }}>
              <svg style={{ height: '2rem', width: '2rem', color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Cadastro Realizado com Sucesso!
            </h3>
            
            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              {clientName && `Olá, ${clientName}! `}
              Seus dados foram enviados com segurança.
            </p>
          </div>

          {/* Conteúdo */}
          <div style={{ padding: '0 2rem 1.5rem' }}>
            {/* Valor Simulado */}
            {simulatedValue > 0 && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: '#15803d', marginBottom: '0.25rem' }}>
                    Valor pré-aprovado:
                  </p>
                  <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#166534'
                  }}>
                    R$ {simulatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>
                    *Sujeito à análise de crédito
                  </p>
                </div>
              </div>
            )}

            {/* Próximos passos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  backgroundColor: '#dbeafe',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 'bold' }}>1</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                    Análise de Crédito
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Nossa equipe irá analisar seu perfil creditício
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  backgroundColor: '#dbeafe',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 'bold' }}>2</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                    Contato em até 24h
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Entraremos em contato via WhatsApp ou telefone
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  backgroundColor: '#dbeafe',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 'bold' }}>3</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                    Proposta Personalizada
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Apresentaremos as melhores condições para você
                  </p>
                </div>
              </div>
            </div>

            {/* Informações importantes */}
            <div style={{
              marginTop: '1.5rem',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '0.5rem',
              padding: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <svg style={{ width: '1rem', height: '1rem', color: '#2563eb', marginTop: '0.125rem', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1e40af' }}>
                    Importante:
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#1d4ed8', marginTop: '0.25rem' }}>
                    Mantenha seu telefone disponível. Nosso atendimento é de segunda a sexta, das 8h às 18h.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '0 2rem 2rem' }}>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            >
              Entendi, Obrigado!
            </button>
            
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Dúvidas? Entre em contato:{' '}
                <a 
                  href="tel:+5511999999999" 
                  style={{ color: '#2563eb', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  (11) 99999-9999
                </a>
              </p>
            </div>
          </div>

          {/* Botão de fechar */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6b7280'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPopup
