const express = require("express");
const router = express.Router();

const {
  getListOfEmployees,
  updateEmployeeData,
  addNewEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { markAttendance } = require("../controllers/attendanceController");

router.get("/", getListOfEmployees);
router.post("/", addNewEmployee);
router.patch("/", updateEmployeeData);
router.delete("/", deleteEmployee);
router.post("/markAttendance", markAttendance);

module.exports = router;
