import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from 'multer';
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// models import
import userModel from '../models/userSchema.js';
import transporter from "../config/nodeMailer.js";

var profilePic = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads')); // Ensure this path exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const profile = multer({
    storage: profilePic, 
    limits: { fileSize: 1000000 * 1 }, // 1MB limit
    fileFilter: function (req, file, cb) { 
        const allowedExtensions = /\.(png|jpe?g|gif)$/i;
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif'];
        if (!allowedExtensions.test(file.originalname) || !allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

export default profile;

export const register = async(req, res) => {
    console.log('Registration request received:', { body: req.body, file: req.file });
    const { firstname, lastname, username, email, password, university } = req.body;

    if(!firstname || !lastname || !username || !email || !password || !university){
        return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }; 
    try {
        console.log('Checking for existing user...');
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        };

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle profile picture
        let profilePicture = '';
        if (req.file) {
            profilePicture = `/uploads/${req.file.filename}`;
            console.log('Profile picture path set to:', profilePicture);
        }

        console.log('Creating new user...');
        const user = new userModel({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            profilePicture,
            university
        });
        await user.save();
        console.log('User saved successfully with profile:', user.profilePicture);

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        console.log('Setting cookie...');
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        try {
            console.log('Sending verification email...');
            // Send verification email  
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Verify your account",
                html: `<h1>Welcome ${firstname} ${lastname}</h1>
                       <p>Click <a href="${process.env.CLIENT_URL}/verify/${token}">here</a> to verify your account</p>`
            };
            await transporter.sendMail(mailOptions);
            console.log('Verification email sent successfully');
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue with registration even if email fails
        }

        console.log('Sending success response...');
        return res.json({success: true, message: "Registration Successful"});

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const login = async(req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.json({success: false, message:"Email and Password Required"});
    }
    try {
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "Enter valid email and password"});
        };
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message: "Enter valid email and password"});
        };
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        console.log('Setting cookie with token:', token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.json({success: true, message: "Login Success"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    };
};

export const logout = async(req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({success: true, message: "Logout Success"});
    } catch (error) {
        return res.json({success: false, message: error.message});
        
    }
};


// send verfication OTP to user Email
export const sendVerifyOtp = async(req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Request body is missing" });
        }

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId in request body" });
        }

        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.json({ success: true, message: "Account Already Verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verify your account",
            html: `<h1>Welcome ${user.firstname} ${user.lastname} to StartUp</h1>
                   <p>Your OTP is ${otp}. Verify your account to become our member.</p>`
        };
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifiedEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing Details" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not Found" });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: 'OTP expired'
            });
        }
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({ success: true, message: "Email Verified True" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
// Check if user is authenticated
export const isAuthenticated = async(req, res) => {
    try {
        return res.json({ success: true, message: "User is authenticated" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        
    }

};
export const sendResetOtp = async(req, res) => {
    const {email} = req.body; 
    if(!email){
        return res.status(400).json({success: false, message: "Email Required"});
    }
    try {
         const user = await userModel.findOne({email});
         if(!user){
            return res.status(400).json({success: false, message: "User not Found, Please Register"});
         };
         const otp = String(Math.floor(100000 + Math.random() * 900000));
         user.resetOtp = otp;
         user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

         await user.save();

         const mailOptions = {
             from: process.env.SENDER_EMAIL,
             to: user.email,
             subject: "Password Reset OTP",
             html: `<h1>Here is your Reset OTP, ${user.firstname} ${user.lastname} to StartUp</h1>
                    <p>Your OTP is ${otp}.</p>`
         };
         await transporter.sendMail(mailOptions);
         return res.status(200).json({success: true, message: "OTP sent to email"});

    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
};

// reset user password

export const resetPassword = async(req, res) => {
    const {email, otp, newpassword} = req.body;

    if(!email || !otp || !newpassword){
        return res.status(400).json({success: false, message: "All Fields Required"}); 
        
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "User not Found, Please Register"});
        }
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.status(400).json({success: false, message: "Invalid OTP"});

        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.status(400).json({success: false, message: "OTP expired"});
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();
        res.status(200).json({success: true, message: "Password Reset Success"});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
};