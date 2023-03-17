const db = require("../models/index");
const { isEmpty } = require("lodash");
const { logger } = require("../../helper/logger");
const EmployeeDsr = db.employeeDsr;
const HttpStatusCode = require("../../enums/httpErrorCodes");
const { BadRequest, NotFound } = require("../../helper/apiErros");
const { Op } = require("sequelize");
const employeeDsr = async (req, res) => {
  const employeeDSRdata = req?.body;
  const empId = employeeDSRdata.empId;
  try {
    if (!employeeDSRdata && !empId) {
      throw new BadRequest();
    }
    let isCreated;
    for (let i = 0; i < employeeDSRdata.length; i++) {
      const currentEmployeeDSR = employeeDSRdata[i];
      isCreated = await EmployeeDsr.create({
        empId: currentEmployeeDSR.empId.toUpperCase(),
        projectId: currentEmployeeDSR.projectId,
        workingDate: currentEmployeeDSR.workingDate,
        workingHours: currentEmployeeDSR.workingHours,
        taskDetail: currentEmployeeDSR.taskDetail,
        taskStatus: currentEmployeeDSR.taskStatus,
        taskMinutes: currentEmployeeDSR.taskMinutes,
        createdBy: "1",
        createdAt: new Date(),
      });
    }
    res
      .status(HttpStatusCode.OK)
      .json({ status: true, message: "success", data: isCreated });
    logger.info(
      {
        controller: "employeeDsrController --->",
        method: "employeeDsr --->",
      },
      {
        payload: isCreated,
        msg: "employeeDsr added",
      }
    );
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "employeeDsr --->",
      },
      {
        empId: "employeeId" + empId,
        msg: "Catch error: " + error?.msg,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ error: error?.message });
  }
};

const getEmployeeDsr = async (req, res) => {
  const { skip = 0, limit = 0, empId } = req?.query;
  try {
    if (!empId) {
      throw new BadRequest();
    }
    const isExists = await EmployeeDsr.findAll({
      offset: parseInt(skip),
      limit: parseInt(limit),
    });

    if (isEmpty(isExists)) {
      throw new NotFound();
    }
    if (isExists) {
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: "success",
        data: isExists,
      });
      logger.info(
        {
          controller: "employeeDsrController --->",
          method: "getEmployeeDsr --->",
        },
        {
          empId: "employeeId" + empId,
          msg: "employeeDsr data ",
        }
      );
    }
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "getEmployeeDsr --->",
      },
      {
        empId: "employeeId" + empId,
        msg: "Catch error: " + error?.msg,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.message });
  }
};

const getSingleEmployeeDsr = async (req, res) => {
  const { id, empId } = req?.query;
  try {
    if (!id || !empId) {
      throw new BadRequest();
    }
    const isEmployeeExists = await EmployeeDsr.findOne({
      where: {
        id: id,
      },
    });
    if (isEmpty(getSingleEmployee)) {
      throw new NotFound();
    }
    res.status(HttpStatusCode.OK).send({
      status: true,
      data: getSingleEmployee,
      message: "success",
    });
    logger.info(
      {
        controller: "employeeDsrController --->",
        method: "getSingleEmployeeDsr---------->",
      },
      {
        empId: "employeeId" + empId,
        msg: "EmployeeDsr data" + empId,
      }
    );
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "getSingleEmployeeDsr---------->",
      },
      {
        empId: "employId: " + empId,
        msg: "Catch error:" + error?.msg,
      }
    );
    res
      .status(HttpStatusCode?.BAD_REQUEST)
      .json({ message: "user doesn't exist" });
  }
};

const updateEmployeeDsr = async (req, res) => {
  const {
    id,
    empId,
    projectId,
    workingDate,
    workingHours,
    taskDetail,
    taskStatus,
    taskMinutes,
  } = req?.body;
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
      throw new BadRequest();
    }
    const getUpdateEmployee = await EmployeeDsr.findOne({
      where: {
        id: id,
      },
    });
    if (isEmpty(getUpdateEmployee)) {
      throw new NotFound();
    }
    const isUpdated = await EmployeeDsr.update(
      {
        empId: empId,
        projectId: projectId,
        workingDate: workingDate,
        workingHours: workingHours,
        taskDetail: taskDetail,
        taskStatus: taskStatus,
        taskMinutes: taskMinutes,
        updatedBy: "1",
        updatedAt: new Date(),
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(HttpStatusCode.OK).send({
      status: true,
      message: "updated successfully",
      data: isUpdated,
    });
    logger.info(
      {
        controller: "employeeDsrController --->",
        method: "updateEmployeeDsr---------->",
      },
      {
        payload: isUpdated,
        msg: "EmployeeDsr updated,employeeId: " + empId,
      }
    );
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "updateEmployeeDsr---------->",
      },
      {
        empId: "employeeId:" + empId,
        msg: "Catch error:" + error?.msg,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.messages });
  }
};

const filterEmployeeDsr = async (req, res) => {
  const {
    skip = 0,
    limit = 0,
    empId,
    taskDetail,
    startDate,
    endDate,
  } = req?.query;

  try {
    if (!empId) {
      throw new BadRequest();
    }
    if (taskDetail && startDate && endDate) {
      var getFilterData = await EmployeeDsr.findAll({
        offset: parseInt(skip),
        limit: parseInt(limit),
        where: {
          taskDetail: taskDetail,
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
    } else if (taskDetail) {
      var getFilterData = await EmployeeDsr.findAll({
        offset: parseInt(skip),
        limit: parseInt(limit),
        where: {
          taskDetail: taskDetail,
        },
      });
    } else if (startDate && endDate) {
      var getFilterData = await EmployeeDsr.findAll({
        offset: parseInt(skip),
        limit: parseInt(limit),
        where: {
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
    }

    if (isEmpty(getFilterData)) {
      throw new NotFound();
    }
    res.status(HttpStatusCode?.OK).json({
      status: true,
      message: "success",
      data: getFilterData,
    });
    logger.info(
      {
        controller: "employeeDsrController --->",
        method: "find taskDetail in employeeDsr",
      },
      {
        payload: "employeeId:" + empId,
        msg: "taskDetail :" + taskDetail,
      }
    );
  } catch (error) {
    logger.error(
      {
        controller: "employeeDsrController --->",
        method: "find taskDetail in employeeDsr",
      },
      {
        payload: "employeeId: " + empId,
        msg: "Catch error: " + error?.msg,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({
      status: false,
      message: error?.message,
    });
  }
};

module.exports = {
  employeeDsr,
  getEmployeeDsr,
  getSingleEmployeeDsr,
  updateEmployeeDsr,
  filterEmployeeDsr,
};
