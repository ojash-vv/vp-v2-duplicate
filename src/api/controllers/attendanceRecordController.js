const db = require("../models/index");
const { Op } = require("sequelize");
const HttpStatusCode = require("../../enums/httpErrorCodes");
const { BadRequest, NotFound } = require("../../helper/apiErros");
const { logger } = require("../../helper/logger");
const monthNames = require("../../enums/monthName");
const { isEmpty } = require("lodash");
const employee = db.AttendenceRecord;

const attendanceRecord = async (req, res) => {
  const employeeNewArr = [];
  const { year, empId } = req?.query;
  try {
    if (!year || !empId) {
      throw new BadRequest();
    }
    const isExist = await employee.findAll({
      where: {
        empId: empId,
        createdAt: {
          [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)],
        },
      },
    });
    if (isEmpty(isExist)) {
      throw new NotFound();
    }
    for (let i = 0; i < 12; i++) {
      const newAttendance = isExist.filter(
        (data) => new Date(data.createdAt).getMonth() === i
      );
      const month = monthNames[i];
      const daysInMonth = new Date(year, i + 1, 0).getDate();
      const weekends = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, i, day, 12, 0, 0);
        if (date.getDay() === 0 || date.getDay() === 6) {
          weekends.push(date);
        }
      }
      const weekdaysInMonth = daysInMonth - weekends.length;
      const employeePresentDays = newAttendance.length;

      if (weekdaysInMonth || employeePresentDays) {
        const employeeData = {
          month: month,
        };
        employeeData.data = {
          presenDays: employeePresentDays,
          workingDays: weekdaysInMonth,
        };
        employeeNewArr.push(employeeData);
      }
    }
    res
      .status(HttpStatusCode?.OK)
      .json({ status: true, message: "success", data: employeeNewArr });
    logger.info(
      {
        component: "attendanceRecord",
        method: "get employee attendanceRecord",
      },
      {
        empId: "employeeId" + empId,
        msg: "employess attendance record",
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "attendanceRecord",
        method: "get employee attendanceRecord",
      },
      {
        empId: "employeeId" + empId,
        msg: "catch error" + error?.msg,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.message });
  }
};
const allEmployeeAttendance = async (req, res) => {
  const employeeNewArr = [];
  const { year, empId, skip = 0, limit = 0 } = req?.query;
  try {
    if (!year || !empId) {
      throw new BadRequest();
    }
    const isExist = await employee.findAll({
      offset: parseInt(skip),
      limit: parseInt(limit),
      where: {
        createdAt: {
          [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)],
        },
      },
    });
    console.log(isExist);
    if (isEmpty(isExist)) {
      throw new NotFound();
    }
    const processedIds = {};
    for (let i = 0; i < isExist.length; i++) {
      const empId = isExist[i].empId;
      if (!processedIds[empId]) {
        processedIds[empId] = true;
        const currentEmployeeData = {
          empId: empId,
          data: [],
        };
        for (let j = 0; j < 12; j++) {
          const newAttendance = isExist.filter(
            (data) =>
              data.empId === empId && new Date(data.createdAt).getMonth() === j
          );
          const month = monthNames[j];
          const daysInMonth = new Date(year, j + 1, 0).getDate();
          const weekends = [];
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, j, day, 12, 0, 0);
            if (date.getDay() === 0 || date.getDay() === 6) {
              weekends.push(date);
            }
          }
          const weekdaysInMonth = daysInMonth - weekends.length;
          const employeePresentDays = newAttendance.length;

          if (weekdaysInMonth || employeePresentDays) {
            currentEmployeeData.data.push({
              month: month,
              presentDays: employeePresentDays,
              workingDays: weekdaysInMonth,
            });
          }
        }
        employeeNewArr.push(currentEmployeeData);
      }
    }
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: "success",
      data: employeeNewArr,
    });
    logger.info(
      {
        component: "attendanceRecord",
        method: "get all employee attendanceRecord",
      },
      {
        empId: "employeeId" + empId,
        msg: "get all employee attendance record",
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "attendanceRecord",
        method: "get all employee attendanceRecord",
      },
      {
        empId: "employeeId" + empId,
        msg: "catch error" + error?.msg,
      }
    );
    res.status(HttpStatusCode.BAD_REQUEST).json({
      status: false,
      message: "error",
      error: error.message,
    });
  }
};
module.exports = {
  attendanceRecord,
  allEmployeeAttendance,
};
