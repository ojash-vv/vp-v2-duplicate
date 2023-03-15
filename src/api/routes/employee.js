const express = require("express");
const router = express.Router();

const {
  getListOfEmployees,
  updateEmployeeData,
  addNewEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { markAttendance } = require("../controllers/attendanceController");
const {
  employeeDsr,
  getEmployeeDsr,
  getSingleEmployeeDsr,
  updateEmployeeDsr,
  filterEmployeeDsr,
} = require("../controllers/employeeDsrController");
const {
  getAttendanceRecord,
  allEmployeeAttendance,
} = require("../controllers/attendanceRecordController");
router.get("/", getListOfEmployees);
router.post("/", addNewEmployee);
router.patch("/", updateEmployeeData);
router.delete("/", deleteEmployee);
router.post("/markAttendance", markAttendance);

/*------employDsr route-----------*/
router.post("/employeeDsr", employeeDsr);
router.get("/get-EmployeeDsr", getEmployeeDsr);
router.get("/getSingle-EmployeeDsr", getSingleEmployeeDsr);
router.patch("/update-EmployeeDsr", updateEmployeeDsr);
router.get("/filter-EmployeeDsr", filterEmployeeDsr);

/*----------------attendanceRecord----------------*/
router.get("/attendance-record", getAttendanceRecord);
router.get("/allattendance-record", allEmployeeAttendance);
module.exports = router;
