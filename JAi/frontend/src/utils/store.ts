import { create } from 'zustand';
import { authAPI, journalAPI, aiAPI } from './api';

// Define types
export type User = {
  id: string;
  email: string;
};

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  ai_summary?: string;
  has_summary: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

// Define store state
type StoreState = {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Journal state
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  pagination: Pagination;
  filters: {
    mood?: string;
    tag?: string;
    search?: string;
    from?: string;
    to?: string;
  };
  
  // UI state
  darkMode: boolean;
  sidebarOpen: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  fetchEntries: (page?: number, limit?: number) => Promise<void>;
  fetchEntryById: (id: string) => Promise<void>;
  createEntry: (entry: { title?: string; content: string; mood?: string; tags?: string[] }) => Promise<JournalEntry>;
  updateEntry: (id: string, updates: { title?: string; content?: string; mood?: string; tags?: string[] }) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  
  summarizeEntry: (text: string, entryId?: string) => Promise<{ summary: string }>;
  
  setFilters: (filters: { mood?: string; tag?: string; search?: string; from?: string; to?: string }) => void;
  clearFilters: () => void;
  
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
};

// Create store
const useStore = create<StoreState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: authAPI.isAuthenticated(),
  isLoading: false,
  error: null,
  
  entries: [],
  currentEntry: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  filters: {},
  
  darkMode: false,
  sidebarOpen: true,
  
  // Auth actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authAPI.login(email, password);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authAPI.register(email, password);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  logout: () => {
    authAPI.logout();
    set({ user: null, isAuthenticated: false, entries: [], currentEntry: null });
  },
  
  // Journal actions
  fetchEntries: async (page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const data = await journalAPI.getEntries({
        page,
        limit,
        ...filters
      });
      set({ 
        entries: data.entries, 
        pagination: data.pagination,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch entries', 
        isLoading: false 
      });
    }
  },
  
  fetchEntryById: async (id) => {
    set({ isLoading: true });
    try {
      const data = await journalAPI.getEntryById(id);
      set({ currentEntry: data.entry, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch entry', 
        isLoading: false 
      });
    }
  },
  
  createEntry: async (entry) => {
    set({ isLoading: true });
    try {
      const data = await journalAPI.createEntry(entry);
      const newEntry = data.entry;
      set(state => ({ 
        entries: [newEntry, ...state.entries],
        currentEntry: newEntry,
        isLoading: false 
      }));
      return newEntry;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create entry', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateEntry: async (id, updates) => {
    set({ isLoading: true });
    try {
      const data = await journalAPI.updateEntry(id, updates);
      const updatedEntry = data.entry;
      set(state => ({ 
        entries: state.entries.map(entry => 
          entry.id === id ? updatedEntry : entry
        ),
        currentEntry: state.currentEntry?.id === id ? updatedEntry : state.currentEntry,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update entry', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteEntry: async (id) => {
    set({ isLoading: true });
    try {
      await journalAPI.deleteEntry(id);
      set(state => ({ 
        entries: state.entries.filter(entry => entry.id !== id),
        currentEntry: state.currentEntry?.id === id ? null : state.currentEntry,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete entry', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // AI actions
  summarizeEntry: async (text, entryId) => {
    set({ isLoading: true });
    try {
      const data = await aiAPI.summarizeEntry(text, entryId);
      
      // If this is for the current entry, update it
      if (entryId && get().currentEntry?.id === entryId) {
        set(state => ({
          currentEntry: state.currentEntry ? {
            ...state.currentEntry,
            ai_summary: data.summary,
            has_summary: true
          } : null
        }));
      }
      
      set({ isLoading: false });
      return { summary: data.summary };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to generate summary', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Filter actions
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchEntries(1, get().pagination.limit);
  },
  
  clearFilters: () => {
    set({ filters: {} });
    get().fetchEntries(1, get().pagination.limit);
  },
  
  // UI actions
  toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen }))
}));

export default useStore;