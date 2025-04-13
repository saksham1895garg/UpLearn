import React, { useContext, useEffect } from 'react'
import Navbar from '../components/navbar.jsx'
import Leaderboard from '../components/leaderboard.jsx'
import Footer from '../components/footer.jsx'
import { AppContent } from '../context/AppContext.js'

const Home = () => {
  const { userData, getUserData, isLoggedin } = useContext(AppContent);
  
  useEffect(() => {
    if (!userData && isLoggedin) {
      getUserData();
    }
  }, [userData, getUserData, isLoggedin]);

  console.log('userData in Home:', userData);
  
  return (
    <div>
        <Navbar/>
        <main className='home-main'>
          <div className="upper-main">
            <h3 className="site-description">Welcome to <span className='uni-name'>UniSathi</span> – a place where students connect to teach, learn, and grow together. Whether you’re here to share your knowledge or seek guidance from your peers, UniSathi is your go-to platform to make learning fun and collaborative.</h3>
            <button className="get-started">Get Started</button>
          </div>
          <div className="mid-main-cards">
            <div className="card-main">
              <h1>Study Groups</h1>
              <p>Join peer-led groups to discuss and solve academic problems together.</p>
            </div>
            <div className="card-main">
              <h1>1:1 Classes</h1>
              <p>Schedule personalized sessions with fellow students who can help you.</p>
            </div>
            <div className="card-main">
              <h1>College Resources</h1>
              <p>Schedule personalized sessions with fellow students who can help you.</p>
            </div>
            <div className="card-main">
              <h1>Tutors</h1>
              <p>Find and connect with student tutors from your university who are ready to help.</p>

            </div>
          </div>
          <div className="empow-out">
            <div className="empow">
              <h1>Empowering Student Tutors</h1>
              <p>At UniSathi, students who teach are rewarded for their time, effort, and quality. We evaluate based on number of sessions, class ratings, video quality, and student feedback. It’s more than just sharing knowledge — it’s a growing opportunity.</p>
              <div className="div-boxes-empow">
                <div className="empow-boxes">
                  <h1>Session Count</h1>
                  <p>Earn more as you help more students consistently.</p>
                </div>
                <div className="empow-boxes">
                  <h1>Student Reviews</h1>
                  <p>Get recognized for great teaching and positive feedback.</p>
                </div>
                <div className="empow-boxes">
                  <h1>Video & Audio Quality</h1>
                  <p>Higher quality content means higher rewards.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="leadboard-div-outer">
            <div className="leadboard-div">
              <h1>Top Students Tutors</h1>
              <Leaderboard/>
              
            </div>

          </div>
         

        </main>
        <footer className='home-footer'>
            <Footer/>
        </footer>
    </div>
  )
}

export default Home
