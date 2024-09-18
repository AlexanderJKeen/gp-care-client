import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './appointmentBooking.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const AppointmentBooking = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [preferredDoctor, setPreferredDoctor] = useState(null);
  const [appointmentReason, setAppointmentReason] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = 1;
        const token = localStorage.getItem('token');

        const [doctorsResponse, patientResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/doctors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/api/patients/1`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDoctors(doctorsResponse.data);

        const patient = patientResponse.data[0];
        setPatientId(patient.PatientID);

        const preferredDoctor = doctorsResponse.data.find(
          (doctor) => doctor.DoctorID === patient.PreferredDoctorID
        );
        if (preferredDoctor) {
          setPreferredDoctor(preferredDoctor);
          setSelectedDoctor(preferredDoctor);
          fetchAvailability(preferredDoctor.DoctorID);
        }

        fetchAppointments(patient.PatientID);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchAppointments = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/appointments/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data.map(app => ({
        ...app,
        start: new Date(app.AppointmentDate),
        end: new Date(app.AppointmentDate),
      })));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchAvailability = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/availability/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableDates(response.data.map(date => ({
        date: new Date(date),
        doctor: doctors.find(d => d.DoctorID === doctorId)
      })));
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleAppointmentSelect = (appointment) => {
    setEditingAppointment(appointment);
    setShowEditModal(true);
  };

  const handleDoctorSelect = async (event) => {
    const index = event.target.value;
    const doctor = doctors[index];
    setSelectedDoctor(doctor);
    setPreferredDoctor(doctor);
    fetchAvailability(doctor.DoctorID);
  };

  const handleImageUploadClick = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUploadModalClose = () => {
    setShowImageUploadModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUploadedImage(file);
    setShowImageUploadModal(false);
  };

  const handleAppointmentSubmit = async () => {
    const token = localStorage.getItem('token');

    const response = await axios.post('http://localhost:3000/api/appointments', {
      AppointmentDate: selectedDate.toISOString().slice(0, 10),
      DoctorID: selectedDoctor.DoctorID,
      PatientID: patientId,
      STATUS: 'Scheduled',
      Notes: appointmentReason || 'Appointment',
      Image: uploadedImage || null,
      Seen: 0,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setAppointments([...appointments, {
      ...response.data,
      start: new Date(response.data.AppointmentDate),
      end: new Date(response.data.AppointmentDate),
    }]);
    setSelectedDate(null);
    setSelectedDoctor(null);
    setAppointmentReason('');
    setUploadedImage(null);
  };

 
  const handleAppointmentUpdate = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`http://localhost:3000/api/updateAppointments/${editingAppointment.AppointmentID}`, {
        Notes: editingAppointment.Notes
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedAppointment = {
        ...editingAppointment,
        Notes: response.data.Notes
      };

      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.AppointmentID === updatedAppointment.AppointmentID ? updatedAppointment : app
        )
      );

      setShowEditModal(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const EditAppointmentModal = () => {
    if (!editingAppointment) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Appointment</h2>
          <p className="disabled-text">Date: {moment(editingAppointment.start).format('MMMM D, YYYY, h:mm a')}</p>
          <p className="disabled-text">Doctor: Dr. {doctors.find(d => d.DoctorID === editingAppointment.DoctorID)?.LastName}</p>
          <textarea
            value={editingAppointment.Notes}
            onChange={(e) => setEditingAppointment({ ...editingAppointment, Notes: e.target.value })}
            placeholder="Appointment notes..."
          />
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={editingAppointment.Seen === 1}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, Seen: e.target.checked ? 1 : 0 })}
                />
                Seen
              </label>
            </div>
          <div className="modal-buttons">
            <button onClick={handleAppointmentUpdate}>Update Appointment</button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = event.Seen === 0 ? '#28a745' : '#007bff';
    return {
      style: {
        backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="appointment-booking">
      <div className="left-side">
        <div className="preferred-doctor">
          <h3>Preferred Doctor</h3>
          {preferredDoctor ? (
            <p>
              Dr. {preferredDoctor.LastName} - {preferredDoctor.Specialty}
            </p>
          ) : (
            <select onChange={handleDoctorSelect}>
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
          <h3>Available Dates</h3>
          <div>
            <label htmlFor="date-select">Select a date:</label>
            <select
              id="date-select"
              value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setSelectedDate(selectedDate);
                setSelectedDoctor(
                  availableDates.find((d) => d.date.toDateString() === selectedDate.toDateString())?.doctor
                );
              }}
            >
              <option value="">Choose a date</option>
              {availableDates.map((availableDate, index) => (
                <option key={index} value={availableDate.date.toISOString().slice(0, 10)}>
                  {moment(availableDate.date).format('MMMM D, YYYY')}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="notes-section">
          <h3>Appointment Notes</h3>
          <textarea
            rows="4"
            value={appointmentReason}
            onChange={(e) => setAppointmentReason(e.target.value)}
            placeholder="Type your notes here..."
          />
        </div>
        <div className="image-upload">
          <h3>Upload Image</h3>
          <button onClick={handleImageUploadClick}>Upload Image</button>
          {showImageUploadModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={handleImageUploadModalClose}>
                  &times;
                </span>
                <div
                  className="drop-zone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImageUpload(e);
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  {uploadedImage ? (
                    <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" />
                  ) : (
                    <p>Drop or click to upload an image</p>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <button className="submit-appointment" onClick={handleAppointmentSubmit}>
          Submit Appointment
        </button>
      </div>
      <div className="right-side">
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          titleAccessor="Notes"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleAppointmentSelect}
          eventPropGetter={eventStyleGetter}
        />
      </div>
      {showEditModal && <EditAppointmentModal />}
    </div>
  );
};

export default AppointmentBooking;