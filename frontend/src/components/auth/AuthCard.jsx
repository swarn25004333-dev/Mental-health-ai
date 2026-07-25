import React from 'react';

const AuthCard = ({ children, title, subtitle, footer }) => {
  return (
    <div className="glass-auth p-8">
      {/* Card Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{subtitle}</p>
        )}
      </div>

      {/* Form Content */}
      <div>{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-sm text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};

export default AuthCard;
