import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './appointmentBooking.css';

const EditAppointmentModal = ({ editingAppointment, doctors, handleAppointmentUpdate, handleClose }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingAppointment) {
      setNotes(editingAppointment.Notes);
    }
  }, [editingAppointment]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleUpdateClick = () => {
    if (editingAppointment) {
      handleAppointmentUpdate({ ...editingAppointment, Notes: notes });
    }
  };

  if (!editingAppointment) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Appointment</h2>
        <p className="disabled-text">
          Date: {moment(editingAppointment.start).format('MMMM D, YYYY, h:mm a')}
        </p>
        <p className="disabled-text">
          Doctor: Dr. {doctors.find(d => d.DoctorID === editingAppointment.DoctorID)?.LastName}
        </p>
        <textarea
          rows='4'
          value={notes}
          onChange={handleNotesChange}
          placeholder="Appointment notes..."
        />
        <div className="modal-buttons">
          <button onClick={handleUpdateClick}>Update Appointment</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
