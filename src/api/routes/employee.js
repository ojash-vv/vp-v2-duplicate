const express = require("express");
const router = express.Router();
const {
  getListOfEmployees,
  updateEmployeeData,
} = require("../controllers/employeeController");

router.get("/", getListOfEmployees);
router.post("/update", updateEmployeeData);
module.exports = router;
