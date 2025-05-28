import supabase from '../utils/supabase.js';

/**
 * Create a new journal entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createEntry = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    const userId = req.user.id;
    
    if (!content) {
      return res.status(400).json({ error: true, message: 'Journal content is required' });
    }
    
    const entry = {
      user_id: userId,
      title: title || 'Untitled Entry',
      content,
      mood: mood || 'neutral',
      tags: tags || [],
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([entry])
      .select();
      
    if (error) {
      console.error('Error creating journal entry:', error);
      return res.status(500).json({ error: true, message: 'Failed to create journal entry' });
    }
    
    res.status(201).json({
      message: 'Journal entry created successfully',
      entry: data[0]
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

/**
 * Get all journal entries for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to, mood, tag, search, limit = 20, page = 1 } = req.query;
    
    let query = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (from) {
      query = query.gte('created_at', from);
    }
    
    if (to) {
      query = query.lte('created_at', to);
    }
    
    if (mood) {
      query = query.eq('mood', mood);
    }
    
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    query = query.range(startIndex, startIndex + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching journal entries:', error);
      return res.status(500).json({ error: true, message: 'Failed to fetch journal entries' });
    }
    
    res.status(200).json({
      entries: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

/**
 * Get a single journal entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching journal entry:', error);
      return res.status(404).json({ error: true, message: 'Journal entry not found' });
    }
    
    res.status(200).json({ entry: data });
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

/**
 * Update a journal entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, mood, tags } = req.body;
    const userId = req.user.id;
    
    // Check if entry exists and belongs to user
    const { data: existingEntry, error: fetchError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
      
    if (fetchError || !existingEntry) {
      return res.status(404).json({ error: true, message: 'Journal entry not found' });
    }
    
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (mood !== undefined) updates.mood = mood;
    if (tags !== undefined) updates.tags = tags;
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select();
      
    if (error) {
      console.error('Error updating journal entry:', error);
      return res.status(500).json({ error: true, message: 'Failed to update journal entry' });
    }
    
    res.status(200).json({
      message: 'Journal entry updated successfully',
      entry: data[0]
    });
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

/**
 * Delete a journal entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if entry exists and belongs to user
    const { data: existingEntry, error: fetchError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
      
    if (fetchError || !existingEntry) {
      return res.status(404).json({ error: true, message: 'Journal entry not found' });
    }
    
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error deleting journal entry:', error);
      return res.status(500).json({ error: true, message: 'Failed to delete journal entry' });
    }
    
    res.status(200).json({
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

export default {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry
};