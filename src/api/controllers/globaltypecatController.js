const Globaltypecategory = require("../models/globaltypecatModel");
const ObjectHelper = require("../../utils");
const MessageTag = require("../../enums/messageNums");

exports.create = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: MessageTag.CONTENT_NOT_FOUND,
    });
  }

  const globaltypecat = new Globaltypecategory({
    email: req.body.email,
    name: req.body.name,
  });

  await Globaltypecategory.create(globaltypecat, (err, data) => {
    if (err) {
      res.status(500).send({
        error: err || MessageTag.ERROR_OCCURRED,
      });
    } else {
      data = ObjectHelper.formatKeys(data);
      res.status(200).send({
        status: "success",
        message: MessageTag.GTC_ADD,
        data: data,
      });
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

  await Globaltypecategory.updateById(
    req.params.categoryId,
    new Globaltypecategory(req.body),
    (err, data) => {
      console.log(req.params.categoryId);
      if (err) {
        console.log(err);
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
  Globaltypecategory.remove(req.params.categoryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          error: MessageTag.GTC_NOT,
        });
      } else {
        res.status(500).send({
          error: MessageTag.ERROR_OCCURRED,
        });
      }
    } else
      res.status(200).send({
        status: "success",
        message: MessageTag.GTC_DELETE,
        data: data,
      });
  });
};

exports.findAll = (req, res) => {
  Globaltypecategory.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || MessageTag.ERROR_OCCURRED,
      });
    else data = ObjectHelper.formatKeys(data);
    res.send(data);
  });
};
