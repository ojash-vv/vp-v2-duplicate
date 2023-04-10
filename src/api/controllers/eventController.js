const { isEmpty } = require("lodash")
const sequelize = require("sequelize")
const db = require("../models/index")
const { logger } = require("../../helper/logger")
const MessageTag = require("../../enums/messageNums")
const ObjectHelper = require("../../helper")
const HttpStatusCode = require("../../enums/httpErrorCodes")

const Events = db.events

const addEvent = async (req, res) => {
  const {startEventDate,endEventDate, eventName, eventDesc } = req?.body;

  const startDateUtc = ObjectHelper.formatDate(startEventDate);
  const enadDateUtc = ObjectHelper.formatDate(endEventDate);
  const startDate = new Date(startDateUtc)
  const enadDate = new Date(enadDateUtc);


  const leaveDays = ObjectHelper.getDates(startDate, enadDate);

  logger.warn(
    {
      component: "eventController --->",
      method: "addEvent --->",
    },
    { payload: req?.body, msg: "Add event started....." },
  )

  try {
    if (!startDateUtc || !enadDateUtc || !eventName) {
      throw new Error(MessageTag.ALL_REQ)
    }

    const isExists = await Events.findOne({
      where: {
        where: sequelize.where(
          sequelize.fn("date", sequelize.col("eventStartDate")),
          "=",
          sequelize.fn("date", startDateUtc),
        ),
        $and: sequelize.where(sequelize.col("eventName"), "=", eventName),
      },
    })

    if (!isEmpty(isExists)) {
      logger.error(
        {
          component: "eventController --->",
          method: "addEvent --->",
        },
        {
          payload: req?.body,
          msg: "Event already marked.....",
        },
      )
      res.status(HttpStatusCode.BAD_REQUEST).json({
        status: false,
        message: MessageTag.EVENT_EXIST,
        statusCode: HttpStatusCode.BAD_REQUEST,
      })
      return
    }
    const result = await Events.create({
      eventName,
      eventStartDate: startDate,
      eventEndDate: enadDate,
      eventCategory: "event",
      eventDesc,
      createdBy: "1",
      updatedBy: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    const data = ObjectHelper.formatKeys(result.dataValues)
    if (!isEmpty(result)) {
      res.status(200).send({
        status: true,
        message: MessageTag.EVENT_MARKED,
        data,
        statusCode: HttpStatusCode.OK,
      })
      logger.info(
        {
          component: "eventController --->",
          method: "addEvent --->",
        },
        {
          data: isExists,
          msg: `Event Added: ${eventName}`,
        },
      )
    }
  } catch (error) {
    logger.error(
      {
        component: "eventController --->",
        method: "addEvent --->",
      },
      {
        payload: req?.body,
        msg: `Catch error: ${error?.message}`,
      },
    )
    if (error?.httpCode) {
      res.status(error?.httpCode).json({
        status: error?.isOperational,
        message: error?.message,
        statusCode: error?.httpCode,
      })
    }
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      status: false,
      message: error?.message,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
    })
  }
}

const updateEvent = async (req, res) => {
  const { id } = req?.params;
  const { startEventDate,endEventDate, eventName, eventDesc } = req?.body;

  const startDateUtc = ObjectHelper.formatDate(startEventDate);
  const enadDateUtc = ObjectHelper.formatDate(endEventDate);
  const startDate = new Date(startDateUtc)
  const enadDate = new Date(enadDateUtc);

  const leaveDays = ObjectHelper.getDates(startDate, enadDate);

  logger.warn(
    {
      component: "eventController --->",
      method: "updateEvent --->",
    },
    { payload: req?.body, msg: "Update Event started....." },
  )

  try {
    if (!startDateUtc || !enadDateUtc || !eventName) {
      throw new Error(MessageTag.ALL_REQ)
    }

    const isExists = await Events.findOne({
      where: {
        where: sequelize.where(
          sequelize.fn("date", sequelize.col("eventStartDate")),
          "=",
          sequelize.fn("date", startDateUtc),
        ),
        $and: sequelize.where(sequelize.col("eventName"), "=", eventName),
      },
    })

    if (!isEmpty(isExists) && isExists?.id !== id) {
      logger.error(
        {
          component: "eventController --->",
          method: "updateEvent --->",
        },
        {
          payload: req?.body,
          msg: "Event already marked.....",
        },
      )
      res.status(HttpStatusCode.BAD_REQUEST).json({
        status: false,
        message: MessageTag.EVENT_EXIST,
        statusCode: HttpStatusCode.BAD_REQUEST,
      })
      return
    }
    const result = await Events.update(
      {
        eventName,
        eventStartDate: startDate,
        eventEndDate: enadDate,
        eventCategory: "event",
        eventDesc,
        createdBy: "1",
        updatedBy: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      },
    )
    if (!isEmpty(result)) {
      res.status(200).send({
        status: true,
        message: MessageTag.EVENT_UPDATED,
        statusCode: HttpStatusCode.OK,
      })
      logger.info(
        {
          component: "eventController --->",
          method: "updateEvent --->",
        },
        {
          data: isExists,
          msg: `Event Updated: ${eventName}`,
        },
      )
    }
  } catch (error) {
    logger.error(
      {
        component: "eventController --->",
        method: "updateEvent --->",
      },
      {
        payload: req?.body,
        msg: `Catch error: ${error?.message}`,
      },
    )
    if (error?.httpCode) {
      res.status(error?.httpCode).json({
        status: error?.isOperational,
        message: error?.message,
        statusCode: error?.httpCode,
      })
    }
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      status: false,
      message: error?.message,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
    })
  }
}

const getEvents = async (req, res) => {
  logger.warn(
    {
      component: "eventController --->",
      method: "getEvents --->",
    },
    { payload: null, msg: "Get Events started....." },
  )

  try {
    const result = await Events.findAll({
      where: {
        where: sequelize.where(sequelize.col("isActive"), "=", "1"),
        $and: sequelize.where(sequelize.col("eventCategory"), "=", "event"),
      },
    })
    const holidayResult = await Events.findAll({
      where: {
        where: sequelize.where(sequelize.col("isActive"), "=", "1"),
        $and: sequelize.where(sequelize.col("eventCategory"), "=", "holiday"),
      },
    })
    res.status(200).send({
      status: true,
      eventData: result,
      holidayData: holidayResult,
    })
    logger.info(
      {
        component: "eventController --->",
        method: "getEvents --->",
      },
      {
        payload: null,
        msg: "Employee Leave List: ",
      },
    )
  } catch (error) {
    logger.error(
      {
        component: "eventController --->",
        method: "getEvents --->",
      },
      {
        payload: null,
        msg: `Catch error: ${error?.message}`,
      },
    )
    res.status(400).json({ status: false, error: error?.message })
  }
}
module.exports = {
  addEvent,
  updateEvent,
  getEvents,
}
