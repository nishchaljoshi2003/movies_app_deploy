import React, { useState } from 'react';
import './Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Navbar from './navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.firstName) {
      tempErrors.firstName = 'First Name is required';
      isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(formData.firstName)) {
      tempErrors.firstName = 'First Name should only contain alphabets';
      isValid = false;
    }

    if (!formData.lastName) {
      tempErrors.lastName = 'Last Name is required';
      isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(formData.lastName)) {
      tempErrors.lastName = 'Last Name should only contain alphabets';
      isValid = false;
    }

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
    } else if (formData.password.length < 8) {
      tempErrors.password = 'Password should be at least 8 characters';
      isValid = false;
    }

    if (!formData.age) {
      tempErrors.age = 'Age is required';
      isValid = false;
    } else if (!/^\d+$/.test(formData.age)) {
      tempErrors.age = 'Age should be numeric';
      isValid = false;
    } else if (formData.age < 18) {
      tempErrors.age = 'User should be at least 18 years old';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('https://movies-app-api.vercel.app/api/register', {
          email: formData.email,
          password: formData.password,
          age: formData.age,
        });

        if (response.status === 201) {
          toast.success('Sign up successful!');
          setTimeout(() => {
            navigate('/signin');
          }, 2000); // Wait for 2 seconds before redirecting
        }
      } catch (error) {
        console.error('Error registering user:', error);
        toast.error('Error registering user. Please try again.');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className='signup-wrapper'>
        <div className="signup-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className='nameContainer'>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <span className="error">{errors.firstName}</span>
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <span className="error">{errors.lastName}</span>
              </div>
            </div>
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
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className='passwordh'
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={toggleShowPassword}
                  className="password-icon"
                />
              </div>
              <span className="error">{errors.password}</span>
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="text"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleChange}
              />
              <span className="error">{errors.age}</span>
            </div>
            <div className="form-group">
              <button type="submit" className="submit-button">Sign Up</button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
