
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Resources from './Resources';
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

describe('Resources Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders resources after fetching data', async () => {
    const mockData = [
      // Mock data should match the structure expected by your component
      // Each item is an array: [Resource Name, Resource Link, Resource Type, Votes]
      ['Practice Resource 1', 'http://example.com/1', 'Practice Questions', 10],
      ['Practice Resource 2', 'http://example.com/2', 'Practice Questions', 5],
      ['Practice Resource 3', 'http://example.com/3', 'Practice Questions', 2],
      ['Practice Resource 4', 'http://example.com/4', 'Practice Questions', 1],
      ['Tutorial Resource 1', 'http://example.com/5', 'Tutorials', 8],
      ['Tutorial Resource 2', 'http://example.com/6', 'Tutorials', 6],
      ['Tutorial Resource 3', 'http://example.com/7', 'Tutorials', 3],
      ['Visualization Resource 1', 'http://example.com/8', 'Visualization Materials', 4],
      ['Visualization Resource 2', 'http://example.com/9', 'Visualization Materials', 2],
      ['Theory Resource 1', 'http://example.com/10', 'Computer Science Theory', 9],
      ['Theory Resource 2', 'http://example.com/11', 'Computer Science Theory', 7],
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    await act(async () => {
      render(
        <MemoryRouter>
          <Resources />
        </MemoryRouter>
      );
    });

    // Check if the header is rendered
    expect(screen.getByText(/Resources \(TBD\)/i)).toBeInTheDocument();

    // Wait for the data to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Tutorials/i)).toBeInTheDocument();
    });

    // Expand the "Tutorials" accordion
    const tutorialsAccordion = screen.getByText('Tutorials');
    userEvent.click(tutorialsAccordion);

    // Check if tutorial resources are displayed
    expect(screen.getByText('Tutorial Resource 1')).toBeInTheDocument();
    expect(screen.getByText('Tutorial Resource 2')).toBeInTheDocument();
    expect(screen.getByText('Tutorial Resource 3')).toBeInTheDocument();

    // Similarly, test other accordions and resources
  });
});
