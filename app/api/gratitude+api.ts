// Mock database for gratitude notes
let gratitudeNotes: any[] = [
  {
    id: 1,
    content: 'Grateful for my family\'s health and happiness. Today was filled with laughter and joy.',
    mood: 'grateful',
    date: '2024-01-15',
    time: '20:30',
  },
  {
    id: 2,
    content: 'Beautiful sunrise this morning reminded me of life\'s simple pleasures.',
    mood: 'peaceful',
    date: '2024-01-14',
    time: '08:15',
  },
];

export async function GET(request: Request) {
  try {
    return new Response(
      JSON.stringify({ success: true, notes: gratitudeNotes }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch gratitude notes' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const note = await request.json();
    const newNote = {
      ...note,
      id: Date.now(),
    };
    
    gratitudeNotes.unshift(newNote);
    
    return new Response(
      JSON.stringify({ success: true, note: newNote }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create gratitude note' }),
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
    
    const noteIndex = gratitudeNotes.findIndex(note => note.id === parseInt(id || '0'));
    if (noteIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, error: 'Note not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    gratitudeNotes[noteIndex] = { ...gratitudeNotes[noteIndex], ...updates };
    
    return new Response(
      JSON.stringify({ success: true, note: gratitudeNotes[noteIndex] }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update note' }),
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
    
    const noteIndex = gratitudeNotes.findIndex(note => note.id === parseInt(id || '0'));
    if (noteIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, error: 'Note not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    gratitudeNotes.splice(noteIndex, 1);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Note deleted' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete note' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}