// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';

// const EditAppointmentModal = ({ editingAppointment, handleEditChange, handleAppointmentUpdate, setShowEditModal }) => {
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [notes, setNotes] = useState('');
//   const [seen, setSeen] = useState(false);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/doctors');
//         setDoctors(response.data);
//         const doctor = response.data.find(d => d.DoctorID === editingAppointment.DoctorID);
//         setSelectedDoctor(doctor);
//         setNotes(editingAppointment.Notes || '');
//         setSeen(editingAppointment.Seen === 1);
//       } catch (error) {
//         console.error('Error fetching doctors:', error);
//       }
//     };

//     fetchDoctors();
//   }, [editingAppointment]);

//   const handleSave = () => {
//     handleEditChange('DoctorID', selectedDoctor.DoctorID);
//     handleEditChange('Notes', notes);
//     handleEditChange('Seen', seen ? 1 : 0);
//     handleAppointmentUpdate();
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={() => setShowEditModal(false)}>
//           &times;
//         </span>
//         <h2>Edit Appointment</h2>
//         <div className="form-group">
//           <label htmlFor="doctor-select">Doctor</label>
//           <select
//             id="doctor-select"
//             value={selectedDoctor ? selectedDoctor.DoctorID : ''}
//             onChange={(e) => {
//               const doctor = doctors.find(d => d.DoctorID === parseInt(e.target.value));
//               setSelectedDoctor(doctor);
//             }}
//           >
//             <option value="">Select a doctor</option>
//             {doctors.map(doctor => (
//               <option key={doctor.DoctorID} value={doctor.DoctorID}>
//                 Dr. {doctor.LastName} - {doctor.Specialty}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label htmlFor="notes">Notes</label>
//           <textarea
//             id="notes"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="seen">Seen</label>
//           <input
//             type="checkbox"
//             id="seen"
//             checked={seen}
//             onChange={() => setSeen(!seen)}
//           />
//         </div>
//         <button onClick={handleSave}>Save</button>
//       </div>
//     </div>
//   );
// };

// EditAppointmentModal.propTypes = {
//   editingAppointment: PropTypes.object.isRequired,
//   handleEditChange: PropTypes.func.isRequired,
//   handleAppointmentUpdate: PropTypes.func.isRequired,
//   setShowEditModal: PropTypes.func.isRequired,
// };

// export default EditAppointmentModal;
