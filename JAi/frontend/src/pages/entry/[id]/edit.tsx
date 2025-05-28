import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiSave, FiX, FiSmile, FiTag, FiArrowLeft } from 'react-icons/fi';
import Layout from '../../../components/layout/Layout';
import useStore from '../../../utils/store';

const EditEntry: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentEntry, fetchEntryById, updateEntry, isLoading } = useStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  
  // Define mood options
  const moods = [
    { value: 'happy', label: 'Happy', icon: '😊' },
    { value: 'sad', label: 'Sad', icon: '😢' },
    { value: 'angry', label: 'Angry', icon: '😠' },
    { value: 'anxious', label: 'Anxious', icon: '😰' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
  ];
  
  // Fetch entry data
  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchEntryById(id);
    }
  }, [id, fetchEntryById]);
  
  // Set form values when entry data is loaded
  useEffect(() => {
    if (currentEntry) {
      setTitle(currentEntry.title);
      setContent(currentEntry.content);
      setMood(currentEntry.mood);
      setTags(currentEntry.tags || []);
    }
  }, [currentEntry]);
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!content.trim()) {
      setError('Journal content is required');
      return;
    }
    
    if (!id || typeof id !== 'string') {
      setError('Invalid entry ID');
      return;
    }
    
    try {
      await updateEntry(id, {
        title: title.trim() || 'Untitled Entry',
        content,
        mood,
        tags
      });
      
      router.push(`/entry/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update entry');
    }
  };
  
  if (isLoading && !currentEntry) {
    return (
      <Layout>
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading entry...</p>
        </div>
      </Layout>
    );
  }
  
  if (!currentEntry && !isLoading) {
    return (
      <Layout>
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">Entry not found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 btn-primary inline-flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to Journal
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Journal Entry</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline flex items-center"
          >
            <FiX className="mr-2" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-primary flex items-center"
          >
            <FiSave className="mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title"
            className="input"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Journal Entry
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="textarea h-64"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <FiSmile className="mr-2" />
            How are you feeling?
          </label>
          <div className="flex flex-wrap gap-2">
            {moods.map((moodOption) => (
              <button
                key={moodOption.value}
                type="button"
                onClick={() => setMood(moodOption.value)}
                className={`flex items-center px-3 py-2 rounded-md ${
                  mood === moodOption.value 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-2 border-primary-500' 
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
                }`}
              >
                <span className="mr-2 text-xl">{moodOption.icon}</span>
                <span>{moodOption.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <FiTag className="mr-2" />
            Tags
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tags (press Enter)"
              className="input flex-grow"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div 
                  key={tag} 
                  className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Layout>
  );
};

export default EditEntry;