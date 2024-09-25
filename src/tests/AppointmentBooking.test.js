import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentBooking from '../components/appointmentBooking';

describe('AppointmentBooking Component', () => {
  test('renders the appointment booking page', () => {
    render(<AppointmentBooking />);
    // Test to check if the main appointment booking container is rendered
    const appointmentBookingElement = screen.getByTestId('appointment-booking');
    expect(appointmentBookingElement).toBeInTheDocument();
  });

  test('renders the left-side form component', () => {
    render(<AppointmentBooking />);
    // Test to check if the left-side form container is rendered
    const leftSideElement = screen.getByTestId('left-side');
    expect(leftSideElement).toBeInTheDocument();
  });

  test('renders the right-side calendar component', () => {
    render(<AppointmentBooking />);
    const rightSideElement = screen.getByTestId('right-side');
    expect(rightSideElement).toBeInTheDocument();
  });

});