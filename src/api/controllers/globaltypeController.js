const Globaltype = require("../models/globaltypeModel");
const ObjectHelper = require("../../utils");
const MessageTag = require("../../enums/messageNums");

exports.masterglobaltype = async (req, res) => {
  Globaltype.findByUniqueValue(req?.params?.uniqueValue, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: MessageTag.GLOBALTYPE_NOT_FOUND,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving Global Type with unique value " +
            req?.params?.uniqueValue,
        });
      }
    } else {
      data = ObjectHelper.formatKeys(data);
      res.send(data);
    }
  });
};

exports.create = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: MessageTag.CONTENT_NOT_FOUND,
    });
  }

  const globaltype = new Globaltype({
    globalTypeCategory: req.body.GTC,
    name: req.body.name,
  });

  await Globaltype.create(globaltype, (err, data) => {
    if (err) {
      res.status(500).send({
        error: err || MessageTag.ERROR_OCCURRED,
      });
    } else {
      data = ObjectHelper.formatKeys(data);
      res.status(200).send({
        status: "success",
        message: MessageTag.GLOBALTYPE_ADD,
        data: data,
      });
    }
  });
};

exports.findAll = (req, res) => {
  Globaltype.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || MessageTag.ERROR_OCCURRED,
      });
    else data = ObjectHelper.formatKeys(data);
    res.send(data);
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
            error: MessageTag.GTC_NOT,
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
          message: MessageTag.GTC_UPDATE,
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
