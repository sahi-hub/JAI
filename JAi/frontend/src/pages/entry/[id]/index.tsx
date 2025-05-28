import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiEdit, FiArrowLeft, FiCalendar, FiSmile, FiTag } from 'react-icons/fi';
import Layout from '../../../components/layout/Layout';
import useStore from '../../../utils/store';

const EntryDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentEntry, fetchEntryById, isLoading, summarizeEntry } = useStore();
  
  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchEntryById(id);
    }
  }, [id, fetchEntryById]);
  
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
  
  const handleGenerateSummary = async () => {
    if (!currentEntry) return;
    
    try {
      await summarizeEntry(currentEntry.content, currentEntry.id);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading entry...</p>
        </div>
      </Layout>
    );
  }
  
  if (!currentEntry) {
    return (
      <Layout>
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">Entry not found</p>
          <Link href="/" className="mt-4 btn-primary inline-flex items-center">
            <FiArrowLeft className="mr-2" />
            Back to Journal
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <Link href="/" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
          <FiArrowLeft className="mr-2" />
          Back to Journal
        </Link>
        <Link 
          href={`/entry/${currentEntry.id}/edit`}
          className="btn-primary flex items-center"
        >
          <FiEdit className="mr-2" />
          Edit Entry
        </Link>
      </div>
      
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {currentEntry.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              <span>{format(new Date(currentEntry.created_at), 'MMMM d, yyyy h:mm a')}</span>
            </div>
            
            <div className="flex items-center">
              <FiSmile className="mr-1" />
              <span className="flex items-center">
                <span className="mr-1">{getMoodEmoji(currentEntry.mood)}</span>
                <span className="capitalize">{currentEntry.mood}</span>
              </span>
            </div>
          </div>
        </header>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          {currentEntry.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {currentEntry.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <FiTag className="mr-2" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentEntry.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Summary & Insights</h3>
            {!currentEntry.has_summary && (
              <button
                onClick={handleGenerateSummary}
                className="btn-secondary"
              >
                Generate Summary
              </button>
            )}
          </div>
          
          {currentEntry.has_summary && currentEntry.ai_summary ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{currentEntry.ai_summary}</p>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-900 rounded-md">
              <p className="text-gray-600 dark:text-gray-400">
                {isLoading ? 'Generating summary...' : 'No AI summary available for this entry yet.'}
              </p>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default EntryDetail;