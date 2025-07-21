const jwt = require("jsonwebtoken");
const secret = "Saptorsi@123$";

function setUser(user){
    console.log("Creating token for user:", user);
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secret);
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
    
}

module.exports = {
    setUser,
    getUser,
};
