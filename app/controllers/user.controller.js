const db = require("../../models");
const User = db.users;
const Op = db.Sequelize.Op;

const config = require("../../config/auth.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const ERROR_MESSAGE = 'Something went wrong.'

const { body, validationResult } = require('express-validator/check')

exports.validate = (method) => {
  switch (method) {
    case 'registerUserValidation': {
     	return [ 
			body('full_name', "Full name required").exists().trim().escape(),
			body('email', 'Invalid email').exists().isEmail().trim().escape().custom(reqEmail=> {
				return new Promise((resolve, reject) => {
					User.findOne({ where: { email: reqEmail } })
					.then(isExist => {
						if(isExist !== null){
							reject(new Error('Email already exists.'))
						}else{
							resolve(true)
						}
					}).catch(err => {
						reject(new Error('Something went wrong.'))
					});
				})
			}),
			body('password', "Password required").exists().isLength({ min: 8 }),
        ]
	}
	case 'loginUserValidation': {
		return [
			body('email', 'Invalid email').exists().isEmail().trim().escape(),
			body('password', "Password required").exists(),
        ]
	}
  }
}

// User Register
exports.register = (req, res) => {
  	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		User.create({
			full_name: req.body.full_name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 8)
		})
		.then(user => {
			return res.status(201).send({ message: "User was registered successfully!" });
		})
		.catch(err => {
			return res.status(500).send({ message: err.message || ERROR_MESSAGE });
		});
	}catch(err){
		return res.status(500).send({ message: err.message || ERROR_MESSAGE });
	}

}

//User Login
exports.login = (req, res) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		User.findOne({where: {email: req.body.email}})
		.then(user => {
				if (!user) {
					return res.status(404).send({ message: "User Not found." });
				}
				var passwordIsValid = bcrypt.compareSync(req.body.password,user.password);
				if (!passwordIsValid) {
					return res.status(401).send({accessToken: null,message: "Invalid Password!"});
				}
				var token = jwt.sign({ id: user.id }, config.secret, {
					expiresIn: config.jwatExpiresIn // 24 hours
				});
				return res.status(201).send({
					message: "User was login successfully!",
					data:{
						id: user.id,
						full_name: user.full_name,
						email: user.email,
						accessToken: token
					}
				});		
		})
		.catch(err => {
			return res.status(500).send({ message: err.message || ERROR_MESSAGE });
		});
	}catch(err){
		return res.status(500).send({ message: err.message || ERROR_MESSAGE });
	}
}