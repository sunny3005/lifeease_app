export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: 'Name, email, and password are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Mock user creation (replace with real database logic)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      membershipType: 'Free'
    };

    // Generate mock JWT token (replace with real JWT)
    const token = 'mock-jwt-token-' + Date.now();

    return new Response(
      JSON.stringify({
        success: true,
        token,
        user: newUser
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}