
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Create from './Create';
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom/extend-expect';

describe('Create Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
      },
      writable: true,
    });
    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };
  });

  test('renders the form fields and buttons', () => {
    render(<Create />);

    // Check for form fields
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign up with Google/i)).toBeInTheDocument();
  });

  test('shows error message when passwords do not match', () => {
    render(<Create />);

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'differentpassword' },
    });

    fireEvent.click(screen.getByText(/Sign Up/i));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('submits the form and redirects on success', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ user_id: '12345' }),
      { status: 200 }
    );

    render(<Create />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'testuser@example.com' },
    });

    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Check that localStorage.setItem was called
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'user_id',
      '12345'
    );

    // Check that window.location.href was changed
    expect(window.location.href).toBe('/complete-profile');
  });

  test('displays server error message on failure', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ ERROR: 'Username already exists' }),
      { status: 400 }
    );

    render(<Create />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'existinguser' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'existinguser@example.com' },
    });

    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByText(/Username already exists/i)
    ).toBeInTheDocument();
  });

  test('redirects to login page on cancel', () => {
    render(<Create />);

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(window.location.href).toBe('/login');
  });

  test('redirects to Google OAuth on "Sign up with Google"', () => {
    render(<Create />);

    fireEvent.click(screen.getByText(/Sign up with Google/i));

    expect(window.location.href).toBe('http://localhost:8080/google-auth');
  });
});
