import React, { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext.js'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedin, setisLoggedin, setUserData, backendUrl } = useContext(AppContent);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setisLoggedin(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='main-upper-nav'>
      <div className="upper-inner-nav-1">
        <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='main-logo'/>
      </div>
      <div className="upper-inner-nav-2">
        <a href="/about" className="upper-inner-links"><button className='btn-upper btn-primary'>About Us</button></a>
        <a href="/tutors" className="upper-inner-links"><button className='btn-upper btn-primary'>Tutors</button></a>
        <a href="blog" className="upper-inner-links"><button className='btn-upper btn-primary'>Blog</button></a>
        <a href="/courses" className="upper-inner-links"><button className='btn-upper btn-primary'>Courses</button></a>        
      </div>
      <div className="upper-inner-nav-3">
        {isLoggedin ? (
          <button onClick={handleLogout} className='btn-user'>Logout</button>
        ) : (
          <>
            <button onClick={()=>navigate("/login")} className='btn-user'>Login</button>
            <button onClick={()=>navigate("/register")} className='btn-user-sign'>Sign Up</button>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
