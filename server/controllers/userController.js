import userModel from "../models/userSchema.js";
import { v4 as uuidv4 } from 'uuid';

export const getUserData = async (req, res) => {
    try {
        console.log('Cookies received:', req.cookies);
        console.log('User from middleware:', req.user);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Construct complete URL for profile picture
        const fullProfilePicUrl = user.profilePicture ? `http://localhost:4000${user.profilePicture}` : '';
        console.log('Full profile picture URL:', fullProfilePicUrl);

        const userData = {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            isAccountVerified: user.isAccountVerified,
            email: user.email,
            university: user.university,
            profilePicture: fullProfilePicUrl
        };

        console.log('User data being sent:', userData);

        res.json({
            success: true,
            userData
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        console.log(error.message);
    }
};

export const startSession = async (req, res) => {
    try {
        const userId = req.user.userId;
        const newSession = {
            sessionId: uuidv4(),
            date: new Date(),
            duration: 0 // Will be updated when session ends
        };

        await userModel.findByIdAndUpdate(
            userId,
            { $push: { sessions: newSession } },
            { new: true }
        );

        res.status(200).json({ 
            success: true, 
            sessionId: newSession.sessionId,
            message: "Session started successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error starting session",
            error: error.message 
        });
    }
};

export const endSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sessionId, rating, review } = req.body;
        
        // Find the session in either tutor or student's records
        const user = await userModel.findOne({
            "sessions.sessionId": sessionId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        const session = user.sessions.find(s => s.sessionId === sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        const duration = Math.round((new Date() - new Date(session.startTime)) / 60000); // Convert to minutes

        // Update session with end time, duration, and review if provided
        const updateData = {
            "sessions.$.status": "completed",
            "sessions.$.endTime": new Date(),
            "sessions.$.duration": duration
        };

        if (rating) updateData["sessions.$.rating"] = rating;
        if (review) updateData["sessions.$.review"] = review;

        await userModel.updateOne(
            { 
                "sessions.sessionId": sessionId
            },
            { $set: updateData }
        );

        res.status(200).json({
            success: true,
            message: "Session ended successfully",
            duration,
            rating,
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error ending session",
            error: error.message
        });
    }
};

export const createVideoSession = async (req, res) => {
    try {
        const tutorId = req.user.id;
        const sessionId = uuidv4();
        const { title, description, scheduledTime } = req.body;

        // Verify user is a tutor
        const tutor = await userModel.findById(tutorId);
        if (!tutor.isTutor) {
            return res.status(403).json({
                success: false,
                message: "Only tutors can create sessions"
            });
        }

        const newSession = {
            sessionId,
            title,
            description,
            scheduledTime: new Date(scheduledTime),
            tutorId,
            status: 'scheduled',
            startTime: null,
            endTime: null,
            duration: 0,
            review: '',
            rating: 0
        };

        await userModel.findByIdAndUpdate(
            tutorId,
            { $push: { sessions: newSession } }
        );

        res.status(200).json({
            success: true,
            sessionId,
            message: "Session created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating session",
            error: error.message
        });
    }
};

export const joinVideoSession = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { sessionId } = req.params;

        // Find tutor with this session
        const tutor = await userModel.findOne({
            "sessions.sessionId": sessionId
        });

        if (!tutor) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        const session = tutor.sessions.find(s => s.sessionId === sessionId);

        if (session.status !== 'scheduled') {
            return res.status(400).json({
                success: false,
                message: "Session is not available"
            });
        }

        // Update session status and add student
        await userModel.updateOne(
            { 
                _id: tutor._id,
                "sessions.sessionId": sessionId
            },
            {
                $set: {
                    "sessions.$.status": "active",
                    "sessions.$.studentId": studentId,
                    "sessions.$.startTime": new Date()
                }
            }
        );

        res.status(200).json({
            success: true,
            sessionId,
            tutorId: tutor._id,
            message: "Joined session successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error joining session",
            error: error.message
        });
    }
};
