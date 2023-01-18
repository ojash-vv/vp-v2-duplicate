const bcrypt = require("bcrypt");
const validator = require("validator");
const QueryIDs = require("../../enums/queryeNums");
const db = require("../../../dbConnect");
var mysql = require("mysql");
const generateAccessToken = require("../controllers/generateAccessToken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw new Error("All fileds are required");
    if (!validator.isEmail(email))
      throw new Error("Please enter a valid email");
    const user = email;
    db.getConnection(async (err, connection) => {
      if (err) throw err;
      const sqlSearch = QueryIDs.SELECT_USER + " where userEmail = ?";
      const search_query = mysql.format(sqlSearch, [user]);
      await connection.query(search_query, async (err, result) => {
        connection.release();
        if (err) throw err;
        if (result.length == 0) {
          res.status(401).json({ error: "User does not exist" });
        } else {
          const hashedPassword = result[0].userPassword;

          if (await bcrypt.compare(password, hashedPassword)) {
            const token = generateAccessToken({ user: user });
            res.status(200).json({
              user: user,
              token: token,
              message: "Welcome to Virtuevise Portal!",
            });
          } else {
            res.status(401).json({ error: "Password incorrect!" });
          }
        }
      });
    });
  } catch (error) {
    res.status(400).json({ error: error?.message });
  }
};

module.exports = {
  loginUser,
};
