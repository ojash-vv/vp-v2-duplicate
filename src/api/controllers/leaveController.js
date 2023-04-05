const db = require("../models/index");
const { isEmpty } = require("lodash");
const { logger } = require("../../helper/logger");
const MessageTag = require("../../enums/messageNums");
const ObjectHelper = require("../../helper");
const sequelize = require("sequelize");
const HttpStatusCode = require("../../enums/httpErrorCodes");

const Employee = db.employee;
const EmployeeLeave = db.employeeLeave;

const markLeave = async (req, res) => {
  const { leaveDate, empId = null, leaveType, leaveReason = null,userRole=null ,employeeId=null } = req?.body;
  const startDate = new Date(leaveDate[0]);
  const enadDate = new Date(leaveDate[1]);
  const startDateUtc = new Date(startDate.setDate(startDate.getDate() + 1));
  const enadDateUtc = new Date(enadDate.setDate(enadDate.getDate() + 1));

  const leaveDays = ObjectHelper.getDates(startDateUtc, enadDateUtc);
  let leaveStatus;
  logger.warn(
    {
      component: "leaveController --->",
      method: "markLeave --->",
    },
    { payload: req?.body, msg: "Mark Leave started....." }
  );

  try {
    if (!startDateUtc || !enadDateUtc || !leaveType || !empId) {
      throw new Error(MessageTag.ALL_REQ);
    }
    leaveDays.forEach(async function (date) {
      const LeaveDate = ObjectHelper.formatDate(date);

      const isExists = await EmployeeLeave.findOne({
        where: {
          where: sequelize.where(
            sequelize.col("leaveDays"),
            "like",
            `%${LeaveDate}%`
          ),
          $and: sequelize.where(sequelize.col("empId"), "=", empId),
        },
      });
      if (!isEmpty(isExists)) {
      }
    });
    const isExists = await EmployeeLeave.findOne({
      where: {
        where: sequelize.where(
          sequelize.fn("date", sequelize.col("leaveFrom")),
          "=",
          sequelize.fn("date", startDateUtc)
        ),
        $and: sequelize.where(sequelize.col("empId"), "=", empId),
      },
    });

    if (!isEmpty(isExists)) {
      logger.error(
        {
          component: "leaveController --->",
          method: "markLeave --->",
        },
        {
          payload: req?.body,
          msg: "Leave already marked.....",
        }
      );
      res.status(HttpStatusCode.BAD_REQUEST).json({
        status: false,
        message: MessageTag.LEAVE_EXIST,
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
      return;
    }
    if(userRole=='admin')
    {    
      leaveStatus==1
  }
  else{
    leaveStatus==0
  }
    const result = await EmployeeLeave.create({
      empId,
      leaveType,
      leaveFrom: startDateUtc,
      leaveTo: enadDateUtc,
      leaveDays: leaveDays,
      leaveReason,
      leaveStatus: leaveStatus,
      createdBy: employeeId,
      updatedBy: employeeId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    data = ObjectHelper.formatKeys(result.dataValues);
    if (!isEmpty(result)) {
      res.status(200).send({
        status: true,
        message: MessageTag.LEAVE_MARK,
        data: data,
        statusCode: HttpStatusCode.OK,
      });
      logger.info(
        {
          component: "leaveController --->",
          method: "markLeave --->",
        },
        {
          data: isExists,
          msg: "Leave Marked for: " + empId,
        }
      );
    }
  } catch (error) {
    logger.error(
      {
        component: "leaveController --->",
        method: "markLeave --->",
      },
      {
        payload: req?.body,
        msg: "Catch error: " + error?.message,
      }
    );
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
  return;
};

const updateLeave = async (req, res) => {
  const { id } = req?.params;
  const { leaveDate, empId = null, leaveType, leaveReason = null, employeeId = null  } = req?.body;

  const startDate = new Date(leaveDate[0]);
  const enadDate = new Date(leaveDate[1]);

  const startDateUtc = new Date(startDate.setDate(startDate.getDate() + 1));
  const enadDateUtc = new Date(enadDate.setDate(enadDate.getDate() + 1));

  const leaveDays = ObjectHelper.getDates(startDateUtc, enadDateUtc);

  logger.warn(
    {
      component: "leaveController --->",
      method: "updateLeave --->",
    },
    { payload: req?.body, msg: "Update Leave started....." }
  );

  try {
    if (!startDateUtc || !enadDateUtc || !leaveType || !empId) {
      throw new Error(MessageTag.ALL_REQ);
    }
    leaveDays.forEach(async function (date) {
      const LeaveDate = ObjectHelper.formatDate(date);
      const isExists = await EmployeeLeave.findOne({
        where: {
          where: sequelize.where(
            sequelize.col("leaveDays"),
            "like",
            `%${LeaveDate}%`
          ),
          $and: sequelize.where(sequelize.col("empId"), "=", empId),
        },
      });
      if (!isEmpty(isExists)) {
      }
    });
    const isExists = await EmployeeLeave.findOne({
      where: {
        where: sequelize.where(
          sequelize.fn("date", sequelize.col("leaveFrom")),
          "=",
          sequelize.fn("date", startDateUtc)
        ),
        $and: sequelize.where(sequelize.col("empId"), "=", empId),
      },
    });
    if (!isEmpty(isExists) && isExists?.id != id) {
      logger.error(
        {
          component: "leaveController --->",
          method: "updateLeave --->",
        },
        {
          payload: req?.body,
          msg: "Leave already marked.....",
        }
      );
      res.status(HttpStatusCode.BAD_REQUEST).json({
        status: false,
        message: MessageTag.LEAVE_EXIST,
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
      return;
    }

    const result = await EmployeeLeave.update(
      {
        empId,
        leaveType,
        leaveFrom: startDateUtc,
        leaveTo: enadDateUtc,
        leaveDays: leaveDays,
        leaveReason,
        leaveStatus: '1',
        updatedBy: employeeId,
        updatedAt: new Date(),
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (!isEmpty(result)) {
      res.status(200).send({
        status: true,
        message: MessageTag.LEAVE_UPDATED,
        statusCode: HttpStatusCode.OK,
      });

      logger.info(
        {
          component: "leaveController --->",
          method: "updateLeave --->",
        },
        {
          data: isExists,
          msg: "Leave Marked for: " + empId,
        }
      );
    }
  } catch (error) {
    logger.error(
      {
        component: "leaveController --->",
        method: "updateLeave --->",
      },
      {
        payload: req?.body,
        msg: "Catch error: " + error?.message,
      }
    );
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
  return;
};

const getEmployeeLeave = async (req, res) => {
  logger.warn(
    {
      component: "leaveController --->",
      method: "getEmployeeLeave --->",
    },
    { payload: null, msg: "Get Employee Leave started....." }
  );

  try {
    const result = await EmployeeLeave.findAll({
      where: {
        where: sequelize.where(sequelize.col("leaveStatus"), "=", "1"),
      },
    });
    const [results, metadata] = await db.sequelize.query(
      "SELECT emp_apply_leave.id,emp_apply_leave.empId,emp_apply_leave.leaveFrom,emp_apply_leave.leaveTo,emp_apply_leave.leaveType,emp_apply_leave.leaveDays,emp_apply_leave.leaveReason,emp_apply_leave.leaveStatus,vp_users.userName FROM emp_apply_leave JOIN vp_users ON emp_apply_leave.empId = vp_users.empId"
    );
    res.status(200).send({
      status: true,
      data: results,
    });
    logger.info(
      {
        component: "leaveController --->",
        method: "getEmployeeLeave --->",
      },
      {
        payload: null,
        msg: "Employee Leave List: ",
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "leaveController --->",
        method: "getEmployeeLeave --->",
      },
      {
        payload: null,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(400).json({ status: false, error: error?.message });
  }
};

const getEmployeeDayLeave = async (req, res) => {
  logger.warn(
    {
      component: "leaveController --->",
      method: "getEmployeeDayLeave --->",
    },
    { payload: null, msg: "Get Employee Day Leave started....." }
  );
  const nowDate = new Date();
  const todayDate = ObjectHelper.formatDate(nowDate);

  try {
    const [results, metadata] = await db.sequelize.query(
      `SELECT emp_apply_leave.id,emp_apply_leave.empId,emp_apply_leave.leaveFrom,emp_apply_leave.leaveTo,emp_apply_leave.leaveType,emp_apply_leave.leaveReason,vp_users.userName FROM emp_apply_leave JOIN vp_users ON emp_apply_leave.empId = vp_users.empId where leaveDays like '%${todayDate}%' and leaveStatus=1 and leaveType!='work_from_home'`
    );

    const [results_WFH, metadata_WFH] = await db.sequelize.query(
      `SELECT emp_apply_leave.id,emp_apply_leave.empId,emp_apply_leave.leaveFrom,emp_apply_leave.leaveTo,emp_apply_leave.leaveType,emp_apply_leave.leaveReason,vp_users.userName FROM emp_apply_leave JOIN vp_users ON emp_apply_leave.empId = vp_users.empId where leaveDays like '%${todayDate}%' and leaveStatus=1 and leaveType='work_from_home'`
    );
    res.status(200).send({
      status: true,
      data: results,
      dataWFH: results_WFH,
    });
    logger.info(
      {
        component: "leaveController --->",
        method: "getEmployeeDayLeave --->",
      },
      {
        payload: null,
        msg: "Employees Day Leave List: ",
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "leaveController --->",
        method: "getEmployeeDayLeave --->",
      },
      {
        payload: null,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(400).json({ status: false, error: error?.message });
  }
};
module.exports = {
  markLeave,
  updateLeave,
  getEmployeeLeave,
  getEmployeeDayLeave,
};
