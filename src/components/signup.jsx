import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const { signUp } = useAppContext(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate()
  const [error, setError] = useState({
    usernameErr: '',
    passwordErr: '',
    confirmPasswordErr: ''
  })

  const validate = ()=> {
    let isValid = true;
    let errors = {};
    if(username=='')
    {
        errors.usernameErr = 'Please Enter User Name'
        isValid=false;
    }
    if(password==''){
        errors.passwordErr = 'Please Enter Password'
        isValid=false;
    }

    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(!passwordRegex.test(password)){
        errors.passwordErr = 'Please Enter Valid Password'
        isValid=false;
    }

    if(confirmPassword==''){
        errors.confirmPasswordErr = 'Please Enter Confirm Password'
        isValid=false;
    }
    if((password && confirmPassword) && password!==confirmPassword){
        errors.confirmPasswordErr = 'Password and Confirm Password does not match'
        isValid=false;
    }
    setError(errors)
    return isValid;
}

const handleSubmit = (e) => {
    e.preventDefault();
    if(validate()){
        let isSignedUp = signUp(username, password); 
        if(isSignedUp){
            navigate("/");
        }
    }
}

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords don't match");
//       return;
//     }
//     let isSignedUp = signUp(username, password);
//     if(isSignedUp){
//         navigate("/");
//     }
//   };

  return (
    <div className='login-style'>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-style'>
          <label>Username</label>
          <input type="text" className='login-input'
            value={username} minLength={2}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className='error-message'>{error.usernameErr}</p>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password" className='login-input'
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <p className='error-message'>{error.passwordErr}</p>
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password" className='login-input'
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <p className='error-message'>{error.confirmPasswordErr}</p>
        </div>
        <button type="submit" className='login-button'>Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
