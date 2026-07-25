import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiMessageSquare,
  FiSmile,
  FiTrendingUp,
  FiClipboard,
  FiClock,
  FiAlertTriangle,
  FiUser,
  FiX,
  FiLogOut,
  FiActivity,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/',             label: 'Dashboard',       icon: FiGrid,          group: 'main' },
  { path: '/chat',         label: 'AI Companion',    icon: FiMessageSquare, group: 'main' },
  { path: '/mood-tracker', label: 'Mood Tracker',    icon: FiSmile,         group: 'wellness' },
  { path: '/mood-history', label: 'Mood History',    icon: FiTrendingUp,    group: 'wellness' },
  { path: '/phq-2',        label: 'PHQ-2 Assessment',icon: FiClipboard,     group: 'wellness' },
  { path: '/chat-history', label: 'Chat History',    icon: FiClock,         group: 'history' },
  { path: '/emergency',    label: 'Emergency Help',  icon: FiAlertTriangle, group: 'emergency', badge: 'Crucial' },
  { path: '/profile',      label: 'Profile Settings',icon: FiUser,          group: 'account' },
];

const groupLabels = {
  main:      'Core',
  wellness:  'Wellness Tools',
  history:   'Logs & History',
  emergency: 'Crisis Support',
  account:   'User Account',
};

const groupedItems = (() => {
  const groups = {};
  navItems.forEach((item) => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  });
  return groups;
})();

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user, profile } = useAuth();

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-sidebar flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header inside Sidebar */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center border border-white/20">
              <FiActivity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Mental Health AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Brand Header inside Sidebar */}
        <div className="hidden md:flex items-center gap-3 px-5 py-5 border-b border-white/[0.08]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-glow border border-white/20 flex-shrink-0">
            <FiActivity className="text-white" style={{ width: '1.1rem', height: '1.1rem' }} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-white">Mental Health AI</div>
            <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider mt-0.5">Wellness Platform</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3.5 py-4 overflow-y-auto space-y-5">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group}>
              <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {groupLabels[group]}
              </p>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/30 to-violet-600/25 border border-blue-500/50 text-white shadow-glow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            item.group === 'emergency' ? 'text-rose-400' : ''
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-600/30 border border-rose-500/50 text-rose-200">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer — User Info & Sign Out */}
        <div className="p-3.5 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 border border-white/20">
              {avatarLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/60 transition-all duration-200"
          >
            <FiLogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
