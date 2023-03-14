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

/*------employee list route-----------*/
router.get("/", getListOfEmployees);
router.post("/", addNewEmployee);
router.patch("/", updateEmployeeData);
router.delete("/:userId/:empId", deleteEmployee);
router.post("/markAttendance", markAttendance);
router.get("/getNewEmpId", getNewEmpId);

/*------employDsr route-----------*/
router.post("/employeeDsr", employeeDsr);
router.get("/getEmployeeDsr", getEmployeeDsr);
router.get("/getSingleEmployeeDsr", getSingleEmployeeDsr);
router.patch("/updateEmployeeDsr", updateEmployeeDsr);
router.get("/filterEmployeeDsr", filterEmployeeDsr);
module.exports = router;
