// src/components/LoginPage.js
import React, { useState } from 'react';
import { useAppContext } from './AppContext'; 
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAppContext(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ usernameErr: '', passwordErr: '', generalErr: '' });
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    setError({ usernameErr: '', passwordErr: '', generalErr: '' });

    let isValid = true;

    if (username === '') {
      setError((prevState) => ({ ...prevState, usernameErr: 'Please enter a username.' }));
      isValid = false;
    }

    if (password === '') {
      setError((prevState) => ({ ...prevState, passwordErr: 'Please enter a password.' }));
      isValid = false;
    }

    if (isValid) {
      const isLoggedIn = login(username, password);
      console.log('isLoggedIn', isLoggedIn);
      if (isLoggedIn) {
        navigate('/tasks');
      } else {
        setError((prevState) => ({ ...prevState, generalErr: 'Invalid username or password' }));
      }
    }
  };

  return (
    <div className='login-style'>
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-style'>
          <label>Username</label>
          <input
            type="text" className='login-input' 
            minLength={2}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error.usernameErr && <p className="error-message">{error.usernameErr}</p>}
        </div>
        <div className='form-style'>
          <label>Password</label>
          <input
            type="password" className='login-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.passwordErr && <p className='error-message'>{error.passwordErr}</p>}
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      {error.generalErr && <p className='error-message'>{error.generalErr}</p>}
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
