import { sql } from '../../config/db.js';

export async function setupDonatedTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS donated_clothes (
      id SERIAL PRIMARY KEY,
      image TEXT NOT NULL,
      category VARCHAR(50) NOT NULL
    );
  `;
}

export async function getDonatedClothes(req, res) {
  try {
    const donated = await sql`SELECT * FROM donated_clothes ORDER BY id DESC`;
    res.json(donated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function donateClothes(req, res) {
  const { image, category } = req.body;

  if (!image || !category) {
    return res.status(400).json({ error: 'Image and category are required' });
  }

  try {
    await sql`INSERT INTO donated_clothes (image, category) VALUES (${image}, ${category})`;
    res.status(200).json({ message: 'Donation successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function restoreDonatedClothes(req, res) {
  const { id, image, category } = req.body;
  if (!id || !image || !category) return res.status(400).json({ error: 'Missing fields' });

  try {
    await sql`INSERT INTO outfits (image, category) VALUES (${image}, ${category})`;
    await sql`DELETE FROM donated_clothes WHERE id = ${id}`;
    res.json({ message: 'Restored to wardrobe' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
