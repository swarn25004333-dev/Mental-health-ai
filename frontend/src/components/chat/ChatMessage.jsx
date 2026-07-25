import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiCopy, FiCheck, FiCpu, FiUser, FiAlertTriangle } from 'react-icons/fi';

const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = ({ message, onCopy, isCopied }) => {
  const isUser = message.role === 'user';
  const isEmergency = message.isEmergency;
  const isError = message.isError;

  return (
    <div
      className={`flex items-end gap-3 group animate-fadeInUp ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mb-1 shadow-md border border-white/20 ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
            : isEmergency
            ? 'bg-rose-600 text-white shadow-glow-rose'
            : isError
            ? 'bg-amber-600 text-white'
            : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-glow-sm'
        }`}
      >
        {isUser ? (
          <FiUser className="w-4.5 h-4.5" />
        ) : isEmergency ? (
          <FiAlertTriangle className="w-4.5 h-4.5" />
        ) : (
          <FiCpu className="w-4.5 h-4.5" />
        )}
      </div>

      {/* Bubble + Timestamp */}
      <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`relative px-4.5 py-3.5 text-sm leading-relaxed transition-all duration-200 ${
            isUser
              ? 'chat-bubble-user'
              : isEmergency
              ? 'chat-bubble-emergency'
              : isError
              ? 'chat-bubble-error'
              : 'chat-bubble-ai'
          }`}
        >
          {/* Emergency Banner */}
          {isEmergency && (
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-300 mb-2.5 pb-2 border-b border-rose-500/30">
              <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>CRISIS SUPPORT AVAILABLE</span>
            </div>
          )}

          {/* Content */}
          {isUser ? (
            <p className="whitespace-pre-wrap break-words text-white font-medium">{message.content}</p>
          ) : (
            <div className="prose-glass prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Copy button (AI messages only) */}
          {!isUser && (
            <button
              onClick={() => onCopy(message.id, message.content)}
              className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-xl bg-slate-800 border border-slate-600 shadow-md flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Copy message"
              aria-label="Copy message"
            >
              {isCopied === message.id ? (
                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <FiCopy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 font-mono px-1 font-semibold">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
