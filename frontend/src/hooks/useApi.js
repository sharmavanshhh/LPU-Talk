import { useCallback } from 'react';
import { useAuth } from './useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useApi = () => {
  const { session } = useAuth();

  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    if (!session?.access_token) {
      throw new Error('No access token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP Error ${response.status}`);
    }

    return response.json();
  }, [session?.access_token]);

  return { fetchWithAuth };
};
