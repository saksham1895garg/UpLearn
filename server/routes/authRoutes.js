import express from 'express';


import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifiedEmail } from '../controllers/authControllers.js';
import userAuth from '../middleware/userAuth.js'
import profile from '../controllers/authControllers.js';



const authRouter = express.Router();    

authRouter.post('/register', profile.single('profilePicture'), register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifiedEmail);
authRouter.post('/verify-account', userAuth, verifiedEmail);
authRouter.route('/is-auth')
    .get(userAuth, isAuthenticated)
    .post(userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
