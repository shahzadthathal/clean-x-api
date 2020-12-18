const { auth } = require("../middleware");


module.exports = app => {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const towerController = require("../controllers/tower.controller.js");

  var router = require("express").Router();

  router.post("/", [auth.verifyToken], towerController.create);

  router.get("/",  towerController.findAll);

  router.get("/:id", towerController.findOne);

  router.patch("/:id", [auth.verifyToken], towerController.update);

  router.delete("/:id", [auth.verifyToken], towerController.delete);

  app.use('/api/towers', router);
};