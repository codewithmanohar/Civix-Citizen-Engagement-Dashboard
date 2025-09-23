import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const jwtAuthMiddleware = (req , res, next) => {
    
    if(!authorization) return res.status(401).json({message : "No authorization header provided"});
    const token = authorization.split(' ')[1]; 
    if(!token) return res.status(401).json({message : "No token provided"});

    try {
        // verify the JWT Token 
        const decoded = jwt.verify(token, JWT_SECRET); 
        console.log("Decoded token:", decoded);

         req.user = {
            id: decoded.id,      
            role: decoded.role,
            // email: decoded.email
        };
        
        console.log("req.user set to:", req.user);
        next();
    } catch (error) {
        console.log("JWT verification error:", error);
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
}