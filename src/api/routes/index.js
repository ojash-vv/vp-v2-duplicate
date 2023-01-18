const express = require("express");
const router = express.Router();
const loginRoutes = require("../controllers/authController.js");
const globaltypecatRoutes = require("../controllers/globaltypecatController");
const globaltypeRoutes = require("../controllers/globaltypeController");
const employeesRoutes = require("../controllers/employeesController");
const { emplpoyeeValidation } = require("../../validation.js");

router.post("/login", loginRoutes.loginUser);

router.post("/globaltypecategory", globaltypecatRoutes.create);
router.put("/globaltypecategory/:categoryId", globaltypecatRoutes.update);
router.put(
  "/globaltypecategoryStauts/:categoryId",
  globaltypecatRoutes.updateStatus
);
router.delete("/globaltypecategory/:categoryId", globaltypecatRoutes.delete);
router.get("/globaltypecategory", globaltypecatRoutes.findAll);

router.get("/masterglobaltype/:uniqueValue", globaltypeRoutes.masterglobaltype);
router.post("/globaltype", globaltypeRoutes.create);
router.get("/globaltype", globaltypeRoutes.findAll);
router.put("/globaltype/:Id", globaltypeRoutes.update);
router.put("/globaltypeStauts/:Id", globaltypeRoutes.updateStatus);
router.delete("/globaltype/:Id", globaltypeRoutes.delete);

router.post("/employees", emplpoyeeValidation, employeesRoutes.create);
router.get("/employees", employeesRoutes.findAll);

module.exports = router;
