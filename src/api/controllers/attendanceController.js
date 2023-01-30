const db = require("../models/index");
const { isEmpty } = require("lodash");
const { logger } = require("../../helper/logger");
const MessageTag = require("../../enums/messageNums");
const ObjectHelper = require("../../helper");

const GlobalTypeCategory = db.globalTypeCategory;

const markAttendance = async (req, res) => {
  const { markDate, timeIn, timeout, empId } = req?.body;
  console.log(markDate);
  console.log(timeIn);
  console.log(timeout);
  console.log(empId);

  if (!isEmpty(markDate)) {
    const displayName = globalTypeCategoryParam?.name;
    logger.warn(
      {
        component: "globalTypeCategory --->",
        method: "addGlobalTypeCategory --->",
      },
      { payload: displayName, msg: "Add global type categoey started....." }
    );
    const uniqueValue = globalTypeCategoryParam?.name
      ?.replace(/ /g, "_")
      .toLowerCase();
    try {
      if (!displayName) throw new Error(MessageTag.ALL_REQ);
      const isExists = await GlobalTypeCategory.findOne({
        where: { displayName: displayName, uniqueValue: uniqueValue },
      });
      if (!isEmpty(isExists)) {
        logger.error(
          {
            component: "globalTypeCategory --->",
            method: "addGlobalTypeCategory --->",
          },
          {
            payload: displayName,
            msg: "Global type categoey already exists.....",
          }
        );
        res.status(400).json({ status: false, error: MessageTag.EXIST_GTC });
        return;
      }
      const result = await GlobalTypeCategory.create({
        displayName,
        uniqueValue,
        createdBy: "1",
        updatedBy: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      data = ObjectHelper.formatKeys(result.dataValues);
      res.status(200).send({
        status: true,
        message: MessageTag.GTC_ADD,
        data: data,
      });
      logger.info(
        {
          component: "globalTypeCategory --->",
          method: "addGlobalTypeCategory --->",
        },
        {
          data: isExists,
          msg: "Global category added: " + displayName,
        }
      );
    } catch (error) {
      logger.error(
        {
          component: "globalTypeCategory --->",
          method: "addGlobalTypeCategory --->",
        },
        {
          payload: displayName,
          msg: "Catch error: " + error?.message,
        }
      );
      res.status(400).json({ status: false, error: error?.message });
    }
  }
};

const updateGlobalTypeCategory = async (req, res) => {
  const { id } = req?.params;
  const globalTypeCategoryParam = req?.body;
  if (!isEmpty(globalTypeCategoryParam)) {
    const displayName = globalTypeCategoryParam?.name;
    const uniqueValue = globalTypeCategoryParam?.name
      ?.replace(/ /g, "_")
      .toLowerCase();
    logger.warn(
      {
        component: "globalTypeCategory --->",
        method: "updateGlobalTypeCategory --->",
      },
      { payload: displayName, msg: "Update global type categoey started....." }
    );

    try {
      if (!displayName) throw new Error(MessageTag.ALL_REQ);
      const isExists = await GlobalTypeCategory.findOne({
        where: { displayName: displayName, uniqueValue: uniqueValue },
      });
      if (!isEmpty(isExists)) {
        logger.error(
          {
            component: "globalTypeCategory --->",
            method: "updateGlobalTypeCategory --->",
          },
          {
            payload: displayName,
            msg: "Global type categoey already exists.....",
          }
        );
        res.status(400).json({ status: false, error: MessageTag.EXIST_GTC });
        return;
      }

      const result = await GlobalTypeCategory.update(
        {
          displayName,
          uniqueValue,
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
        message: MessageTag.GTC_UPDATE,
      });
      logger.info(
        {
          component: "globalTypeCategory --->",
          method: "updateGlobalTypeCategory --->",
        },
        {
          data: isExists,
          msg: "Global category updated,Id: " + id,
        }
      );
    } catch (error) {
      logger.error(
        {
          component: "globalTypeCategory --->",
          method: "updateGlobalTypeCategory --->",
        },
        {
          payload: displayName,
          msg: "Catch error: " + error?.message,
        }
      );
      res.status(400).json({ status: false, error: error?.message });
    }
  }
};

const deleteGlobalTypeCategory = async (req, res) => {
  const { id } = req?.params;
  logger.warn(
    {
      component: "globalTypeCategory --->",
      method: "deleteGlobalTypeCategory --->",
    },
    { payload: id, msg: "Delete global type categoey started....." }
  );

  try {
    const isExists = await GlobalTypeCategory.findOne({
      where: { id: id },
    });
    if (isEmpty(isExists)) {
      logger.error(
        {
          component: "globalTypeCategory --->",
          method: "deleteGlobalTypeCategory --->",
        },
        {
          payload: id,
          msg: "Global type categoey not exists.....",
        }
      );
      res.status(400).json({ status: false, error: MessageTag.GTC_NOT });
      return;
    }

    const result = await GlobalTypeCategory.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send({
      status: true,
      message: MessageTag.GTC_DELETE,
    });
    logger.info(
      {
        component: "globalTypeCategory --->",
        method: "deleteGlobalTypeCategory --->",
      },
      {
        data: isExists,
        msg: "Global category deleted,Id: " + id,
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "globalTypeCategory --->",
        method: "deleteGlobalTypeCategory --->",
      },
      {
        payload: id,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(400).json({ status: false, error: error?.message });
  }
};

const getGlobalTypeCategory = async (req, res) => {
  logger.warn(
    {
      component: "globalTypeCategory --->",
      method: "getGlobalTypeCategory --->",
    },
    { payload: null, msg: "Get global type categoey started....." }
  );

  try {
    const result = await GlobalTypeCategory.findAll();
    res.status(200).send({
      status: true,
      message: MessageTag.GTC_LIST,
      data: result,
    });
    logger.info(
      {
        component: "globalTypeCategory --->",
        method: "getGlobalTypeCategory --->",
      },
      {
        payload: null,
        msg: "Global category List: ",
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "globalTypeCategory --->",
        method: "getGlobalTypeCategory --->",
      },
      {
        payload: null,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(400).json({ status: false, error: error?.message });
  }
};

const updateStatusGlobalTypeCategory = async (req, res) => {
  const { id } = req?.params;
  const globalTypeCategoryParam = req?.body;
  if (!isEmpty(globalTypeCategoryParam)) {
    if (globalTypeCategoryParam?.isActive == 1) {
      isActive = 0;
    } else {
      isActive = 1;
    }
    logger.warn(
      {
        component: "globalTypeCategory --->",
        method: "updateStatusGlobalTypeCategory --->",
      },
      {
        payload: globalTypeCategoryParam,
        msg: "Update status global type categoey started.....",
      }
    );

    try {
      const isExists = await GlobalTypeCategory.findOne({
        where: { id: id },
      });
      if (isEmpty(isExists)) {
        logger.error(
          {
            component: "globalTypeCategory --->",
            method: "updateStatusGlobalTypeCategory --->",
          },
          {
            payload: globalTypeCategoryParam,
            msg: "Global type categoey not exists.....",
          }
        );
        res.status(400).json({ status: false, error: MessageTag.GTC_NOT });
        return;
      }

      const result = await GlobalTypeCategory.update(
        {
          isActive,
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
        message: MessageTag.GTC_UPDATE,
      });
      logger.info(
        {
          component: "globalTypeCategory --->",
          method: "updateStatusGlobalTypeCategory --->",
        },
        {
          data: isExists,
          msg: "Global category updated,Id: " + id,
        }
      );
    } catch (error) {
      logger.error(
        {
          component: "globalTypeCategory --->",
          method: "updateStatusGlobalTypeCategory --->",
        },
        {
          payload: displayName,
          msg: "Catch error: " + error?.message,
        }
      );
      res.status(400).json({ status: false, error: error?.message });
    }
  }
};
module.exports = {
  markAttendance,
  updateGlobalTypeCategory,
  deleteGlobalTypeCategory,
  getGlobalTypeCategory,
  updateStatusGlobalTypeCategory,
};
