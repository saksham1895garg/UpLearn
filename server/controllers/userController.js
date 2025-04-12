import userModel from "../models/userSchema.js";

export const getUserData = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Request body is missing" });
        }

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId in request body" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            userData: {
                username: user.username,
                isAccountVerified: user.isAccountVerified,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        console.log(error.message);
    }
};
