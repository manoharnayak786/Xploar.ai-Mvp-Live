import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';

// Mock NextRequest and NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url: string, options: { method?: string; body?: string } = {}) => ({
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
    json: jest.fn().mockImplementation((data: unknown, options: { status?: number } = {}) => ({
      status: options.status || 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

describe('/api/auth/login', () => {
      let mockSupabaseAuth: jest.Mocked<unknown>;

  beforeEach(() => {
    jest.clearAllMocks();
    const supabaseModule = jest.requireMock('@/lib/supabase');
    mockSupabaseAuth = supabaseModule.supabase.auth;
  });

  it('should successfully login with valid credentials', async () => {
    const mockUser = {
      id: 'user_123',
      email: 'test@example.com',
    };

    const mockSession = {
      access_token: 'mock_token',
      refresh_token: 'mock_refresh_token',
    };

    mockSupabaseAuth.signInWithPassword.mockResolvedValue({
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    });

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      user: mockUser,
      session: mockSession,
    });
    expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should return error for invalid credentials', async () => {
    const mockError = {
      message: 'Invalid login credentials',
    };

    mockSupabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    });

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      error: 'Invalid login credentials',
    });
  });

  it('should return error for missing email', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      error: 'Invalid login credentials',
    });
    // The API still calls Supabase but with undefined values
    expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalled();
  });

  it('should return error for missing password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      error: 'Invalid login credentials',
    });
    // The API still calls Supabase but with undefined values
    expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalled();
  });

  it('should handle network errors gracefully', async () => {
    mockSupabaseAuth.signInWithPassword.mockRejectedValue(
      new Error('Network error')
    );

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
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
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({
      error: 'Internal server error',
    });
    // The API should handle malformed JSON gracefully with empty/undefined values
    expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
      email: undefined,
      password: undefined,
    });
  });
});
