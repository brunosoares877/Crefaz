import React from 'react'
import { colors, typography, borderRadius, shadows } from '../../styles/design-tokens'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = ''
}) => {
  const baseStyles = {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.lg,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  }

  const sizeStyles = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: typography.fontSize.sm,
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: typography.fontSize.base,
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: typography.fontSize.lg,
    },
  }

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary[600],
      color: colors.white,
      boxShadow: shadows.md,
      '&:hover': {
        backgroundColor: colors.primary[700],
        transform: 'translateY(-1px)',
        boxShadow: shadows.lg,
      },
    },
    secondary: {
      backgroundColor: colors.secondary[600],
      color: colors.white,
      boxShadow: shadows.md,
      '&:hover': {
        backgroundColor: colors.secondary[700],
        transform: 'translateY(-1px)',
        boxShadow: shadows.lg,
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[600],
      border: `2px solid ${colors.primary[600]}`,
      '&:hover': {
        backgroundColor: colors.primary[50],
        transform: 'translateY(-1px)',
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.secondary[600],
      '&:hover': {
        backgroundColor: colors.secondary[100],
      },
    },
  }

  const styles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    opacity: disabled ? 0.5 : 1,
  }

  return (
    <button
      style={styles}
      onClick={onClick}
      disabled={disabled}
      className={`button button-${variant} button-${size} ${className}`}
    >
      {children}
    </button>
  )
} 