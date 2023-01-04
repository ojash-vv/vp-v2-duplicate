const express = require("express");
const router = express.Router();
const loginRoutes = require("../controllers/authController.js");
const globaltypecatRoutes = require("../controllers/globaltypecatController");
const globaltypeRoutes = require("../controllers/globaltypeController");

router.post("/login", loginRoutes.loginUser);

router.post("/globaltypecategory", globaltypecatRoutes.create);
router.put("/globaltypecategory/:categoryId", globaltypecatRoutes.update);
router.delete("/globaltypecategory/:categoryId", globaltypecatRoutes.delete);
router.get("/globaltypecategory", globaltypecatRoutes.findAll);

router.get("/masterglobaltype/:uniqueValue", globaltypeRoutes.masterglobaltype);
router.post("/globaltype", globaltypeRoutes.create);
router.get("/globaltype", globaltypeRoutes.findAll);
router.put("/globaltype/:Id", globaltypeRoutes.update);
router.delete("/globaltype/:Id", globaltypeRoutes.delete);

module.exports = router;
