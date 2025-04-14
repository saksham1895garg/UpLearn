import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import Emailverify from "./pages/email-verify"
import ResetPassword from "./pages/reset-password"
import TutoringSession from "./pages/TutoringSession"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/email-verify" element={<Emailverify/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/session/:sessionId" element={<TutoringSession/>} />
      </Routes>
    </div>
  )
}

export default App
