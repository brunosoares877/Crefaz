import React from 'react'
import { useNavigation } from '../../src/contexts/NavigationContext'

export const Header: React.FC = () => {
  const { currentPage, navigateTo } = useNavigation()
  
  return (
    <header style={{
      position: 'fixed',
      top: 'clamp(0.5rem, 2vw, 1rem)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      width: '100%',
      maxWidth: '800px',
      padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1e40af',
        padding: 'clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)',
        borderRadius: 'clamp(6px, 1.5vw, 8px)',
        color: 'white',
        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.25rem, 1vw, 0.5rem)',
          cursor: 'pointer'
        }}
        onClick={() => navigateTo('home')}>
          <span style={{
            backgroundColor: 'white',
            color: '#1e40af',
            width: 'clamp(18px, 4vw, 20px)',
            height: 'clamp(18px, 4vw, 20px)',
            borderRadius: 'clamp(3px, 1vw, 4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
            fontWeight: 'bold',
          }}>
            S
          </span>
          solution
        </div>

        {/* Menu de navegação */}
        <nav style={{
          display: 'flex',
          gap: 'clamp(0.25rem, 1vw, 0.5rem)',
          alignItems: 'center',
        }}>
          <button
            onClick={() => navigateTo('admin')}
            style={{
              background: currentPage === 'admin' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
              borderRadius: 'clamp(3px, 1vw, 4px)',
              fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentPage === 'admin' ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
            }}
          >
            ⚙️ Admin
          </button>
        </nav>
      </div>
    </header>
  )
} 