const express = require("express");
const router = express.Router();
const loginRoutes = require("../controllers/authController.js");
const globaltypecatRoutes = require("../controllers/globaltypecatController");

router.post("/", function (req, res, next) {
  res.send("Erorrrrr");
});
router.post("/login", loginRoutes.loginUser);
router.post("/signup", loginRoutes.signupUser);

module.exports = router;
