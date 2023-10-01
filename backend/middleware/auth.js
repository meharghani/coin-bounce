const JWTService = require('../services/JWTService');
const User = require('../models/user');
const userDTO = require('../dto/user');

 const auth =async (req, res, next) =>{
    //refresh , access token validate
    try {
        
    
    const {accessToken, refreshToken} = req.cookies;
    if(!refreshToken || !accessToken){
        const error = {
            status: 401,
            message: "Ubauthorized"
        }
        return next(error)
    }
    let id
    try {
        id = JWTService.verifyAccessToken(accessToken)._id;
    } catch (error) {
        return next(error)
    }
    let user
    try {
        user =await User.findOne({_id: id});        
    } catch (error) {
        return next(error)
    }
    const userDto = new userDTO(user);
    req.user = userDto
    next()
} catch (error) {
    return next(error)       
}
   
}

module.exports = auth