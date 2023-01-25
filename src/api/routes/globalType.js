const express = require("express");
const {
  masterGlobalType,
  addGlobalType,
  updateGlobalType,
  deleteGlobalType,
  getGlobalType,
  updateStatusGlobalType,
} = require("../controllers/globalTypeController");

const router = express.Router();

router.get("/masterglobaltype/:category", masterGlobalType);
router.post("/", addGlobalType);
router.put("/:id", updateGlobalType);
router.delete("/:id", deleteGlobalType);
router.get("/", getGlobalType);
router.put("/status/:id", updateStatusGlobalType);

module.exports = router;
