import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu,
  FiAlertCircle,
  FiActivity,
} from 'react-icons/fi';

const Navbar = ({ onToggleSidebar }) => {
  const { user, profile } = useAuth();

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    '';

  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="glass-navbar sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3.5 md:px-6">

        {/* Left: Mobile Toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 md:hidden"
            aria-label="Toggle Navigation Sidebar"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo Icon */}
            <div className="relative w-9.5 h-9.5 flex-shrink-0">
              <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-glow border border-white/20 group-hover:shadow-glow-lg transition-all duration-300">
                <FiActivity className="text-white" style={{ width: '1.2rem', height: '1.2rem' }} />
              </div>
            </div>

            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-base font-extrabold text-white tracking-tight">Mental Health AI</span>
              <span className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">Wellness Platform</span>
            </div>
          </Link>
        </div>

        {/* Right: Emergency CTA + User Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/emergency"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 bg-rose-600/20 border border-rose-500/50 text-rose-200 hover:bg-rose-600 hover:text-white shadow-glow-rose"
          >
            <FiAlertCircle className="w-4 h-4 text-rose-300" />
            <span>Emergency Help</span>
          </Link>

          {/* User profile button */}
          <Link
            to="/profile"
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700/90 transition-all duration-200 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold shadow-sm border border-white/20">
                {avatarLetter}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-dark-900 shadow-glow-emerald" />
            </div>
            {displayName && (
              <span className="hidden md:block text-xs font-bold text-slate-100 group-hover:text-white transition-colors max-w-[120px] truncate">
                {displayName}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
