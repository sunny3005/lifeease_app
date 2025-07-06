export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(
        JSON.stringify({ message: 'No token provided' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Mock token verification (replace with real JWT verification)
    if (token.startsWith('mock-jwt-token-')) {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        membershipType: 'Premium'
      };

      return new Response(
        JSON.stringify({
          success: true,
          user: mockUser
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Invalid token' }),
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