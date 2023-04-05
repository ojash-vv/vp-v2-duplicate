const express = require("express");
const router = express.Router();
const {
  updateStaticContent,
  getStaticContent,
} = require("../controllers/staticContentController");
router.patch("/", updateStaticContent);
router.get("/getStatic-Content", getStaticContent);
module.exports = router;
