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

router.get("/", getListOfEmployees);
router.post("/", addNewEmployee);
router.patch("/", updateEmployeeData);
router.delete("/", deleteEmployee);
router.post("/markAttendance", markAttendance);

/*------employDsr route-----------*/
router.post("/employeeDsr", employeeDsr);
router.get("/getEmployeeDsr", getEmployeeDsr);
router.get("/getSingleEmployeeDsr", getSingleEmployeeDsr);
router.patch("/updateEmployeeDsr", updateEmployeeDsr);
router.get("/filterEmployeeDsr", filterEmployeeDsr);
module.exports = router;
