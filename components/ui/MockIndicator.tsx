import React, { useState, useEffect } from 'react'

export const MockIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verificar se há logs de mock no console
    const checkMockUsage = () => {
      const originalWarn = console.warn
      console.warn = (...args) => {
        if (args[0]?.includes('mock local')) {
          setIsVisible(true)
        }
        originalWarn.apply(console, args)
      }
    }

    checkMockUsage()
  }, [])

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#f59e0b',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <span>🧪</span>
      <span>MOCK LOCAL</span>
    </div>
  )
}
