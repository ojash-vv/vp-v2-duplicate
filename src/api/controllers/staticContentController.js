const { isEmpty } = require("lodash");
const HttpStatusCode = require("../../enums/httpErrorCodes");
const { BadRequest } = require("../../helper/apiErrors");
const { logger } = require("../../helper/logger");
const db = require("../models/index");
const staticContent = db.staticContent;
const updateStaticContent = async (req, res) => {
  const { empId, title, content } = req.body;
  try {
    if (!empId || !title || !content) {
      throw new BadRequest();
    }
    const checkExistContent = await staticContent.findAll({
      where: {
        title: title,
      },
    });
    if (isEmpty(checkExistContent)) {
      logger.error(
        {
          controller: "updateTermsCondition",
          method: "update term and condition",
        },
        {
          empId: "employeeId" + empId,
          msg: "Content Doesn't exist",
        }
      );
      res.status(HttpStatusCode?.NOT_FOUND).json({
        status: false,
        message: "Data doesn't exist",
        statusCode: HttpStatusCode?.NOT_FOUND,
      });
      return;
    } else {
      const updatedContent = await staticContent.update(
        {
          content: content,
          updatedBy: "1",
          updatedAt: new Date(),
        },
        {
          where: {
            title: title,
          },
        }
      );
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: "success",
        data: updatedContent,
        statusCode: HttpStatusCode.OK,
      });
      logger.info(
        {
          controller: "updateTermsCondition",
          method: "update term and condition",
        },
        {
          empId: "employeeId" + empId,
          msg: "update term and condition",
        }
      );
    }
  } catch (error) {
    logger.error(
      {
        controller: "updateTermsCondition",
        method: "update term and condition",
      },
      {
        empId: "employeeId" + empId,
        msg: "Catch error" + error?.msg,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.message });
  }
};

const getStaticContent = async (req, res) => {
  console.log(
    "🚀 ~ file: StaticContentController.js:81 ~ getStaticContent ~ req:",
    req?.query
  );

  const { empId, title } = req?.query;
  try {
    if (!empId || !title) {
      throw new BadRequest();
    }
    const getContent = await staticContent.findAll({
      where: {
        title: title,
      },
    });
    if (isEmpty(getContent)) {
      logger.error(
        {
          controller: "getStaticContent",
          method: "get static Content",
        },
        {
          empId: "employeeId" + empId,
          msg: "Content Doesn't exist",
        }
      );
      res.status(HttpStatusCode?.NOT_FOUND).json({
        status: false,
        message: "Data doesn't exist",
        statusCode: HttpStatusCode?.NOT_FOUND,
      });
      return;
    }
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: "successfully get Content",
      data: getContent,
      statusCode: HttpStatusCode.OK,
    });
    logger.info(
      {
        controller: "getStaticContent",
        method: "get static Content",
      },
      {
        empId: "employeeId" + empId,
        msg: "get static content",
      }
    );
  } catch (error) {
    logger.error(
      {
        controller: "getStaticContent",
        method: "get static Content",
      },
      {
        empId: "employeeId" + empId,
        msg: "Catch error" + error?.msg,
      }
    );
    res.status(HttpStatusCode?.BAD_REQUEST).json({ message: error?.message });
  }
};

module.exports = {
  updateStaticContent,
  getStaticContent,
};
