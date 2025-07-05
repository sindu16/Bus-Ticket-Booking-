import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import Navbar from './components/Navbar.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Homepage1 from './Pages/Homepage1.jsx';
import SearchResults from './components/SearchResults.jsx';
import Sectionpage2 from './Pages/Sectionpage2.jsx';
import BusDetails from './components/BusDetails.jsx';
import Bookingpage3 from './Pages/Bookingpage3.jsx';
import PassengerDetails from './components/PassengerDetails.jsx';
import Invoice from './components/Invoice.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminApp from './Adminpanel/Adminroutes/AdminApp.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
      
        <Navbar />
        <Routes>
          <Route path='/' element={<Homepage1 />} />
          <Route path='/service' element={<Sectionpage2 />} />
          <Route path='/tickets' element={<SearchResults />} />
          <Route path='/seats' element={<Bookingpage3 />} />
          <Route path='/bus' element={<BusDetails />} />
          <Route path='/passenger' element={<PassengerDetails />} />
          <Route path='/invoice' element={<Invoice />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/admin/*' element={<AdminApp />} /> 
        </Routes>
      
      <Footer />
    </BrowserRouter>
  );
}

export default App;





