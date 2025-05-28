import { generateSummary } from '../utils/ollama.js';
import supabase from '../utils/supabase.js';

/**
 * Generate a summary for a journal entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const summarizeEntry = async (req, res) => {
  try {
    const { text, entryId } = req.body;
    const userId = req.user.id;
    
    if (!text) {
      return res.status(400).json({ error: true, message: 'Text content is required' });
    }
    
    // If entryId is provided, verify that the entry belongs to the user
    if (entryId) {
      const { data: entry, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', userId)
        .single();
        
      if (error || !entry) {
        return res.status(404).json({ error: true, message: 'Journal entry not found' });
      }
    }
    
    // Generate summary using Ollama LLM
    const summary = await generateSummary(text);
    
    // If entryId is provided, save the summary to the database
    if (entryId) {
      const { error } = await supabase
        .from('journal_entries')
        .update({ ai_summary: summary, has_summary: true })
        .eq('id', entryId)
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error saving summary to database:', error);
        // Continue anyway, as we still have the summary to return
      }
    }
    
    res.status(200).json({
      summary,
      entryId: entryId || null
    });
  } catch (error) {
    console.error('Summarize entry error:', error);
    res.status(500).json({ error: true, message: error.message || 'Internal server error' });
  }
};

/**
 * Get the summary for a journal entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getEntrySummary = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('id, ai_summary, has_summary')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching journal entry summary:', error);
      return res.status(404).json({ error: true, message: 'Journal entry not found' });
    }
    
    if (!data.has_summary) {
      return res.status(404).json({ error: true, message: 'No summary available for this entry' });
    }
    
    res.status(200).json({
      summary: data.ai_summary,
      entryId: data.id
    });
  } catch (error) {
    console.error('Get entry summary error:', error);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

export default {
  summarizeEntry,
  getEntrySummary
};