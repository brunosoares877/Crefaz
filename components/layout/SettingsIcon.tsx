import React from 'react'
import { colors } from '../../styles/design-tokens'

export const SettingsIcon: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '2rem',
      left: '2rem',
      zIndex: 10,
      cursor: 'pointer',
      transition: 'transform 0.2s ease-in-out',
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
    >
      <div style={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.white,
        fontSize: '1.5rem',
        fontWeight: 'bold',
      }}>
        ⚙️
      </div>
    </div>
  )
} 