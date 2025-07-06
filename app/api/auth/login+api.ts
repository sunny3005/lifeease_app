export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Mock user authentication (replace with real database logic)
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      membershipType: 'Premium'
    };

    // Mock password check (replace with bcrypt comparison)
    if (email === 'john@example.com' && password === 'password123') {
      // Generate mock JWT token (replace with real JWT)
      const token = 'mock-jwt-token-' + Date.now();

      return new Response(
        JSON.stringify({
          success: true,
          token,
          user: mockUser
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Invalid credentials' }),
      { 
        status: 401,
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