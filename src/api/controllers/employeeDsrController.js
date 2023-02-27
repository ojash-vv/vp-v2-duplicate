const db = require("../models/index");
const { isEmpty } = require("lodash");
const { logger } = require("../../helper/logger");
const employee = db.employeeDsr;
const HttpStatusCode = require("../../enums/httpErrorCodes");
const { BadRequest, NotFound } = require("../../helper/apiErros");
const employeeDsr = async (req, res) => {
  const employeeDSRdata = req?.body;
  const empId = employeeDSRdata.empId;
  try {
    if (!employeeDSRdata) {
      throw new BadRequest();
    }
    let isCreated;
    for (let i = 0; i < employeeDSRdata.length; i++) {
      const data = employeeDSRdata[i];
      isCreated = await employee.create({
        empId: data.empId,
        projectId: data.projectId,
        workingDate: data.workingDate,
        workingHours: data.workingHours,
        taskDetail: data.taskDetail,
        taskStatus: data.taskStatus,
        taskMinutes: data.taskMinutes,
        createdBy: "1",
        createdAt: new Date(),
      });
    }
    res
      .status(HttpStatusCode.OK)
      .json({ status: true, message: "success", data: isCreated });
    logger.info(
      {
        component: "employeeDsr --->",
        method: "addemployeeDsr --->",
      },
      {
        payload: isCreated,
        msg: "employeeDsr added",
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "employeeDsr --->",
        method: "addemployeeDsr --->",
      },
      {
        empId: "employeeId" + empId,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ error: error?.message });
  }
};

const getEmployeeDsr = async (req, res) => {
  const { empId } = req?.body;
  try {
    const isExists = await employee.findAll();
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
          component: "employeeDsr --->",
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
        component: "employeeDsr --->",
        method: "getEmployeeDsr --->",
      },
      {
        empId: "employeeId" + empId,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.message });
  }
};

const getSingleEmployeeDsr = async (req, res) => {
  const { id, empId } = req?.body;

  try {
    if (!id) {
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
        compound: "EmployeeDsr------->",
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
        compound: "EmployeeDsr------->",
        method: "getSingleEmployeeDsr---------->",
      },
      {
        empId: "employId" + empId,
        msg: "Catch error:" + error?.message,
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
        compound: "EmployeeDsr------->",
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
        compound: "EmployeeDsr------->",
        method: "updateEmployeeDsr---------->",
      },
      {
        empId: "employeeId" + empId,
        msg: "Catch error:" + error?.message,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.messages });
  }
};

module.exports = {
  employeeDsr,
  getEmployeeDsr,
  getSingleEmployeeDsr,
  updateEmployeeDsr,
};
