import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s — AI responses can take time
});

// Request Interceptor: Attach Supabase Auth Token
api.interceptors.request.use(
  async (config) => {
    try {
      // Dynamically import to avoid circular deps
      const { supabase } = await import('../lib/supabase.js');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('⚠️ Error fetching Supabase session in API interceptor:', error);
      }

      const token = data?.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`🔒 [API Request] ${config.method?.toUpperCase()} ${config.url} — Attached Supabase Token (len: ${token.length})`);
      } else {
        // Fallback: try localStorage (legacy)
        const localToken = localStorage.getItem('token');
        if (localToken) {
          config.headers.Authorization = `Bearer ${localToken}`;
          console.log(`🔒 [API Request] ${config.method?.toUpperCase()} ${config.url} — Attached LocalStorage Token (len: ${localToken.length})`);
        } else {
          console.warn(`⚠️ [API Request] ${config.method?.toUpperCase()} ${config.url} — NO AUTH TOKEN FOUND in session or localStorage!`);
        }
      }
    } catch (err) {
      console.error('❌ Exception in API request interceptor:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
