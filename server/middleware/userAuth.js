

import jwt from 'jsonwebtoken';

const userAuth = async(req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({success: false, message: "Not Authenticated"});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if(!tokenDecode?.id){
            return res.status(401).json({success: false, message: "Invalid token"});
        }
        
        // Standard practice to attach user to req object
        req.user = { id: tokenDecode.id };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false, 
            message: "Authentication failed",
            error: error.message
        });
    }
};

export default userAuth;

