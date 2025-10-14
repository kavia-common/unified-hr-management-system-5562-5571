import { render, screen } from '@testing-library/react';
import App from './App';

test('renders HRMS welcome headline', () => {
  render(<App />);
  const headline = screen.getByText(/Welcome to HRMS/i);
  expect(headline).toBeInTheDocument();
});

test('does not render CRA boilerplate text', () => {
  render(<App />);
  const craEditHint = screen.queryByText(/Edit src\/App\.js and save to reload\./i);
  const learnReact = screen.queryByText(/learn react/i);
  expect(craEditHint).toBeNull();
  expect(learnReact).toBeNull();
});
