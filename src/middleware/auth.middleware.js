import jwt from "jsonwebtoken";

// Authentication middleware --> who are you
export const verifyJWT = (req,res,next)=>{
    
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success: false,
                message: "Token is not provided or Invalid format"
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token is invalid or expired"
        });
    }
}