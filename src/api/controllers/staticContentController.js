const { isEmpty } = require("lodash")
const HttpStatusCode = require("../../enums/httpErrorCodes")
const { BadRequest, NotFound } = require("../../helper/apiErrors")
const { logger } = require("../../helper/logger")
const db = require("../models/index")

const { staticContent } = db

const updateStaticContent = async (req, res) => {
  const { empId, title, content } = req?.body
  try {
    if (!empId || !title || !content) {
      throw new BadRequest()
    }
    const checkExistingContent = await staticContent.findAll({
      where: {
        title,
      },
    })
    if (isEmpty(checkExistingContent)) {
      logger.error(
        {
          controller: "staticContentController",
          method: "updateStaticContent",
        },
        {
          empId: `employId: ${empId}`,
          msg: "Content Doesn't exist",
        },
      )
      throw new NotFound()
    } else {
      const updatedContent = await staticContent.update(
        {
          content,
          updatedBy: "1",
          updatedAt: new Date(),
        },
        {
          where: {
            title,
          },
        },
      )
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: "success",
        data: updatedContent,
        statusCode: HttpStatusCode.OK,
      })
      logger.info(
        {
          controller: "staticContentController",
          method: "updateStaticContent",
        },
        {
          empId: `employeeId${empId}`,
          msg: "static Content updated successfully",
        },
      )
    }
  } catch (error) {
    logger.error(
      {
        controller: "staticContentController",
        method: "updateStaticContent",
      },
      {
        empId: `employId: ${empId}`,
        msg: `Catch error:${error?.msg}`,
      },
    )
    if (error?.httpCode) {
      res.status(error?.httpCode || HttpStatusCode.INTERNAL_SERVER).json({
        status: error?.isOperational || false,
        message: error?.message,
        statusCode: error?.httpCode || HttpStatusCode.INTERNAL_SERVER,
      })
    }
  }
}

const getStaticContent = async (req, res) => {
  const { empId, title } = req?.query
  try {
    if (!empId || !title) {
      throw new BadRequest()
    }
    const getContent = await staticContent.findAll({
      where: {
        title,
      },
    })
    if (isEmpty(getContent)) {
      logger.error(
        {
          controller: "staticContentController",
          method: "getStaticContent",
        },
        {
          empId: `employId: ${empId}`,
          msg: "Content Doesn't exist",
        },
      )
      throw new NotFound()
    }
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: "successfully get staticContent",
      data: getContent,
      statusCode: HttpStatusCode.OK,
    })
    logger.info(
      {
        controller: "staticContentController",
        method: "getStaticContent",
      },
      {
        empId: `employeeId${empId}`,
        msg: "static content get successfully",
      },
    )
  } catch (error) {
    logger.error(
      {
        controller: "getStaticContent",
        method: "get static Content",
      },
      {
        empId: `employId: ${empId}`,
        msg: `Catch error:${error?.msg}`,
      },
    )
    if (error?.httpCode) {
      res.status(error?.httpCode || HttpStatusCode.INTERNAL_SERVER).json({
        status: error?.isOperational || false,
        message: error?.message,
        statusCode: error?.httpCode || HttpStatusCode.INTERNAL_SERVER,
      })
    }
  }
}

module.exports = {
  updateStaticContent,
  getStaticContent,
}
