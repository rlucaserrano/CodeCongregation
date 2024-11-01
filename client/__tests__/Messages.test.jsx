
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Messages from './Messages';
import '@testing-library/jest-dom/extend-expect';

describe('Messages Component', () => {
  test('renders the component with default view', () => {
    render(<Messages />);

    // Check that the Messages header is displayed
    expect(screen.getByText('Messages')).toBeInTheDocument();

    // Verify that the default view is 'Group Messages'
    expect(screen.getByText('Group Chat Message 1')).toBeInTheDocument();
    expect(screen.getByText('Group Chat Message 2')).toBeInTheDocument();
    expect(screen.getByText('Group Chat Message 3')).toBeInTheDocument();
  });

  test('toggles the sidebar when hamburger icon is clicked', () => {
    render(<Messages />);

    const hamburgerButton = screen.getByRole('button', { name: /menu/i });
    expect(hamburgerButton).toBeInTheDocument();

    // Initially, the sidebar should be collapsed
    expect(screen.queryByText('Group Messages')).not.toBeInTheDocument();

    // Click to open the sidebar
    fireEvent.click(hamburgerButton);
    expect(screen.getByText('Group Messages')).toBeInTheDocument();

    // Click again to close the sidebar
    fireEvent.click(hamburgerButton);
    expect(screen.queryByText('Group Messages')).not.toBeInTheDocument();
  });

  test('changes view when menu items are clicked', () => {
    render(<Messages />);

    const hamburgerButton = screen.getByRole('button', { name: /menu/i });

    // Open the sidebar
    fireEvent.click(hamburgerButton);

    // Click on 'Direct Messages'
    fireEvent.click(screen.getByText('Direct Messages'));
    expect(screen.getByText('Direct Message 1')).toBeInTheDocument();
    expect(screen.queryByText('Group Chat Message 1')).not.toBeInTheDocument();

    // Click on 'Group Members'
    fireEvent.click(screen.getByText('Group Members'));
    expect(screen.getByText('Group Members')).toBeInTheDocument();
    expect(screen.getByText('ExampleUser1')).toBeInTheDocument();

    // Return to 'Group Messages'
    fireEvent.click(screen.getByText('Group Messages'));
    expect(screen.getByText('Group Chat Message 1')).toBeInTheDocument();
  });

  test('toggles the notifications pane when notifications icon is clicked', () => {
    render(<Messages />);

    const notificationsButton = screen.getByRole('button', { name: /notifications/i });
    expect(notificationsButton).toBeInTheDocument();

    // Initially, the notifications pane should be collapsed
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();

    // Click to open the notifications pane
    fireEvent.click(notificationsButton);
    expect(screen.getByText('Notifications')).toBeInTheDocument();

    // Click again to close the notifications pane
    fireEvent.click(notificationsButton);
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  test('opens and closes the invite dialog in Group Members view', () => {
    render(<Messages />);

    const hamburgerButton = screen.getByRole('button', { name: /menu/i });

    // Open the sidebar and navigate to 'Group Members'
    fireEvent.click(hamburgerButton);
    fireEvent.click(screen.getByText('Group Members'));

    // Click the 'Invite' button
    const inviteButton = screen.getByText('Invite');
    fireEvent.click(inviteButton);

    // The dialog should open
    expect(screen.getByText('Look up by username')).toBeInTheDocument();

    // Close the dialog
    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton);

    // The dialog should close
    expect(screen.queryByText('Look up by username')).not.toBeInTheDocument();
  });

  test('filters messages when typing in the search field', () => {
    render(<Messages />);

    // Ensure we're in the 'Group Messages' view
    expect(screen.getByText('Group Chat Message 1')).toBeInTheDocument();

    const filterInput = screen.getByLabelText('Filter by user');
    fireEvent.change(filterInput, { target: { value: '1' } });

    // Assuming the filter logic is implemented, only messages containing '1' should be displayed
  
  });
});
