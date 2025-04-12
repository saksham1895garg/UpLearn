import React from 'react'
import { assets } from '../assets/assets.js'

const Navbar = () => {
  return (
    <div className='main-upper-nav'>
      <div className="upper-inner-nav-1">
        <img src={assets.logo} alt="" className='main-logo'/>
      </div>
      <div className="upper-inner-nav-2">
        <a href="/about" className="upper-inner-links"><button className='btn-upper btn-primary'>About Us</button></a>
        <a href="/contact" className="upper-inner-links"> <button className='btn-upper btn-primary'>Contact Us</button></a>
        <a href="blog" className="upper-inner-links"><button className='btn-upper btn-primary'>Blog</button></a>
        <a href="/courses" className="upper-inner-links"><button className='btn-upper btn-primary'>Courses</button></a>        
      </div>
      <div className="upper-inner-nav-3">
          <a href="/login" className="user-btn-a"><button className='btn-user'>Login</button></a>
          <a href="/register" className="user-btn-a"><button className='btn-user-sign'>Sign Up</button></a>
          
          
      </div>
      
    </div>
  )
}

export default Navbar
