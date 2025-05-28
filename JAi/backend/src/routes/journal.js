import express from 'express';
import { createEntry, getEntries, getEntryById, updateEntry, deleteEntry } from '../controllers/journalController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all journal routes
router.use(authenticateToken);

/**
 * @route POST /api/journal
 * @desc Create a new journal entry
 * @access Private
 */
router.post('/', createEntry);

/**
 * @route GET /api/journal
 * @desc Get all journal entries for the authenticated user
 * @access Private
 */
router.get('/', getEntries);

/**
 * @route GET /api/journal/:id
 * @desc Get a single journal entry by ID
 * @access Private
 */
router.get('/:id', getEntryById);

/**
 * @route PUT /api/journal/:id
 * @desc Update a journal entry
 * @access Private
 */
router.put('/:id', updateEntry);

/**
 * @route DELETE /api/journal/:id
 * @desc Delete a journal entry
 * @access Private
 */
router.delete('/:id', deleteEntry);

export default router;