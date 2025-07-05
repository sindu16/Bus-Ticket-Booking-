import  { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showAdminCheckbox, setShowAdminCheckbox] = useState(false);

  const navigate = useNavigate();
  // const location = useLocation();

  // const bus = location.state || JSON.parse(localStorage.getItem('busDetails')) || {};

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Show admin checkbox only if email contains "admin"
    const adminPattern = /admin/i;
    setShowAdminCheckbox(adminPattern.test(value));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const isAdminEmail = /admin/i.test(email);

    // Prevent admin login without checking the box
    if (isAdminEmail && !isAdminLogin) {
      Swal.fire({
        icon: 'warning',
        title: 'Admin Login Required',
        text: 'Please check "Login as Admin" to proceed as admin.',
      });
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        isAdmin: isAdminLogin,
      });

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: res.data.message,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isAdmin', res.data.isAdmin);

      if (res.data.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/tickets', {
          // state: {
          //   from: bus.from,
          //   to: bus.to,
          //   departure: bus.departure || bus.time,
          //   arrival: bus.arrival || bus.arrive,
          //   price: bus.price,
          //   bus: bus.busno || bus.bus,
          //   company: bus.company,
          //   duration: bus.duration,
          //   amPmArrival: bus.amPmArrival,
          //   amPmDeparture: bus.amPmDeparture,
          //   busType: bus.busType,
          // },
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className={styles.container}>
        <form onSubmit={handleLogin} className={styles.form}>
          <h2>Login</h2>

          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            required
          />

          <div className={styles.passwordContainer}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              type="button"
              className={styles.togglePasswordBtn}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {showAdminCheckbox && (
            <label className="mt-2">
              <input
                type="checkbox"
                checked={isAdminLogin}
                onChange={(e) => setIsAdminLogin(e.target.checked)}
              />
              &nbsp; Login as Admin
            </label>
          )}

          <button type="submit" className="mt-3">Login</button>

          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-danger">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

