import pool from '../config/db.js';

class TeamMember {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS team_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        bio TEXT,
        photo_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  }

  static async create({ name, role, bio, photo_url }) {
    const query = 'INSERT INTO team_members (name, role, bio, photo_url) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(query, [name, role, bio, photo_url]);
    return { id: result.insertId, name, role, bio, photo_url };
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM team_members ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM team_members WHERE id = ? LIMIT 1', [id]);
    return rows[0];
  }

  static async update(id, { name, role, bio, photo_url }) {
    await pool.query(
      'UPDATE team_members SET name = ?, role = ?, bio = ?, photo_url = ? WHERE id = ?',
      [name, role, bio, photo_url, id]
    );
    return this.findById(id);
  }

  static async deleteById(id) {
    await pool.query('DELETE FROM team_members WHERE id = ?', [id]);
  }
}

export default TeamMember;
