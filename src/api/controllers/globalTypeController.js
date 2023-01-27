const db = require("../models/index");
const { isEmpty } = require("lodash");
const { logger } = require("../../utils/logger");
const MessageTag = require("../../enums/messageNums");
const ObjectHelper = require("../../utils");

const GlobalType = db.globalType;
const GlobalTypeCategory = db.globalTypeCategory;

const masterGlobalType = async (req, res) => {
  const { category } = req?.params;

  logger.warn(
    {
      component: "globalType --->",
      method: "masterGlobalType --->",
    },
    { payload: category, msg: "Get master global type started....." }
  );

  try {
    const result = await GlobalType.findAll({
      where: {
        GlobalTypeCategory_uniqeValue: category,
      },
    });
    if (isEmpty(result)) {
      logger.error(
        {
          component: "globalType --->",
          method: "masterGlobalType --->",
        },
        {
          payload: category,
          msg: "Global type categoey not exists.....",
        }
      );
      res.status(400).json({ status: false, error: MessageTag.GTC_NOT });
      return;
    }

    res.status(200).send({
      status: true,
      data: result,
    });
    logger.info(
      {
        component: "globalType --->",
        method: "masterGlobalType --->",
      },
      {
        payload: category,
        msg: "Master global type list: ",
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "globalType --->",
        method: "masterGlobalType --->",
      },
      {
        payload: category,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(400).json({ status: false, error: error?.message });
  }
};

const addGlobalType = async (req, res) => {
  const globalTypeParam = req?.body;
  if (!isEmpty(globalTypeParam)) {
    const displayName = globalTypeParam?.name;
    const globalTypeCategory = globalTypeParam?.globalTypeCategory;
    logger.warn(
      {
        component: "globalType --->",
        method: "addGlobalType --->",
      },
      { payload: displayName, msg: "Add global type started....." }
    );
    const uniqueValue = globalTypeParam?.name?.replace(/ /g, "_").toLowerCase();
    try {
      if (!displayName || !globalTypeCategory)
        throw new Error(MessageTag.ALL_REQ);
      const isCategoryExists = await GlobalTypeCategory.findOne({
        where: {
          uniqueValue: globalTypeCategory,
        },
      });
      if (isEmpty(isCategoryExists)) {
        logger.error(
          {
            component: "globalType --->",
            method: "addGlobalType --->",
          },
          {
            payload: displayName,
            msg: "Global type Category not exists.....",
          }
        );
        res.status(400).json({ status: false, error: MessageTag.GTC_NOT });
        return;
      }
      const isExists = await GlobalType.findOne({
        where: {
          uniqueValue: uniqueValue,
          globalTypeCategory_uniqeValue: globalTypeCategory,
        },
      });
      if (!isEmpty(isExists)) {
        logger.error(
          {
            component: "globalType --->",
            method: "addGlobalType --->",
          },
          {
            payload: displayName,
            msg: "Global type already exists.....",
          }
        );
        res
          .status(400)
          .json({ status: false, error: MessageTag.GLOBALTYPE_EXIST });
        return;
      }
      const result = await GlobalType.create({
        displayName,
        uniqueValue,
        globalTypeCategory_uniqeValue: globalTypeCategory,
        createdBy: "1",
        updatedBy: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      data = ObjectHelper.formatKeys(result.dataValues);
      res.status(200).send({
        status: true,
        message: MessageTag.GLOBALTYPE_ADD,
        data: data,
      });
      logger.info(
        {
          component: "globalType --->",
          method: "addGlobalType --->",
        },
        {
          data: isExists,
          msg: "Global type added: " + displayName,
        }
      );
    } catch (error) {
      logger.error(
        {
          component: "globalType --->",
          method: "addGlobalType --->",
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

const updateGlobalType = async (req, res) => {
  const { id } = req?.params;
  const globalTypeParam = req?.body;
  if (!isEmpty(globalTypeParam)) {
    const displayName = globalTypeParam?.name;
    const uniqueValue = globalTypeParam?.name?.replace(/ /g, "_").toLowerCase();
    const globalTypeCategory = globalTypeParam?.globalTypeCategory;

    logger.warn(
      {
        component: "globalType --->",
        method: "updateGlobalType --->",
      },
      { payload: displayName, msg: "Update global type started....." }
    );

    try {
      if (!displayName || !globalTypeCategory)
        throw new Error(MessageTag.ALL_REQ);

      const isCategoryExists = await GlobalTypeCategory.findOne({
        where: {
          uniqueValue: globalTypeCategory,
        },
      });
      if (isEmpty(isCategoryExists)) {
        logger.error(
          {
            component: "globalType --->",
            method: "updateGlobalType --->",
          },
          {
            payload: displayName,
            msg: "Global type Category not exists.....",
          }
        );
        res.status(419).json({ status: false, error: MessageTag.GTC_NOT });
        return;
      }

      const isExists = await GlobalType.findOne({
        where: {
          uniqueValue: uniqueValue,
          globalTypeCategory_uniqeValue: globalTypeCategory,
        },
      });
      if (!isEmpty(isExists)) {
        logger.error(
          {
            component: "globalType --->",
            method: "updateGlobalType --->",
          },
          {
            payload: displayName,
            msg: "Global type already exists.....",
          }
        );
        res
          .status(400)
          .json({ status: false, error: MessageTag.GLOBALTYPE_EXIST });
        return;
      }

      const result = await GlobalType.update(
        {
          displayName,
          uniqueValue,
          globalTypeCategory_uniqeValue: globalTypeCategory,
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
        message: MessageTag.GLOBALTYPE_UPDATE,
      });
      logger.info(
        {
          component: "globalType --->",
          method: "updateGlobalType --->",
        },
        {
          data: isExists,
          msg: "Global type updated,Id: " + id,
        }
      );
    } catch (error) {
      logger.error(
        {
          component: "globalType--->",
          method: "updateGlobalType --->",
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

const deleteGlobalType = async (req, res) => {
  const { id } = req?.params;
  logger.warn(
    {
      component: "globalType --->",
      method: "deleteGlobalType--->",
    },
    { payload: id, msg: "Delete global type started....." }
  );

  try {
    const isExists = await GlobalType.findOne({
      where: { id: id },
    });
    if (isEmpty(isExists)) {
      logger.error(
        {
          component: "globalType --->",
          method: "deleteGlobalType --->",
        },
        {
          payload: id,
          msg: "Global type not exists.....",
        }
      );
      res
        .status(400)
        .json({ status: false, error: MessageTag.GLOBALTYPE_NOT_EXIST });
      return;
    }

    const result = await GlobalType.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send({
      status: true,
      message: MessageTag.GLOBALTYPE_DELETE,
    });
    logger.info(
      {
        component: "globalType --->",
        method: "deleteGlobalType--->",
      },
      {
        data: isExists,
        msg: "Global type deleted,Id: " + id,
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "globalType --->",
        method: "deleteGlobalType--->",
      },
      {
        payload: id,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(400).json({ status: false, error: error?.message });
  }
};

const getGlobalType = async (req, res) => {
  logger.warn(
    {
      component: "globalType --->",
      method: "getGlobalType --->",
    },
    { payload: null, msg: "Get global type started....." }
  );

  try {
    const result = await GlobalType.findAll();
    res.status(200).send({
      status: true,
      data: result,
    });
    logger.info(
      {
        component: "globalType --->",
        method: "getGlobalType --->",
      },
      {
        payload: null,
        msg: "Global type List: ",
      }
    );
  } catch (error) {
    logger.error(
      {
        component: "globalType --->",
        method: "getGlobalType --->",
      },
      {
        payload: null,
        msg: "Catch error: " + error?.message,
      }
    );
    res.status(400).json({ status: false, error: error?.message });
  }
};

const updateStatusGlobalType = async (req, res) => {
  const { id } = req?.params;
  const globalTypeParam = req?.body;
  if (!isEmpty(globalTypeParam)) {
    if (globalTypeParam?.isActive == 1) {
      isActive = 0;
    } else {
      isActive = 1;
    }
    logger.warn(
      {
        component: "globalType --->",
        method: "updateStatusGlobalType --->",
      },
      {
        payload: globalTypeParam,
        msg: "Update status global type started.....",
      }
    );

    try {
      const isExists = await GlobalType.findOne({
        where: { id: id },
      });
      if (isEmpty(isExists)) {
        logger.error(
          {
            component: "globalType --->",
            method: "updateStatusGlobalType --->",
          },
          {
            payload: globalTypeParam,
            msg: "Global type not exists.....",
          }
        );
        res
          .status(400)
          .json({ status: false, error: MessageTag.GLOBALTYPE_NOT_EXIST });
        return;
      }

      const result = await GlobalType.update(
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
        message: MessageTag.GLOBALTYPE_UPDATE,
      });
      logger.info(
        {
          component: "globalType --->",
          method: "updateStatusGlobalType --->",
        },
        {
          data: isExists,
          msg: "Global type updated,Id: " + id,
        }
      );
    } catch (error) {
      logger.error(
        {
          component: "globalType --->",
          method: "updateStatusGlobalType --->",
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
  masterGlobalType,
  addGlobalType,
  updateGlobalType,
  deleteGlobalType,
  getGlobalType,
  updateStatusGlobalType,
};
