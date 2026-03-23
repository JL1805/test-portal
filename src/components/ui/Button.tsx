import { cn } from '../../utils/helpers';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  ariaLabel?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  type = 'button',
  className = '',
  ariaLabel,
}: ButtonProps) {
  const base =
    'relative inline-flex items-center justify-center rounded-full font-semibold min-h-[44px] px-6 py-3 text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants: Record<string, string> = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] focus:ring-[var(--color-primary)] shadow-lg hover:shadow-xl active:scale-[0.98]',
    secondary:
      'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white focus:ring-[var(--color-primary)]',
    ghost:
      'text-[var(--color-text-secondary)] bg-transparent hover:bg-slate-100 focus:ring-slate-300',
    danger:
      'text-[var(--color-error)] bg-transparent hover:bg-red-50 focus:ring-red-300',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={cn(
        base,
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
