// Mock database for pomodoro sessions
let pomodoroSessions: any[] = [];

export async function GET(request: Request) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = pomodoroSessions.filter(session => 
      session.completedAt.startsWith(today)
    );
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        sessions: pomodoroSessions,
        todaySessions: todaySessions.length,
        totalFocusTime: todaySessions
          .filter(s => s.type === 'focus')
          .reduce((total, s) => total + s.duration, 0)
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch pomodoro sessions' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await request.json();
    const newSession = {
      ...session,
      id: Date.now(),
    };
    
    pomodoroSessions.unshift(newSession);
    
    return new Response(
      JSON.stringify({ success: true, session: newSession }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create pomodoro session' }),
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
    
    const sessionIndex = pomodoroSessions.findIndex(session => session.id === parseInt(id || '0'));
    if (sessionIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, error: 'Session not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    pomodoroSessions.splice(sessionIndex, 1);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Session deleted' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete session' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}