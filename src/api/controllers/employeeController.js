const db = require("../models/index");

const Employee = db.employee;

const getListOfEmployees = async (req, res) => {
  const { skip = 0, limit = 0 } = req?.query;
  try {
    const employee = await Employee.findAll({
      offset: parseInt(skip),
      limit: parseInt(limit),
      where: { userDesignation: "Employee" },
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

module.exports = {
  getListOfEmployees,
  updateEmployeeData,
};
