const { isEmpty } = require("lodash");
const MessageTag = require("../../enums/messageNums");
const db = require("../models/index");
const HttpStatusCode = require("../../enums/httpErrorCodes");
const { APIError, BadRequest, NotFound } = require("../../helper/apiErros");
const { logger } = require("../../helper/logger");
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
  const {
    userId,
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
    empCurrentAddress,
    empPermanentAddress,
  } = req?.body;
  try {
    if (
      !empID ||
      !empName ||
      !empPersonalEmail ||
      !empEmail ||
      !empPassword ||
      !empDesignation ||
      !userRole ||
      !empProfileImage ||
      !empMobileNumber ||
      !empCurrentAddress ||
      !empPermanentAddress
    ) {
      throw new BadRequest();
    }
    const isExists = await Employee.findAll({
      where: {
        userId: userId,
        isActive: 1,
      },
    });

    if (isEmpty(isExists)) {
      throw new NotFound(null, null, null, "User not found");
    }

    const isUpdated = await Employee.create({
      empId: empID,
      userPersonalEmail: empPersonalEmail,
      userEmail: empEmail,
      userPassword: empPassword,
      userDesignation: empDesignation,
      userName: empName,
      userRole: userRole,
      userProfileImage: empProfileImage,
      empMobileNumber: empMobileNumber,
      userBirthday: empDob,
      empJoinDate: empJoinDate,
      empSalary: empSal,
      empCurrentAddress: empCurrentAddress,
      empPermanentAddress: empPermanentAddress,
      createdAt: new Date(),
      isActive: 1,
    });

    if (!isEmpty(isCreated)) {
      //  logger.warn(
      //    {
      //      component: "Employee --->",
      //      method: "addEmployee --->",
      //    },
      //    { payload: displayName, msg: "Add new employee created successfully....." }
      //  );
      res.status(200).json({
        status: true,
        message: "success",
        data: isUpdated,
        statusCode: HttpStatusCode.OK,
      });
    }
  } catch (error) {
    if (error?.httpCode) {
      res.status(error?.httpCode).json({
        status: error?.isOperational,
        message: error?.message,
        statusCode: error?.httpCode,
      });
    }
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      status: false,
      message: error?.message,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
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
    empCurrentAddress,
    empPermanentAddress,
  } = req?.body;
  try {
    if (
      !empID ||
      !empName ||
      !empPersonalEmail ||
      !empEmail ||
      !empPassword ||
      !empDesignation ||
      !userRole ||
      !empProfileImage ||
      !empMobileNumber ||
      !empCurrentAddress ||
      !empPermanentAddress
    ) {
      throw new BadRequest();
    }
    const isExists = await Employee.findAll({
      where: {
        userEmail: empEmail,
      },
    });
    const isEmpIdExists = await Employee.findAll({
      where: {
        empId: empID,
      },
    });
    if (!isEmpty(isExists)) {
      throw new APIError(
        "Conflict",
        HttpStatusCode.CONFLICT,
        false,
        MessageTag.EMAIL_EXISTS
      );
    }
    if (!isEmpty(isEmpIdExists)) {
      throw new APIError(
        "Conflict",
        HttpStatusCode.CONFLICT,
        false,
        MessageTag.EMPLOYEE_ID_EXISTS
      );
    }

    const isCreated = await Employee.create({
      empId: empID,
      userPersonalEmail: empPersonalEmail,
      userEmail: empEmail,
      userPassword: empPassword,
      userDesignation: empDesignation,
      userName: empName,
      userRole: userRole,
      userProfileImage: empProfileImage,
      empMobileNumber: empMobileNumber,
      userBirthday: empDob,
      empJoinDate: empJoinDate,
      empSalary: empSal,
      empCurrentAddress: empCurrentAddress,
      empPermanentAddress: empPermanentAddress,
      createdAt: new Date(),
      isActive: 1,
    });

    if (!isEmpty(isCreated)) {
      //  logger.warn(
      //    {
      //      component: "Employee --->",
      //      method: "addEmployee --->",
      //    },
      //    { payload: displayName, msg: "Add new employee created successfully....." }
      //  );
      res.status(200).json({
        status: true,
        message: "success",
        data: isCreated,
        statusCode: HttpStatusCode.OK,
      });
    }
  } catch (error) {
    if (error?.httpCode) {
      res.status(error?.httpCode).json({
        status: error?.isOperational,
        message: error?.message,
        statusCode: error?.httpCode,
      });
    }
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      status: false,
      message: error?.message,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
    });
  }
};

module.exports = {
  getListOfEmployees,
  updateEmployeeData,
  addNewEmployee,
};
