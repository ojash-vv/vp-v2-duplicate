const express = require("express");
const { markAttendance } = require("../controllers/attendanceController");

const router = express.Router();

router.post("/markAttendance", markAttendance);
// router.post("/", addGlobalType);
// router.put("/:id", updateGlobalType);
// router.delete("/:id", deleteGlobalType);
// router.get("/", getGlobalType);
// router.put("/status/:id", updateStatusGlobalType);

module.exports = router;
