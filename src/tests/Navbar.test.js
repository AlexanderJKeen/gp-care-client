import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/navbar';
import '@testing-library/jest-dom';

jest.mock('react-modal', () => ({
  ...jest.requireActual('react-modal'),
  setAppElement: jest.fn(),
}));

describe('Navbar Component', () => {
  // Wrap Navbar with BrowserRouter to provide routing context
  const renderNavbar = () => render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  beforeEach(() => {
    renderNavbar();
  });

  test('renders the navbar brand with text "GP Care"', () => {
    const brandElement = screen.getByText(/GP Care/i);
    expect(brandElement).toBeInTheDocument();
  });

  test('renders the home link', () => {
    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('renders the book appointment link', () => {
    const bookAppointmentLink = screen.getByText(/Book Appointment/i);
    expect(bookAppointmentLink).toBeInTheDocument();
    expect(bookAppointmentLink).toHaveAttribute('href', '/bookings');
  });

  test('renders the admin link', () => {
    const adminLink = screen.getByText(/Admin/i);
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute('href', '/Admin');
  });

  test('should have the navbar brand image with correct attributes', () => {
    const brandImage = screen.getByAltText('.');
    expect(brandImage).toBeInTheDocument();
    expect(brandImage).toHaveAttribute('src', './images/nhs.png');
    expect(brandImage).toHaveAttribute('width', '60');
    expect(brandImage).toHaveAttribute('height', '30');
  });
});
