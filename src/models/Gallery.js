import pool from '../config/db.js';

class Gallery {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS gallery (
        id INT PRIMARY KEY AUTO_INCREMENT,
        image_url VARCHAR(500) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  }

  static async create({ image_url, description }) {
    const query = 'INSERT INTO gallery (image_url, description) VALUES (?, ?)';
    const [result] = await pool.query(query, [image_url, description]);
    return { id: result.insertId, image_url, description };
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ? LIMIT 1', [id]);
    return rows[0];
  }

  static async update(id, { image_url, description }) {
    await pool.query(
      'UPDATE gallery SET image_url = ?, description = ? WHERE id = ?',
      [image_url, description, id]
    );
    return this.findById(id);
  }

  static async deleteById(id) {
    await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
  }
}

export default Gallery;
