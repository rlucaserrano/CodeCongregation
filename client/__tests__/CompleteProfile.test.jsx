import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompleteProfile from './CompleteProfile';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('CompleteProfile Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    window.localStorage.getItem.mockReset();
    window.localStorage.setItem.mockReset();
    window.localStorage.removeItem.mockReset();
  });

  test('renders the component when isGoogleUser is true', async () => {
    // Mock localStorage.getItem
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'isGoogleUser') return 'true';
      if (key === 'user_id') return 'user123';
      return null;
    });

    render(
      <BrowserRouter>
        <CompleteProfile />
      </BrowserRouter>
    );

    // Check that the form fields are rendered
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
  });

  test('redirects to /account when isGoogleUser is false', async () => {
    const mockNavigate = jest.fn();

    // Update the mock for useNavigate
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'isGoogleUser') return null;
      return null;
    });

    render(
      <BrowserRouter>
        <CompleteProfile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/account');
    });
  });

  test('submits the form and updates the profile successfully', async () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'isGoogleUser') return 'true';
      if (key === 'user_id') return 'user123';
      return null;
    });

    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), { status: 200 });

    render(
      <BrowserRouter>
        <CompleteProfile />
      </BrowserRouter>
    );

    // Fill out the form
    userEvent.type(screen.getByLabelText('First Name'), 'John');
    userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
    userEvent.type(screen.getByLabelText('Bio'), 'Software Developer');

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    // Wait for the fetch call to be made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Check that fetch was called with the correct parameters
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/users', {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Software Developer',
      }),
    });

    // Check that localStorage.removeItem was called
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('isGoogleUser');

    // Check that window.location.href was updated
    expect(window.location.href).toBe('/account');
  });

  test('handles server error during profile update', async () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'isGoogleUser') return 'true';
      if (key === 'user_id') return 'user123';
      return null;
    });

    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'Update failed' }),
      { status: 400 }
    );

    // Mock console.error to suppress error logs during test
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <CompleteProfile />
      </BrowserRouter>
    );

    // Fill out the form
    userEvent.type(screen.getByLabelText('First Name'), 'John');
    userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
    userEvent.type(screen.getByLabelText('Bio'), 'Software Developer');

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    // Wait for the fetch call to be made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Check that console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Error updating profile:',
      'Update failed'
    );

    // Restore console.error
    console.error.mockRestore();
  });
});
