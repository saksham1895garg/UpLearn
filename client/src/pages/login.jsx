import React, { useState } from 'react'
import Navbar from '../components/navbar'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContent } from '../context/AppContext.js';
import axios from 'axios';
import {toast} from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();
  const{backendUrl, setisLoggedin, getUserData} = useContext(AppContent);

  const [state, setState] = useState('Sign Up')
  const[firstname, setFirstName] = useState('')
  const[lastname, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [university, setUniversity] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)

  const universities = [
    { name: 'UPES', emailFormat: '@stu.upes.ac.in' },
    { name: 'Uttaranchal University', emailFormat: '@uttaranchal.ac.in' },
    { name: 'IIT Roorkee', emailFormat: '@iitr.ac.in' }
  ];

  const validateEmail = (email, university) => {
    if (!university) return true;
    const selectedUniv = universities.find(u => u.name === university);
    return email.endsWith(selectedUniv.emailFormat);
  };

  const handleUniversityChange = (e) => {
    const selectedUniversity = e.target.value;
    setUniversity(selectedUniversity);
    // Clear email if it doesn't match the new university format
    if (email && !validateEmail(email, selectedUniversity)) {
      setEmail('');
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    // Always allow typing, validation will be handled by the input pattern
    setEmail(newEmail);
  };

  const onSubmitHandler = async(e) => {
    try {
      e.preventDefault();

      // Check all required fields for Sign Up
      if (state === "Sign Up") {
        if (!firstname.trim() || !lastname.trim() || !username.trim() || !email.trim() || !password.trim() || !university) {
          toast.error("Please fill all fields");
          return;
        }

        // Get confirm password value
        const confirmPassword = document.querySelector('.conpass-input').value;
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
      } else {
        // Check required fields for Login
        if (!email.trim() || !password.trim()) {
          toast.error("Please fill all fields");
          return;
        }
      }

      axios.defaults.withCredentials = true
      if (state === "Sign Up") {
        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('university', university);
        if (profilePicture) {
          formData.append('profilePicture', profilePicture);
        }

        const { data } = await axios.post(backendUrl + '/api/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (data.success) {
          setisLoggedin(true);
          getUserData()
          toast.success(data.message || "Registration Successful");
          setTimeout(() => navigate('/'), 1000);
        } else {
          toast.error(data.message || "Registration Failed");
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });
        if (data.success) {
          setisLoggedin(true);
          getUserData()
          toast.success(data.message || "Login Successful");
          setTimeout(() => navigate('/'), 1000);
        } else {
          toast.error(data.message || "Login Failed");
        }
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log('Error response:', error.response.data);
        console.log('Status:', error.response.status);
        console.log('Headers:', error.response.headers);
        toast.error(error.response.data.message || "Login Failed");
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Error request:', error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        console.log('Error message:', error.message);
        toast.error("Login Failed: " + error.message);
      }
    }
  }

  return (
    <div>
      <Navbar/>
    
    <div className="outer-user-verify">
      <div className='user-verify-page-inner'>
        <h1 className='upper-reg-h1'>{state === "Sign Up" ? "Sign Up for UniSathi" : "Login"}</h1>

        <div className='form-registration'>
          <form onSubmit={onSubmitHandler}>
            {state === 'Sign Up' && (
              <>
                <div className="userfirstname-div user-verify-input-div">
                  <input onChange={e => setFirstName(e.target.value)} value={firstname} className='name-reg firstname-input' type="text" placeholder="First Name" required />
                  <input onChange={e => setLastName(e.target.value)} value={lastname} className='name-reg lastname-input' type="text" placeholder='Last Name' required />
                </div>
                <div className="username-div user-verify-input-div">
                  <input onChange={e => setUsername(e.target.value)} value={username} className='name-reg username-reg username-input' type="text" placeholder='Username' required />
                </div>
                <div className="profile-picture-div user-verify-input-div">
                  <input 
                    placeholder='Profile Picture'
                    type="file" 
                    onChange={e => setProfilePicture(e.target.files[0])} 
                    className='name-reg profile-picture-input' 
                    accept="image/*"
                  />
                </div>
              </>
            )}
            <div className="university-selector">
              {state === 'Sign Up' && (
                <select 
                  onChange={handleUniversityChange} 
                  value={university} 
                  className='university-select' 
                  required
                >
                  <option value="">Select University</option>
                  {universities.map(univ => (
                    <option key={univ.name} value={univ.name}>{univ.name}</option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="user-email-div user-verify-input-div">
              <input 
                onChange={handleEmailChange}
                value={email} 
                className='name-reg email-reg email-input' 
                type="email" 
                placeholder={state === 'Sign Up' && university ? `College Email (${universities.find(u => u.name === university)?.emailFormat})` : 'Email'} 
                required 
                pattern={state === 'Sign Up' && university ? `.*${universities.find(u => u.name === university)?.emailFormat}$` : undefined}
              />
            </div>
            <div className="password-div user-verify-input-div">
              <input onChange={e => setPassword(e.target.value)} value={password} className='name-reg password-reg password-input' type="password" placeholder='Password' required />
            </div>
            
            {state === 'Sign Up' ? (
              <>
              <div className="conpass user-verify-input-div">
              <input className='name-reg conpass-reg conpass-input' type="password" placeholder='Confirm Password' required />
            </div>
            
              </>
            ): (
              <>
              <h4 onClick={()=> navigate('/reset-password')} className="forgot">Forgot Password?</h4>
              </>
            )}
            
            <div className="user-verify-btn-div">
              <button className='btn-user-verify' type='submit'>{state === "Sign Up" ? "Sign Up" : "Login"}</button>
            </div>

          </form>
        </div>
        {state === "Sign Up" ? (
          <>
            <h4  className="already">Already have an account?{' '} <span onClick={()=>setState('login')}><h4>Login</h4></span></h4>
          </>
        ): (
          <>
            <h4 className="already">Don't have an account{' '} <span onClick={()=>setState('Sign Up')}><h4>Sign Up</h4></span></h4>
          </>
        )}
      </div>
    </div>
    </div>
  )
}

export default Login
