import Home from '../components/home';
import AppointmentBooking from '../components/appointmentBooking';
import Admin from '../components/Admin';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/bookings',
    component: AppointmentBooking
  },
  {
    path: '/admin',
    component: Admin
  }
];

export default routes;