/* eslint-disable no-await-in-loop */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const { isEmpty } = require("lodash")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const db = require("../models/index")
const { logger } = require("../../helper/logger")
const HttpStatusCode = require("../../enums/httpErrorCodes")
const MessageTag = require("../../enums/messageNums")

const Auth = db.auth
const RolePermissions = db.roleAndPermissions
const GlobalType = db.globalType
const { Unauthorized, NotFound, APIError } = require("../../helper/apiErrors")
require("dotenv").config()

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
}

const loginUser = async (req, res) => {
  const loginAuth = req?.body

  if (!isEmpty(loginAuth)) {
    const email = loginAuth?.email
    logger.warn(
      { component: "auth --->", method: "loginUser --->" },
      { user: email, msg: "Running login api" },
    )

    const password = loginAuth?.password
    try {
      if (!email || !password) throw new Error(MessageTag.ALL_REQ)
      if (!validator.isEmail(email)) throw new Error(MessageTag.ValidEmail)
      const isExists = await Auth.findOne({
        where: { userEmail: email },
      })
      if (!isEmpty(isExists)) {
        const hashedPassword = isExists.userPassword
        const isPasswordMatch = await bcrypt.compare(password, hashedPassword)
        if (isPasswordMatch) {
          const userRoles = {}
          const userRole = isExists?.userRole
          const token = generateAccessToken({ email, userRole })
          try {
            const listOfPermissions = await RolePermissions.findAll({
              where: {
                roleId: userRole,
              },
            })
            if (listOfPermissions?.length > 0) {
              logger.info(
                { component: "auth", method: "loginUser" },
                {
                  user: email,
                  message: `permissions fetched successfully.Length of permissions are ${listOfPermissions?.length}`,
                },
              )
              for (let i = 0; i < listOfPermissions.length; i++) {
                const { moduleId } = listOfPermissions[i]
                const { permissions } = listOfPermissions[i]
                const moduleName = await GlobalType.findOne({
                  where: {
                    id: moduleId,
                    globalTypeCategory_uniqeValue: "modules",
                  },
                })
                userRoles[`${moduleName?.displayName}`] = JSON.stringify(permissions)?.includes(
                  "all",
                )
                  ? "all"
                  : Object.keys(permissions)[0]
              }
            }
          } catch (e) {
            logger.error(
              { component: "auth", method: "loginUser" },
              {
                user: email,
                error: e,
              },
            )
            throw new APIError()
          }
          res.status(200).json({
            user: email,
            token,
            userRoles,
            status: true,
            message: MessageTag.WelcomeMsg,
          })
          logger.info(
            { component: "auth", method: "loginUser" },
            {
              user: isExists,
              msg: `Login successfully: ${email}`,
            },
          )
        } else {
          logger.error(
            { component: "auth --->", method: "loginUser --->" },
            {
              user: isExists,
              msg: `Password Incorrect for user: ${email}`,
            },
          )
          throw new Unauthorized()
        }
      } else {
        throw new NotFound(null, null, null, "User not found")
      }
    } catch (error) {
      logger.error(
        {
          controller: "authController --->",
          method: "loginUser --->",
        },
        {
          payload: `Requested employee: ${email} `,
          msg: `error:${error}`,
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
}

module.exports = {
  loginUser,
}
