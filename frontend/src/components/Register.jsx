import { useState } from 'react';
import styles from './Register.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' }); // isAdmin removed
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      Swal.fire({
        icon: 'success',
        title: 'Registered Successfully!',
        text: res.data.msg,
      });
      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.msg || 'Something went wrong',
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Register</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className={styles.passwordContainer}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
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

          <button type="submit" className="mt-3">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
