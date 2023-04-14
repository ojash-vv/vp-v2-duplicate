const { isEmpty } = require('lodash')
const db = require('../models/index')
const HttpStatusCode = require('../../enums/httpErrorCodes')
const { BadRequest, NotFound } = require('../../helper/apiErrors')
const { logger } = require('../../helper/logger')

const FormBuilder = db.formBuilder

const getFormBuilderData = async (req, res) => {
  try {
    const FormBuilderData = await FormBuilder.findAll({})
    if (FormBuilder) {
      res.status(HttpStatusCode.OK).json({
        status: true,
        data: FormBuilderData,
        message: 'success',
      })
    }
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      status: false,
      message: error,
    })
  }
}

const createFormBuilder = async (req, res) => {
  const { formType, questionName, answerType, mcqOptions, selectionType, empId } = req.body
  try {
    if (!formType || !questionName || !answerType || !mcqOptions || !selectionType || !empId) {
      throw new BadRequest()
    }

    const isCreated = await FormBuilder.create({
      formType,
      questionName,
      answerType,
      mcqOptions,
      selectionType,
      isActive: 1,
      createdBy: empId,
      createdAt: new Date(),
    })
    if (!isEmpty(isCreated)) {
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: 'success',
        data: isCreated,
        statusCode: HttpStatusCode.OK,
      })
    }
  } catch (error) {
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
const updateFormBuilder = async (req, res) => {
  const { id, formType, questionName, answerType, mcqOptions, selectionType, isActive, empId } =
    req.body
  try {
    if (!id) {
      throw new BadRequest()
    }
    const isExists = await FormBuilder.findAll({
      where: {
        id,
      },
    })
    if (isEmpty(isExists)) {
      logger.error(
        {
          controller: 'formbuilderController --->',
          method: 'updateFormBuilder --->',
        },
        {
          payload: `Employee id :${empId}`,
          msg: 'Form not found',
        },
      )
      throw new NotFound(null, null, null, 'Form not found')
    }
    const isUpdated = await FormBuilder.update(
      {
        formType,
        questionName,
        answerType,
        mcqOptions,
        selectionType,
        isActive,
        updatedBy: empId,
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      },
    )
    let updatedForm = []
    updatedForm = await FormBuilder.findOne({
      where: {
        id,
      },
    })
    if (!isEmpty(isUpdated)) {
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: 'Success',
        data: updatedForm,
      })
      logger.info(
        {
          controller: 'formbuilderController --->',
          method: 'updateFormBuilder --->',
        },
        {
          payload: `Employee id :${empId}`,
          msg: 'FormData updated successfully',
        },
      )
    }
  } catch (error) {
    logger.info(
      {
        controller: 'formbuilderController --->',
        method: 'updateFormBuilder --->',
      },
      {
        payload: `Employee id :${empId}`,
        msg: `error: ${error}`,
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
  createFormBuilder,
  updateFormBuilder,
  getFormBuilderData,
}
