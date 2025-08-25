import { render, screen } from '@testing-library/react';
import { AuthScreen } from '@/components/features/onboarding/AuthScreen';

// Mock the store
jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(() => ({
    loginWithPassword: jest.fn(),
    signUpWithPassword: jest.fn(),
    requestPasswordReset: jest.fn(),
  })),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('AuthScreen Component', () => {
  const mockOnAuthSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render login form by default', () => {
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByText('Sign in to continue your journey.')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText("Don't have an account? Sign Up")).toBeInTheDocument();
    });

    it('should show signup link', () => {
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      expect(screen.getByText("Don't have an account? Sign Up")).toBeInTheDocument();
    });

    it('should show email input field', () => {
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      expect(emailInput).toBeInTheDocument();
    });

    it('should show password input field', () => {
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      expect(passwordInput).toBeInTheDocument();
    });

    it('should show sign in button', () => {
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  describe('Form Structure', () => {
    it('should show forgot password link', () => {
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    it('should show app branding', () => {
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      expect(screen.getByText('xploar.ai')).toBeInTheDocument();
      expect(screen.getByText('Your AI-Powered UPSC Preparation Companion')).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Should have form elements
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should accept onAuthSuccess callback', () => {
      const mockCallback = jest.fn();
      render(<AuthScreen onAuthSuccess={mockCallback} />);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle different callback functions', () => {
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();

      const { rerender } = render(<AuthScreen onAuthSuccess={mockCallback1} />);
      expect(mockCallback1).not.toHaveBeenCalled();

      rerender(<AuthScreen onAuthSuccess={mockCallback2} />);
      expect(mockCallback2).not.toHaveBeenCalled();
    });
  });
});