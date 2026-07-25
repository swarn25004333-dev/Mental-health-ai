/**
 * moodService.js — Frontend API client for Mood Tracking
 */

import api from './api';

const moodService = {
  /**
   * Log a new mood entry.
   * @param {{ mood: string, note?: string }} data
   * @returns {Promise<Object>} The created mood entry object
   */
  logMood: async ({ mood, note = '' }) => {
    const response = await api.post('/mood/log', { mood, note });
    return response.data;
  },

  /**
   * Fetch today's logged mood entry if available.
   * @returns {Promise<{ has_logged_today: boolean, today_entry: Object|null }>}
   */
  getTodayMood: async () => {
    const response = await api.get('/mood/today');
    return response.data;
  },

  /**
   * Fetch historical mood entries for the user.
   * @param {number|null} days - Optional filter for last N days (7, 30, or null for all)
   * @param {number} limit - Maximum entries to fetch (default: 200)
   * @returns {Promise<{ history: Array, count: number }>}
   */
  getMoodHistory: async (days = null, limit = 200) => {
    const params = { limit };
    if (days) params.days = days;
    const response = await api.get('/mood/history', { params });
    return response.data;
  },

  /**
   * Delete a specific mood entry by ID.
   * @param {string} entryId
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  deleteMoodEntry: async (entryId) => {
    const response = await api.delete(`/mood/history/${entryId}`);
    return response.data;
  },
};

export default moodService;
