const jwt = require('jsonwebtoken')
var config = require("config");
const secretKey = config.get("secretKey") ; 

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ 
      "errorFlag" : true ,
      "msg" : 'Invalid Login' 
    });
  }

   jwt.verify(token, secretKey, (err, decoded) => {
    
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.decoded = decoded;
    next();
  
  });
};

module.exports = verifyToken;
