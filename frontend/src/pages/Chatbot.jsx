import React from 'react';
import useChat from '../hooks/useChat';
import ChatMessage from '../components/chat/ChatMessage';
import TypingIndicator from '../components/chat/TypingIndicator';
import ChatInput from '../components/chat/ChatInput';
import ChatHeader from '../components/chat/ChatHeader';
import EmptyChat from '../components/chat/EmptyChat';
import { FiAlertCircle } from 'react-icons/fi';
import { formatErrorMessage } from '../utils/formatError';

const Chatbot = () => {
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    error,
    setError,
    isCopied,
    messagesEndRef,
    inputRef,
    handleSubmit,
    handleKeyDown,
    clearChat,
    copyMessage,
    sendMessage,
  } = useChat();

  const showEmptyState = messages.length === 1 && messages[0].id === 'welcome';

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-5xl mx-auto animate-fadeInUp">
      {/* Main glass chat container */}
      <div className="flex-1 flex flex-col glass-card-elevated border border-white/10 rounded-2xl overflow-hidden shadow-glow">
        
        {/* Header */}
        <ChatHeader onClear={clearChat} messageCount={messages.length} />

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {showEmptyState ? (
            <EmptyChat onSelectPrompt={(text) => sendMessage(text)} />
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onCopy={copyMessage}
                  isCopied={isCopied}
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && <TypingIndicator />}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-4 mb-3 alert-error px-4 py-2.5 flex items-center justify-between gap-2 animate-fadeInUp">
            <div className="flex items-center gap-2 text-xs">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{typeof error === 'string' ? error : formatErrorMessage(error)}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-300 hover:text-rose-100 font-bold text-xs p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Area */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          isLoading={isTyping}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export default Chatbot;
