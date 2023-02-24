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
} = require("../controllers/employeeDsrController");

router.get("/", getListOfEmployees);
router.post("/", addNewEmployee);
router.patch("/", updateEmployeeData);
router.delete("/", deleteEmployee);
router.post("/markAttendance", markAttendance);

/*------employDsr route-----------*/
router.post("/employeeDsr", employeeDsr);
router.get("/getEmployeeDsr", getEmployeeDsr);
router.get("/getSingleEmployeeDsr/:id", getSingleEmployeeDsr);
router.patch("/updateEmployeeDsr/:id", updateEmployeeDsr);

module.exports = router;
