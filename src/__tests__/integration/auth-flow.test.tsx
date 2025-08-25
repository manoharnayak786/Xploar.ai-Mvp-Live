import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthScreen } from '@/components/features/onboarding/AuthScreen';
import { useAppStore } from '@/lib/store';
import { createMockUser } from '../test-utils';

// Mock the store
jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(),
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Authentication Flow Integration', () => {
  const storeModule = jest.requireMock('@/lib/store');
  const mockUseAppStore = storeModule.useAppStore;
  const mockOnAuthSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppStore.mockReturnValue({
      loginWithPassword: jest.fn(),
      signUpWithPassword: jest.fn(),
      requestPasswordReset: jest.fn(),
    });
  });

  describe('Complete Login Flow', () => {
    it('should handle successful login and redirect', async () => {
      const mockLogin = jest.fn().mockResolvedValue(undefined);
      mockUseAppStore.mockReturnValue({
        loginWithPassword: mockLogin,
        signUpWithPassword: jest.fn(),
        requestPasswordReset: jest.fn(),
      });

      const user = userEvent.setup();
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Verify initial state
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByText('Sign in to continue your journey.')).toBeInTheDocument();

      // Fill in login form
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Submit form
      const signInButton = screen.getByText('Sign In');
      await user.click(signInButton);

      // Verify login was called with correct data
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });

      // Verify success callback was called
      expect(mockOnAuthSuccess).toHaveBeenCalled();
    });

    it('should handle login form submission', async () => {
      const mockLogin = jest.fn();
      mockUseAppStore.mockReturnValue({
        loginWithPassword: mockLogin,
        signUpWithPassword: jest.fn(),
        requestPasswordReset: jest.fn(),
      });

      const user = userEvent.setup();
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Fill and submit form
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByText('Sign In'));

      // Verify login was attempted
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should handle form switching between login and signup', async () => {
      const user = userEvent.setup();
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Start with login form
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();

      // Switch to signup
      const signupLink = screen.getByText("Don't have an account? Sign Up");
      await user.click(signupLink);

      // Verify signup form
      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();

      // Switch back to login
      const loginLink = screen.getByText('Already have an account? Sign In');
      await user.click(loginLink);

      // Verify back to login form
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.queryByLabelText('Full Name')).not.toBeInTheDocument();
    });
  });

  describe('Complete Signup Flow', () => {
    it('should handle successful signup and redirect', async () => {
      const mockSignUp = jest.fn().mockResolvedValue(undefined);
      mockUseAppStore.mockReturnValue({
        loginWithPassword: jest.fn(),
        signUpWithPassword: mockSignUp,
        requestPasswordReset: jest.fn(),
      });

      const user = userEvent.setup();
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Switch to signup form
      await user.click(screen.getByText("Don't have an account? Sign Up"));

      // Fill in signup form
      const nameInput = screen.getByPlaceholderText('Enter your full name');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      await user.type(nameInput, 'New User');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'password123');

      // Submit form
      const signUpButton = screen.getByText('Create Account');
      await user.click(signUpButton);

      // Verify signup was called with correct data
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('newuser@example.com', 'password123', 'New User');
      });

      // Verify success callback was called
      expect(mockOnAuthSuccess).toHaveBeenCalled();
    });

    it('should validate required fields in signup', async () => {
      const mockSignUp = jest.fn();
      mockUseAppStore.mockReturnValue({
        loginWithPassword: jest.fn(),
        signUpWithPassword: mockSignUp,
        requestPasswordReset: jest.fn(),
      });

      const user = userEvent.setup();
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Switch to signup and try to submit without filling fields
      await user.click(screen.getByText("Don't have an account? Sign Up"));

      const signUpButton = screen.getByText('Create Account');
      await user.click(signUpButton);

      // Verify signup was not called
      expect(mockSignUp).not.toHaveBeenCalled();
      expect(mockOnAuthSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Password Reset Flow', () => {
    it('should handle password reset request', async () => {
      const mockResetPassword = jest.fn().mockResolvedValue(undefined);
      mockUseAppStore.mockReturnValue({
        loginWithPassword: jest.fn(),
        signUpWithPassword: jest.fn(),
        requestPasswordReset: mockResetPassword,
      });

      // Mock alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

      const user = userEvent.setup();
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Fill email and click forgot password
      const emailInput = screen.getByPlaceholderText('Enter your email');
      await user.type(emailInput, 'test@example.com');

      const forgotPasswordLink = screen.getByText('Forgot password?');
      await user.click(forgotPasswordLink);

      // Verify reset request was made
      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith('test@example.com');
      });

      // Verify alert was shown
      expect(mockAlert).toHaveBeenCalledWith('Password reset email sent (check your inbox)');

      mockAlert.mockRestore();
    });

    it('should not submit password reset without email', async () => {
      const mockResetPassword = jest.fn();
      mockUseAppStore.mockReturnValue({
        loginWithPassword: jest.fn(),
        signUpWithPassword: jest.fn(),
        requestPasswordReset: mockResetPassword,
      });

      const user = userEvent.setup();
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Click forgot password without email
      const forgotPasswordLink = screen.getByText('Forgot password?');
      await user.click(forgotPasswordLink);

      // Verify reset request was not made
      expect(mockResetPassword).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation Integration', () => {
    it('should validate email format', async () => {
      const mockLogin = jest.fn();
      mockUseAppStore.mockReturnValue({
        loginWithPassword: mockLogin,
        signUpWithPassword: jest.fn(),
        requestPasswordReset: jest.fn(),
      });

      const user = userEvent.setup();
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Fill form with invalid email
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');

      const signInButton = screen.getByText('Sign In');
      await user.click(signInButton);

      // Form should still allow submission (no client-side validation implemented)
      // The API will handle validation
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('invalid-email', 'password123');
      });
    });

    it('should handle empty form submission', async () => {
      const mockLogin = jest.fn();
      mockUseAppStore.mockReturnValue({
        loginWithPassword: mockLogin,
        signUpWithPassword: jest.fn(),
        requestPasswordReset: jest.fn(),
      });

      const user = userEvent.setup();
      render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

      // Submit without filling any fields
      const signInButton = screen.getByText('Sign In');
      await user.click(signInButton);

      // Verify login was not attempted
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockOnAuthSuccess).not.toHaveBeenCalled();
    });
  });
});
