import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard'; // acts as layout
import ManageBuses from '../ManageBuses';
import ViewBookings from '../ViewBookings';
import BookingChart from '../BookingChart';

const AdminApp = () => {
  return (
    <Routes>
      
      <Route path="/" element={<AdminDashboard />}>
        <Route index element={<BookingChart />} />
        <Route path="dashboard" element={<BookingChart />} />
        <Route path="buses" element={<ManageBuses />} />
        <Route path="bookings" element={<ViewBookings />} />
      </Route>
    </Routes>
  );
};

export default AdminApp;
