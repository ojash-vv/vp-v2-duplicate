const db = require("../models/index");
const { logger } = require("../../helper/logger");
const employee = db.employeeDsr;

const employeeDsr = async (req, res) => {
  const createEmployeeDsr = req?.body;
  try {
    let isCreated;
    for (let i = 0; i < createEmployeeDsr.length; i++) {
      const result = createEmployeeDsr[i];
      isCreated = await employee.create({
        empId: result.empId,
        projectId: result.projectId,
        workingDate: result.workingDate,
        workingHours: result.workingHours,
        taskDetail: result.taskDetail,
        taskStatus: result.taskStatus,
        taskMinutes: result.taskMinutes,
        createdBy: "1",
        createdAt: new Date(),
      });
    }
    res.status(200).json({ status: true, message: "success", data: isCreated });
    logger.info(
      {
        component: "employeeDsr --->",
        method: "addemployeeDsr --->",
      },
      {
        payload: null,
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
        payload: null,
        msg: "Catch error: " + error?.message,
      }
    );
    return res.status(400).json({ error: error?.message });
  }
};

const getEmployeeDsr = async (req, res) => {
  try {
    const result = await employee.findAll();
    if (result) {
      res.status(200).json({
        status: true,
        message: "success",
        data: result,
      });
      logger.info(
        {
          component: "employeeDsr --->",
          method: "getEmployeeDsr --->",
        },
        {
          payload: null,
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
        payload: null,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(400).json({ message: error?.message });
  }
};

const getSingleEmployeeDsr = async (req, res) => {
  const { id } = req?.params;
  try {
    const result = await employee.findOne({
      where: {
        id: id,
      },
    });
    res.status(200).send({
      status: true,
      data: result,
      message: "success",
    });
    logger.info(
      {
        compound: "EmployeeDsr------->",
        method: "getSingleEmployeeDsr---------->",
      },
      {
        payload: result,
        msg: "EmployeeDsr Id: " + id,
      }
    );

    res.status(400).json({ message: "user doesn't exist" });
  } catch (error) {
    logger.error(
      {
        compound: "EmployeeDsr------->",
        method: "getSingleEmployeeDsr---------->",
      },
      {
        payload: result,
        msg: "Catch error:" + error?.message,
      }
    );
    res.status(400).json({ message: "user doesn't exist" });
  }
};

const updateEmployeeDsr = async (req, res) => {
  const { id } = req?.params;
  const {
    empId,
    projectId,
    workingDate,
    workingHours,
    taskDetail,
    taskStatus,
    taskMinutes,
  } = req?.body;
  try {
    const isExists = await employee.findOne({
      where: {
        id: id,
      },
    });
    if (isExists) {
      const result = await employee.update(
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
      res.status(200).send({
        status: true,
        message: "updated successfully",
      });
      logger.info(
        {
          compound: "EmployeeDsr------->",
          method: "updateEmployeeDsr---------->",
        },
        {
          payload: result,
          msg: "EmployeeDsr updated,Id: " + id,
        }
      );
    } else {
      res.status(400).json({ message: "user doesn't exist" });
    }
  } catch (error) {
    logger.error(
      {
        compound: "EmployeeDsr------->",
        method: "updateEmployeeDsr---------->",
      },
      {
        payload: null,
        msg: "Catch error:" + error?.message,
      }
    );
    res.status(400).json({ message: error?.messages });
  }
};

module.exports = {
  employeeDsr,
  getEmployeeDsr,
  getSingleEmployeeDsr,
  updateEmployeeDsr,
};
