/**
 * useChat.js — Custom hook for all chatbot state and logic
 *
 * Manages:
 * - Message list (user + AI bubbles)
 * - Loading/typing state while AI is responding
 * - Sending messages and handling responses
 * - Emergency redirect detection
 * - Auto-scroll to latest message
 * - Clear chat functionality
 * - Copy message utility
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { formatErrorMessage } from '../utils/formatError';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  content:
    "Hello! I'm **Aria**, your AI mental wellness companion. 💙\n\nI'm here to listen and support you — whether you're feeling stressed, overwhelmed, or just need someone to talk to.\n\nRemember: I'm an AI, not a licensed therapist. For serious concerns, please always reach out to a mental health professional.\n\nHow are you feeling today?",
  timestamp: new Date(),
};

const useChat = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(null); // stores ID of last copied message

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to the latest message whenever messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Send a message to the AI
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setError(null);

      // Append user message immediately for instant feedback
      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      try {
        const data = await chatService.sendMessage(trimmed);

        // Check for crisis/emergency signal
        if (data.is_emergency) {
          const emergencyMessage = {
            id: `ai-${Date.now()}`,
            role: 'ai',
            content: data.reply,
            timestamp: new Date(),
            isEmergency: true,
          };
          setMessages((prev) => [...prev, emergencyMessage]);
          // Give the user a moment to read before redirecting
          setTimeout(() => navigate('/emergency'), 2500);
          return;
        }

        const aiMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        const errorMessage = {
          id: `error-${Date.now()}`,
          role: 'ai',
          content:
            "I'm sorry, I had trouble connecting. Please check your connection and try again. If you're in distress, please reach out to a trusted person or call emergency services.",
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
        const safeErrorStr = formatErrorMessage(err, 'Connection failed. Please try again.');
        setError(safeErrorStr);
      } finally {
        setIsTyping(false);
        // Refocus input after response
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [isTyping, navigate]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      sendMessage(inputValue);
    },
    [inputValue, sendMessage]
  );

  // Handle keyboard: Enter to send, Shift+Enter for new line
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputValue);
      }
    },
    [inputValue, sendMessage]
  );

  // Clear the visible chat (reset to welcome message only)
  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    inputRef.current?.focus();
  }, []);

  // Copy message text to clipboard
  const copyMessage = useCallback(async (id, content) => {
    try {
      // Strip markdown for clean copy
      const plainText = content
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/#+\s/g, '')
        .trim();
      await navigator.clipboard.writeText(plainText);
      setIsCopied(id);
      setTimeout(() => setIsCopied(null), 2000);
    } catch {
      // Clipboard API not available in all contexts
    }
  }, []);

  return {
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
  };
};

export default useChat;
