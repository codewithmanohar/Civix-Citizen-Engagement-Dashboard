import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const jwtAuthMiddleware = (req , res, next) => {
    // Extract the jwt token from the request headers 
    const authorization = req.headers.authorization; 
    if(!authorization) return res.status(401).json({message : "No authorization header provided"});
    const token = authorization.split(' ')[1]; 
    if(!token) return res.status(401).json({message : "No token provided"});

    try {
        // verify the JWT Token 
        const decoded = jwt.verify(token, JWT_SECRET, { expiresIn: "7d" }); 

         req.user = {
            id: decoded.id,      
            role: decoded.role,
            // email: decoded.email
        };
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
}