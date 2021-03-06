const { auth } = require("../middleware");


module.exports = app => {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const officeController = require("../controllers/office.controller.js");

  var router = require("express").Router();

  router.post("/", [auth.verifyToken], officeController.validate('createOfficeValidation'), officeController.create);

  router.get("/",  officeController.findAll);

  router.get("/:id", officeController.validate('checkParamsIdValidation'), officeController.findOne);

  router.patch("/:id", [auth.verifyToken], officeController.validate('checkParamsIdValidation'), officeController.update);

  router.delete("/:id", [auth.verifyToken], officeController.validate('checkParamsIdValidation'), officeController.delete);

  app.use('/api/offices', router);
};