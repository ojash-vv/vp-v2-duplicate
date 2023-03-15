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
      console.log(LeaveDate);

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
      res.status(400).json({ status: false, error: MessageTag.LeaveExist });
      return;
    }
    const result = await EmployeeLeave.create({
      empId,
      leaveType,
      leaveFrom: startDateUtc,
      leaveTo: enadDateUtc,
      leaveDays: leaveDays,
      leaveReason,
      createdBy: "1",
      updatedBy: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    data = ObjectHelper.formatKeys(result.dataValues);
    res.status(200).send({
      status: true,
      message: MessageTag.LeaveMarked,
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
module.exports = {
  markLeave,
};
