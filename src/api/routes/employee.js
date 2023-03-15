const express = require("express");
const router = express.Router();

const {
  getListOfEmployees,
  updateEmployeeData,
} = require("../controllers/employeeController");
const {
  markAttendance,
  markTimeOut,
} = require("../controllers/attendanceController");

const { markLeave } = require("../controllers/leaveController");

router.get("/", getListOfEmployees);
router.post("/update", updateEmployeeData);
router.post("/markAttendance", markAttendance);
router.post("/markLeave", markLeave);

module.exports = router;
