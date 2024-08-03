import React, { useState } from 'react';
import './SignIn.css';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId); 
            localStorage.setItem('email',data.email);
            toast.success('Login successful!');
            setTimeout(() => {
                navigate('/');
            }, 2000); // Wait for 2 seconds before redirecting
        } catch (error) {
            console.error('Error during sign in:', error);
            toast.error('Login failed. Please try again.');
        }
    }
};

  return (
    <div>
      <Navbar />
      <div className="signin-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            <span className="error">{errors.email}</span>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            <span className="error">{errors.password}</span>
          </div>
          {errors.server && <span className="error">{errors.server}</span>}
          <div className="form-group">
            <button type="submit" className="submit-button">Sign In</button>
          </div>
        </form>
        <div className="signup-link">
          New User? <a href='/signup'>Sign up now</a>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
