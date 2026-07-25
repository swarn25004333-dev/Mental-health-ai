import React from 'react';

/**
 * Button — High-Contrast Dark Glassmorphism Button Component
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden';

  const variants = {
    primary: 'btn-gradient',
    secondary:
      'bg-slate-800/90 border border-slate-600/80 text-white hover:bg-slate-700/90 hover:border-slate-500 active:scale-[0.98] shadow-md',
    outline: 'btn-glass text-white font-semibold',
    ghost:
      'bg-transparent text-slate-200 hover:text-white hover:bg-white/10 active:scale-[0.98]',
    danger:
      'bg-rose-600 border border-rose-400 text-white hover:bg-rose-700 shadow-md active:scale-[0.98]',
    success:
      'bg-emerald-600 border border-emerald-400 text-white hover:bg-emerald-700 shadow-md active:scale-[0.98]',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs gap-1.5',
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-5.5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
