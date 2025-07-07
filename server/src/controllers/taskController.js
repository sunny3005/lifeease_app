import { sql } from '../../config/db.js';

export async function setupTaskTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      time TIME NOT NULL,
      date DATE NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      priority VARCHAR(10) DEFAULT 'medium',
      category VARCHAR(50) DEFAULT 'Personal',
      reminder_set BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function createTask(req, res) {
  const { title, description, time, date, priority, category, reminderSet } = req.body;
  
  if (!title || !time || !date) {
    return res.status(400).json({ error: 'Title, time, and date are required' });
  }

  try {
    const result = await sql`
      INSERT INTO tasks (title, description, time, date, priority, category, reminder_set)
      VALUES (${title}, ${description}, ${time}, ${date}, ${priority || 'medium'}, ${category || 'Personal'}, ${reminderSet || true})
      RETURNING *
    `;

    const task = result[0];
    console.log('[TASK] Created task:', task.title);

    res.status(201).json({
      id: task.id,
      title: task.title,
      description: task.description,
      time: task.time,
      date: task.date,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      reminderSet: task.reminder_set,
    });
  } catch (err) {
    console.error('[TASK] Create error:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

export async function getTasks(req, res) {
  const { date } = req.query;
  
  try {
    let tasks;
    if (date) {
      tasks = await sql`
        SELECT * FROM tasks 
        WHERE date = ${date}
        ORDER BY time ASC, created_at DESC
      `;
    } else {
      tasks = await sql`
        SELECT * FROM tasks 
        ORDER BY date DESC, time ASC
      `;
    }

    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      time: task.time,
      date: task.date,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      reminderSet: task.reminder_set,
    }));

    res.json(formattedTasks);
  } catch (err) {
    console.error('[TASK] Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const { title, description, time, date, completed, priority, category, reminderSet } = req.body;

  try {
    const result = await sql`
      UPDATE tasks
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        time = COALESCE(${time}, time),
        date = COALESCE(${date}, date),
        completed = COALESCE(${completed}, completed),
        priority = COALESCE(${priority}, priority),
        category = COALESCE(${category}, category),
        reminder_set = COALESCE(${reminderSet}, reminder_set),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = result[0];
    console.log('[TASK] Updated task:', task.title);

    res.json({
      id: task.id,
      title: task.title,
      description: task.description,
      time: task.time,
      date: task.date,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      reminderSet: task.reminder_set,
    });
  } catch (err) {
    console.error('[TASK] Update error:', err.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

export async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const result = await sql`
      DELETE FROM tasks WHERE id = ${id}
      RETURNING title
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log('[TASK] Deleted task:', result[0].title);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    console.error('[TASK] Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}

export async function getTaskStats(req, res) {
  const { date } = req.query;

  try {
    let whereClause = '';
    let params = [];
    
    if (date) {
      whereClause = 'WHERE date = $1';
      params = [date];
    }

    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE completed = true) as completed,
        COUNT(*) FILTER (WHERE completed = false) as pending,
        COUNT(*) FILTER (WHERE priority = 'high') as high_priority,
        COUNT(*) FILTER (WHERE priority = 'medium') as medium_priority,
        COUNT(*) FILTER (WHERE priority = 'low') as low_priority
      FROM tasks
      ${date ? sql`WHERE date = ${date}` : sql``}
    `;

    const result = stats[0];
    const completionRate = result.total > 0 ? Math.round((result.completed / result.total) * 100) : 0;

    res.json({
      total: parseInt(result.total),
      completed: parseInt(result.completed),
      pending: parseInt(result.pending),
      completionRate,
      priorityBreakdown: {
        high: parseInt(result.high_priority),
        medium: parseInt(result.medium_priority),
        low: parseInt(result.low_priority),
      }
    });
  } catch (err) {
    console.error('[TASK] Stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
}