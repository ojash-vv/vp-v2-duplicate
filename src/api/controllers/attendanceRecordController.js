const db = require("../models/index");
const { Op } = require("sequelize");
const HttpStatusCode = require("../../enums/httpErrorCodes");
const { BadRequest, NotFound } = require("../../helper/apiErros");
const { logger } = require("../../helper/logger");
const monthNames = require("../../enums/monthName");
const { isEmpty } = require("lodash");
const AttendanceRecord = db.attendanceRecord;

const getWeekend = (daysInMonth, month, year) => {
  const weekends = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12, 0, 0);
    if (date.getDay() === 0 || date.getDay() === 6) {
      weekends.push(date);
    }
  }
  return weekends;
};
const getAttendanceRecord = async (req, res) => {
  const employeeAttendanceRecord = [];
  const { year, empId } = req?.query;
  try {
    if (!year || !empId) {
      throw new BadRequest();
    }
    const findAttendanceRecord = await AttendanceRecord.findAll({
      where: {
        empId: empId,
        createdAt: {
          [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)],
        },
      },
    });
    if (isEmpty(findAttendanceRecord)) {
      throw new NotFound();
    }
    for (let i = 0; i < 12; i++) {
      const newAttendance = findAttendanceRecord.filter(
        (data) => new Date(data.createdAt).getMonth() === i
      );
      const month = monthNames[i];
      const daysInMonth = new Date(year, i + 1, 0).getDate();
      const weekendsDaysInMonth = getWeekend(daysInMonth, i, year);
      const weekdaysInMonth = daysInMonth - weekendsDaysInMonth.length;
      const employeePresentDays = newAttendance.length;

      if (weekdaysInMonth || employeePresentDays) {
        const employeeData = {
          month: month,
        };
        employeeData.data = {
          presentDays: employeePresentDays,
          workingDays: weekdaysInMonth,
        };
        employeeAttendanceRecord.push(employeeData);
      }
    }
    res.status(HttpStatusCode?.OK).json({
      status: true,
      message: "success",
      data: employeeAttendanceRecord,
    });
    logger.info(
      {
        controller: "attendanceRecord",
        method: "getAttendanceRecord",
      },
      {
        empId: `employeeId: ${empId}`,
        msg: "employee attendance record",
      }
    );
  } catch (error) {
    logger.error(
      {
        controller: "attendanceRecord",
        method: "getAttendanceRecord",
      },
      {
        empId: `employeeId: ${empId}`,
        msg: `catch error: ${error?.message}`,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.message });
  }
};
const allEmployeeAttendance = async (req, res) => {
  const allEmployeeAttendanceRecords = [];
  const { year, empId, skip = 0, limit = 0 } = req?.query;
  try {
    if (!year || !empId) {
      throw new BadRequest();
    }
    const fetchedRecords = await AttendanceRecord.findAll({
      offset: parseInt(skip),
      limit: parseInt(limit),
      where: {
        createdAt: {
          [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)],
        },
      },
    });

    if (isEmpty(fetchedRecords)) {
      throw new NotFound();
    }
    const processedIds = {};
    for (let i = 0; i < fetchedRecords.length; i++) {
      const empId = fetchedRecords[i].empId;
      if (!processedIds[empId]) {
        processedIds[empId] = true;
        const currentEmployeeData = {
          empId: empId,
          data: [],
        };
        for (let j = 0; j < 12; j++) {
          const newAttendance = fetchedRecords.filter(
            (data) =>
              data.empId === empId && new Date(data.createdAt).getMonth() === j
          );
          const month = monthNames[j];
          const daysInMonth = new Date(year, j + 1, 0).getDate();
          const weekendsDaysInMonth = getWeekend(daysInMonth, j, year);
          const weekdaysInMonth = daysInMonth - weekendsDaysInMonth.length;
          const employeePresentDays = newAttendance.length;
          if (weekdaysInMonth || employeePresentDays) {
            currentEmployeeData.data.push({
              month: month,
              presentDays: employeePresentDays,
              workingDays: weekdaysInMonth,
            });
          }
        }
        allEmployeeAttendanceRecords.push(currentEmployeeData);
      }
    }
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: "success",
      data: allEmployeeAttendanceRecords,
    });
    logger.info(
      {
        controller: "attendanceRecord",
        method: "get all employee attendanceRecord",
      },
      {
        empId: `employeeId: ${empId}`,
        msg: "get all employee attendance record",
      }
    );
  } catch (error) {
    logger.error(
      {
        controller: "attendanceRecord",
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
  getAttendanceRecord,
  allEmployeeAttendance,
};
