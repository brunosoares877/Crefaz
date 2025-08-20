import React from 'react'
import { colors, typography, borderRadius, shadows } from '../../styles/design-tokens'

export const WarningMessage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'clamp(0.75rem, 3vw, 1rem)',
      marginTop: '0',
      padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.5rem, 2.5vw, 1rem)',
      backgroundColor: '#0f172a',
      borderRadius: `0 0 ${borderRadius.xl} ${borderRadius.xl}`,
      width: '100%',
      border: 'none',
      borderTop: 'none',
      boxShadow: shadows.lg,
      boxSizing: 'border-box',
    }}>
      {/* Ícone de aviso */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'clamp(40px, 10vw, 50px)',
        height: 'clamp(40px, 10vw, 50px)',
        backgroundColor: colors.warning,
        borderRadius: '50%',
        boxShadow: shadows.md,
        flexShrink: 0,
      }}>
        <span style={{
          color: colors.white,
          fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
          fontWeight: 'bold',
        }}>
          !
        </span>
      </div>
      
      {/* Texto do aviso */}
      <div style={{ flex: 1 }}>
                 <p style={{
           color: colors.white,
           fontSize: 'clamp(0.875rem, 3vw, 1rem)',
           margin: 0,
           fontFamily: typography.fontFamily.primary,
           fontWeight: typography.fontWeight.medium,
           lineHeight: 1.5,
         }}>
          <strong>Fique atento:</strong> <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Não solicitamos nenhum tipo de pagamento antecipado para liberação de empréstimo</span>
        </p>
      </div>
    </div>
  )
} 