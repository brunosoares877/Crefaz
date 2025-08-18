import React from 'react'
import { getCurrentEnvironment, isDevelopment, isStaging, isProduction } from '../../src/config/environments'

export const EnvironmentInfo: React.FC = () => {
  const currentEnv = getCurrentEnvironment()
  
  // Só mostrar em desenvolvimento ou staging
  if (isProduction()) return null

  const getEnvironmentColor = () => {
    if (isDevelopment()) return '#3b82f6' // Azul
    if (isStaging()) return '#f59e0b' // Laranja
    return '#6b7280' // Cinza
  }

  const getEnvironmentLabel = () => {
    if (isDevelopment()) return 'DEV'
    if (isStaging()) return 'STAGING'
    return 'PROD'
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 'clamp(8px, 2vw, 10px)',
        left: 'clamp(8px, 2vw, 10px)',
        backgroundColor: getEnvironmentColor(),
        color: 'white',
        padding: 'clamp(0.125rem, 0.5vw, 0.25rem) clamp(0.25rem, 1vw, 0.5rem)',
        borderRadius: '0.25rem',
        fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        zIndex: 9999,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {getEnvironmentLabel()}
    </div>
  )
}
