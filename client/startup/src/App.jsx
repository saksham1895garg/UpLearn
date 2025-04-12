import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import Emailverify from "./pages/email-verify"
import ResetPassword from "./pages/reset-password"

function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/email-verify" element={<Emailverify/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </div>
  )
}

export default App
