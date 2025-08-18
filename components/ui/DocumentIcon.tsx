import React from 'react'

interface DocumentIconProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { container: '16px', grid: '12px' },
    md: { container: '20px', grid: '16px' },
    lg: { container: '24px', grid: '16px' },
  }

  const currentSize = sizeMap[size]

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: currentSize.container,
        height: currentSize.container,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '6px',
        padding: '4px',
        position: 'relative',
      }}
      className={className}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '2px',
        width: currentSize.grid,
        height: currentSize.grid,
      }}>
        <div style={{ backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
        <div style={{ backgroundColor: '#8b5cf6', borderRadius: '2px' }}></div>
        <div style={{ backgroundColor: '#f59e0b', borderRadius: '2px' }}></div>
        <div style={{ backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
      </div>
    </div>
  )
} 