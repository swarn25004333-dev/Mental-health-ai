import React from 'react';
import { FiCpu } from 'react-icons/fi';

const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-3 animate-fadeInUp">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center flex-shrink-0 mb-1 shadow-glow-sm">
        <FiCpu className="w-4.5 h-4.5" />
      </div>

      {/* Typing Bubble */}
      <div className="chat-bubble-ai px-4 py-3.5 flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-blue-400 animate-typingDot"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-indigo-400 animate-typingDot"
          style={{ animationDelay: '0.2s' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-violet-400 animate-typingDot"
          style={{ animationDelay: '0.4s' }}
        />
        <span className="text-xs text-slate-400 font-medium ml-2">Aria is thinking...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
