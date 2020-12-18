const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config.js");
const db = require("../../models");
const User = db.user;

verifyToken = (req, res, next) => {
  	
  	let token = req.headers['authorization'] || req.headers["x-access-token"]  ;
  	
  	if (!token) {
    	return res.status(403).send({
      		message: "No token provided!"
    	});
  	}
  	if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

   	jwt.verify(token, config.secret, (err, decoded) => {
    	//Token expired or not matched with secret code
    	if (err) {
	      return res.status(401).send({
	        message: "Unauthorized!"
	      });
    	}
	    req.userId = decoded.id;
	    next();
  });
};

const auth = {
  verifyToken: verifyToken,
};
module.exports = auth;