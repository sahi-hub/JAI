import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../../../.env') });

const OLLAMA_API_URL = process.env.OLLAMA_API_URL;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'tinyllama';

if (!OLLAMA_API_URL) {
  console.error('Missing Ollama API URL. Please check your .env file.');
  process.exit(1);
}

/**
 * Generate a summary or insights for a journal entry using Ollama LLM
 * @param {string} text - The journal entry text to summarize
 * @returns {Promise<string>} - The generated summary
 */
export async function generateSummary(text) {
  try {
    const prompt = `
You are an AI assistant helping to summarize and provide insights on a personal journal entry.
Please provide a thoughtful, concise summary (2-3 sentences) followed by 1-2 key insights or reflections.
Be empathetic, supportive, and focus on the emotional themes present in the entry.

Journal entry:
${text}

Summary and insights:`;

    const response = await fetch(`${OLLAMA_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ollama API error: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary. Please try again later.');
  }
}

export default {
  generateSummary,
};