import { render, screen } from '@testing-library/react';
import App from './App';

test('renders appointment button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/I'll make an appointment/i);
  expect(buttonElement).toBeInTheDocument();
});