import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiPlusCircle, FiSearch, FiTag, FiCalendar, FiSmile } from 'react-icons/fi';
import useStore from '../../utils/store';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { sidebarOpen, filters, setFilters, clearFilters } = useStore();
  
  // Define mood options
  const moods = [
    { value: 'happy', label: 'Happy', icon: '😊' },
    { value: 'sad', label: 'Sad', icon: '😢' },
    { value: 'angry', label: 'Angry', icon: '😠' },
    { value: 'anxious', label: 'Anxious', icon: '😰' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
  ];
  
  // Common tag examples
  const commonTags = ['work', 'personal', 'ideas', 'goals', 'gratitude'];
  
  const isActive = (path: string) => router.pathname === path;
  
  if (!sidebarOpen) return null;
  
  return (
    <aside className="bg-white dark:bg-gray-900 w-64 fixed left-0 top-16 bottom-0 shadow-md overflow-y-auto z-10 transition-all duration-300">
      <div className="p-4">
        <nav className="space-y-1">
          <Link 
            href="/"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive('/') ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiHome className="mr-3 h-5 w-5" />
            <span>Home</span>
          </Link>
          
          <Link 
            href="/new"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive('/new') ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiPlusCircle className="mr-3 h-5 w-5" />
            <span>New Entry</span>
          </Link>
          
          <Link 
            href="/search"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive('/search') ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiSearch className="mr-3 h-5 w-5" />
            <span>Search</span>
          </Link>
        </nav>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Filters
          </h3>
          
          {/* Mood filter */}
          <div className="mt-4">
            <div className="flex items-center px-3 text-sm text-gray-700 dark:text-gray-300">
              <FiSmile className="mr-2 h-4 w-4" />
              <span>Mood</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 px-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setFilters({ mood: mood.value === filters.mood ? undefined : mood.value })}
                  className={`flex items-center px-2 py-1 rounded-full text-xs ${
                    filters.mood === mood.value 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="mr-1">{mood.icon}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tags filter */}
          <div className="mt-4">
            <div className="flex items-center px-3 text-sm text-gray-700 dark:text-gray-300">
              <FiTag className="mr-2 h-4 w-4" />
              <span>Tags</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 px-3">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilters({ tag: tag === filters.tag ? undefined : tag })}
                  className={`px-2 py-1 rounded-full text-xs ${
                    filters.tag === tag 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Date filter - simplified version */}
          <div className="mt-4">
            <div className="flex items-center px-3 text-sm text-gray-700 dark:text-gray-300">
              <FiCalendar className="mr-2 h-4 w-4" />
              <span>Time Period</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 px-3">
              {['Today', 'This Week', 'This Month', 'This Year'].map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    // Simplified date filtering logic
                    const now = new Date();
                    let from;
                    
                    if (period === 'Today') {
                      from = new Date(now.setHours(0, 0, 0, 0)).toISOString();
                    } else if (period === 'This Week') {
                      const day = now.getDay();
                      from = new Date(now.setDate(now.getDate() - day)).toISOString();
                    } else if (period === 'This Month') {
                      from = new Date(now.setDate(1)).toISOString();
                    } else if (period === 'This Year') {
                      from = new Date(now.setMonth(0, 1)).toISOString();
                    }
                    
                    setFilters({ from });
                  }}
                  className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          {/* Clear filters button */}
          {(filters.mood || filters.tag || filters.from) && (
            <button
              onClick={clearFilters}
              className="mt-4 px-3 py-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;