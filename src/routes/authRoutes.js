import express from 'express';
import { login, signup, verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', login);

// Signup route
router.post('/signup', signup);

// Verify token route
router.get('/verify', verifyToken);

export default router;
