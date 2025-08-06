import React from 'react'

export const Header: React.FC = () => {
  return (
    <header style={{
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      zIndex: 10,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#1e40af',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: 'bold',
      }}>
        <span style={{
          backgroundColor: 'white',
          color: '#1e40af',
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}>
          R
        </span>
        reallizi
      </div>
    </header>
  )
} 