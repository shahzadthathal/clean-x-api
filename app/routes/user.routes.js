

module.exports = app => {

  const userController = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.post("/register",  userController.validate('registerUserValidation'), userController.register);

  router.post("/login", userController.validate('loginUserValidation'), userController.login);

  app.use('/api/users', router);
};