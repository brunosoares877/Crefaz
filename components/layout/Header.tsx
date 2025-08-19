import React from 'react'

export const Header: React.FC = () => {
  return (
    <header style={{
      position: 'fixed',
      top: 'clamp(0.5rem, 2vw, 1rem)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      width: '100%',
      maxWidth: '500px',
      padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(0.25rem, 1vw, 0.5rem)',
        backgroundColor: '#1e40af',
        padding: 'clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)',
        borderRadius: 'clamp(6px, 1.5vw, 8px)',
        color: 'white',
        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
        fontWeight: 'bold',
        width: 'fit-content',
        margin: '0 auto',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}>
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
    </header>
  )
} 