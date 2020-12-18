const db = require("../../models");
const User = db.users;
const Op = db.Sequelize.Op;

const config = require("../../config/auth.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const ERROR_MESSAGE = 'Something went wrong.'


// User Register
exports.register = (req, res) => {
  	
  	if (!req.body.full_name || !req.body.email || !req.body.password ) {
	    return res.status(400).send({
	      message: "User content can not be empty!"
	    });   
  	}

  	// Save User to Database
	User.create({
	    full_name: req.body.full_name,
	    email: req.body.email,
	    password: bcrypt.hashSync(req.body.password, 8)
	})
    .then(user => {
    	return res.send({ message: "User was registered successfully!" });
    })
    .catch(err => {
       return res.status(500).send({ message: err.message || ERROR_MESSAGE });
    });

}

//User Login
exports.login = (req, res) => {

	if (!req.body.email || !req.body.password ) {
	    return res.status(400).send({
	      message: "User content can not be empty!"
	    });   
  	}

	User.findOne({
	    where: {
	      email: req.body.email
	    }
	})
    .then(user => {
	      	if (!user) {
	        	return res.status(404).send({ message: "User Not found." });
	      	}

	      	var passwordIsValid = bcrypt.compareSync(
		        req.body.password,
		        user.password
		     );

	      	if (!passwordIsValid) {
		        return res.status(401).send({
		          accessToken: null,
		          message: "Invalid Password!"
		        });
	      	}

			var token = jwt.sign({ id: user.id }, config.secret, {
				expiresIn: config.jwatExpiresIn // 24 hours
			});

	      	return res.status(200).send({
	          id: user.id,
	          full_name: user.full_name,
	          email: user.email,
	          accessToken: token
	        });
      
    })
    .catch(err => {
      res.status(500).send({ message: err.message || ERROR_MESSAGE });
    });
}