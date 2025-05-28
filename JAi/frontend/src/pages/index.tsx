import React, { useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { FiPlusCircle, FiEdit, FiTrash2, FiCalendar, FiSmile } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import useStore from '../utils/store';

const Home: React.FC = () => {
  const { entries, fetchEntries, deleteEntry, isLoading } = useStore();
  
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(id);
    }
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
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Journal</h1>
        <Link href="/new" className="btn-primary flex items-center">
          <FiPlusCircle className="mr-2" />
          New Entry
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading your entries...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any journal entries yet.</p>
          <Link href="/new" className="btn-primary inline-flex items-center">
            <FiPlusCircle className="mr-2" />
            Write your first entry
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <div key={entry.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                  {entry.title}
                </h2>
                <span className="text-xl" title={`Mood: ${entry.mood}`}>
                  {getMoodEmoji(entry.mood)}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <FiCalendar className="mr-1" />
                <span>{format(new Date(entry.created_at), 'MMM d, yyyy')}</span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {entry.content}
              </p>
              
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
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
              
              <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                <Link 
                  href={`/entry/${entry.id}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  Read more
                </Link>
                
                <div className="flex space-x-2">
                  <Link 
                    href={`/entry/${entry.id}/edit`}
                    className="p-1 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label="Edit entry"
                  >
                    <FiEdit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                    aria-label="Delete entry"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Home;