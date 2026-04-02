import pool from '../config/db.js';

const tableName = 'blogs';

const Blog = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        content MEDIUMTEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  },

  create: async ({ title, summary, content, image_url }) => {
    const [result] = await pool.query(
      `INSERT INTO ${tableName} (title, summary, content, image_url) VALUES (?, ?, ?, ?)`,
      [title, summary, content, image_url]
    );
    return { id: result.insertId, title, summary, content, image_url };
  },

  findAll: async () => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at DESC`);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    return rows[0];
  },

  update: async (id, { title, summary, content, image_url }) => {
    await pool.query(
      `UPDATE ${tableName} SET title = ?, summary = ?, content = ?, image_url = ? WHERE id = ?`,
      [title, summary, content, image_url, id]
    );
    return Blog.findById(id);
  },

  deleteById: async (id) => {
    await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
  }
};

export default Blog;
