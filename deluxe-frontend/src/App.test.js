import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// React Router v7 uses package exports that the Jest resolver bundled with
// react-scripts v5 cannot load. The app itself is exercised by the browser
// build; this unit test only needs lightweight routing components.
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    BrowserRouter: ({ children }) => React.createElement('div', null, children),
    Routes: ({ children }) => React.createElement('div', null, children),
    Route: ({ element }) => element,
    Link: ({ children, to }) => React.createElement('a', { href: to }, children),
    Navigate: ({ to }) => React.createElement('a', { href: to }, 'Redirect'),
    useNavigate: () => jest.fn(),
  };
}, { virtual: true });

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  });
});

test('renders the booking home page', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /welcome to deluxe booking/i })).toBeInTheDocument();
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/routes/')
  ));
});
