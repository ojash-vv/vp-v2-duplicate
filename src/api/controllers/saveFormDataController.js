const { isEmpty } = require('lodash')
const { BadRequest } = require('../../helper/apiErrors')
const HttpStatusCode = require('../../enums/httpErrorCodes')

const db = require('../models/index')

const SavedFormData = db.savedFormData

const saveFormData = async (req, res) => {
  const { empId, formType, formData } = req.body
  try {
    if (!empId || !formType || !formData) {
      throw new BadRequest()
    }
    const isCreated = await SavedFormData.create({
      submittedBy: empId,
      formType,
      formData,
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
const getSavedFormData = async (req, res) => {
  try {
    const savedFormData = await SavedFormData.findAll({})
    if (savedFormData) {
      res.status(HttpStatusCode.OK).json({
        status: true,
        data: savedFormData,
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

module.exports = {
  saveFormData,
  getSavedFormData,
}
