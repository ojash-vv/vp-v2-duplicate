const { isEmpty } = require("lodash")
const db = require("../models/index")
const { logger } = require("../../helper/logger")
const MessageTag = require("../../enums/messageNums")

const GlobalTypeCategory = db.globalTypeCategory

const updateGlobalTypeCategory = async (req, res) => {
  const { id } = req.params
  const globalTypeCategoryParam = req?.body
  if (!isEmpty(globalTypeCategoryParam)) {
    const displayName = globalTypeCategoryParam?.name
    const uniqueValue = globalTypeCategoryParam?.name?.replace(/ /g, "_").toLowerCase()
    logger.warn(
      {
        component: "globalTypeCategory --->",
        method: "updateGlobalTypeCategory --->",
      },
      { payload: displayName, msg: "Update global type category started....." },
    )

    try {
      if (!displayName) throw new Error(MessageTag.ALL_REQ)
      const isExists = await GlobalTypeCategory.findOne({
        where: { displayName, uniqueValue },
      })
      if (!isEmpty(isExists)) {
        logger.error(
          {
            component: "globalTypeCategory --->",
            method: "updateGlobalTypeCategory --->",
          },
          {
            payload: displayName,
            msg: "Global type category already exists.....",
          },
        )
        res.status(400).json({ status: false, error: MessageTag.EXIST_GTC })
        return
      }
      await GlobalTypeCategory.update(
        {
          displayName,
          uniqueValue,
          updatedBy: "1",
          updatedAt: new Date(),
        },
        {
          where: {
            id,
          },
        },
      )
      res.status(200).send({
        status: true,
        message: MessageTag.GTC_UPDATE,
      })
      logger.info(
        {
          component: "globalTypeCategory --->",
          method: "updateGlobalTypeCategory --->",
        },
        {
          data: isExists,
          msg: `Global category updated with Id: ${id}`,
        },
      )
    } catch (error) {
      logger.error(
        {
          component: "globalTypeCategory --->",
          method: "updateGlobalTypeCategory --->",
        },
        {
          payload: displayName,
          msg: `Catch error: ${error?.message}`,
        },
      )
      res.status(400).json({ status: false, error: error?.message })
    }
  }
}

const deleteGlobalTypeCategory = async (req, res) => {
  const { id } = req.params
  logger.warn(
    {
      component: "globalTypeCategory --->",
      method: "deleteGlobalTypeCategory --->",
    },
    { payload: id, msg: "Delete global type categoey started....." },
  )

  try {
    const isExists = await GlobalTypeCategory.findOne({
      where: { id },
    })
    if (isEmpty(isExists)) {
      logger.error(
        {
          component: "globalTypeCategory --->",
          method: "deleteGlobalTypeCategory --->",
        },
        {
          payload: id,
          msg: "Global type categoey not exists.....",
        },
      )
      res.status(400).json({ status: false, error: MessageTag.GTC_NOT })
      return
    }

    await GlobalTypeCategory.destroy({
      where: {
        id,
      },
    })
    res.status(200).send({
      status: true,
      message: MessageTag.GTC_DELETE,
    })
    logger.info(
      {
        component: "globalTypeCategory --->",
        method: "deleteGlobalTypeCategory --->",
      },
      {
        data: isExists,
        msg: `Global category deleted with Id: ${id}`,
      },
    )
  } catch (error) {
    logger.error(
      {
        component: "globalTypeCategory --->",
        method: "deleteGlobalTypeCategory --->",
      },
      {
        payload: id,
        msg: `Catch error: ${error?.message}`,
      },
    )
    res.status(400).json({ status: false, error: error?.message })
  }
}

const getGlobalTypeCategory = async (req, res) => {
  logger.warn(
    {
      component: "globalTypeCategory --->",
      method: "getGlobalTypeCategory --->",
    },
    { payload: null, msg: "Get global type categoey started....." },
  )

  try {
    const result = await GlobalTypeCategory.findAll()
    res.status(200).send({
      status: true,
      message: MessageTag.GTC_LIST,
      data: result,
    })
    logger.info(
      {
        component: "globalTypeCategory --->",
        method: "getGlobalTypeCategory --->",
      },
      {
        payload: null,
        msg: "Global category List: ",
      },
    )
  } catch (error) {
    logger.error(
      {
        component: "globalTypeCategory --->",
        method: "getGlobalTypeCategory --->",
      },
      {
        payload: null,
        msg: `Catch error: ${error?.message}`,
      },
    )
    res.status(400).json({ status: false, error: error?.message })
  }
}

const updateStatusGlobalTypeCategory = async (req, res) => {
  const { id } = req.params
  const globalTypeCategoryParam = req?.body
  if (!isEmpty(globalTypeCategoryParam)) {
    const isActive = globalTypeCategoryParam?.isActive === 1 ? 0 : 1
    logger.warn(
      {
        component: "globalTypeCategory --->",
        method: "updateStatusGlobalTypeCategory --->",
      },
      {
        payload: globalTypeCategoryParam,
        msg: "Update status global type category started.....",
      },
    )

    try {
      const isExists = await GlobalTypeCategory.findOne({
        where: { id },
      })
      if (isEmpty(isExists)) {
        logger.error(
          {
            component: "globalTypeCategory --->",
            method: "updateStatusGlobalTypeCategory --->",
          },
          {
            payload: globalTypeCategoryParam,
            msg: "Global type category not exists.....",
          },
        )
        res.status(400).json({ status: false, error: MessageTag.GTC_NOT })
        return
      }

      await GlobalTypeCategory.update(
        {
          isActive,
          updatedBy: "1",
          updatedAt: new Date(),
        },
        {
          where: {
            id,
          },
        },
      )
      res.status(200).send({
        status: true,
        message: MessageTag.GTC_UPDATE,
      })
      logger.info(
        {
          component: "globalTypeCategory --->",
          method: "updateStatusGlobalTypeCategory --->",
        },
        {
          data: isExists,
          msg: `Global category updated,Id: ${id}`,
        },
      )
    } catch (error) {
      logger.error(
        {
          component: "globalTypeCategory --->",
          method: "updateStatusGlobalTypeCategory --->",
        },
        {
          payload: null,
          msg: `Catch error: ${error?.message}`,
        },
      )
      res.status(400).json({ status: false, error: error?.message })
    }
  }
}
module.exports = {
  updateGlobalTypeCategory,
  deleteGlobalTypeCategory,
  getGlobalTypeCategory,
  updateStatusGlobalTypeCategory,
}
