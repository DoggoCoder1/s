import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Missing content' });
    return;
  }

  const result = await pool.query(
    'INSERT INTO messages (content) VALUES ($1) RETURNING *',
    [content]
  );
  res.status(200).json({ message: 'Saved', data: result.rows[0] });
}
