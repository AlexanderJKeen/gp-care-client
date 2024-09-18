import Home from '../components/home';
import AppointmentBooking from '../components/appointmentBooking';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/bookings',
    component: AppointmentBooking
  }
];

export default routes;