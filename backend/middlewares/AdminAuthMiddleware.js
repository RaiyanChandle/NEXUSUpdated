import jsonwebtoken from "jsonwebtoken"

export const adminAuth=async (req,res,next)=>{
    try {
        const token=req.headers.authorization.split(" ")[1];
        const decoded=jsonwebtoken.verify(token,process.env.JWT_SECRET);
        req.Adminid=decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
    }
}