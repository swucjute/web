import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'w-full px-3.5 py-3 text-sm text-[#292524] bg-white border rounded-xl',
            'placeholder:text-[#a8a29e]',
            'focus:outline-none focus:ring-2 focus:border-transparent transition',
            error
              ? 'border-[#dc2626] focus:ring-[#dc2626]/20'
              : 'border-[#e7e5e4] focus:ring-[#DE5252]/20 focus:border-[#DE5252]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#fafaf9]',
            className
          )}
          {...props}
        />
        {helperText && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-[#dc2626]' : 'text-[#78716c]')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
