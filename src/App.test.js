import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import Modal from 'react-modal';

jest.mock('react-modal', () => ({
  ...jest.requireActual('react-modal'),
  setAppElement: jest.fn(),
}));

test('renders GP Care navbar brand', () => {
  render(<App />);
  const linkElement = screen.getByText(/GP Care/i);
  expect(linkElement).not.toBeNull();
});
