import pool from '../config/db.js';

const tableName = 'hero';

const Hero = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        button1_text VARCHAR(120),
        button2_text VARCHAR(120),
        image_url TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);

    // ensure default row exists
    await pool.query(`INSERT IGNORE INTO ${tableName} (id, title, description, button1_text, button2_text) VALUES (1, 'PCM Life Sciences – Trusted Pharma Partner', 'WHO-GMP certified PCD Pharma Franchise & Third Party Manufacturing company delivering high-quality medicines across India with trust and excellence.', 'Get Started', 'Explore Products')`);
  },

  get: async () => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = 1`);
    return rows[0];
  },

  upsert: async ({ title, description, button1_text, button2_text, image_url }) => {
    await pool.query(`
      INSERT INTO ${tableName} (id, title, description, button1_text, button2_text, image_url)
      VALUES (1, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      description = VALUES(description),
      button1_text = VALUES(button1_text),
      button2_text = VALUES(button2_text),
      image_url = VALUES(image_url)
    `, [title, description, button1_text, button2_text, image_url]);

    const hero = await Hero.get();
    return hero;
  }
};

export default Hero;
