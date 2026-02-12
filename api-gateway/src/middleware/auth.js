const jwt = require("jsonwebtoken");
const verifyToken = (req,res,next)=>{
   try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token,process.env.JWT);
      req.user = decoded;
      next();
   } catch (error) {
      return res.status(401).json({
         success: false,
         message: "Unauthorized"
      });
   }
}

module.exports = {verifyToken};