const { isEmpty } = require("lodash")
const { Op } = require("sequelize")
const db = require("../models/index")
const { logger } = require("../../helper/logger")

const employee = db.employeeDsr
const ProjectsName = db.projectsName
const HttpStatusCode = require("../../enums/httpErrorCodes")
const { APIError, BadRequest, NotFound } = require("../../helper/apiErrors")

const employeeDsr = async (req, res) => {
  const employeeDSRdata = req?.body
  const { empId } = req.query

  try {
    const dsrAlreadyExist = await employee.findAll({
      where: {
        empId,
      },
    })

    for (let i = 0; i < dsrAlreadyExist?.length; i += 1) {
      const singleDsr = dsrAlreadyExist[i]

      for (let j = 0; j < employeeDSRdata?.length; j += 1) {
        if (singleDsr?.workingDate === employeeDSRdata[j]?.workingDate) {
          throw new APIError("Conflict", HttpStatusCode.CONFLICT, false, "DSR already exists!")
        }
      }
    }

    if (!employeeDSRdata) {
      throw new BadRequest()
    }
    let isCreated
    for (let i = 0; i < employeeDSRdata.length; i += 1) {
      const currentEmployeeDSR = employeeDSRdata[i]

      isCreated = employee.create({
        empId: empId.toUpperCase(),
        projectId: currentEmployeeDSR?.projectId,
        workingDate: currentEmployeeDSR?.workingDate,
        workingHours: currentEmployeeDSR?.taskMinutes,
        taskDetails: currentEmployeeDSR?.taskDetails,
        taskStatus: currentEmployeeDSR?.taskStatus,
        createdBy: "1",
        createdAt: new Date(),
      })
    }
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: "success",
      data: isCreated,
      statusCode: HttpStatusCode.OK,
    })
    logger.info(
      {
        controller: "employeeDsrController --->",
        method: "employeeDsr --->",
      },
      {
        payload: isCreated,
        msg: "employeeDsr added",
      },
    )
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "employeeDsr --->",
      },
      {
        empId: `employeeId${empId}`,
        msg: `Catch error: ${error?.msg}`,
      },
    )
    res.status(error?.httpCode || HttpStatusCode.INTERNAL_SERVER).json({
      status: error?.isOperational || false,
      message: error?.message,
      statusCode: error?.httpCode || HttpStatusCode.INTERNAL_SERVER,
    })
  }
}

const getEmployeeDsr = async (req, res) => {
  const { skip = 0, limit = 0, empId, userRole } = req.query

  let isExists = []

  try {
    if (!empId) {
      throw new BadRequest()
    }
    if (userRole === "user") {
      isExists = await employee.findAll({
        where: {
          empId,
        },
        include: [
          {
            model: ProjectsName,
            attributes: ["projectName"],
          },
        ],
        offset: parseInt(skip, 10),
        limit: parseInt(limit - skip, 10),
        order: [["workingDate", "DESC"]],
      })
      //  totalCount = await employee.findAll({
      //       where: {
      //         empId,
      //       },
      //     })
    } else {
      isExists = await employee.findAll({
        include: [
          {
            model: ProjectsName,
            attributes: ["projectName"],
          },
        ],
        offset: parseInt(skip, 10),
        limit: parseInt(limit - skip, 10),
        order: [["workingDate", "DESC"]],
      })
      // totalCount = await employee.findAll({})
    }

    if (isEmpty(isExists)) {
      throw new NotFound()
    }
    if (isExists) {
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: "success",
        data: { dsrList: isExists, totalCount: isExists?.length },
      })

      logger.info(
        {
          controller: "employeeDsrController --->",
          method: "getEmployeeDsr --->",
        },
        {
          empId: `employeeId${empId}`,
          msg: "employeeDsr data ",
        },
      )
    }
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "getEmployeeDsr --->",
      },
      {
        empId: `employeeId${empId}`,
        msg: `Catch error: ${error?.msg}`,
      },
    )
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.message })
  }
}

const getSingleEmployeeDsr = async (req, res) => {
  const { id, empId } = req.query
  try {
    if (!id || !empId) {
      throw new BadRequest()
    }
    const isEmployeeExists = await employee.findOne({
      where: {
        id,
      },
    })
    if (isEmpty(isEmployeeExists)) {
      throw new NotFound()
    }
    res.status(HttpStatusCode.OK).send({
      status: true,
      data: isEmployeeExists,
      message: "success",
    })
    logger.info(
      {
        controller: "employeeDsrController --->",
        method: "getSingleEmployeeDsr---------->",
      },
      {
        empId: `employeeId${empId}`,
        msg: `EmployeeDsr data${empId}`,
      },
    )
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "getSingleEmployeeDsr---------->",
      },
      {
        empId: `employId: ${empId}`,
        msg: `Catch error:${error?.msg}`,
      },
    )
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: "user doesn't exist" })
  }
}

const updateEmployeeDsr = async (req, res) => {
  const { id, empId, projectId, workingDate, workingHours, taskDetail, taskStatus, taskMinutes } =
    req.body
  try {
    if (
      !id ||
      !empId ||
      !projectId ||
      !workingDate ||
      !workingHours ||
      !taskDetail ||
      !taskStatus ||
      !taskMinutes
    ) {
      throw new BadRequest()
    }
    const getUpdateEmployee = await employee.findOne({
      where: {
        id,
      },
    })
    if (isEmpty(getUpdateEmployee)) {
      throw new NotFound()
    }
    const isUpdated = await employee.update(
      {
        empId,
        projectId,
        workingDate,
        workingHours,
        taskDetail,
        taskStatus,
        taskMinutes,
        updatedBy: "1",
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      },
    )
    res.status(HttpStatusCode.OK).send({
      status: true,
      message: "updated successfully",
      data: isUpdated,
    })
    logger.info(
      {
        controller: "employeeDsrController --->",
        method: "updateEmployeeDsr---------->",
      },
      {
        payload: isUpdated,
        msg: `EmployeeDsr updated,employeeId: ${empId}`,
      },
    )
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "updateEmployeeDsr---------->",
      },
      {
        empId: `employeeId:${empId}`,
        msg: `Catch error:${error?.msg}`,
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

const filterEmployeeDsr = async (req, res) => {
  const { skip = 0, limit = 0, empId, taskDetail, startDate, endDate } = req.query
  let isExists = []
  let totalFilterData = []

  try {
    if (!empId) {
      throw new BadRequest()
    }
    if (taskDetail && startDate && endDate) {
      isExists = await employee.findAll({
        include: [
          {
            model: ProjectsName,
            attributes: ["projectName"],
          },
        ],
        offset: parseInt(skip, 10),
        limit: parseInt(limit - skip, 10),
        where: {
          taskDetail,
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["workingDate", "DESC"]],
      })
    } else if (taskDetail) {
      isExists = await employee.findAll({
        include: [
          {
            model: ProjectsName,
            attributes: ["projectName"],
          },
        ],
        offset: parseInt(skip, 10),
        limit: parseInt(limit - skip, 10),
        where: {
          taskDetail,
        },
      })
    } else if (startDate && endDate) {
      isExists = await employee.findAll({
        include: [
          {
            model: ProjectsName,
            attributes: ["projectName"],
          },
        ],
        offset: parseInt(skip, 10),
        limit: parseInt(limit - skip, 10),
        where: {
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["workingDate", "DESC"]],
      })
    }
    if (taskDetail && startDate && endDate) {
      totalFilterData = await employee.findAll({
        where: {
          taskDetail,
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      })
    } else if (taskDetail) {
      totalFilterData = await employee.findAll({
        where: {
          taskDetail,
        },
      })
    } else if (startDate && endDate) {
      totalFilterData = await employee.findAll({
        where: {
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      })
    }

    if (isEmpty(isExists) || isEmpty(totalFilterData)) {
      throw new NotFound()
    }
    res.status(HttpStatusCode?.OK).json({
      status: true,
      message: "success",
      data: { dsrList: isExists, totalCount: totalFilterData?.length },
    })
    logger.info(
      {
        controller: "employeeDsrController --->",
        method: "find taskDetail in employeeDsr",
      },
      {
        payload: `employeeId:${empId}`,
        msg: `taskDetail :${taskDetail}`,
      },
    )
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "find taskDetail in employeeDsr",
      },
      {
        payload: `employeeId: ${empId}`,
        msg: `Catch error: ${error?.msg}`,
      },
    )
    res.status(HttpStatusCode?.BAD_REQUEST).json({
      status: false,
      message: error?.message,
      statusCode: error?.httpCode,
    })
  }
}

module.exports = {
  employeeDsr,
  getEmployeeDsr,
  getSingleEmployeeDsr,
  updateEmployeeDsr,
  filterEmployeeDsr,
}
