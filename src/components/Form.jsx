import React from 'react';
import moment from 'moment';
import './appointmentBooking.css';

const Form = ({
  preferredDoctor,
  doctors,
  availableDates,
  selectedDate,
  appointmentReason,
  onDoctorSelect,
  onDateSelect,
  onReasonChange,
  onSubmit,
  submitButtonText
}) => {
  return (
    <div className="form-container">
      <div className="preferred-doctor">
        <h3>Preferred Doctor</h3>
        <br/>
        {preferredDoctor ? (
          <p>
            Dr. {preferredDoctor.LastName} - {preferredDoctor.Specialty}
          </p>
        ) : (
          <select onChange={onDoctorSelect}>
            <option value="">Select a doctor</option>
            {doctors.map((doctor, index) => (
              <option key={doctor.DoctorID} value={index}>
                Dr. {doctor.LastName} - {doctor.Specialty}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="available-dates">
      <br/>
        <h3>Available Dates</h3>
        <br/>
        <div>
          <label htmlFor="date-select">Select a date:</label>
          <br/>
          <select
            id="date-select"
            value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
            onChange={onDateSelect}
          >
            <option value="">Choose a date</option>
            {availableDates.map((availableDate, index) => (
              <option key={index} value={availableDate.date.toISOString().slice(0, 10)}>
                {moment(availableDate.date).format('MMMM D, YYYY')}
              </option>
            ))}
          </select>
          <br/>
        </div>
      </div>
      <div className="notes-section">
      <br/>
        <h3>Appointment Notes</h3>
        <br/>
        <textarea
          rows="4"
          value={appointmentReason}
          onChange={onReasonChange}
          placeholder="Type your notes here..."
        />
      </div>
      <br/>
      <button className="submit-appointment" onClick={onSubmit}>
        {submitButtonText || 'Submit Appointment'}
      </button>
    </div>
  );
};

export default Form;