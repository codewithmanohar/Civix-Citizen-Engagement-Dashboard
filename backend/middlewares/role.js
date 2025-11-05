
export const roleCheck = async (req , res , next) => {    
    const userRole = req.user.role ; 
    if(userRole !== "official"){
        return res.status(403).json({message : "Access denied , officials only"});
    };
    next();
}