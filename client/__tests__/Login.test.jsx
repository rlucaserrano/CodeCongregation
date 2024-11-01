// src/pages/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';

// Mock the GoogleLogin component
jest.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <button onClick={() => onSuccess({ credential: 'test_google_token' })}>
      Google Sign In
    </button>
  ),
}));

describe('Login Component', () => {
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

  test('renders the component with all elements', () => {
    render(<Login />);

    // Check for form fields
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Google Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account yet\?/i)).toBeInTheDocument();
  });

  test('handles successful form submission', async () => {
    fetchMock.mockResponseOnce('mock_token', { status: 200 });

    render(<Login />);

    // Fill out the form
    userEvent.type(screen.getByLabelText(/Username/i), 'testuser');
    userEvent.type(screen.getByLabelText(/Password/i), 'password123');

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Check that localStorage.setItem was called with the token
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'mock_token');

    // Check that window.location.href was changed
    expect(window.location.href).toBe('/account');
  });

  test('displays error message on form submission failure', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

    render(<Login />);

    // Fill out the form
    userEvent.type(screen.getByLabelText(/Username/i), 'wronguser');
    userEvent.type(screen.getByLabelText(/Password/i), 'wrongpassword');

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  test('handles Google login success', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success', user_info: { name: 'Google User' } }), { status: 200 });

    render(<Login />);

    // Click on the mocked Google Sign In button
    fireEvent.click(screen.getByText('Google Sign In'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Check that localStorage.setItem was called
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'test_google_token');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('info', JSON.stringify({ name: 'Google User' }));

    // Check that window.location.href was changed
    expect(window.location.href).toBe('/account');
  });

  test('handles Google login failure', async () => {
    // Modify the mock to trigger onError
    jest.mock('@react-oauth/google', () => ({
      GoogleLogin: ({ onSuccess, onError }) => (
        <button onClick={() => onError('Google login failed')}>
          Google Sign In
        </button>
      ),
    }));

    render(<Login />);

    // Click on the mocked Google Sign In button
    fireEvent.click(screen.getByText('Google Sign In'));

    // Check for error message
    expect(screen.getByText(/Google login failed\. Please try again\./i)).toBeInTheDocument();
  });

  test('navigates to create account page when "Create an Account" is clicked', () => {
    render(<Login />);

    // Click on the toggle text to show extra options
    fireEvent.click(screen.getByText(/Don't have an account yet\?/i));

    // Click on "Create an Account" button
    fireEvent.click(screen.getByRole('button', { name: /Create an Account/i }));

    // Check that window.location.href was changed
    expect(window.location.href).toBe('/create');
  });

  test('navigates to home page when "Continue as Guest" is clicked', () => {
    render(<Login />);

    // Click on the toggle text to show extra options
    fireEvent.click(screen.getByText(/Don't have an account yet\?/i));

    // Click on "Continue as Guest" button
    fireEvent.click(screen.getByRole('button', { name: /Continue as Guest/i }));

    // Check that window.location.href was changed
    expect(window.location.href).toBe('/');
  });

  test('toggles extra options visibility', () => {
    render(<Login />);

    // Initially, extra options should not be visible
    expect(screen.queryByRole('button', { name: /Create an Account/i })).not.toBeInTheDocument();

    // Click on the toggle text to show extra options
    fireEvent.click(screen.getByText(/Don't have an account yet\?/i));

    // Extra options should now be visible
    expect(screen.getByRole('button', { name: /Create an Account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue as Guest/i })).toBeInTheDocument();
  });
});
