import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import pool, { checkConnection } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import Admin from './src/models/Admin.js';
import Product from './src/models/Product.js';
import Gallery from './src/models/Gallery.js';
import TeamMember from './src/models/TeamMember.js';
import Blog from './src/models/Blog.js';
import Hero from './src/models/Hero.js';
import Testimonial from './src/models/Testimonial.js';
import testimonialRoutes from './src/routes/testimonialRoutes.js';
import { cloudinaryConnect } from './src/config/cloudnary.js';

dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Initialize database
const initializeDatabase = async () => {
  try {
    await checkConnection();
    await Admin.createTable();
    await Product.createTable();
    await Gallery.createTable();
    await TeamMember.createTable();
    await Blog.createTable();
    await Hero.createTable();
    await Testimonial.createTable();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
};

// Initialize on startup
await initializeDatabase();

cloudinaryConnect();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', testimonialRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('🚀 PCM Admin Server is running!');
});

// Example API route (for testing)
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admins');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});