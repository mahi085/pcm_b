import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Check connection using try-catch
export const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to the database');
    connection.release();
  } catch (error) {
    console.error('❌ Error connecting to the database:', error.message);
    throw error;
  }
};

// Run connection check
await checkConnection();

export default pool;