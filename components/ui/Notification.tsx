import React, { useEffect, useState } from 'react'

interface NotificationProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(onClose, 300) // Aguarda a animação terminar
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10b981',
          borderColor: '#059669',
          icon: '✓',
        }
      case 'error':
        return {
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          icon: '✗',
        }
      case 'warning':
        return {
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          icon: '!',
        }
      case 'info':
        return {
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          icon: 'i',
        }
      default:
        return {
          backgroundColor: '#6b7280',
          borderColor: '#4b5563',
          icon: '•',
        }
    }
  }

  const typeStyles = getTypeStyles()

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <div
        style={{
          backgroundColor: typeStyles.backgroundColor,
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.75rem',
          border: `2px solid ${typeStyles.borderColor}`,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          minWidth: '300px',
          maxWidth: '400px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 500,
        }}
      >
        <span style={{ fontSize: '1.25rem' }}>{typeStyles.icon}</span>
        <span style={{ flex: 1 }}>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.25rem',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
