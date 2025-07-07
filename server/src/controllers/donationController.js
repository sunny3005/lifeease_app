import { sql } from '../../config/db.js';

export async function setupDonationTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category VARCHAR(20) NOT NULL CHECK (category IN ('clothes', 'shoes')),
      description TEXT,
      condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair')),
      image TEXT,
      is_deleted BOOLEAN DEFAULT FALSE,
      donated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function createDonation(req, res) {
  const { name, category, description, condition, image } = req.body;
  
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  if (!['clothes', 'shoes'].includes(category)) {
    return res.status(400).json({ error: 'Category must be either "clothes" or "shoes"' });
  }

  try {
    const result = await sql`
      INSERT INTO donations (name, category, description, condition, image)
      VALUES (${name}, ${category}, ${description || ''}, ${condition || 'good'}, ${image || ''})
      RETURNING *
    `;

    const donation = result[0];
    console.log('[DONATION] Created donation:', donation.name);

    res.status(201).json({
      id: donation.id,
      name: donation.name,
      category: donation.category,
      description: donation.description,
      condition: donation.condition,
      image: donation.image,
      isDeleted: donation.is_deleted,
      donatedAt: donation.donated_at,
    });
  } catch (err) {
    console.error('[DONATION] Create error:', err.message);
    res.status(500).json({ error: 'Failed to create donation' });
  }
}

export async function getDonations(req, res) {
  try {
    const donations = await sql`
      SELECT * FROM donations 
      ORDER BY donated_at DESC
    `;

    const formattedDonations = donations.map(donation => ({
      id: donation.id,
      name: donation.name,
      category: donation.category,
      description: donation.description,
      condition: donation.condition,
      image: donation.image,
      isDeleted: donation.is_deleted,
      donatedAt: donation.donated_at,
    }));

    res.json(formattedDonations);
  } catch (err) {
    console.error('[DONATION] Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
}

export async function softDeleteDonation(req, res) {
  const { id } = req.params;

  try {
    const result = await sql`
      UPDATE donations
      SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND is_deleted = FALSE
      RETURNING name
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Donation not found or already deleted' });
    }

    console.log('[DONATION] Soft deleted:', result[0].name);
    res.json({ success: true, message: 'Donation removed successfully' });
  } catch (err) {
    console.error('[DONATION] Soft delete error:', err.message);
    res.status(500).json({ error: 'Failed to remove donation' });
  }
}

export async function restoreDonation(req, res) {
  const { id } = req.params;

  try {
    const result = await sql`
      UPDATE donations
      SET is_deleted = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND is_deleted = TRUE
      RETURNING name
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Donation not found or not deleted' });
    }

    console.log('[DONATION] Restored:', result[0].name);
    res.json({ success: true, message: 'Donation restored successfully' });
  } catch (err) {
    console.error('[DONATION] Restore error:', err.message);
    res.status(500).json({ error: 'Failed to restore donation' });
  }
}

export async function permanentDeleteDonation(req, res) {
  const { id } = req.params;

  try {
    const result = await sql`
      DELETE FROM donations WHERE id = ${id}
      RETURNING name
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    console.log('[DONATION] Permanently deleted:', result[0].name);
    res.json({ success: true, message: 'Donation permanently deleted' });
  } catch (err) {
    console.error('[DONATION] Permanent delete error:', err.message);
    res.status(500).json({ error: 'Failed to permanently delete donation' });
  }
}

export async function updateDonation(req, res) {
  const { id } = req.params;
  const { name, category, description, condition, image } = req.body;

  try {
    const result = await sql`
      UPDATE donations
      SET 
        name = COALESCE(${name}, name),
        category = COALESCE(${category}, category),
        description = COALESCE(${description}, description),
        condition = COALESCE(${condition}, condition),
        image = COALESCE(${image}, image),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const donation = result[0];
    console.log('[DONATION] Updated:', donation.name);

    res.json({
      id: donation.id,
      name: donation.name,
      category: donation.category,
      description: donation.description,
      condition: donation.condition,
      image: donation.image,
      isDeleted: donation.is_deleted,
      donatedAt: donation.donated_at,
    });
  } catch (err) {
    console.error('[DONATION] Update error:', err.message);
    res.status(500).json({ error: 'Failed to update donation' });
  }
}

export async function getDonationStats(req, res) {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_deleted = false) as active,
        COUNT(*) FILTER (WHERE is_deleted = true) as deleted,
        COUNT(*) FILTER (WHERE category = 'clothes' AND is_deleted = false) as clothes,
        COUNT(*) FILTER (WHERE category = 'shoes' AND is_deleted = false) as shoes,
        COUNT(*) FILTER (WHERE condition = 'excellent' AND is_deleted = false) as excellent_condition,
        COUNT(*) FILTER (WHERE condition = 'good' AND is_deleted = false) as good_condition,
        COUNT(*) FILTER (WHERE condition = 'fair' AND is_deleted = false) as fair_condition
      FROM donations
    `;

    const result = stats[0];

    res.json({
      total: parseInt(result.total),
      active: parseInt(result.active),
      deleted: parseInt(result.deleted),
      byCategory: {
        clothes: parseInt(result.clothes),
        shoes: parseInt(result.shoes),
      },
      byCondition: {
        excellent: parseInt(result.excellent_condition),
        good: parseInt(result.good_condition),
        fair: parseInt(result.fair_condition),
      }
    });
  } catch (err) {
    console.error('[DONATION] Stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch donation statistics' });
  }
}