import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-[#DE5252] text-white hover:bg-[#c94747] active:bg-[#b33d3d] shadow-sm',
      secondary: 'bg-[#b8a890] text-white hover:bg-[#a08968] active:bg-[#7d6b52] shadow-sm',
      outline: 'border-2 border-[#DE5252] text-[#DE5252] hover:bg-[#fef2f2] active:bg-[#fee2e2]',
      ghost: 'text-[#DE5252] hover:bg-[#fef2f2] active:bg-[#fee2e2]',
      danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] active:bg-[#b91c1c] shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
