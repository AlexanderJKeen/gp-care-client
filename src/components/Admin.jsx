import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from './Calendar';
import Modal from 'react-modal';
import './AdminPage.css';

Modal.setAppElement('#root');

const AdminPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [editFormData, setEditFormData] = useState({
    doctorName: '',
    patientName: '',
    patientID: '',
    appointmentTime: '',
    status: 'pending',
    declineReason: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/appointments');
      const formattedAppointments = response.data.map(app => ({
        ...app,
        title: app.PatientName,
        doctor: app.DoctorName,
        patientId: app.PatientID,
        start: new Date(app.AppointmentDate),
        end: new Date(new Date(app.AppointmentDate).getTime() + 60 * 60 * 1000)
      }));
      setAppointments(formattedAppointments);
      
      const unseenCount = response.data.filter(app => app.Seen === 0).length;
      alert(`There are ${unseenCount} unseen appointments`);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchAvailableDates = async (doctorID, patientID) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/availability/${doctorID}`, {
        params: { doctorID, patientID }
      });
      setAvailableDates(response.data);
    } catch (error) {
      console.error('Error fetching available dates:', error);
    }
  };

  const handleAppointmentSelect = async (appointment) => {
    setSelectedAppointment(appointment);
    await fetchAvailableDates(appointment.DoctorID, appointment.PatientID);
    console.log();
    setEditFormData({
      doctorName: appointment.DoctorName,
      patientName: appointment.PatientName,
      patientID: appointment.PatientID,
      appointmentTime: new Date(appointment.AppointmentDate).toISOString().slice(0, 16),
      status: 'pending',
      declineReason: ''
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleConfirm = async () => {
    const status = editFormData.status;
    try {
      if (status === 'approved') {
        await axios.put(`http://localhost:3000/api/admin/appointments/${selectedAppointment.AppointmentID}/seen`);
        alert('Appointment approved successfully');
      } 
      
      if (status === 'declined') {
        if (!editFormData.declineReason.trim()) {
          alert('Please provide a reason for declining the appointment.');
          return;
        }
  
        const response = await axios.delete(`http://localhost:3000/api/admin/appointments/${selectedAppointment.AppointmentID}`, {
          data: { 
            reason: editFormData.declineReason
          }
        });
        
        if (response.data.newAppointment) {
          alert(`Appointment cancelled and rescheduled for ${new Date(response.data.newAppointment.AppointmentDate).toLocaleString()}`);
        } else {
          alert('Appointment cancelled successfully');
        }
      }
      fetchAppointments();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
      if (error.response) {
        alert(`Error: ${error.response.data}`);
      } else if (error.request) {
        alert('No response received from server. Please try again.');
      } else {
        alert('An error occurred while updating the appointment. Please try again.');
      }
    }
  };

  const openCalendar = () => setShowCalendar(true);
  const closeCalendar = () => setShowCalendar(false);

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      maxHeight: '80vh',
      overflow: 'auto'
    }
  };

  return (
    <div className="admin-page-container">
      <button
        className="calendar-button"
        onClick={openCalendar}
        data-testid="open-calendar-button"
      >
        Open Calendar
      </button>

      <Modal
        isOpen={showCalendar}
        onRequestClose={closeCalendar}
        contentLabel="Calendar Modal"
        data-testid="calendar-modal"
      >
        <button
          onClick={closeCalendar}
          className="modal-close-button"
          data-testid="close-calendar-button"
        >
          Close
        </button>
        <Calendar
          events={appointments}
          onSelectEvent={handleAppointmentSelect}
          eventStyleGetter={(event) => ({
            style: {
              backgroundColor: event.Seen === 0 ? 'green' : 'blue',
              color: 'white',
              borderRadius: '0px',
              opacity: 0.8,
              display: 'block',
            }
          })}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        style={modalStyles}
        contentLabel="Edit Appointment Modal"
        data-testid="edit-appointment-modal"
      >
        <h2>Edit Appointment</h2>
        <form className="admin-form">
          <div className="form-group">
            <label htmlFor="doctorName">Doctor Name:</label>
            <span id="doctorName" data-testid="doctor-name">
              {editFormData.doctorName}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="patientName">Patient Name:</label>
            <span id="patientName" data-testid="patient-name">
              {editFormData.patientName}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="patientID">Patient ID:</label>
            <span id="patientID" data-testid="patient-id">
              {editFormData.patientID}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="appointmentTime">Appointment Time:</label>
            <span id="appointmentTime" data-testid="appointment-time">
              {new Date(editFormData.appointmentTime).toLocaleString()}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={editFormData.status}
              onChange={handleInputChange}
              data-testid="status-select"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          {editFormData.status === 'declined' && (
            <div className="form-group">
              <label htmlFor="declineReason">Reason for Declining:</label>
              <textarea 
                id="declineReason"
                name="declineReason" 
                value={editFormData.declineReason} 
                onChange={handleInputChange}
                required
                data-testid="decline-reason-textarea"
              />
            </div>
          )}
        </form>
        <div className="button-container">
          <button
            onClick={handleConfirm}
            data-testid="confirm-button"
          >
            Confirm
          </button>
          <button
            onClick={() => setIsEditModalOpen(false)}
            data-testid="cancel-button"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;