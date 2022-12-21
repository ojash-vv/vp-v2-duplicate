const express = require("express");
const router = express.Router();
const loginRoutes = require("../controllers/authController.js");
const globaltypecatRoutes = require("../controllers/globaltypecatController");
const globaltypeRoutes = require("../controllers/globaltypeController");

router.post("/", function (req, res, next) {
  res.send("Erorrrrr");
});
router.post("/login", loginRoutes.loginUser);
router.post("/signup", loginRoutes.signupUser);

router.post("/globaltypecategory", globaltypecatRoutes.create);
router.get("/masterglobaltype/:uniqueValue", globaltypeRoutes.masterglobaltype);

module.exports = router;
