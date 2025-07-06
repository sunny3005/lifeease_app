// Mock database for tasks
let tasks: any[] = [
  { id: 1, title: 'Morning workout', time: '07:00', completed: true, reminder: true },
  { id: 2, title: 'Team meeting', time: '10:00', completed: false, reminder: true },
  { id: 3, title: 'Lunch with Sarah', time: '13:00', completed: false, reminder: true },
  { id: 4, title: 'Grocery shopping', time: '17:00', completed: false, reminder: true },
];

export async function GET(request: Request) {
  try {
    return new Response(
      JSON.stringify({ success: true, tasks }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch tasks' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const task = await request.json();
    const newTask = {
      ...task,
      id: Date.now(),
    };
    
    tasks.unshift(newTask);
    
    return new Response(
      JSON.stringify({ success: true, task: newTask }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create task' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const updates = await request.json();
    
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id || '0'));
    if (taskIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, error: 'Task not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    
    return new Response(
      JSON.stringify({ success: true, task: tasks[taskIndex] }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update task' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id || '0'));
    if (taskIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, error: 'Task not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    tasks.splice(taskIndex, 1);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Task deleted' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete task' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}