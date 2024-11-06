
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Groups from './Groups';
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

describe('Groups Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    window.localStorage.getItem.mockReset();
    window.localStorage.setItem.mockReset();
    window.localStorage.removeItem.mockReset();
    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };
  });

  test('renders the component with groups and invites', async () => {
    // Mock localStorage.getItem
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock_token';
      if (key === 'groupID') return '123';
      return null;
    });

    // Mock fetch responses
    fetchMock
      .mockResponseOnce(JSON.stringify({ id: 'user123' })) // For /info
      .mockResponseOnce(
        JSON.stringify([
          [['Group 1', 'Description 1', 'group1ID']],
          [['Group 2', 'Description 2', 'group2ID']],
        ])
      ) // For /groups
      .mockResponseOnce(
        JSON.stringify([
          [['Invite Group 1', 'Invite Description 1']],
          [['Invite Group 2', 'Invite Description 2']],
        ])
      ); // For /invite

    render(<Groups />);

    // Wait for data fetching to complete
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    // Check that group titles are rendered
    expect(screen.getByText('Your Groups')).toBeInTheDocument();
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Group 2')).toBeInTheDocument();

    // Check that invite titles are rendered
    expect(screen.getByText('Pending Invites')).toBeInTheDocument();
    expect(screen.getByText('Invite Group 1')).toBeInTheDocument();
    expect(screen.getByText('Invite Group 2')).toBeInTheDocument();
  });

  test('handles opening and closing the "Create New Group" dialog', async () => {
    // Mock localStorage and fetch as before
    window.localStorage.getItem.mockReturnValue('mock_token');
    fetchMock
      .mockResponseOnce(JSON.stringify({ id: 'user123' })) // For /info
      .mockResponseOnce(JSON.stringify([])) // For /groups
      .mockResponseOnce(JSON.stringify([])); // For /invite

    render(<Groups />);

    // Wait for data fetching to complete
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    // Click on "Create New Group" button
    const createButton = screen.getByText('Create New Group');
    fireEvent.click(createButton);

    // The dialog should be open
    expect(screen.getByText('Create a new Group')).toBeInTheDocument();

    // Close the dialog
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // The dialog should be closed
    expect(screen.queryByText('Create a new Group')).not.toBeInTheDocument();
  });

  test('submits the "Create New Group" form', async () => {
    // Mock localStorage and fetch as before
    window.localStorage.getItem.mockReturnValue('mock_token');
    fetchMock
      .mockResponseOnce(JSON.stringify({ id: 'user123' })) // For /info
      .mockResponseOnce(JSON.stringify([])) // For /groups
      .mockResponseOnce(JSON.stringify([])) // For /invite
      .mockResponseOnce('') // For /addgroup
      .mockResponseOnce(''); // For /addmem

    render(<Groups />);

    // Wait for data fetching to complete
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    // Open the dialog
    fireEvent.click(screen.getByText('Create New Group'));

    // Fill out the form
    userEvent.type(screen.getByLabelText('Group Name'), 'New Group');
    userEvent.type(screen.getByLabelText('Description'), 'New Group Description');

    // Click on "Create" button
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    // Wait for the fetch calls
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(5));

    // Check that localStorage.setItem was called with "groupID"
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'groupID',
      expect.any(Number)
    );

    // Check that window.location.href was changed
    expect(window.location.href).toBe('/');
  });

  test('selects a group from the list', async () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock_token';
      if (key === 'groupID') return '123';
      return null;
    });

    fetchMock
      .mockResponseOnce(JSON.stringify({ id: 'user123' })) // For /info
      .mockResponseOnce(
        JSON.stringify([
          [['Group 1', 'Description 1', 'group1ID']],
          [['Group 2', 'Description 2', 'group2ID']],
        ])
      ) // For /groups
      .mockResponseOnce(JSON.stringify([])); // For /invite

    render(<Groups />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    // Click on "Group 1"
    fireEvent.click(screen.getByText('Group 1'));

    // Check that localStorage.setItem was called with "groupID" and the correct ID
    expect(window.localStorage.setItem).toHaveBeenCalledWith('groupID', 'group1ID');

    // Check that window.location.href was changed
    expect(window.location.href).toBe('/');
  });

  test('displays message when no groups are available', async () => {
    window.localStorage.getItem.mockReturnValue('mock_token');

    fetchMock
      .mockResponseOnce(JSON.stringify({ id: 'user123' })) // For /info
      .mockResponseOnce(JSON.stringify([])) // For /groups
      .mockResponseOnce(JSON.stringify([])); // For /invite

    render(<Groups />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    // Check for the message about no groups
    expect(
      screen.getByText('You currently have no groups available')
    ).toBeInTheDocument();
  });

  test('displays message when no pending invites are available', async () => {
    window.localStorage.getItem.mockReturnValue('mock_token');

    fetchMock
      .mockResponseOnce(JSON.stringify({ id: 'user123' })) // For /info
      .mockResponseOnce(JSON.stringify([])) // For /groups
      .mockResponseOnce(JSON.stringify([])); // For /invite

    render(<Groups />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    // Check for the message about no pending invites
    expect(
      screen.getByText('You currently have no pending invites')
    ).toBeInTheDocument();
  });
});
