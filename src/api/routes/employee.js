const express = require("express");
const router = express.Router();

const {
  getListOfEmployees,
  updateEmployeeData,
} = require("../controllers/employeeController");
const { markAttendance } = require("../controllers/attendanceController");

router.get("/", getListOfEmployees);
router.post("/", updateEmployeeData);
// router.post("/update", updateEmployeeData);
router.post("/markAttendance", markAttendance);

module.exports = router;
