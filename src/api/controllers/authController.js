const db = require("../models/index");
const { isEmpty } = require("lodash");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../controllers/generateAccessToken");
const validator = require("validator");

const Auth = db.auth;

const loginUser = async (req, res) => {
  const loginAuth = req?.body;
  if (!isEmpty(loginAuth)) {
    const email = loginAuth?.email;
    const password = loginAuth?.password;
    try {
      if (!email || !password) throw new Error("All fileds are required");
      if (!validator.isEmail(email))
        throw new Error("Please enter a valid email");
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
            message: "Welcome to Virtuevise Portal!",
          });
        } else {
          res.status(401).json({ status: false, error: "Password incorrect!" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ status: false, error: error?.message });
    }
  }
};
module.exports = {
  loginUser,
};
