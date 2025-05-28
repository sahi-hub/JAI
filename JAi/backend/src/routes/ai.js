import express from 'express';
import { summarizeEntry, getEntrySummary } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all AI routes
router.use(authenticateToken);

/**
 * @route POST /api/ai/summarize
 * @desc Generate a summary for a journal entry
 * @access Private
 */
router.post('/summarize', summarizeEntry);

/**
 * @route GET /api/ai/summary/:id
 * @desc Get the summary for a journal entry
 * @access Private
 */
router.get('/summary/:id', getEntrySummary);

export default router;