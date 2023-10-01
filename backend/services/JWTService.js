const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/token')

ACCESS_TOKEN_SECRET = "6b655b739d1ef505cf531b0644a1c3d8078fbaf421f64919ed9db4f1944b4026102ef34f18bf25c0a8401d10b1d4031b705ef39df53a99cb7c75679d3fb1fb4f"
REFRESH_TOKEN_SECRET = "8d4dc9821ea0444c9ab0e00e16bec9d7929ee79b0b5648c9651f8ae2878eb6efe9c70d3765d4fb25f1a0b21d4560ac7e75e330b1633aec634bf6f330e826bb45"

class JWTService{
    //sign access token
    static signAccessToken(payload,expiryTime ){
        return jwt.sign(payload,ACCESS_TOKEN_SECRET, {expiresIn: expiryTime});
    }
    //sign refresh token
    static signRefreshToken(payload, expiryTime ){
        return jwt.sign(payload,REFRESH_TOKEN_SECRET , {expiresIn: expiryTime})
    }
    //verfiy access token
    static verifyAccessToken(token){
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }
    //vrify refresh token
    static verifyRefreshToken(token){
        return jwt.verify(token, REFRESH_TOKEN_SECRET)
    }
    //store refreh token
   static async storeRefreshToken(token, userId){
        try {
            const newToken = new RefreshToken({
                token: token,
                userId: userId
            });
            //store in db
            await newToken.save();           
        } catch (error) {
            console.log(error);   
        }
    }
}


module.exports = JWTService;