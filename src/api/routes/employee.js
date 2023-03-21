const express = require("express");
const router = express.Router();

const {
  getListOfEmployees,
  updateEmployeeData,
  addNewEmployee,
  deleteEmployee,
  getNewEmpId,
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

/*------employee list route-----------*/
router.get("/", getListOfEmployees);
router.post("/", addNewEmployee);
router.patch("/", updateEmployeeData);
router.delete("/:userId/:empId", deleteEmployee);
router.post("/markAttendance", markAttendance);
router.get("/getNewEmpId", getNewEmpId);

/*------employDsr route-----------*/
router.post("/employeeDsr", employeeDsr);
router.get("/get-EmployeeDsr", getEmployeeDsr);
router.get("/getSingle-EmployeeDsr", getSingleEmployeeDsr);
router.patch("/update-EmployeeDsr", updateEmployeeDsr);
router.get("/filter-EmployeeDsr", filterEmployeeDsr);

/*----------------attendanceRecord----------------*/
router.get("/attendance-record", getAttendanceRecord);
router.get("/allAttendance-record", allEmployeeAttendance);
module.exports = router;
