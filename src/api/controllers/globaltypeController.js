const Globaltype = require("../models/globaltypeModel");

exports.masterglobaltype = async (req, res) => {
  Globaltype.findByUniqueValue(req?.params?.uniqueValue, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Global Type with unique value ${req?.params?.uniqueValue}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving Global Type with unique value " +
            req?.params?.uniqueValue,
        });
      }
    } else res.send(data);
  });
};
