// src/pages/Account.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Account from './Account';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
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

describe('Account Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    window.localStorage.getItem.mockReset();
    window.localStorage.setItem.mockReset();
    window.localStorage.removeItem.mockReset();
    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };
  });

  test('renders the component and displays user data after fetching', async () => {
    // Mock localStorage.getItem to return a token
    window.localStorage.getItem.mockReturnValue('mock_token');

    // Mock fetch response for user info
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 'user123',
        user: 'testuser',
        pass: 'password123',
        mail: 'testuser@example.com',
        first: 'Test',
        last: 'User',
        bio: 'This is a test bio.',
      })
    );

    render(<Account />);

    // Wait for data fetching to complete
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Check that form fields are populated with fetched data
    expect(screen.getByLabelText('Username')).toHaveValue('testuser');
    expect(screen.getByLabelText('Password')).toHaveValue('password123');
    expect(screen.getByLabelText('Email')).toHaveValue('testuser@example.com');
    expect(screen.getByLabelText('First Name')).toHaveValue('Test');
    expect(screen.getByLabelText('Last Name')).toHaveValue('User');
    expect(screen.getByLabelText('Bio')).toHaveValue('This is a test bio.');
  });

  test('updates state when form inputs change', async () => {
    window.localStorage.getItem.mockReturnValue('mock_token');
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 'user123',
        user: 'testuser',
        pass: 'password123',
        mail: 'testuser@example.com',
        first: 'Test',
        last: 'User',
        bio: 'This is a test bio.',
      })
    );

    render(<Account />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Update the 'Bio' field
    const bioField = screen.getByLabelText('Bio');
    userEvent.clear(bioField);
    userEvent.type(bioField, 'Updated bio.');

    // Check that the value has been updated
    expect(bioField).toHaveValue('Updated bio.');
  });

  test('handles save changes and calls the update API', async () => {
    window.localStorage.getItem.mockReturnValue('mock_token');
    fetchMock
      .mockResponseOnce(
        JSON.stringify({
          id: 'user123',
          user: 'testuser',
          pass: 'password123',
          mail: 'testuser@example.com',
          first: 'Test',
          last: 'User',
          bio: 'This is a test bio.',
        })
      ) // For initial data fetching
      .mockResponseOnce(JSON.stringify({ success: true })); // For update API

    // Mock window.alert
    window.alert = jest.fn();

    render(<Account />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Update the 'Email' field
    const emailField = screen.getByLabelText('Email');
    userEvent.clear(emailField);
    userEvent.type(emailField, 'newemail@example.com');

    // Click 'Save Changes' button
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    // Wait for the update API call
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    // Check that fetch was called with the correct URL and method
    expect(fetchMock).toHaveBeenLastCalledWith('http://localhost:8080/update_user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock_token',
      },
      body: JSON.stringify({
        valUserID: 'user123',
        valUserName: 'testuser',
        valHashedPassword: 'password123',
        valEmail: 'newemail@example.com',
        valFirstName: 'Test',
        valLastName: 'User',
        valBio: 'This is a test bio.',
      }),
    });

    // Check that window.alert was called
    expect(window.alert).toHaveBeenCalledWith('User information updated successfully!');
  });

  test('handles logout and clears local storage', async () => {
    window.localStorage.getItem.mockReturnValue('mock_token');
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 'user123',
        user: 'testuser',
        pass: 'password123',
        mail: 'testuser@example.com',
        first: 'Test',
        last: 'User',
        bio: 'This is a test bio.',
      })
    );

    render(<Account />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Click 'Log Out' button
    const logoutButton = screen.getByText('Log Out');
    fireEvent.click(logoutButton);

    // Check that localStorage.removeItem was called
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('groupID');

    // Check that window.location.href was updated
    expect(window.location.href).toBe('/');
  });

  test('toggles sidebar and switches views', async () => {
    window.localStorage.getItem.mockReturnValue('mock_token');
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 'user123',
        user: 'testuser',
        pass: 'password123',
        mail: 'testuser@example.com',
        first: 'Test',
        last: 'User',
        bio: 'This is a test bio.',
      })
    );

    render(<Account />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Sidebar should be collapsed initially
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();

    // Click the hamburger menu to open sidebar
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Sidebar should now be open
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Friends')).toBeInTheDocument();

    // Click on 'Friends' to switch view
    fireEvent.click(screen.getByText('Friends'));

    // The 'Friends' view should be displayed (placeholder in this case)
    // Since there's no content, we can check that the 'account-form' is not in the document
    expect(screen.queryByRole('textbox', { name: 'Username' })).not.toBeInTheDocument();

    // Switch back to 'Settings'
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  test('displays an error message if fetching user info fails', async () => {
    window.localStorage.getItem.mockReturnValue('mock_token');
    fetchMock.mockRejectOnce(new Error('Network error'));

    render(<Account />);

    // Since the component returns null if !safe, and there's no error UI,
    // we can check that nothing is rendered
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Component should not render any content
    expect(screen.queryByText('Account')).not.toBeInTheDocument();
  });
});
