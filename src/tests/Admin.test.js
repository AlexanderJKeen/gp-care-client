import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import AdminPage from '../components/Admin';
import Modal from 'react-modal';

jest.mock('axios');
const mockedAxios = axios;

jest.mock('react-modal', () => {
  const Modal = ({ isOpen, onRequestClose, children }) => (
    isOpen ? (
      <div>
        <div onClick={onRequestClose} data-testid="overlay" />
        <div data-testid="calendar-modal">{children}</div>
      </div>
    ) : null
  );

  Modal.setAppElement = () => {};

  return Modal;
});

describe('AdminPage Component', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          AppointmentID: '1',
          DoctorName: 'Dr. Smith',
          PatientName: 'John Doe',
          PatientID: '123',
          AppointmentDate: '2024-10-01T10:00:00Z',
          Seen: 0,
          DoctorID: '456',
          notes: 'Sick'
        }
      ]
    });

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<AdminPage />);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the calendar button', () => {
    const calendarButton = screen.getByTestId('open-calendar-button');
    expect(calendarButton).toBeInTheDocument();
  });

  test('opens and interacts with the Edit Appointment modal', async () => {
    render(<AdminPage />);
  
    const calendarButtons = screen.getAllByTestId('open-calendar-button');
    act(() => {
      fireEvent.click(calendarButtons[0]);
    });
  
    await waitFor(() => {
      expect(screen.getByTestId('calendar-modal')).toBeInTheDocument();
    });
  
    const appointment = screen.getByTitle('John Doe');
    expect(appointment).toBeInTheDocument();
    act(() => {
      fireEvent.click(appointment);
    });
  
    const closeCalendarButton = screen.getByTestId('close-calendar-button');
    act(() => {
      fireEvent.click(closeCalendarButton);
    });
  
    await waitFor(() => {
      expect(screen.queryByTestId('calendar-modal')).not.toBeInTheDocument();
    });
  });
});
