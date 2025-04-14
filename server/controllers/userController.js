import userModel from "../models/userSchema.js";

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
