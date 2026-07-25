import React, { useState } from 'react';
import { FiCpu, FiTrash2, FiShield, FiAlertCircle } from 'react-icons/fi';

const ChatHeader = ({ onClear, messageCount }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearClick = () => {
    if (messageCount <= 1) return;
    setShowConfirm(true);
  };

  const handleConfirmClear = () => {
    onClear();
    setShowConfirm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-700/80 bg-slate-900/95 backdrop-blur-md">
        {/* Left: Avatar + Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-glow border border-white/20">
              <FiCpu className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-glow-emerald" />
          </div>

          <div>
            <h1 className="text-base font-extrabold text-white leading-tight">
              Aria · AI Wellness Companion
            </h1>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online · Always here for you
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-200 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-full font-semibold">
            <FiShield className="w-3.5 h-3.5 text-blue-400" />
            <span>Private & Encrypted</span>
          </div>

          <button
            onClick={handleClearClick}
            disabled={messageCount <= 1}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-rose-300 px-3 py-1.5 rounded-xl hover:bg-rose-950/40 border border-transparent hover:border-rose-800/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="Clear chat"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-modal p-6 m-4 max-w-sm w-full animate-scaleIn bg-slate-900 border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center flex-shrink-0">
                <FiAlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Clear conversation?</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  This will clear the active message window.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed font-medium">
              Your saved database chat history will remain untouched. Only this active session display will reset.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-glass flex-1 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="btn-gradient flex-1 py-2.5 rounded-xl text-xs font-bold !from-rose-600 !to-rose-700 hover:!from-rose-500 hover:!to-rose-600"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
