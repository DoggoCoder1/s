import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(200).end();
    return;
  }

  const { content } = req.body;

  if (typeof content !== 'string') {
    res.status(200).end();
    return;
  }

  try {
    await pool.query(
      `INSERT INTO messages (content) VALUES ($1)`,
      [content]
    );

    res.status(200).json({ message: 'Message saved' });
  } catch {
    res.status(200).end();
  }
}
