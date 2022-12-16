const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

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

authSchema.statics.signup = async function (email, password) {
  if (!email || !password) throw new Error("All fileds are required");
  if (!validator.isEmail(email)) throw new Error("Please enter a valid email");
  if (!validator.isStrongPassword(password))
    throw new Error("Please enter a strong password");
  const isExists = await this.findOne({ email });
  if (isExists) throw new Error(`User ${email} already exists`);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return await this.create({ email, password: hash });
};
authSchema.statics.login = async function (email, password) {
  if (!email || !password) throw new Error("All fileds are required");
  if (!validator.isEmail(email)) throw new Error("Please enter a valid email");
  const user = await this.findOne({ email });
  if (!user) throw new Error("Invalid email");
  const match = await bcrypt.compare(password, user?.password);
  if (!match) throw new Error("Incorrect password");
  return user;
};
module.exports = mongoose.model("Auth", authSchema);
