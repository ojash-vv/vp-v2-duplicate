const { isEmpty } = require("lodash")
const bcrypt = require("bcryptjs")
const MessageTag = require("../../enums/messageNums")
const db = require("../models/index")
const HttpStatusCode = require("../../enums/httpErrorCodes")
const { APIError, BadRequest, NotFound } = require("../../helper/apiErrors")
const { logger } = require("../../helper/logger")

const Employee = db.employee

const getListOfEmployees = async (req, res) => {
  const { skip = 0, limit = 0 } = req.query
  try {
    const employee = await Employee.findAll({
      offset: parseInt(skip, 10),
      limit: parseInt(limit - skip, 10),
      order: [["userId", "DESC"]],
    })
    const totalEmpCount = await Employee.findAll()
    if (employee) {
      res.status(200).json({
        status: true,
        data: { employee, totalCount: totalEmpCount?.length },
        message: "success",
      })
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error,
    })
  }
}
const updateEmployeeData = async (req, res) => {
  const {
    userId,
    empId,
    userName,
    userPersonalEmail,
    userEmail,
    userPassword,
    userDesignation,
    userRole,
    userProfileImg,
    empMobileNumber,
    empDob,
    empJoinDate,
    empSal,
    empCurrentAddress,
    empPermanentAddress,
    isActive,
  } = req.body
  try {
    if (
      !empId ||
      !userName ||
      !userPersonalEmail ||
      !userEmail ||
      !userPassword ||
      !userDesignation ||
      !userRole ||
      // !userProfileImg ||
      !empMobileNumber
    ) {
      logger.error(
        {
          controller: "employeeController --->",
          method: "updateEmployeeData --->",
        },
        {
          payload: `Requested employee: ${userName} and employee id :${empId}`,
          msg: "Bad request by the client",
        },
      )
      throw new BadRequest()
    }
    const isExists = await Employee.findAll({
      where: {
        userId,
      },
    })

    if (isEmpty(isExists)) {
      logger.error(
        {
          controller: "employeeController --->",
          method: "updateEmployeeData --->",
        },
        {
          payload: `Requested employee: ${userName} and employee id :${empId}`,
          msg: "User not found",
        },
      )
      throw new NotFound(null, null, null, "User not found")
    }

    const isUpdated = await Employee.update(
      {
        empId,
        userPersonalEmail,
        userEmail,
        userPassword,
        userDesignation,
        userName,
        userRole,
        userProfileImage: userProfileImg,
        empMobileNumber,
        userBirthday: empDob,
        empJoinDate,
        empSalary: empSal,
        empCurrentAddress,
        empPermanentAddress,
        updatedAt: new Date(),
        isActive,
      },
      {
        where: {
          userId,
        },
        returning: true,
      },
    )
    let updatedUser = []
    updatedUser = await Employee.findOne({
      where: {
        userId,
      },
    })
    if (!isEmpty(isUpdated)) {
      res.status(200).json({
        status: true,
        message: "success",
        data: updatedUser,
      })
      logger.info(
        {
          controller: "employeeController --->",
          method: "updateEmployeeData --->",
        },
        {
          payload: `Requested employee: ${userName} and employee id :${empId}`,
          msg: "Record updated successfully",
        },
      )
    }
  } catch (error) {
    logger.error(
      {
        controller: "employeeController --->",
        method: "updateEmployeeData --->",
      },
      {
        payload: `Requested employee: ${userName} and employee id :${empId}`,
        msg: `error:${error}`,
      },
    )
    if (error?.httpCode) {
      res.status(error?.httpCode || HttpStatusCode.INTERNAL_SERVER).json({
        status: error?.isOperational || false,
        message: error?.message,
        statusCode: error?.httpCode || HttpStatusCode.INTERNAL_SERVER,
      })
    }
  }
}
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
  } = req.body
  try {
    if (
      !empID ||
      !empName ||
      !empPersonalEmail ||
      !empEmail ||
      !empPassword ||
      !empDesignation ||
      !userRole ||
      !empMobileNumber ||
      !empCurrentAddress ||
      !empPermanentAddress
    ) {
      throw new BadRequest()
    }
    const isExists = await Employee.findAll({
      where: {
        userEmail: empEmail,
      },
    })
    const isEmpIdExists = await Employee.findAll({
      where: {
        empId: empID,
      },
    })
    if (!isEmpty(isExists)) {
      throw new APIError("Conflict", HttpStatusCode.CONFLICT, false, MessageTag.EMAIL_EXISTS)
    }
    if (!isEmpty(isEmpIdExists)) {
      throw new APIError("Conflict", HttpStatusCode.CONFLICT, false, MessageTag.EMPLOYEE_ID_EXISTS)
    }
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(empPassword, salt)
    const isCreated = await Employee.create({
      empId: empID,
      userPersonalEmail: empPersonalEmail,
      userEmail: empEmail,
      userPassword: hashedPassword,
      userDesignation: empDesignation,
      userName: empName,
      userRole,
      userProfileImage: empProfileImage,
      empMobileNumber,
      userBirthday: empDob,
      empJoinDate,
      empSalary: empSal,
      empCurrentAddress,
      empPermanentAddress,
      createdAt: new Date(),
      isActive: 1,
    })

    if (!isEmpty(isCreated)) {
      res.status(200).json({
        status: true,
        message: "success",
        data: isCreated,
        statusCode: HttpStatusCode.OK,
      })
    }
  } catch (error) {
    if (error?.httpCode) {
      res.status(error?.httpCode).json({
        status: error?.isOperational,
        message: error?.message,
        statusCode: error?.httpCode,
      })
    }
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      status: false,
      message: error?.message,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
    })
  }
}
const deleteEmployee = async (req, res) => {
  const { empId, userId } = req.params
  try {
    if (!empId || !userId) {
      throw new BadRequest()
    }

    const isEmpIdExists = await Employee.findAll({
      where: {
        empId,
        userId: parseInt(userId, 10),
        isDeleted: 0,
      },
    })
    if (isEmpty(isEmpIdExists)) {
      throw new NotFound()
    }

    const isDeleted = await Employee.update(
      {
        isDeleted: 1,
        isActive: 0,
      },
      {
        where: {
          userId: parseInt(userId, 10),
          empID: empId,
        },
        returning: true,
      },
    )
    if (!isEmpty(isDeleted)) {
      res.status(200).json({
        status: true,
        message: "success",
        data: isDeleted[1][0],
        statusCode: HttpStatusCode.OK,
      })
    }
  } catch (error) {
    res.status(error?.httpCode || HttpStatusCode.INTERNAL_SERVER).json({
      status: error?.isOperational || false,
      message: error?.message,
      statusCode: error?.httpCode || HttpStatusCode.INTERNAL_SERVER,
    })
  }
}

const getNewEmpId = async (req, res) => {
  try {
    const lastRecord = await Employee.findOne({
      order: [["userId", "DESC"]],
    })
    if (isEmpty(lastRecord)) {
      throw new NotFound()
    }
    const { empId } = lastRecord
    const newEmpId = `VVT-${parseInt(empId.split("-")[1], 10) + 1}`
    res.status(200).json({
      status: true,
      message: "success",
      data: newEmpId,
      statusCode: HttpStatusCode.OK,
    })
    logger.info(
      {
        controller: "employeeController --->",
        method: "getNewEmpId --->",
      },
      {
        payload: null,
        msg: "Record fetch and sent successfully",
      },
    )
  } catch (error) {
    // uncomment this error log once the emp id is attached on the api call headers

    // logger.error(
    //   {
    //     controller: "employeeController --->",
    //     method: "getNewEmpId --->",
    //   },
    //   {
    //     payload: `Requested user: ${userName} and employee id :${empId}`,
    //     msg: `error:${error}`,
    //   }
    // );
    res.status(error?.httpCode || HttpStatusCode.INTERNAL_SERVER).json({
      status: error?.isOperational || false,
      message: error?.message,
      statusCode: error?.httpCode || HttpStatusCode.INTERNAL_SERVER,
    })
  }
}
module.exports = {
  getListOfEmployees,
  updateEmployeeData,
  addNewEmployee,
  deleteEmployee,
  getNewEmpId,
}
