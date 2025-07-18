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

  const { x, y, color } = req.body;

  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof color !== 'string'
  ) {
    res.status(200).end();
    return;
  }

  try {
    await pool.query(
      `INSERT INTO pixels (x, y, color)
       VALUES ($1, $2, $3)
       ON CONFLICT (x, y) DO UPDATE SET color = EXCLUDED.color`,
      [x, y, color]
    );

    res.status(200).json({ message: 'Pixel saved' });
  } catch {
    res.status(200).end();
  }
}
