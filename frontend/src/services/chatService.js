/**
 * chatService.js — Frontend API calls for the AI Chatbot
 *
 * All calls go to the FastAPI backend, which holds the Gemini API key.
 * The Gemini key is NEVER sent to or exposed on the frontend.
 */

import api from './api';

const chatService = {
  /**
   * Send a message to the AI companion.
   * @param {string} message - User's input text
   * @returns {{ reply: string, is_emergency: boolean }}
   */
  sendMessage: async (message) => {
    const response = await api.post('/chatbot/chat', { message });
    return response.data;
  },

  /**
   * Retrieve the user's chat history.
   * @param {number} limit - Max records to fetch (default 50)
   * @returns {{ history: Array, count: number }}
   */
  getHistory: async (limit = 50) => {
    const response = await api.get('/chatbot/history', { params: { limit } });
    return response.data;
  },

  /**
   * Delete ALL chat history for the authenticated user.
   * @returns {{ success: boolean, message: string }}
   */
  clearHistory: async () => {
    const response = await api.delete('/chatbot/history');
    return response.data;
  },

  /**
   * Delete a single chat history record by ID.
   * @param {string} chatId - UUID of the chat record
   * @returns {{ success: boolean, message: string }}
   */
  deleteHistoryItem: async (chatId) => {
    const response = await api.delete(`/chatbot/history/${chatId}`);
    return response.data;
  },
};

export default chatService;
