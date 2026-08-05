import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

const variants = {
  primary: 'bg-primary-50 text-primary-600',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  error: 'bg-error-50 text-error-600',
  neutral: 'bg-neutral-100 text-neutral-600',
}

const dotColors = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  neutral: 'bg-neutral-400',
}

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', dot, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  )
)
Badge.displayName = 'Badge'
