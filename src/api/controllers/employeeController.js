const db = require("../models/index");

const Employee = db.employee;

const getListOfEmployees = async (req, res) => {
  const { skip = 0, limit = 0 } = req?.query;
  try {
    const employee = await Employee.findAll({
      offset: parseInt(skip),
      limit: parseInt(limit),
    });
    const totalEmpCount = await Employee.findAll({
      where: { userDesignation: "Employee" },
    });
    if (employee) {
      res.status(200).json({
        status: true,
        data: { employee, totalCount: totalEmpCount?.length },
        message: "success",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};
const updateEmployeeData = async (req, res) => {
  const { userId, isActive } = req?.body;
  try {
    const isUpdated = await Employee.update(
      { isActive: isActive },
      {
        where: { userId: userId },
      }
    );

    if (isUpdated) {
      res.status(200).json({
        status: true,
        message: "success",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};
const addNewEmployee = async (req, res) => {
  const {
    empID,
    empName,
    empPersonalEmail,
    empEmail,
    empPassword,
    empDesignation,
    userRole,
    empProfileImage,
    empMobileNumber,
    empDob,
    empJoinDate,
    empSal,
  } = req?.body;
  try {
    const isExists = await Employee.findAll({
      where: {
        userEmail: empEmail,
      },
    });
    if (!isExists) {
      res.status()
    }
    const isUpdated = await Employee.ad(
      { isActive: isActive },
      {
        where: { userId: userId },
      }
    );

    if (isUpdated) {
      res.status(200).json({
        status: true,
        message: "success",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

module.exports = {
  getListOfEmployees,
  updateEmployeeData,
};
