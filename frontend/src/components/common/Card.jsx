import React from 'react';

/**
 * Card — Dark Glassmorphism Card Component
 * High contrast, translucent dark navy background, white headings, clear body text.
 */
const Card = ({
  children,
  title,
  subtitle,
  action,
  variant = 'default',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  noPadding = false,
}) => {
  const baseClass = variant === 'elevated'
    ? 'glass-card-elevated'
    : variant === 'flat'
    ? 'glass border border-white/[0.12] rounded-2xl'
    : 'glass-card';

  return (
    <div className={`${baseClass} ${className}`}>
      {/* Card Header */}
      {(title || subtitle || action) && (
        <div
          className={`flex items-center justify-between px-6 py-4.5 border-b border-white/[0.10] ${headerClassName}`}
        >
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0 ml-4">{action}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={noPadding ? '' : `p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
