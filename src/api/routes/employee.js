const express = require("express");
const router = express.Router();

const {
  getListOfEmployees,
  updateEmployeeData,
  addNewEmployee,
} = require("../controllers/employeeController");
const { markAttendance } = require("../controllers/attendanceController");

router.get("/", getListOfEmployees);
router.post("/", addNewEmployee);
router.patch("/", updateEmployeeData);
router.post("/markAttendance", markAttendance);

module.exports = router;
