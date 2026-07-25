import React, { useEffect } from 'react';
import { FiSend } from 'react-icons/fi';

const MAX_LENGTH = 4000;

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  isLoading,
  inputRef,
}) => {
  const charCount = value.length;
  const isNearLimit = charCount > MAX_LENGTH * 0.85;
  const isOverLimit = charCount > MAX_LENGTH;

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [value, inputRef]);

  return (
    <div className="p-3.5 md:p-4 border-t border-slate-700/80 bg-slate-950/90 backdrop-blur-md">
      <form onSubmit={onSubmit} className="flex items-end gap-2.5 max-w-4xl mx-auto">
        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            id="chat-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Share what's on your mind... (Enter to send, Shift+Enter for newline)"
            maxLength={MAX_LENGTH}
            rows={1}
            disabled={isLoading}
            className={`glass-input w-full px-4 py-3 rounded-2xl text-sm leading-relaxed resize-none disabled:opacity-50 text-white placeholder-slate-400 ${
              isOverLimit ? 'error' : ''
            }`}
            style={{ minHeight: '48px', maxHeight: '160px' }}
          />

          {isNearLimit && (
            <span
              className={`absolute bottom-2.5 right-3.5 text-[10px] font-mono font-bold ${
                isOverLimit ? 'text-rose-400' : 'text-slate-400'
              }`}
            >
              {charCount}/{MAX_LENGTH}
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !value.trim() || isOverLimit}
          className="w-12 h-12 flex-shrink-0 rounded-2xl btn-gradient flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-sm"
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiSend className="w-5 h-5 text-white" />
          )}
        </button>
      </form>

      <p className="text-[11px] text-slate-400 mt-2 text-center font-semibold">
        Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">Enter</kbd> to send ·{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">Shift+Enter</kbd> for line break
      </p>
    </div>
  );
};

export default ChatInput;
