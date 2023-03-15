const db = require("../models/index");
const { isEmpty } = require("lodash");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { logger } = require("../../helper/logger");
const MessageTag = require("../../enums/messageNums");

const Auth = db.auth;
const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

const loginUser = async (req, res) => {
  const loginAuth = req?.body;

  if (!isEmpty(loginAuth)) {
    const email = loginAuth?.email;
    logger.warn(
      { component: "auth --->", method: "loginUser --->" },
      { user: email, msg: "Running login api" }
    );

    const password = loginAuth?.password;
    try {
      if (!email || !password) throw new Error(MessageTag.ALL_REQ);
      if (!validator.isEmail(email)) throw new Error(MessageTag.ValidEmail);
      const isExists = await Auth.findOne({
        where: { userEmail: email },
      });
      if (!isEmpty(isExists)) {
        const hashedPassword = isExists.userPassword;
        const user = email;
        if (await bcrypt.compare(password, hashedPassword)) {
          const token = generateAccessToken({ user: user });
          res.status(200).json({
            user: user,
            token: token,
            status: true,
            message: MessageTag.WelcomeMsg,
          });
          logger.info(
            { component: "auth --->", method: "loginUser --->" },
            {
              user: isExists,
              msg: "Login successfully: " + email,
            }
          );
        } else {
          logger.error(
            { component: "auth --->", method: "loginUser --->" },
            {
              user: isExists,
              msg: "Password incorrect for user: " + email,
            }
          );
          res
            .status(200)
            .json({ status: false, error: MessageTag.PasswordWrong });
        }
      } else {
        logger.error(
          { component: "auth --->", method: "loginUser --->" },
          {
            user: isExists,
            msg: "User Not Found ,user: " + email,
          }
        );
        res
          .status(200)
          .json({ status: false, error: MessageTag.NotFoundEmail });
      }
    } catch (error) {
      logger.error({
        user: email,
        msg: "Catch error: " + error?.message,
      });
      res.status(400).json({ status: false, error: error?.message });
    }
  }
};
module.exports = {
  loginUser,
};
