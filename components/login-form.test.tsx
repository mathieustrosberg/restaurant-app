import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';
import { LoginForm } from './login-form';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth client
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: jest.fn(),
    },
  },
}));

// Mock ChefHat icon from lucide-react
jest.mock('lucide-react', () => ({
  ChefHat: () => <div data-testid="chef-hat-icon">ChefHat</div>,
}));

const mockPush = jest.fn();
const mockAuthClient = require('@/lib/auth-client').authClient;

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
  jest.clearAllMocks();
});

describe('LoginForm Component', () => {
  describe('Rendering', () => {
    test('renders all form elements correctly', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
      expect(screen.getByText('Connexion')).toBeInTheDocument();
      expect(screen.getByTestId('chef-hat-icon')).toBeInTheDocument();
    });

    test('renders header with logo and title', () => {
      render(<LoginForm />);

      expect(screen.getByText('Connexion')).toBeInTheDocument();
      expect(screen.getByTestId('chef-hat-icon')).toBeInTheDocument();
      expect(screen.getByText('Mon Restaurant')).toBeInTheDocument();
    });

    test('renders legal links', () => {
      render(<LoginForm />);

      const mentionsLink = screen.getByRole('link', { name: 'Mentions légales' });
      const privacyLink = screen.getByRole('link', { name: 'Politique de confidentialité' });

      expect(mentionsLink).toHaveAttribute('href', '/mentions-legales');
      expect(privacyLink).toHaveAttribute('href', '/politique-de-confidentialite');
    });

    test('renders admin notice', () => {
      render(<LoginForm />);

      expect(screen.getByText('Accès réservé aux administrateurs')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      render(<LoginForm className="custom-class" data-testid="login-form" />);

      const form = screen.getByTestId('login-form');
      expect(form).toHaveClass('custom-class');
    });
  });

  describe('Form Interactions', () => {
    test('updates email input when user types', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });

    test('updates password input when user types', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText('Mot de passe') as HTMLInputElement;
      await user.type(passwordInput, 'password123');

      expect(passwordInput.value).toBe('password123');
    });

    test('has correct input types and attributes', () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('placeholder', 'admin@restaurant.com');

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
    });
  });

  describe('Form Submission', () => {
    test('calls authClient.signIn.email on form submission', async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockResolvedValue({ error: null });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      await user.type(emailInput, 'admin@restaurant.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
        email: 'admin@restaurant.com',
        password: 'password123',
        callbackURL: '/dashboard',
      });
    });

    test('navigates to dashboard on successful login', async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockResolvedValue({ error: null });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      await user.type(emailInput, 'admin@restaurant.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    test('shows loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveSignIn: (value: any) => void;
      const signInPromise = new Promise(resolve => {
        resolveSignIn = resolve;
      });
      mockAuthClient.signIn.email.mockReturnValue(signInPromise);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      await user.type(emailInput, 'admin@restaurant.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(screen.getByText('Connexion…')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      resolveSignIn!({ error: null });
      await waitFor(() => {
        expect(screen.getByText('Se connecter')).toBeInTheDocument();
      });
    });

    test('displays error message on failed login', async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockResolvedValue({
        error: { message: 'Invalid credentials' }
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      await user.type(emailInput, 'wrong@email.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    test('displays generic error message when error has no message', async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockResolvedValue({
        error: {}
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
      });
    });

    test('clears error message on new submission', async () => {
      const user = userEvent.setup();

      // First submission with error
      mockAuthClient.signIn.email.mockResolvedValueOnce({
        error: { message: 'Invalid credentials' }
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      await user.type(emailInput, 'wrong@email.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });

      // Second submission
      mockAuthClient.signIn.email.mockResolvedValueOnce({ error: null });

      await user.clear(emailInput);
      await user.clear(passwordInput);
      await user.type(emailInput, 'correct@email.com');
      await user.type(passwordInput, 'correctpassword');
      await user.click(submitButton);

      // Error should be cleared immediately when form is submitted
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });

    test('form submission triggers auth client', async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockResolvedValue({ error: null });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        callbackURL: '/dashboard',
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper form structure', () => {
      const { container } = render(<LoginForm />);

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');

      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });

    test('submit button has correct type', () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: 'Se connecter' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    test('home link has screen reader text', () => {
      render(<LoginForm />);

      expect(screen.getByText('Mon Restaurant')).toHaveClass('sr-only');
    });

    test('error message has appropriate styling', async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockResolvedValue({
        error: { message: 'Test error' }
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('Test error');
        expect(errorMessage).toHaveClass('text-red-500');
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles empty form submission', async () => {
      mockAuthClient.signIn.email.mockResolvedValue({ error: null });

      const { container } = render(<LoginForm />);

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
          email: '',
          password: '',
          callbackURL: '/dashboard',
        });
      });
    });

    test('handles authClient throwing an exception', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock the auth client to reject with an error
      mockAuthClient.signIn.email.mockImplementation(() => {
        throw new Error('Network error');
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      
      // The form should still work even if auth client throws
      await user.click(submitButton);

      // The component should handle the error gracefully
      expect(submitButton).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    test('handles very long email and password inputs', async () => {
      const user = userEvent.setup();
      const longEmail = 'a'.repeat(100) + '@example.com';
      const longPassword = 'p'.repeat(200);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Mot de passe') as HTMLInputElement;

      await user.type(emailInput, longEmail);
      await user.type(passwordInput, longPassword);

      expect(emailInput.value).toBe(longEmail);
      expect(passwordInput.value).toBe(longPassword);
    });

    test('handles special characters in inputs', async () => {
      const user = userEvent.setup();
      const specialEmail = 'test+tag@éxample.com';
      const specialPassword = 'pássw0rd!@#$%^&*()';

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Mot de passe') as HTMLInputElement;

      await user.type(emailInput, specialEmail);
      await user.type(passwordInput, specialPassword);

      expect(emailInput.value).toBe(specialEmail);
      expect(passwordInput.value).toBe(specialPassword);
    });

    test('forwards additional props correctly', () => {
      render(<LoginForm data-testid="login-form" aria-label="Login form" />);

      const loginForm = screen.getByTestId('login-form');
      expect(loginForm).toHaveAttribute('aria-label', 'Login form');
    });
  });
});