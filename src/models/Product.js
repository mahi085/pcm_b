import pool from '../config/db.js';

class Product {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  }

  static async create({ name, description, image_url }) {
    const query = 'INSERT INTO products (name, description, image_url) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [name, description, image_url]);
    return { id: result.insertId, name, description, image_url };
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
    return rows[0];
  }

  static async update(id, { name, description, image_url }) {
    await pool.query(
      'UPDATE products SET name = ?, description = ?, image_url = ? WHERE id = ?',
      [name, description, image_url, id]
    );
    return this.findById(id);
  }

  static async deleteById(id) {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  }
}

export default Product;
