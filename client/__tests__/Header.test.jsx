
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';

describe('Header Component', () => {
  test('renders the logo with link to home', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const logoLink = screen.getByText(/CoderCongregation/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.closest('a')).toHaveAttribute('href', '/');
  });

  test('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const resourcesLink = screen.getByText(/Resources/i);
    const messagesLink = screen.getByText(/Messages/i);
    const calendarLink = screen.getByText(/Calendar/i);

    expect(resourcesLink.closest('a')).toHaveAttribute('href', '/resources');
    expect(messagesLink.closest('a')).toHaveAttribute('href', '/messages');
    expect(calendarLink.closest('a')).toHaveAttribute('href', '/calendar');
  });

  test('renders group and user avatars', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const avatars = screen.getAllByRole('img');
    expect(avatars.length).toBe(2); // Group and User avatars
  });

  test('navigates to groups page on group avatar click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const groupAvatar = screen.getAllByRole('img')[0];
    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    fireEvent.click(groupAvatar);
    expect(window.location.href).toBe('/groups');
  });

  test('opens user menu on user avatar click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const userAvatar = screen.getAllByRole('img')[1];
    fireEvent.click(userAvatar);

    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});
