import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  // Log the raw body for debugging:
  console.log('Request body:', req.body);

  // Check for content:
  const { content } = req.body || {};

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Missing content' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (content) VALUES ($1) RETURNING *',
      [content.trim()]
    );
    return res.status(200).json({ message: 'Saved', data: result.rows[0] });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
}
