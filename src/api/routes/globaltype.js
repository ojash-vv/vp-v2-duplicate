const express = require("express");
const router = express.Router();
const globaltypecatRoutes = require("../controllers/globaltypecatController");

router.post("/globaltypecategory", globaltypecatRoutes.create);

module.exports = router;
