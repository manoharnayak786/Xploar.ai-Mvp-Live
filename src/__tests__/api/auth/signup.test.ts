import { POST } from '@/app/api/auth/signup/route';
import { NextRequest } from 'next/server';

// Mock NextRequest and NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, options = {}) => ({
    url,
    method: options.method || 'GET',
    headers: {
      get: jest.fn(),
      has: jest.fn(),
    },
    json: jest.fn().mockImplementation(() => {
      if (options.body) {
        try {
          return Promise.resolve(JSON.parse(options.body));
        } catch {
          return Promise.resolve({});
        }
      }
      return Promise.resolve({});
    }),
    text: jest.fn().mockResolvedValue(options.body || ''),
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    clone: jest.fn(),
    ...options,
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((data, options = {}) => ({
      status: options.status || 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

describe('/api/auth/signup', () => {
      let mockSupabaseAuth: jest.Mocked<unknown>;

  beforeEach(() => {
    jest.clearAllMocks();
    const supabaseModule = jest.requireMock('@/lib/supabase');
    mockSupabaseAuth = supabaseModule.supabase.auth;
  });

  it('should successfully signup with valid data', async () => {
    const mockUser = {
      id: 'user_123',
      email: 'newuser@example.com',
    };

    const mockSession = {
      access_token: 'mock_token',
      refresh_token: 'mock_refresh_token',
    };

    mockSupabaseAuth.signUp.mockResolvedValue({
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    });

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      user: mockUser,
      session: mockSession,
    });
    expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'password123',
      options: {
        data: { full_name: 'New User' },
        emailRedirectTo: undefined, // Since NEXT_PUBLIC_SITE_URL is not set in test
      },
    });
  });

  it('should successfully signup without name', async () => {
    const mockUser = {
      id: 'user_123',
      email: 'newuser@example.com',
    };

    mockSupabaseAuth.signUp.mockResolvedValue({
      data: {
        user: mockUser,
        session: null,
      },
      error: null,
    });

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      user: mockUser,
      session: null,
    });
    expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'password123',
      options: {
        data: { full_name: undefined },
        emailRedirectTo: undefined,
      },
    });
  });

  it('should return error for missing email', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        password: 'password123',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      error: 'Email and password are required',
    });
    expect(mockSupabaseAuth.signUp).not.toHaveBeenCalled();
  });

  it('should return error for missing password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      error: 'Email and password are required',
    });
    expect(mockSupabaseAuth.signUp).not.toHaveBeenCalled();
  });

  it('should return error for existing user', async () => {
    const mockError = {
      message: 'User already registered',
    };

    mockSupabaseAuth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    });

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      error: 'User already registered',
    });
  });

  it('should handle network errors gracefully', async () => {
    mockSupabaseAuth.signUp.mockRejectedValue(
      new Error('Network error')
    );

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({
      error: 'Internal server error',
    });
  });

  it('should handle malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      error: 'Email and password are required',
    });
    expect(mockSupabaseAuth.signUp).not.toHaveBeenCalled();
  });

  it('should include email redirect URL when NEXT_PUBLIC_SITE_URL is set', async () => {
    // Mock environment variable
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';

    const mockUser = {
      id: 'user_123',
      email: 'newuser@example.com',
    };

    mockSupabaseAuth.signUp.mockResolvedValue({
      data: {
        user: mockUser,
        session: null,
      },
      error: null,
    });

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      }),
    });

    await POST(request);

    expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'password123',
      options: {
        data: { full_name: 'New User' },
        emailRedirectTo: 'https://example.com/auth/callback',
      },
    });

    // Clean up
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });
});
