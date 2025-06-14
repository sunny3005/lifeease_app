import { sql } from '../../config/db.js';

export async function setupOutfitTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS outfits (
      id SERIAL PRIMARY KEY,
      image TEXT NOT NULL,
      category VARCHAR(50) NOT NULL
    );
  `;
}

export async function createOutfit(req, res) {
  const { image, category } = req.body;
  if (!image || !category) return res.status(400).json({ error: 'Missing fields' });

  try {
    const result = await sql`
      INSERT INTO outfits (image, category) VALUES (${image}, ${category}) RETURNING id
    `;
    res.json({ id: result[0].id, image, category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOutfitsByCategory(req, res) {
  const { category } = req.params;
  try {
    const outfits = await sql`
      SELECT * FROM outfits WHERE category = ${category} ORDER BY id DESC
    `;
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteOutfit(req, res) {
  const { id } = req.params;
  try {
    await sql`DELETE FROM outfits WHERE id = ${id}`;
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
