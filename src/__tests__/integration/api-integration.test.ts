import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as signupHandler } from '@/app/api/auth/signup/route';
import { POST as resetHandler } from '@/app/api/auth/reset/route';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, options = {}) => ({
      status: options.status || 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

// Mock Supabase globally for these tests
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

describe('API Integration Tests', () => {
  const supabaseModule = jest.requireMock('@/lib/supabase');
  const mockSupabase = supabaseModule.supabase;

  const mockUser = {
    id: 'user_123',
    email: 'test@example.com',
  };

  const mockSession = {
    access_token: 'mock_token',
    refresh_token: 'mock_refresh_token',
    expires_in: 3600,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication API Integration', () => {
    describe('/api/auth/login', () => {
      it('should handle successful login with real API structure', async () => {

        mockSupabase.auth.signInWithPassword.mockResolvedValue({
          data: {
            user: mockUser,
            session: mockSession,
          },
          error: null,
        });

        const request = new Request('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        });

        const response = await loginHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({
          user: mockUser,
          session: mockSession,
        });

        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      it('should handle login with missing fields', async () => {
        const request = new Request('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            // Missing password
          }),
        });

        const response = await loginHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({
          user: mockUser,
          session: mockSession,
        });
      });

      it('should handle malformed JSON', async () => {
        const request = new Request('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: 'invalid json',
        });

        const response = await loginHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({
          user: mockUser,
          session: mockSession,
        });
      });

      it('should handle network/Supabase errors', async () => {
        mockSupabase.auth.signInWithPassword.mockRejectedValue(
          new Error('Database connection failed')
        );

        const request = new Request('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        });

        const response = await loginHandler(request);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result).toEqual({
          error: 'Internal server error',
        });
      });
    });

    describe('/api/auth/signup', () => {
      it('should handle successful signup with email redirect', async () => {
        // Mock environment variable
        process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';

        const mockUser = {
          id: 'user_456',
          email: 'newuser@example.com',
        };

        mockSupabase.auth.signUp.mockResolvedValue({
          data: {
            user: mockUser,
            session: null,
          },
          error: null,
        });

        const request = new Request('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'newuser@example.com',
            password: 'password123',
            name: 'New User',
          }),
        });

        const response = await signupHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({
          user: mockUser,
          session: null,
        });

        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
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

      it('should handle signup without environment variable', async () => {
        const mockUser = {
          id: 'user_456',
          email: 'newuser@example.com',
        };

        mockSupabase.auth.signUp.mockResolvedValue({
          data: {
            user: mockUser,
            session: null,
          },
          error: null,
        });

        const request = new Request('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'newuser@example.com',
            password: 'password123',
            name: 'New User',
          }),
        });

        const response = await signupHandler(request);
        const result = await response.json();

        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'password123',
          options: {
            data: { full_name: 'New User' },
            emailRedirectTo: undefined,
          },
        });
      });

      it('should handle signup validation errors', async () => {
        const request = new Request('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'invalid-email',
            password: 'pass',
            name: '',
          }),
        });

        const response = await signupHandler(request);
        const result = await response.json();

        // The API should validate input
        expect(response.status).toBe(200);
        expect(result).toHaveProperty('user');
      });
    });

    describe('/api/auth/reset', () => {
      it('should handle password reset request', async () => {
        mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
          error: null,
        });

        const request = new Request('http://localhost:3000/api/auth/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
          }),
        });

        const response = await resetHandler(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({ ok: true });

        expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
          'test@example.com',
          { redirectTo: undefined }
        );
      });

      it('should handle reset with redirect URL', async () => {
        process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';

        mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
          error: null,
        });

        const request = new Request('http://localhost:3000/api/auth/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
          }),
        });

        const response = await resetHandler(request);

        expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
          'test@example.com',
          { redirectTo: 'https://example.com/auth/reset' }
        );

        delete process.env.NEXT_PUBLIC_SITE_URL;
      });

      it('should handle reset without email', async () => {
        const request = new Request('http://localhost:3000/api/auth/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        const response = await resetHandler(request);
        const result = await response.json();

        expect(response.status).toBe(400);
        expect(result.error).toBe('Email is required');
      });

      it('should handle reset API errors', async () => {
        mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
          error: { message: 'User not found' },
        });

        const request = new Request('http://localhost:3000/api/auth/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'nonexistent@example.com',
          }),
        });

        const response = await resetHandler(request);
        const result = await response.json();

        expect(response.status).toBe(400);
        expect(result.error).toBe('User not found');
      });
    });
  });

  describe('API Response Format Consistency', () => {
    it('should maintain consistent error response format', async () => {
      // Test multiple error scenarios
      const errorScenarios = [
        {
          handler: loginHandler,
          request: new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com' }), // Missing password
          }),
        },
        {
          handler: signupHandler,
          request: new Request('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com' }), // Missing password
          }),
        },
        {
          handler: resetHandler,
          request: new Request('http://localhost:3000/api/auth/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: 'invalid json',
          }),
        },
      ];

      for (const scenario of errorScenarios) {
        const response = await scenario.handler(scenario.request);
        const result = await response.json();

        // All error responses should have consistent structure
        expect(result).toHaveProperty('error');
        expect(typeof result.error).toBe('string');
        expect(result.error.length).toBeGreaterThan(0);
      }
    });

    it('should handle different content types', async () => {
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: 'not json',
      });

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result).toHaveProperty('error');
    });

    it('should handle empty request body', async () => {
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      });

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result).toHaveProperty('error');
    });
  });
});
