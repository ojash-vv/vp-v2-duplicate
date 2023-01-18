const Users = require("../models/employeesModel");
const ObjectHelper = require("../../utils");
const MessageTag = require("../../enums/messageNums");

exports.create = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: MessageTag.CONTENT_NOT_FOUND,
    });
  }

  const employee = new Users({
    empId: req.body.empId,
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userPersonalEmail: req.body.userPersonalEmail,
    userPassword: req.body.userPassword,
    userDesignation: req.body.userDesignation,
    userRole: req.body.userRole,
    empMobileNumber: req.body.empMobileNumber,
    userBirthday: req.body.userBirthday,
    empStartDate: req.body.empStartDate,
    empJoinDate: req.body.empJoinDate,
    empJoinDate: req.body.empJoinDate,
  });

  await Users.create(employee, (err, data) => {
    if (err) {
      res.status(500).send({
        error: err || MessageTag.ERROR_OCCURRED,
      });
    } else {
      data = ObjectHelper.formatKeys(data);
      res.status(200).send({
        status: "success",
        message: MessageTag.USER_ADDED,
        data: data,
      });
    }
  });
};

exports.findAll = (req, res) => {
  Users.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || MessageTag.ERROR_OCCURRED,
      });
    else {
      const filters = req.query;
      const filteredUsers = data.filter((user) => {
        let isValid = true;
        for (key in filters) {
          isValid = isValid && user[key] == filters[key];
        }
        return isValid;
      });
      if (!filteredUsers) {
        res.status(500).send({
          message: err.message || MessageTag.ERROR_OCCURRED,
        });
      }

      data = ObjectHelper.formatKeys(filteredUsers);
      res.send(data);
    }
  });
};

exports.update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: MessageTag.CONTENT_NOT_FOUND,
    });
  }

  await Globaltype.updateById(
    req.params.Id,
    new Globaltype(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            error: MessageTag.GLOBALTYPE_NOT_FOUND,
          });
        } else {
          res.status(500).send({
            error: err,
          });
        }
      } else {
        data = ObjectHelper.formatKeys(data);
        res.status(200).send({
          status: "success",
          message: MessageTag.GLOBALTYPE_UPDATE,
          data: data,
        });
      }
    }
  );
};

exports.updateStatus = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: MessageTag.CONTENT_NOT_FOUND,
    });
  }

  await Globaltype.statusUpdateById(
    req.params.Id,
    new Globaltype(req.body),
    (err, data) => {
      if (err) {
        console.log(err);
        if (err.kind === "not_found") {
          res.status(404).send({
            error: MessageTag.GLOBALTYPE_NOT_FOUND,
          });
        } else {
          res.status(500).send({
            error: err,
          });
        }
      } else {
        data = ObjectHelper.formatKeys(data);
        res.status(200).send({
          status: "success",
          message: MessageTag.GLOBALTYPE_UPDATE,
          data: data,
        });
      }
    }
  );
};
exports.delete = (req, res) => {
  Globaltype.remove(req.params.Id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          error: MessageTag.GLOBALTYPE_NOT_EXIST,
        });
      } else {
        res.status(500).send({
          error: MessageTag.ERROR_OCCURRED,
        });
      }
    } else
      res.status(200).send({
        status: "success",
        message: MessageTag.GLOBALTYPE_DELETE,
        data: data,
      });
  });
};
