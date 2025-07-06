// Mock database for donated items
let donatedItems: any[] = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    category: 'Clothes',
    description: 'Blue denim jacket',
    donatedAt: '2024-01-15',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    category: 'Shoes',
    description: 'White sneakers',
    donatedAt: '2024-01-14',
  },
];

export async function GET(request: Request) {
  try {
    return new Response(
      JSON.stringify({ success: true, items: donatedItems }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch donated items' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Handle restore endpoint
    if (pathname.includes('/restore')) {
      const id = pathname.split('/')[3]; // Extract ID from path
      const itemIndex = donatedItems.findIndex(item => item.id === parseInt(id));
      
      if (itemIndex === -1) {
        return new Response(
          JSON.stringify({ success: false, error: 'Item not found' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Remove from donated items (restore to collection)
      donatedItems.splice(itemIndex, 1);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Item restored to collection' }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Handle regular donation
    const item = await request.json();
    const newItem = {
      ...item,
      id: Date.now(),
      donatedAt: new Date().toISOString().split('T')[0],
    };
    
    donatedItems.unshift(newItem);
    
    return new Response(
      JSON.stringify({ success: true, item: newItem }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to process request' }),
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
    
    const itemIndex = donatedItems.findIndex(item => item.id === parseInt(id || '0'));
    if (itemIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, error: 'Item not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    donatedItems.splice(itemIndex, 1);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Item deleted' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete item' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}