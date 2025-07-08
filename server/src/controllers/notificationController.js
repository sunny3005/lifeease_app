import { sql } from '../../config/db.js';

export async function setupNotificationTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      type VARCHAR(50) DEFAULT 'general',
      data JSONB,
      read BOOLEAN DEFAULT FALSE,
      sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      read_at TIMESTAMPTZ
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS push_tokens (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      platform VARCHAR(20) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export const registerPushToken = async (req, res) => {
  const { token, platform } = req.body;
  const userId = req.user?.id;

  if (!token || !platform) {
    return res.status(400).json({ error: 'Token and platform are required' });
  }

  try {
    // Upsert push token
    await sql`
      INSERT INTO push_tokens (user_id, token, platform)
      VALUES (${userId}, ${token}, ${platform})
      ON CONFLICT (token) 
      DO UPDATE SET 
        user_id = ${userId},
        platform = ${platform},
        updated_at = CURRENT_TIMESTAMP
    `;

    console.log('[PUSH_TOKEN] Registered token for user:', userId);
    res.json({ success: true, message: 'Push token registered successfully' });
  } catch (err) {
    console.error('[PUSH_TOKEN] Registration error:', err.message);
    res.status(500).json({ error: 'Failed to register push token' });
  }
};

export const createNotification = async (req, res) => {
  const { title, body, type, data, userIds } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  try {
    let notifications;

    if (userIds && userIds.length > 0) {
      // Send to specific users
      const values = userIds.map(userId => `(${userId}, '${title}', '${body}', '${type || 'general'}', '${JSON.stringify(data || {})}')`).join(',');
      notifications = await sql`
        INSERT INTO notifications (user_id, title, body, type, data)
        VALUES ${sql.unsafe(values)}
        RETURNING *
      `;
    } else {
      // Broadcast to all users
      notifications = await sql`
        INSERT INTO notifications (user_id, title, body, type, data)
        SELECT id, ${title}, ${body}, ${type || 'general'}, ${JSON.stringify(data || {})}
        FROM users
        RETURNING *
      `;
    }

    console.log('[NOTIFICATION] Created notifications:', notifications.length);
    res.json({ 
      success: true, 
      message: `${notifications.length} notifications created`,
      notifications: notifications.length 
    });
  } catch (err) {
    console.error('[NOTIFICATION] Creation error:', err.message);
    res.status(500).json({ error: 'Failed to create notifications' });
  }
};

export const getUserNotifications = async (req, res) => {
  const userId = req.user.id;
  const { limit = 20, offset = 0, unreadOnly = false } = req.query;

  try {
    let whereClause = sql`WHERE user_id = ${userId}`;
    
    if (unreadOnly === 'true') {
      whereClause = sql`WHERE user_id = ${userId} AND read = FALSE`;
    }

    const notifications = await sql`
      SELECT id, title, body, type, data, read, sent_at, read_at
      FROM notifications
      ${whereClause}
      ORDER BY sent_at DESC
      LIMIT ${parseInt(limit)}
      OFFSET ${parseInt(offset)}
    `;

    const unreadCount = await sql`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ${userId} AND read = FALSE
    `;

    res.json({
      success: true,
      notifications: notifications.map(notif => ({
        id: notif.id,
        title: notif.title,
        body: notif.body,
        type: notif.type,
        data: notif.data,
        read: notif.read,
        sentAt: notif.sent_at,
        readAt: notif.read_at
      })),
      unreadCount: parseInt(unreadCount[0].count)
    });
  } catch (err) {
    console.error('[GET_NOTIFICATIONS] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await sql`
      UPDATE notifications
      SET read = TRUE, read_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    console.error('[MARK_READ] Error:', err.message);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await sql`
      UPDATE notifications
      SET read = TRUE, read_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId} AND read = FALSE
      RETURNING id
    `;

    res.json({ 
      success: true, 
      message: `${result.length} notifications marked as read`,
      count: result.length 
    });
  } catch (err) {
    console.error('[MARK_ALL_READ] Error:', err.message);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await sql`
      DELETE FROM notifications
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    console.error('[DELETE_NOTIFICATION] Error:', err.message);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};