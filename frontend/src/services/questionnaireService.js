/**
 * questionnaireService.js — Frontend API client for assessments and screening tools
 */

import api from './api';

const questionnaireService = {
  /**
   * Submit a PHQ-2 Screening.
   * @param {{ question1: number, question2: number }} data
   * @returns {Promise<Object>} The generated PHQ-2 evaluation result
   */
  submitPhq2: async ({ question1, question2 }) => {
    const response = await api.post('/questionnaire/phq-2', {
      question1: parseInt(question1, 10),
      question2: parseInt(question2, 10),
    });
    return response.data;
  },

  /**
   * Fetch historical PHQ-2 assessments.
   * @returns {Promise<{ assessments: Array, count: number }>}
   */
  getPhq2History: async () => {
    const response = await api.get('/questionnaire/phq-2/history');
    return response.data;
  },
};

export default questionnaireService;
