const db = require("../models/index");
const { isEmpty } = require("lodash");
const { logger } = require("../../helper/logger");
const employee = db.employeeDsr;
const HttpStatusCode = require("../../enums/httpErrorCodes");
const { BadRequest, NotFound } = require("../../helper/apiErros");

const { Op } = require("sequelize");
const employeeDsr = async (req, res) => {
  const employeeDSRdata = req?.body;
  const { empId } = req?.query;

  try {
    if (!employeeDSRdata) {
      0;
      throw new BadRequest();
    }
    let isCreated;
    for (let i = 0; i < employeeDSRdata.length; i++) {
      const currentEmployeeDSR = employeeDSRdata[i];
      isCreated = await employee.create({
        empId: empId.toUpperCase(),
        projectId: currentEmployeeDSR?.projectId,
        workingDate: currentEmployeeDSR?.workingDate,

        workingHours: currentEmployeeDSR?.taskMinutes,
        taskDetail: currentEmployeeDSR?.taskDetails,
        taskStatus: currentEmployeeDSR?.taskStatus,

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
    const isExists = await employee.findAll({
      offset: parseInt(skip),
      limit: parseInt(limit - skip),
      where: {
        empId,
      },
    });
    const totalCount = await employee.findAll({});

    if (isEmpty(isExists)) {
      throw new NotFound();
    }
    if (isExists) {
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: "success",
        data: { dsrList: isExists, totalCount: totalCount?.length },
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
    const isExists = await employee.findOne({
      where: {
        id: id,
      },
    });
    if (isEmpty(isExists)) {
      throw new NotFound();
    }
    res.status(HttpStatusCode.OK).send({
      status: true,
      data: isExists,
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
    const isExists = await employee.findOne({
      where: {
        id: id,
      },
    });
    if (isEmpty(isExists)) {
      throw new NotFound();
    }
    const isUpdated = await employee.update(
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
      var isExists = await employee.findAll({
        offset: parseInt(skip),
        limit: parseInt(limit - skip),
        where: {
          taskDetail: taskDetail,
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
    } else if (taskDetail) {
      var isExists = await employee.findAll({
        offset: parseInt(skip),
        limit: parseInt(limit - skip),
        where: {
          taskDetail: taskDetail,
        },
      });
    } else if (startDate && endDate) {
      var isExists = await employee.findAll({
        offset: parseInt(skip),
        limit: parseInt(limit - skip),
        where: {
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
    }
    if (taskDetail && startDate && endDate) {
      var totalFilterData = await employee.findAll({
        where: {
          taskDetail: taskDetail,
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
    } else if (taskDetail) {
      var totalFilterData = await employee.findAll({
        where: {
          taskDetail: taskDetail,
        },
      });
    } else if (startDate && endDate) {
      var totalFilterData = await employee.findAll({
        where: {
          workingDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
    }
    if (isEmpty(isExists)) {
      throw new NotFound();
    }
    res.status(HttpStatusCode?.OK).json({
      status: true,
      message: "success",
      data: { dsrList: isExists, totalCount: totalFilterData?.length },
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
      statusCode: error?.httpCode,
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
