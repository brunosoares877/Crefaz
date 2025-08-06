import React from 'react'
import { colors, typography, borderRadius, shadows } from '../../styles/design-tokens'

export const WarningMessage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '2.5rem',
      padding: '1.5rem 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: borderRadius.xl,
      width: '100%',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: shadows.lg,
    }}>
      {/* Ícone de aviso */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50px',
        height: '50px',
        backgroundColor: colors.warning,
        borderRadius: '50%',
        boxShadow: shadows.md,
        flexShrink: 0,
      }}>
        <span style={{
          color: colors.white,
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}>
          ⚠️
        </span>
      </div>
      
      {/* Texto do aviso */}
      <div style={{ flex: 1 }}>
        <p style={{
          color: colors.white,
          fontSize: typography.fontSize.base,
          margin: 0,
          fontFamily: typography.fontFamily.primary,
          fontWeight: typography.fontWeight.medium,
          lineHeight: 1.5,
        }}>
          <strong>Fique atento:</strong> Não solicitamos nenhum tipo de pagamento antecipado para liberação de empréstimo
        </p>
      </div>
    </div>
  )
} 