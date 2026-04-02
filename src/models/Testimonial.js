import pool from '../config/db.js';

const tableName = 'testimonials';

const Testimonial = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        rating TINYINT NOT NULL DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  },

  getAll: async () => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at DESC`);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    return rows[0];
  },

  create: async ({ name, text, rating }) => {
    const trimmedName = name?.trim() || 'Anonymous';
    const trimmedText = text?.trim() || '';
    const safeRating = Number.isNaN(Number(rating)) ? 5 : Math.min(5, Math.max(1, Number(rating)));

    const [result] = await pool.query(
      `INSERT INTO ${tableName} (name, text, rating) VALUES (?, ?, ?)`,
      [trimmedName, trimmedText, safeRating]
    );

    const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [result.insertId]);
    return rows[0];
  },

  deleteById: async (id) => {
    await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
  }
};

export default Testimonial;
