import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiSearch, FiX, FiCalendar, FiSmile, FiTag } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import useStore from '../utils/store';

const Search: React.FC = () => {
  const router = useRouter();
  const { entries, fetchEntries, isLoading, setFilters, clearFilters, filters } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  // Define mood options
  const moods = [
    { value: 'happy', label: 'Happy', icon: '😊' },
    { value: 'sad', label: 'Sad', icon: '😢' },
    { value: 'angry', label: 'Angry', icon: '😠' },
    { value: 'anxious', label: 'Anxious', icon: '😰' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
  ];
  
  // Get all unique tags from entries
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags || [])));
  
  // Initialize search from URL query params
  useEffect(() => {
    const { search, mood, tag, from, to } = router.query;
    
    if (search && typeof search === 'string') {
      setSearchTerm(search);
    }
    
    if (mood && typeof mood === 'string') {
      setSelectedMood(mood);
    }
    
    if (tag && typeof tag === 'string') {
      setSelectedTag(tag);
    }
    
    if (from && typeof from === 'string') {
      setDateRange(prev => ({ ...prev, from }));
    }
    
    if (to && typeof to === 'string') {
      setDateRange(prev => ({ ...prev, to }));
    }
    
    // Apply filters from URL
    if (search || mood || tag || from || to) {
      setFilters({
        search: typeof search === 'string' ? search : undefined,
        mood: typeof mood === 'string' ? mood : undefined,
        tag: typeof tag === 'string' ? tag : undefined,
        from: typeof from === 'string' ? from : undefined,
        to: typeof to === 'string' ? to : undefined,
      });
    } else {
      // If no filters in URL, fetch all entries
      fetchEntries();
    }
  }, [router.query, setFilters, fetchEntries]);
  
  // Update URL when filters change
  useEffect(() => {
    const query: Record<string, string> = {};
    
    if (searchTerm) query.search = searchTerm;
    if (selectedMood) query.mood = selectedMood;
    if (selectedTag) query.tag = selectedTag;
    if (dateRange.from) query.from = dateRange.from;
    if (dateRange.to) query.to = dateRange.to;
    
    router.push({
      pathname: '/search',
      query
    }, undefined, { shallow: true });
  }, [searchTerm, selectedMood, selectedTag, dateRange, router]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    setFilters({
      search: searchTerm,
      mood: selectedMood,
      tag: selectedTag,
      from: dateRange.from,
      to: dateRange.to,
    });
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedMood('');
    setSelectedTag('');
    setDateRange({ from: '', to: '' });
    clearFilters();
  };
  
  // Get mood emoji
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'anxious': return '😰';
      default: return '😐';
    }
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search Journal</h1>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search journal entries..."
                className="input pl-10"
              />
            </div>
            <button
              type="submit"
              className="ml-2 btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
            {(searchTerm || selectedMood || selectedTag || dateRange.from || dateRange.to) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="ml-2 btn-outline"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mood filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by mood
              </label>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="input"
              >
                <option value="">All moods</option>
                {moods.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.icon} {mood.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tag filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="input"
              >
                <option value="">All tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date range filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="input w-1/2"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="input w-1/2"
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Search results */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {isLoading ? 'Searching...' : `Search Results (${entries.length})`}
        </h2>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Searching your entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No entries found matching your search criteria.</p>
            <button
              onClick={handleClearFilters}
              className="btn-primary inline-flex items-center"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <Link 
                    href={`/entry/${entry.id}`}
                    className="font-semibold text-lg text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {entry.title}
                  </Link>
                  <span className="text-xl" title={`Mood: ${entry.mood}`}>
                    {getMoodEmoji(entry.mood)}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <FiCalendar className="mr-1" />
                  <span>{format(new Date(entry.created_at), 'MMM d, yyyy')}</span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {entry.content}
                </p>
                
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <Link 
                  href={`/entry/${entry.id}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  Read more
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;