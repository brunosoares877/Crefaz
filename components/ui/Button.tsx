import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '1rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: 700,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    letterSpacing: '0.025em',
    width: '100%',
  }

  const sizeStyles = {
    sm: {
      padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 4vw, 1.5rem)',
      fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
    },
    md: {
      padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)',
      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
    },
    lg: {
      padding: 'clamp(1rem, 4vw, 1.5rem) clamp(1.5rem, 5vw, 2rem)',
      fontSize: 'clamp(1rem, 3.5vw, 1.125rem)',
    },
  }

  const variantStyles = {
    primary: {
      background: 'linear-gradient(90deg, #25D366 0%, #20BA5A 25%, #1BA34A 50%, #16A34A 75%, #15803D 100%)',
      color: '#ffffff',
      boxShadow: '0 10px 25px -5px rgba(37, 211, 102, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    secondary: {
      background: 'linear-gradient(90deg, #6b7280 0%, #4b5563 25%, #374151 50%, #1f2937 75%, #111827 100%)',
      color: '#ffffff',
      boxShadow: '0 10px 25px -5px rgba(107, 114, 128, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    const button = e.currentTarget
    button.style.transform = 'translateY(-4px) scale(1.02)'
    
    if (variant === 'primary') {
      button.style.boxShadow = '0 20px 40px -10px rgba(37, 211, 102, 0.5), 0 10px 20px -5px rgba(0, 0, 0, 0.15)'
      button.style.background = 'linear-gradient(90deg, #20BA5A 0%, #1BA34A 25%, #16A34A 50%, #15803D 75%, #15803D 100%)'
    } else {
      button.style.boxShadow = '0 20px 40px -10px rgba(107, 114, 128, 0.4), 0 10px 20px -5px rgba(0, 0, 0, 0.15)'
      button.style.background = 'linear-gradient(90deg, #4b5563 0%, #374151 25%, #1f2937 50%, #111827 75%, #111827 100%)'
    }
    
    // Ativar efeito de brilho
    const shine = button.querySelector('[data-shine]') as HTMLElement
    if (shine) {
      shine.style.left = '100%'
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    const button = e.currentTarget
    button.style.transform = 'translateY(0) scale(1)'
    
    if (variant === 'primary') {
      button.style.boxShadow = '0 10px 25px -5px rgba(37, 211, 102, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      button.style.background = 'linear-gradient(90deg, #25D366 0%, #20BA5A 25%, #1BA34A 50%, #16A34A 75%, #15803D 100%)'
    } else {
      button.style.boxShadow = '0 10px 25px -5px rgba(107, 114, 128, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      button.style.background = 'linear-gradient(90deg, #6b7280 0%, #4b5563 25%, #374151 50%, #1f2937 75%, #111827 100%)'
    }
    
    // Resetar efeito de brilho
    const shine = button.querySelector('[data-shine]') as HTMLElement
    if (shine) {
      shine.style.left = '-100%'
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)'
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
  }

  const styles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    opacity: disabled ? 0.6 : 1,
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={styles}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
      
      {/* Efeito de brilho */}
      <div 
        data-shine
        style={{
          position: 'absolute',
          top: '0',
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          transition: 'left 0.6s ease-in-out',
        }} 
      />
    </button>
  )
} 