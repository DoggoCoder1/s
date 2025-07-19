import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // method not allowed
    return;
  }

  // 1. Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // 2. Verify token
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  // 3. Validate content
  const { content } = req.body;
  if (typeof content !== 'string') {
    res.status(400).json({ error: 'Invalid content' });
    return;
  }

  // 4. Insert message
  try {
    await pool.query(`INSERT INTO messages (content) VALUES ($1)`, [content]);
    res.status(200).json({ message: 'Message saved' });
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
}
