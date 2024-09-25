import React, { useState, useEffect } from 'react';
import './appointmentBooking.css';
import axios from 'axios';
import EditAppointmentModal from './EditAppointmentModal.jsx';
import Form from './Form.jsx';
import Calendar from './Calendar.jsx';

const AppointmentBooking = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [preferredDoctor, setPreferredDoctor] = useState(null);
  const [appointmentReason, setAppointmentReason] = useState('');
  const [patientId, setPatientId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);


  useEffect(() => {
    const fetchAvailability = async (doctorId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/availability/${doctorId}`, {
          params: { patientID: patientId, doctorID: doctorId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableDates(response.data.map(date => ({
          date: new Date(date),
          doctor: doctors.find(d => d.DoctorID === doctorId),
        })));
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };
  
    const fetchData = async () => {
      try {
        const userID = 1;
        const token = localStorage.getItem('token');
  
        const [doctorsResponse, patientResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/doctors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/api/patients/${userID}`, {
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
        params: { patientID: patientId, doctorID: doctorId},
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

  const handleDoctorSelect = async (event) => {
    const index = event.target.value;
    const doctor = doctors[index];
    setSelectedDoctor(doctor);
    setPreferredDoctor(doctor);
    fetchAvailability(doctor.DoctorID);
  };

  const handleDateSelect = (e) => {
    const selectedDate = new Date(e.target.value);
    setSelectedDate(selectedDate);
    setSelectedDoctor(
      availableDates.find((d) => d.date.toDateString() === selectedDate.toDateString())?.doctor
    );
  };

  const handleAppointmentSubmit = async () => {
    const token = localStorage.getItem('token');
    selectedDate.setHours(17, 0, 0, 0);

    const response = await axios.post('http://localhost:3000/api/appointments', {
      AppointmentDate: selectedDate.toISOString(),
      DoctorID: selectedDoctor.DoctorID,
      PatientID: patientId,
      STATUS: 'Scheduled',
      Notes: appointmentReason || 'Appointment',
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
  };

  const handleAppointmentUpdate = async (updatedAppointment) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`http://localhost:3000/api/updateAppointments/${updatedAppointment.AppointmentID}`, {
        Notes: updatedAppointment.Notes
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedApp = {
        ...updatedAppointment,
        Notes: response.data.Notes
      };

      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.AppointmentID === updatedApp.AppointmentID ? updatedApp : app
        )
      );

      setShowEditModal(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleAppointmentSelect = (appointment) => {
    setEditingAppointment(appointment);
    setShowEditModal(true);
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
    <div className="appointment-booking" style={{ display: 'flex', height: '90vh' }} data-testid="appointment-booking">
      <div className="left-side" style={{ flex: '1', overflowY: 'auto' }} data-testid="left-side">
        <Form
          preferredDoctor={preferredDoctor}
          doctors={doctors}
          availableDates={availableDates}
          selectedDate={selectedDate}
          appointmentReason={appointmentReason}
          onDoctorSelect={handleDoctorSelect}
          onDateSelect={handleDateSelect}
          onReasonChange={(e) => setAppointmentReason(e.target.value)}
          onSubmit={handleAppointmentSubmit}
          submitButtonText="Submit Appointment"
        />
      </div>
      <div className="right-side" style={{ flex: '1', height: '100%' }} data-testid="right-side">
        <Calendar
          events={appointments}
          onSelectEvent={handleAppointmentSelect}
          eventStyleGetter={eventStyleGetter}
        />
      </div>
      {showEditModal && (
        <EditAppointmentModal
          editingAppointment={editingAppointment}
          doctors={doctors}
          handleAppointmentUpdate={handleAppointmentUpdate}
          handleClose={() => setShowEditModal(false)}
          data-testid="edit-appointment-modal"
        />
      )}
    </div>
  );
};

export default AppointmentBooking;