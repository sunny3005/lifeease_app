import { sql } from '../../config/db.js';
import bcrypt from 'bcryptjs';

export async function setupUserActivityTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_activity (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      activity_type VARCHAR(50) NOT NULL,
      activity_data JSONB,
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export const getUserDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user stats
    const [outfitStats, taskStats, donationStats] = await Promise.all([
      sql`
        SELECT 
          COUNT(*) as total_outfits,
          COUNT(DISTINCT category) as categories
        FROM outfits
      `,
      sql`
        SELECT 
          COUNT(*) as total_tasks,
          COUNT(*) FILTER (WHERE completed = true) as completed_tasks,
          COUNT(*) FILTER (WHERE date = CURRENT_DATE) as today_tasks
        FROM tasks
      `,
      sql`
        SELECT 
          COUNT(*) as total_donations,
          COUNT(*) FILTER (WHERE is_deleted = false) as active_donations
        FROM donations
      `
    ]);

    // Get recent activity
    const recentOutfits = await sql`
      SELECT id, image, category
      FROM outfits
      ORDER BY id DESC
      LIMIT 5
    `;

    const upcomingTasks = await sql`
      SELECT id, title, time, date, priority
      FROM tasks
      WHERE completed = false AND date >= CURRENT_DATE
      ORDER BY date ASC, time ASC
      LIMIT 5
    `;

    res.json({
      success: true,
      user: req.user,
      stats: {
        outfits: {
          total: parseInt(outfitStats[0]?.total_outfits || 0),
          categories: parseInt(outfitStats[0]?.categories || 0)
        },
        tasks: {
          total: parseInt(taskStats[0]?.total_tasks || 0),
          completed: parseInt(taskStats[0]?.completed_tasks || 0),
          today: parseInt(taskStats[0]?.today_tasks || 0)
        },
        donations: {
          total: parseInt(donationStats[0]?.total_donations || 0),
          active: parseInt(donationStats[0]?.active_donations || 0)
        }
      },
      recentActivity: {
        outfits: recentOutfits,
        upcomingTasks: upcomingTasks
      }
    });
  } catch (err) {
    console.error('[USER_DASHBOARD] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  try {
    // Get current password hash
    const user = await sql`
      SELECT password FROM users WHERE id = ${userId}
    `;

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await sql`
      UPDATE users 
      SET password = ${hashedNewPassword}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;

    console.log('[CHANGE_PASSWORD] Password updated for user:', userId);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('[CHANGE_PASSWORD] Error:', err.message);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const deleteAccount = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  if (!password) {
    return res.status(400).json({ error: 'Password confirmation required' });
  }

  try {
    // Verify password before deletion
    const user = await sql`
      SELECT password FROM users WHERE id = ${userId}
    `;

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Delete user (cascade will handle related data)
    await sql`DELETE FROM users WHERE id = ${userId}`;

    console.log('[DELETE_ACCOUNT] Account deleted for user:', userId);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error('[DELETE_ACCOUNT] Error:', err.message);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

export const logActivity = async (userId, activityType, activityData, req) => {
  try {
    await sql`
      INSERT INTO user_activity (user_id, activity_type, activity_data, ip_address, user_agent)
      VALUES (${userId}, ${activityType}, ${JSON.stringify(activityData)}, ${req.ip}, ${req.get('User-Agent')})
    `;
  } catch (err) {
    console.error('[LOG_ACTIVITY] Error:', err.message);
  }
};

export const getUserActivity = async (req, res) => {
  const userId = req.user.id;
  const { limit = 20, offset = 0 } = req.query;

  try {
    const activities = await sql`
      SELECT activity_type, activity_data, created_at
      FROM user_activity
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${parseInt(limit)}
      OFFSET ${parseInt(offset)}
    `;

    res.json({
      success: true,
      activities: activities.map(activity => ({
        type: activity.activity_type,
        data: activity.activity_data,
        timestamp: activity.created_at
      }))
    });
  } catch (err) {
    console.error('[GET_USER_ACTIVITY] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
};