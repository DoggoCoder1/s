import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Missing content' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (content) VALUES ($1) RETURNING *',
      [content]
    );
    return res.status(200).json({ message: 'Saved', data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
}
