/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const { Op } = require("sequelize")
const { isEmpty } = require("lodash")
const db = require("../models/index")
const HttpStatusCode = require("../../enums/httpErrorCodes")
const { BadRequest, NotFound } = require("../../helper/apiErrors")
const { logger } = require("../../helper/logger")
const monthNames = require("../../enums/monthName")
const MessageTag = require("../../enums/messageNums");
const Attendance = db.attendanceRecord;
const Employee = db.employee;

const getWeekend = (daysInMonth, month, year) => {
  const weekends = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12, 0, 0)
    if (date.getDay() === 0 || date.getDay() === 6) {
      weekends.push(date)
    }
  }
  return weekends
}
const getAttendanceRecord = async (req, res) => {
  const { year, empId } = req.query
  try {
    if (!year || !empId) {
      throw new BadRequest()
    }
    const findAttendanceRecord = await Attendance.findAll({
      where: {
        empId,
        createdAt: {
          [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)],
        },
      },
    })
    if (isEmpty(findAttendanceRecord)) {
      throw new NotFound()
    }
    const employeeName = {
      data: [],
    }
    for (let i = 0; i < 12; i++) {
      const newAttendance = findAttendanceRecord.filter(
        (data) => new Date(data.createdAt).getMonth() === i,
      )
      const month = monthNames[i]
      const daysInMonth = new Date(year, i + 1, 0).getDate()
      const weekendsDaysInMonth = getWeekend(daysInMonth, i, year)
      const weekdaysInMonth = daysInMonth - weekendsDaysInMonth.length
      const employeePresentDays = newAttendance.length
      if (weekdaysInMonth || employeePresentDays) {
        employeeName.data.push(month, {
          presentDays: employeePresentDays,
          workingDays: weekdaysInMonth,
        })
      }
    }

    res.status(HttpStatusCode?.OK).json({
      status: true,
      message: "success",
      data: employeeName,
    })
    logger.info(
      {
        controller: "attendanceRecord",
        method: "get employee attendanceRecord",
      },
      {
        empId: `employeeId: ${empId}`,
        msg: "employees attendance record",
      },
    )
  } catch (error) {
    logger.error(
      {
        controller: "attendanceRecord",
        method: "get employee attendanceRecord",
      },
      {
        empId: `employeeId: ${empId}`,
        msg: `catch error: ${error?.msg}`,
      },
    )
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.message })
  }
}
const allEmployeeAttendance = async (req, res) => {
  const allEmployeeAttendanceRecords = []
  const { year, empId, skip = 0, limit = 0 } = req.query
  try {
    if (!year || !empId) {
      throw new BadRequest()
    }
    const fetchedRecords = await Attendance.findAll({
      offset: parseInt(skip, 10),
      limit: parseInt(limit - skip, 10),
      where: {
        createdAt: {
          [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)],
        },
      },
    });
    const totalCount = await Attendance.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)],
        },
      },
    })
    if (isEmpty(fetchedRecords)) {
      logger.error(
        {
          controller: "attendanceRecord",
          method: "get all employee attendanceRecord",
        },
        {
          empId: "employeeId" + empId,
          msg: "employee Attendance Doesn't exist",
        }
      );
      res.status(HttpStatusCode.NOT_FOUND).json({
        status: false,
        message: "Not found",
        error: MessageTag.ATTENDANCE_NOT_FOUND,
        statusCode: HttpStatusCode.NOT_FOUND,
      });
      return;
    }

    const processedIds = {};
    for (let i = 0; i < fetchedRecords.length; i++) {
      const { newEmpId } = fetchedRecords[i]
      if (!processedIds[empId]) {
        processedIds[empId] = true
        const employeeData = await Employee.findAll({
          where: {
            newEmpId,
          },
        })

        for (let user = 0; user < employeeData.length; user++) {
          const name = employeeData[user].userName
          const currentEmployeeData = {
            empId,
            name,
            data: [],
          }
          for (let j = 0; j < 12; j++) {
            const newAttendance = fetchedRecords.filter(
              (data) => data.empId === empId && new Date(data.createdAt).getMonth() === j,
            )
            const month = monthNames[j]
            const daysInMonth = new Date(year, j + 1, 0).getDate()
            const weekendsDaysInMonth = getWeekend(daysInMonth, j, year)
            const weekdaysInMonth = daysInMonth - weekendsDaysInMonth.length
            const employeePresentDays = newAttendance.length
            if (weekdaysInMonth || employeePresentDays) {
              currentEmployeeData.data.push({
                month,
                presentDays: employeePresentDays,
                workingDays: weekdaysInMonth,
              })
            }
          }
          allEmployeeAttendanceRecords.push(currentEmployeeData)
        }
      }
    }
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: "success",
      data: {
        attendanceList: allEmployeeAttendanceRecords,
        totalCount: totalCount?.length,
      },
    });
    logger.info(
      {
        controller: "attendanceRecord",
        method: "get all employee attendanceRecord",
      },
      {
        empId: `employeeId: ${empId}`,
        msg: "get all employee attendance record",
      },
    )
  } catch (error) {
    logger.error(
      {
        controller: "attendanceRecord",
        method: "get all employee attendanceRecord",
      },
      {
        empId: `employeeId${empId}`,
        msg: `catch error${error?.msg}`,
      },
    )
    res.status(HttpStatusCode.BAD_REQUEST).json({
      status: false,
      message: "error",
      error: error?.message,
    })
  }
}
module.exports = {
  getAttendanceRecord,
  allEmployeeAttendance,
}
