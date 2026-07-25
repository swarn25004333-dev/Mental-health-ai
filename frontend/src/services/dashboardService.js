/**
 * dashboardService.js — Frontend API client for fetching dashboard summary statistics
 */

import api from './api';

const dashboardService = {
  /**
   * Fetch aggregated summary statistics for the user's dashboard.
   * @returns {Promise<{
   *   today_mood: string|null,
   *   has_logged_today: boolean,
   *   total_chat_messages: number,
   *   latest_phq2_score: number|null,
   *   latest_phq2_recommendation: string|null
   * }>}
   */
  getDashboardSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
};

export default dashboardService;
