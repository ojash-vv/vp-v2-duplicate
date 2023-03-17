const db = require("../models/index");
const { isEmpty } = require("lodash");
const { logger } = require("../../helper/logger");
const MessageTag = require("../../enums/messageNums");
const ObjectHelper = require("../../helper");
const sequelize = require("sequelize");

const Employee = db.employee;
const EmployeeLeave = db.employeeLeave;

const markLeave = async (req, res) => {
  const { leaveDate, empId = null, leaveType, leaveReason = null } = req?.body;
  console.log(leaveDate);
  console.log(leaveDate[0]);

  const startDateUtc = new Date(leaveDate[0]);
  const enadDateUtc = new Date(leaveDate[1]);

  const leaveDays = ObjectHelper.getDates(startDateUtc, enadDateUtc);

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
      res.status(400).json({ status: false, error: MessageTag.LEAVE_EXIST });
      return;
    }
    const result = await EmployeeLeave.create({
      empId,
      leaveType,
      leaveFrom: startDateUtc,
      leaveTo: enadDateUtc,
      leaveDays: leaveDays,
      leaveReason,
      leaveStatus: "1",
      createdBy: "1",
      updatedBy: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    data = ObjectHelper.formatKeys(result.dataValues);
    res.status(200).send({
      status: true,
      message: MessageTag.LEAVE_MARK,
      data: data,
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
    res.status(400).json({ status: false, error: error?.message });
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
      "SELECT emp_apply_leave.empId,emp_apply_leave.leaveFrom,emp_apply_leave.leaveTo,vp_users.userName FROM emp_apply_leave JOIN vp_users ON emp_apply_leave.empId = vp_users.empId where leaveStatus=1"
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
module.exports = {
  markLeave,
  getEmployeeLeave,
};
