const db = require("../models/index");
const { isEmpty } = require("lodash");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../controllers/generateAccessToken");
const validator = require("validator");
const { logger } = require("../../../logger");
const MessageTag = require("../../enums/messageNums");

const Auth = db.auth;

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
            { component: "auth --->", method: "successLogin --->" },
            {
              user: isExists,
              msg: "Login successfully: " + email,
            }
          );
        } else {
          logger.error(
            { component: "auth --->", method: "password --->" },
            {
              user: isExists,
              msg: "Password Incrrect for user: " + email,
            }
          );
          res
            .status(401)
            .json({ status: false, error: MessageTag.PasswordWrong });
        }
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
