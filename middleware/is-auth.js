const jwt = require('jsonwebtoken');
module.exports =(req,res,next)=>{
    console.log("Check Token Validation");
    if(!req.get("Authorization")){
        const error = Error("Auth Header is Missing");
        error.statusCode = 422;
        throw error;
    }

    const authHeader = req.get("Authorization").split(" ")[1];
    if(!authHeader){
        const error = Error("Header is Missing");
        error.statusCode = 422;
        throw error;
    }
    const decodedToken = jwt.verify(authHeader,"mysecretkey");
    if(!decodedToken){
        const error = Error("Invalid Auth");
        error.statusCode = 422;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}