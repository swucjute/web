import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'w-full px-3.5 py-3 text-sm text-neutral-800 bg-white border rounded-xl',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:border-transparent transition',
            error
              ? 'border-primary-600 focus:ring-primary-600/20'
              : 'border-neutral-200 focus:ring-primary-500/20 focus:border-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50',
            className
          )}
          {...props}
        />
        {helperText && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-primary-600' : 'text-neutral-500')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
