const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;
const QueryIDs = require("../../enums/queryenums");
const db = require("../../../dbConnect");
var mysql = require("mysql");
const generateAccessToken = require("../controllers/generateAccessToken");

const authSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});

authSchema.statics.signup = async function (name, email, password) {
  if (!email || !password) throw new Error("All fileds are required");
  if (!validator.isEmail(email)) throw new Error("Please enter a valid email");
  if (!validator.isStrongPassword(password))
    throw new Error("Please enter a strong password");
  const user = name;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    try {
      const sqlSearch = "SELECT * FROM users WHERE name = ?";
      const search_query = mysql.format(sqlSearch, [user]);
      const sqlInsert = "INSERT INTO users VALUES (0,?,?,?,?,?,?,?)";
      const insert_query = mysql.format(sqlInsert, [
        user,
        email,
        null,
        hashedPassword,
        null,
        null,
        null,
      ]);
      await connection.query(search_query, async (err, result) => {
        console.log(result);
        if (err) throw err;
        console.log("------> Search Results");
        if (result.length != 0) {
          connection.release();
          console.log("------> User already exists");
        } else {
          await connection.query(insert_query, (err, result) => {
            connection.release();
            if (err) throw err;
            console.log("--------> Created new User");
            console.log(result.insertId);
            return result;
          });
        }
      }); //end of connection.query()
    } catch (error) {
      console.log(error);
    }
  }); //end of db.getConnection()
};
authSchema.statics.login = async function (email, password, callback) {
  if (!email || !password) throw new Error("All fileds are required");
  if (!validator.isEmail(email)) throw new Error("Please enter a valid email");
  const user = email;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch =
      QueryIDs.SELECT_USER + " where user_profissional_email = ?";
    const search_query = mysql.format(sqlSearch, [user]);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        // res.sendStatus(404)
      } else {
        const hashedPassword = result[0].user_password;
        //get the hashedPassword from result
        if (await bcrypt.compare(password, hashedPassword)) {
          console.log("---------> Login Successful");
          console.log("---------> Generating accessToken");
          const token = generateAccessToken({ user: user });
          return token; // res.json({accessToken: token})
        } else {
          console.log("-------->Password incorrect!");

          //res.send("Password incorrect!")
        } //end of Password incorrect
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.connection()
};
module.exports = mongoose.model("Auth", authSchema);
