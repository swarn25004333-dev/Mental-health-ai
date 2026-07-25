import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity } from 'react-icons/fi';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute top-1/3 left-[-150px] w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-md z-10 animate-fadeInUp">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <FiActivity className="text-white" style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-100 tracking-tight">Mental Health AI</div>
              <div className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-0.5">Wellness Platform</div>
            </div>
          </Link>
        </div>

        {/* Form container */}
        {children}
      </div>

      {/* Footer note */}
      <p className="relative z-10 mt-8 text-xs text-slate-600 text-center">
        Your data is protected with end-to-end encryption.
      </p>
    </div>
  );
};

export default AuthLayout;
