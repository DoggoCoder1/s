import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required by Neon
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Missing content" });
    }

    try {
      const result = await pool.query(
        'INSERT INTO messages (content) VALUES ($1) RETURNING *',
        [content]
      );
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
