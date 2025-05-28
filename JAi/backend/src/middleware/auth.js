import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../../../.env') });

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('Missing JWT secret. Please check your .env file.');
  process.exit(1);
}

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ error: true, message: 'Authentication required' });
  }
  
  try {
    // Verify the token
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user; // Add user data to request object
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: true, message: 'Invalid or expired token' });
  }
};

export default {
  authenticateToken,
};