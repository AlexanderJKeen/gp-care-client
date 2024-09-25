import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../components/home';
import '@testing-library/jest-dom';

describe('Home Component', () => {
  // Render the Home component before each test
  beforeEach(() => {
    render(
        <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });

  test('renders an input element with the placeholder "Search.."', () => {
    const inputElement = screen.getByPlaceholderText('Search..');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  test('renders a section with data-testid "card-section"', () => {
    const cardSection = screen.getByTestId('card-section');
    expect(cardSection).toBeInTheDocument();
  });

  test('renders a section with data-testid "home-section"', () => {
    const homeSection = screen.getByTestId('home-section');
    expect(homeSection).toBeInTheDocument();
  });
});