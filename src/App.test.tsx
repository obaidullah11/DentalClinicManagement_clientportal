import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders appointment button', async () => {
  render(<App />);
  await waitFor(() => {
    const buttonElement = screen.getByText(/I'll make an appointment/i);
    expect(buttonElement).toBeInTheDocument();
  });
});