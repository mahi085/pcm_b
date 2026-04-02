import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class Admin {
  // Create admin table if not exists
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    try {
      await pool.query(query);
      console.log('✅ Admins table created or already exists');
    } catch (error) {
      console.error('❌ Error creating admins table:', error.message);
    }
  }

  // Create new admin (signup)
  static async create(name, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)';
      const [result] = await pool.query(query, [name, email, hashedPassword]);
      return { id: result.insertId, name, email };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Find admin by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM admins WHERE email = ?';
      const [rows] = await pool.query(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find admin by ID
  static async findById(id) {
    try {
      const query = 'SELECT id, name, email FROM admins WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(inputPassword, hashedPassword) {
    try {
      return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  // Get all admins
  static async getAll() {
    try {
      const query = 'SELECT id, name, email, created_at FROM admins';
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default Admin;
