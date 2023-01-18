const sql = require("../../../dbConnect");
const MessageTag = require("../../enums/messageNums");
const QueryIDs = require("../../enums/queryeNums");
const bcrypt = require("bcrypt");

const Users = function (users) {
  this.empId = users?.empId;
  this.userName = users?.userName;
  this.userPersonalEmail = users?.userPersonalEmail;
  this.userEmail = users?.userEmail;
  this.userPassword = users?.userPassword;
  this.userDesignation = users?.userDesignation;
  this.userRole = users?.userRole;
  this.userProfileImg = users?.userProfileImg;
  this.empMobileNumber = users?.empMobileNumber;
  this.userBirthday = users?.userBirthday;
  this.isActive = users?.isActive;
  this.isDeleted = users?.isDeleted;
  this.empStartDate = users?.empStartDate;
  this.empJoinDate = users?.empJoinDate;
  this.empSalary = users?.empSalary;
  this.createdAt = new Date(new Date().toUTCString());
  this.updatedAt = new Date(new Date().toUTCString());
};

Users.create = (newData, result) => {
  console.log(newData.userEmail);
  sql.query(
    QueryIDs.SELECT_USER + " where userEmail = ?",
    newData.userEmail,
    (err, row) => {
      if (err) {
        result(err, null);
        return;
      } else {
        if (row && row.length) {
          result(MessageTag.USER_EXIST, null);
          return;
        } else {
          bcrypt.hash(newData.userPassword, 10, function (err, hash) {
            newData.userPassword = hash;
            sql.query(QueryIDs.STORE_USER, newData, (err, res) => {
              if (err) {
                result(err, null);
                return;
              }
              result(null, { id: res.insertId, ...newData });
            });
          });
        }
      }
    }
  );
};

Users.getAll = (result) => {
  sql.query(QueryIDs.SELECT_USER, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = Users;
