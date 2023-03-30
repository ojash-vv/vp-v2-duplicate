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
const {
  markLeave,
  updateLeave,
  getEmployeeLeave,
  getEmployeeDayLeave,
} = require("../controllers/leaveController");
const { isUserAuthenticated } = require("../middleware/auth-middleware");

/*------employee list route-----------*/
router.get("/", isUserAuthenticated, getListOfEmployees);
router.post("/", isUserAuthenticated, addNewEmployee);
router.patch("/", isUserAuthenticated, updateEmployeeData);
router.delete("/:userId/:empId", isUserAuthenticated, deleteEmployee);
router.post("/markAttendance", isUserAuthenticated, markAttendance);
router.get("/getNewEmpId", isUserAuthenticated, getNewEmpId);

/*------employDsr route-----------*/
router.post("/employeeDsr", isUserAuthenticated, employeeDsr);
router.get("/get-EmployeeDsr", isUserAuthenticated, getEmployeeDsr);
router.get("/getSingle-EmployeeDsr", isUserAuthenticated, getSingleEmployeeDsr);
router.patch("/update-EmployeeDsr", isUserAuthenticated, updateEmployeeDsr);
router.get("/filter-EmployeeDsr", isUserAuthenticated, filterEmployeeDsr);

/*----------------attendanceRecord----------------*/

router.get("/attendance-record", isUserAuthenticated, getAttendanceRecord);
router.get("/allAttendance-record", isUserAuthenticated, allEmployeeAttendance);

/*******************Employee Leave********************/
router.post("/markLeave", isUserAuthenticated, markLeave);
router.put("/updateLeave/:id", isUserAuthenticated, updateLeave);

router.get("/allEmployee-leave", isUserAuthenticated, getEmployeeLeave);
router.get("/allEmployeeDay-leave", isUserAuthenticated, getEmployeeDayLeave);

module.exports = router;
