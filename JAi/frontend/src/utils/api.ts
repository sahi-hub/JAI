import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Journal API
export const journalAPI = {
  createEntry: async (entry: { title?: string; content: string; mood?: string; tags?: string[] }) => {
    const response = await api.post('/journal', entry);
    return response.data;
  },
  
  getEntries: async (params?: { 
    page?: number; 
    limit?: number; 
    from?: string; 
    to?: string; 
    mood?: string; 
    tag?: string; 
    search?: string 
  }) => {
    const response = await api.get('/journal', { params });
    return response.data;
  },
  
  getEntryById: async (id: string) => {
    const response = await api.get(`/journal/${id}`);
    return response.data;
  },
  
  updateEntry: async (id: string, updates: { 
    title?: string; 
    content?: string; 
    mood?: string; 
    tags?: string[] 
  }) => {
    const response = await api.put(`/journal/${id}`, updates);
    return response.data;
  },
  
  deleteEntry: async (id: string) => {
    const response = await api.delete(`/journal/${id}`);
    return response.data;
  }
};

// AI API
export const aiAPI = {
  summarizeEntry: async (text: string, entryId?: string) => {
    const response = await api.post('/ai/summarize', { text, entryId });
    return response.data;
  },
  
  getEntrySummary: async (id: string) => {
    const response = await api.get(`/ai/summary/${id}`);
    return response.data;
  }
};

export default {
  auth: authAPI,
  journal: journalAPI,
  ai: aiAPI
};